import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { getOrCreateSubscription, getUserSubscription, getUserNotes, getNoteById, getSummaryByNoteId, getUserQuizzes, getQuizById, getUserQuizResponses, getUserFlashcards, getUserWeaknessAnalysis, getUserStudyPlans, getUserExamPredictions } from "./db";
import { getDb } from "./db";
import { notes, summaries, quizzes, quizResponses, flashcards, weaknessAnalysis, studyPlans, examPredictions } from "../drizzle/schema";
import { invokeLLM } from "./_core/llm";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  /**
   * Subscription management
   */
  subscription: router({
    getCurrent: protectedProcedure.query(async ({ ctx }) => {
      return await getOrCreateSubscription(ctx.user.id);
    }),
  }),

  /**
   * Notes management
   */
  notes: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await getUserNotes(ctx.user.id);
    }),

    get: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return await getNoteById(input.id);
    }),

    create: protectedProcedure
      .input(
        z.object({
          title: z.string().min(1).max(255),
          content: z.string().min(1),
          subject: z.string().max(100).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        await db.insert(notes).values({
          userId: ctx.user.id,
          title: input.title,
          content: input.content,
          subject: input.subject,
        });

        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const note = await getNoteById(input.id);
        if (!note || note.userId !== ctx.user.id) {
          throw new Error("Unauthorized");
        }

        await db.delete(notes).where(eq(notes.id, input.id));
        return { success: true };
      }),
  }),

  /**
   * Summaries (AI-powered)
   */
  summaries: router({
    get: protectedProcedure.input(z.object({ noteId: z.number() })).query(async ({ input }) => {
      return await getSummaryByNoteId(input.noteId);
    }),

    generate: protectedProcedure
      .input(z.object({ noteId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const note = await getNoteById(input.noteId);
        if (!note || note.userId !== ctx.user.id) {
          throw new Error("Unauthorized");
        }

        // Check if summary already exists
        const existing = await getSummaryByNoteId(input.noteId);
        if (existing) return existing;

        // Generate summary using LLM
        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: "You are an expert study assistant. Create a concise, well-structured summary of the provided study notes. Include key points in a bullet list.",
            },
            {
              role: "user",
              content: `Please summarize these study notes:\n\n${note.content}`,
            },
          ],
        });

        const summaryText = typeof response.choices[0]?.message.content === 'string' ? response.choices[0]?.message.content : "";

        // Extract key points (simple implementation)
        const keyPoints = (typeof summaryText === 'string' ? summaryText : "")
          .split("\n")
          .filter((line) => line.trim().startsWith("-") || line.trim().startsWith("•"))
          .map((line) => line.replace(/^[-•]\s*/, "").trim())
          .filter((line) => line.length > 0);

        await db.insert(summaries).values({
          noteId: input.noteId,
          summary: typeof summaryText === 'string' ? summaryText : "",
          keyPoints: keyPoints as any,
        });

        return { noteId: input.noteId, summary: summaryText, keyPoints };
      }),
  }),

  /**
   * Quizzes (basic and premium)
   */
  quizzes: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await getUserQuizzes(ctx.user.id);
    }),

    get: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return await getQuizById(input.id);
    }),

    generate: protectedProcedure
      .input(z.object({ noteId: z.number(), difficulty: z.enum(["easy", "medium", "hard"]).optional() }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const note = await getNoteById(input.noteId);
        if (!note || note.userId !== ctx.user.id) {
          throw new Error("Unauthorized");
        }

        // Generate quiz using LLM
        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: "You are an expert quiz creator. Generate 5 multiple choice questions based on the provided study notes. Return ONLY valid JSON with this format: {\"questions\": [{\"id\": \"q1\", \"question\": \"...\", \"options\": [\"...\", \"...\", \"...\", \"...\"], \"correctAnswer\": \"...\", \"explanation\": \"...\"}]}",
            },
            {
              role: "user",
              content: `Create a ${input.difficulty || "medium"} difficulty quiz from these notes:\n\n${note.content}`,
            },
          ],
        });

        const content = typeof response.choices[0]?.message.content === 'string' ? response.choices[0]?.message.content : "{}";
        let questions: any[] = [];
        try {
          const parsed = JSON.parse(content);
          questions = parsed.questions || [];
        } catch (e) {
          console.error("Failed to parse quiz response", e);
        }

        await db.insert(quizzes).values({
          userId: ctx.user.id,
          noteId: input.noteId,
          title: `Quiz: ${note.title}`,
          questions: questions as any,
          difficulty: input.difficulty || "medium",
        });

        return { title: `Quiz: ${note.title}`, questions, difficulty: input.difficulty || "medium" };
      }),
  }),

  /**
   * Quiz responses
   */
  quizResponses: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await getUserQuizResponses(ctx.user.id);
    }),

    submit: protectedProcedure
      .input(
        z.object({
          quizId: z.number(),
          answers: z.record(z.string(), z.string()),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const quiz = await getQuizById(input.quizId);
        if (!quiz || quiz.userId !== ctx.user.id) {
          throw new Error("Unauthorized");
        }

        // Calculate score
        let score = 0;
        const questions = quiz.questions || [];
        questions.forEach((q: any) => {
          if (input.answers[q.id] === q.correctAnswer) {
            score++;
          }
        });

        await db.insert(quizResponses).values({
          userId: ctx.user.id,
          quizId: input.quizId,
          answers: input.answers as any,
          score,
          totalQuestions: questions.length,
        });

        return { score, totalQuestions: questions.length, percentage: Math.round((score / questions.length) * 100) };
      }),
  }),

  /**
   * Flashcards (premium only)
   */
  flashcards: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await getUserFlashcards(ctx.user.id);
    }),

    generate: protectedProcedure
      .input(z.object({ noteId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const subscription = await getUserSubscription(ctx.user.id);
        if (subscription?.tier !== "premium") {
          throw new Error("Premium feature");
        }

        const note = await getNoteById(input.noteId);
        if (!note || note.userId !== ctx.user.id) {
          throw new Error("Unauthorized");
        }

        // Generate flashcards using LLM
        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: "You are an expert flashcard creator. Create 10 flashcards from the provided study notes. Return ONLY valid JSON: {\"flashcards\": [{\"front\": \"...\", \"back\": \"...\"}]}",
            },
            {
              role: "user",
              content: `Create flashcards from these notes:\n\n${note.content}`,
            },
          ],
        });

        const content = typeof response.choices[0]?.message.content === 'string' ? response.choices[0]?.message.content : "{}";
        let flashcardList: any[] = [];
        try {
          const parsed = JSON.parse(content);
          flashcardList = parsed.flashcards || [];
        } catch (e) {
          console.error("Failed to parse flashcard response", e);
        }

        // Insert all flashcards
        for (const card of flashcardList) {
          await db.insert(flashcards).values({
            userId: ctx.user.id,
            noteId: input.noteId,
            front: card.front || "",
            back: card.back || "",
          });
        }

        return { created: flashcardList.length };
      }),
  }),

  /**
   * Weakness analysis (premium only)
   */
  weaknessAnalysis: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await getUserWeaknessAnalysis(ctx.user.id);
    }),

    analyze: protectedProcedure.mutation(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const subscription = await getUserSubscription(ctx.user.id);
      if (subscription?.tier !== "premium") {
        throw new Error("Premium feature");
      }

      // Get recent quiz responses
      const responses = await getUserQuizResponses(ctx.user.id);
      
      if (responses.length === 0) {
        return { message: "No quiz data available yet" };
      }

      // Analyze weak areas
      const weakAreas: Record<string, number> = {};
      for (const response of responses) {
        const percentage = (response.score / response.totalQuestions) * 100;
        if (percentage < 70) {
          const quiz = await getQuizById(response.quizId);
          if (quiz) {
            weakAreas[quiz.title] = (weakAreas[quiz.title] || 0) + 1;
          }
        }
      }

      // Generate recommendations
      const topics = Object.keys(weakAreas);
      const recommendations = topics.map((topic) => `Focus on ${topic} - you've struggled with this topic`);

      return { weakAreas, recommendations };
    }),
  }),

  /**
   * Study planner (premium only)
   */
  studyPlanner: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await getUserStudyPlans(ctx.user.id);
    }),

    generate: protectedProcedure.mutation(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const subscription = await getUserSubscription(ctx.user.id);
      if (subscription?.tier !== "premium") {
        throw new Error("Premium feature");
      }

      // Get user's notes to create personalized schedule
      const userNotes = await getUserNotes(ctx.user.id);
      const noteTitles = userNotes.map((n) => n.title).join(", ");

      // Generate study plan using LLM
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: "You are an expert study planner. Create a personalized 7-day study schedule. Return ONLY valid JSON: {\"schedule\": [{\"day\": \"Monday\", \"tasks\": [{\"time\": \"9:00 AM\", \"task\": \"...\", \"duration\": 60}]}]}",
          },
          {
            role: "user",
            content: `Create a study plan for these topics: ${noteTitles || "General study"}`,
          },
        ],
      });

      const content = typeof response.choices[0]?.message.content === 'string' ? response.choices[0]?.message.content : "{}";
      let schedule: any[] = [];
      try {
        const parsed = JSON.parse(content);
        schedule = parsed.schedule || [];
      } catch (e) {
        console.error("Failed to parse study plan response", e);
      }

        await db.insert(studyPlans).values({
          userId: ctx.user.id,
          title: "AI Study Plan",
          schedule: schedule as any,
        });

        return { title: "AI Study Plan", schedule };
    }),
  }),

  /**
   * Exam predictor (premium only)
   */
  examPredictor: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await getUserExamPredictions(ctx.user.id);
    }),

    predict: protectedProcedure
      .input(z.object({ noteId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const subscription = await getUserSubscription(ctx.user.id);
        if (subscription?.tier !== "premium") {
          throw new Error("Premium feature");
        }

        const note = await getNoteById(input.noteId);
        if (!note || note.userId !== ctx.user.id) {
          throw new Error("Unauthorized");
        }

        // Predict exam questions using LLM
        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: "You are an expert exam predictor. Predict 5 likely exam questions with confidence scores. Return ONLY valid JSON: {\"predictions\": [{\"question\": \"...\", \"likelihood\": 85, \"topic\": \"...\"}]}",
            },
            {
              role: "user",
              content: `Based on these study notes, predict likely exam questions:\n\n${note.content}`,
            },
          ],
        });

        const content = typeof response.choices[0]?.message.content === 'string' ? response.choices[0]?.message.content : "{}";
        let predictedQuestions: any[] = [];
        try {
          const parsed = JSON.parse(content);
          predictedQuestions = parsed.predictions || [];
        } catch (e) {
          console.error("Failed to parse exam prediction response", e);
        }

        await db.insert(examPredictions).values({
          userId: ctx.user.id,
          noteId: input.noteId,
          predictedQuestions: predictedQuestions as any,
        });

        return { predictedQuestions };
      }),
  }),
});

export type AppRouter = typeof appRouter;
