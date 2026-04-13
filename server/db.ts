import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, subscriptions, notes, summaries, quizzes, quizResponses, flashcards, weaknessAnalysis, studyPlans, examPredictions } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Subscription queries
 */
export async function getOrCreateSubscription(userId: number) {
  const db = await getDb();
  if (!db) return null;

  const existing = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId)).limit(1);
  
  if (existing.length > 0) {
    return existing[0];
  }

  // Create default free subscription
  await db.insert(subscriptions).values({
    userId,
    tier: "free",
    billingCycle: "none",
  });

  const result = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId)).limit(1);
  return result[0] || null;
}

export async function getUserSubscription(userId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId)).limit(1);
  return result[0] || null;
}

/**
 * Notes queries
 */
export async function getUserNotes(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(notes).where(eq(notes.userId, userId));
}

export async function getNoteById(noteId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(notes).where(eq(notes.id, noteId)).limit(1);
  return result[0] || null;
}

/**
 * Summaries queries
 */
export async function getSummaryByNoteId(noteId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(summaries).where(eq(summaries.noteId, noteId)).limit(1);
  return result[0] || null;
}

/**
 * Quizzes queries
 */
export async function getUserQuizzes(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(quizzes).where(eq(quizzes.userId, userId));
}

export async function getQuizById(quizId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(quizzes).where(eq(quizzes.id, quizId)).limit(1);
  return result[0] || null;
}

/**
 * Quiz responses queries
 */
export async function getUserQuizResponses(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(quizResponses).where(eq(quizResponses.userId, userId));
}

/**
 * Flashcards queries
 */
export async function getUserFlashcards(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(flashcards).where(eq(flashcards.userId, userId));
}

/**
 * Weakness analysis queries
 */
export async function getUserWeaknessAnalysis(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(weaknessAnalysis).where(eq(weaknessAnalysis.userId, userId));
}

/**
 * Study plans queries
 */
export async function getUserStudyPlans(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(studyPlans).where(eq(studyPlans.userId, userId));
}

/**
 * Exam predictions queries
 */
export async function getUserExamPredictions(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(examPredictions).where(eq(examPredictions.userId, userId));
}
