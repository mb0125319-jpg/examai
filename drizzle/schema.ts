import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, decimal, json } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Subscription tiers and billing information
 */
export const subscriptions = mysqlTable("subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  tier: mysqlEnum("tier", ["free", "premium"]).default("free").notNull(),
  billingCycle: mysqlEnum("billingCycle", ["monthly", "yearly", "none"]).default("none").notNull(),
  pricePerMonth: decimal("pricePerMonth", { precision: 10, scale: 2 }),
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
  renewalDate: timestamp("renewalDate"),
  cancelledAt: timestamp("cancelledAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;

/**
 * Uploaded study notes
 */
export const notes = mysqlTable("notes", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  subject: varchar("subject", { length: 100 }),
  uploadedAt: timestamp("uploadedAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Note = typeof notes.$inferSelect;
export type InsertNote = typeof notes.$inferInsert;

/**
 * AI-generated summaries of notes
 */
export const summaries = mysqlTable("summaries", {
  id: int("id").autoincrement().primaryKey(),
  noteId: int("noteId").notNull().references(() => notes.id, { onDelete: "cascade" }),
  summary: text("summary").notNull(),
  keyPoints: json("keyPoints").$type<string[]>(),
  generatedAt: timestamp("generatedAt").defaultNow().notNull(),
});

export type Summary = typeof summaries.$inferSelect;
export type InsertSummary = typeof summaries.$inferInsert;

/**
 * Generated quizzes from notes
 */
export const quizzes = mysqlTable("quizzes", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  noteId: int("noteId").notNull().references(() => notes.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  questions: json("questions").$type<Array<{ id: string; question: string; options: string[]; correctAnswer: string; explanation: string }>>(),
  difficulty: mysqlEnum("difficulty", ["easy", "medium", "hard"]).default("medium").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Quiz = typeof quizzes.$inferSelect;
export type InsertQuiz = typeof quizzes.$inferInsert;

/**
 * User quiz responses and scores
 */
export const quizResponses = mysqlTable("quizResponses", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  quizId: int("quizId").notNull().references(() => quizzes.id, { onDelete: "cascade" }),
  answers: json("answers").$type<Record<string, string>>(),
  score: int("score").notNull(),
  totalQuestions: int("totalQuestions").notNull(),
  completedAt: timestamp("completedAt").defaultNow().notNull(),
});

export type QuizResponse = typeof quizResponses.$inferSelect;
export type InsertQuizResponse = typeof quizResponses.$inferInsert;

/**
 * Auto-generated flashcards from notes (premium only)
 */
export const flashcards = mysqlTable("flashcards", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  noteId: int("noteId").notNull().references(() => notes.id, { onDelete: "cascade" }),
  front: text("front").notNull(),
  back: text("back").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Flashcard = typeof flashcards.$inferSelect;
export type InsertFlashcard = typeof flashcards.$inferInsert;

/**
 * Weakness analysis and improvement recommendations (premium only)
 */
export const weaknessAnalysis = mysqlTable("weaknessAnalysis", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  topic: varchar("topic", { length: 255 }).notNull(),
  weaknessScore: int("weaknessScore").notNull(),
  recommendations: json("recommendations").$type<string[]>(),
  lastAnalyzedAt: timestamp("lastAnalyzedAt").defaultNow().onUpdateNow().notNull(),
});

export type WeaknessAnalysis = typeof weaknessAnalysis.$inferSelect;
export type InsertWeaknessAnalysis = typeof weaknessAnalysis.$inferInsert;

/**
 * AI-generated study plans (premium only)
 */
export const studyPlans = mysqlTable("studyPlans", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  schedule: json("schedule").$type<Array<{ day: string; tasks: Array<{ time: string; task: string; duration: number }> }>>(),
  generatedAt: timestamp("generatedAt").defaultNow().notNull(),
});

export type StudyPlan = typeof studyPlans.$inferSelect;
export type InsertStudyPlan = typeof studyPlans.$inferInsert;

/**
 * Exam predictions based on notes (premium only)
 */
export const examPredictions = mysqlTable("examPredictions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  noteId: int("noteId").notNull().references(() => notes.id, { onDelete: "cascade" }),
  predictedQuestions: json("predictedQuestions").$type<Array<{ question: string; likelihood: number; topic: string }>>(),
  generatedAt: timestamp("generatedAt").defaultNow().notNull(),
});

export type ExamPrediction = typeof examPredictions.$inferSelect;
export type InsertExamPrediction = typeof examPredictions.$inferInsert;

/**
 * Relations for type safety
 */
export const usersRelations = relations(users, ({ many }) => ({
  subscriptions: many(subscriptions),
  notes: many(notes),
  quizzes: many(quizzes),
  quizResponses: many(quizResponses),
  flashcards: many(flashcards),
  weaknessAnalysis: many(weaknessAnalysis),
  studyPlans: many(studyPlans),
  examPredictions: many(examPredictions),
}));

export const notesRelations = relations(notes, ({ one, many }) => ({
  user: one(users, { fields: [notes.userId], references: [users.id] }),
  summaries: many(summaries),
  quizzes: many(quizzes),
  flashcards: many(flashcards),
  examPredictions: many(examPredictions),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, { fields: [subscriptions.userId], references: [users.id] }),
}));
