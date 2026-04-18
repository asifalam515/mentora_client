"use client";

import { apiRequest } from "@/lib/api-client";

const API_V1_BASE = (
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000/api/v1"
).replace(/\/$/, "");

const LESSON_PLAN_API_BASE = `${API_V1_BASE}/lesson-plans`;

export type StudentLevel = "beginner" | "intermediate" | "advanced";
export type LessonPlanStatus = "active" | "completed" | "archived";

export interface LessonPlanExercise {
  title: string;
  difficulty: string;
}

export interface LessonPlanWeek {
  weekNumber: number;
  title: string;
  topics: string[];
  exercises: LessonPlanExercise[];
  milestone: string;
  estimatedHours: number;
}

export interface LessonPlan {
  id: string;
  goal: string;
  level: StudentLevel;
  totalWeeks: number;
  totalHours: number;
  responseTimeMs?: number;
  generatedAt?: string;
  createdAt?: string;
  status: LessonPlanStatus;
  resources: string[];
  assessmentStrategy: string;
  weeks: LessonPlanWeek[];
  studentId?: string;
  tutorId?: string;
}

export interface GenerateLessonPlanPayload {
  studentGoal: string;
  duration: number;
  studentLevel: StudentLevel;
  studentId?: string;
  tutorId?: string;
}

type UnknownRecord = Record<string, unknown>;

const readJsonBody = async (response: Response) => {
  try {
    return (await response.json()) as unknown;
  } catch {
    return null;
  }
};

const getErrorMessage = (payload: unknown, fallback: string) => {
  if (!payload || typeof payload !== "object") return fallback;
  const rec = payload as UnknownRecord;
  const message = rec.message || rec.error;
  return typeof message === "string" && message.trim() ? message : fallback;
};

const ensureOk = async (response: Response, fallback: string) => {
  if (response.ok) return;
  const payload = await readJsonBody(response);
  const defaultMessage = `${fallback} (HTTP ${response.status})`;
  throw new Error(getErrorMessage(payload, defaultMessage));
};

const toStringArray = (value: unknown) => {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
};

const normalizeExercises = (value: unknown): LessonPlanExercise[] => {
  if (!Array.isArray(value)) return [];

  return value
    .map((exercise) => {
      if (typeof exercise === "string") {
        return {
          title: exercise,
          difficulty: "Medium",
        };
      }

      if (!exercise || typeof exercise !== "object") return null;

      const rec = exercise as UnknownRecord;
      const title =
        (typeof rec.title === "string" && rec.title) ||
        (typeof rec.name === "string" && rec.name) ||
        "Practice exercise";
      const difficulty =
        (typeof rec.difficulty === "string" && rec.difficulty) || "Medium";

      return { title, difficulty };
    })
    .filter((exercise): exercise is LessonPlanExercise => Boolean(exercise));
};

const normalizeStatus = (status: unknown): LessonPlanStatus => {
  if (typeof status !== "string") return "active";
  const normalized = status.toLowerCase();
  if (
    normalized === "active" ||
    normalized === "completed" ||
    normalized === "archived"
  ) {
    return normalized;
  }
  return "active";
};

const normalizeLevel = (level: unknown): StudentLevel => {
  if (typeof level !== "string") return "beginner";
  const normalized = level.toLowerCase();
  if (normalized === "advanced") return "advanced";
  if (normalized === "intermediate") return "intermediate";
  return "beginner";
};

const toNumber = (value: unknown, fallback = 0) =>
  typeof value === "number" && Number.isFinite(value) ? value : fallback;

const normalizeFromWeekContent = (
  week: unknown,
  index: number,
): LessonPlanWeek => {
  const rec = (week && typeof week === "object" ? week : {}) as UnknownRecord;

  return {
    weekNumber:
      toNumber(rec.weekNumber, 0) || toNumber(rec.week, 0) || index + 1,
    title:
      (typeof rec.title === "string" && rec.title) ||
      (typeof rec.topic === "string" && rec.topic) ||
      `Week ${index + 1}`,
    topics: toStringArray(rec.topics),
    exercises: normalizeExercises(rec.exercises),
    milestone: (typeof rec.milestone === "string" && rec.milestone) || "",
    estimatedHours:
      toNumber(rec.estimatedHours, 0) ||
      toNumber(rec.hours, 0) ||
      toNumber(rec.estimatedStudyHours, 0),
  };
};

const normalizePlan = (raw: unknown): LessonPlan => {
  const rec = (raw && typeof raw === "object" ? raw : {}) as UnknownRecord;
  const content =
    rec.content && typeof rec.content === "object"
      ? (rec.content as UnknownRecord)
      : {};

  const weeksFromTop = Array.isArray(rec.weeks) ? rec.weeks : [];
  const weeksFromContent = Array.isArray(content.weeks) ? content.weeks : [];
  const resolvedWeeksSource =
    weeksFromTop.length > 0 ? weeksFromTop : weeksFromContent;

  const normalizedWeeks = resolvedWeeksSource.map((week, index) =>
    normalizeFromWeekContent(week, index),
  );

  const totalWeeksRaw =
    rec.totalWeeks ??
    rec.durationWeeks ??
    rec.weeksCount ??
    rec.duration ??
    (typeof rec.weeks === "number" ? rec.weeks : undefined) ??
    normalizedWeeks.length;

  const totalHoursRaw =
    rec.totalHours ?? rec.estimatedTotalHours ?? content.totalHours;

  return {
    id:
      (typeof rec.id === "string" && rec.id) ||
      (typeof rec.planId === "string" && rec.planId) ||
      "",
    goal:
      (typeof rec.goal === "string" && rec.goal) ||
      (typeof rec.studentGoal === "string" && rec.studentGoal) ||
      (typeof rec.learningGoal === "string" && rec.learningGoal) ||
      "",
    level: normalizeLevel(rec.level ?? rec.studentLevel),
    totalWeeks: toNumber(totalWeeksRaw),
    totalHours: toNumber(totalHoursRaw),
    responseTimeMs:
      typeof rec.responseTimeMs === "number"
        ? rec.responseTimeMs
        : typeof rec.responseTime === "number"
          ? rec.responseTime
          : typeof content.responseTime === "number"
            ? content.responseTime
            : undefined,
    generatedAt:
      (typeof rec.generatedAt === "string" && rec.generatedAt) || undefined,
    createdAt:
      (typeof rec.createdAt === "string" && rec.createdAt) || undefined,
    status: normalizeStatus(rec.status),
    resources: toStringArray(rec.resources ?? content.resources),
    assessmentStrategy:
      (typeof rec.assessmentStrategy === "string" && rec.assessmentStrategy) ||
      (typeof content.assessmentStrategy === "string" &&
        content.assessmentStrategy) ||
      "",
    weeks: normalizedWeeks,
    studentId:
      (typeof rec.studentId === "string" && rec.studentId) ||
      (rec.student && typeof rec.student === "object"
        ? ((rec.student as UnknownRecord).id as string) || undefined
        : undefined),
    tutorId:
      (typeof rec.tutorId === "string" && rec.tutorId) ||
      (rec.tutor && typeof rec.tutor === "object"
        ? ((rec.tutor as UnknownRecord).id as string) || undefined
        : undefined),
  };
};

const unwrapData = (payload: unknown): unknown => {
  if (!payload || typeof payload !== "object") return payload;
  const rec = payload as UnknownRecord;
  return rec.data ?? rec.result ?? payload;
};

const request = async (
  path: string,
  options?: RequestInit & { skipAuthRedirect?: boolean },
) => {
  const response = await apiRequest(`${LESSON_PLAN_API_BASE}${path}`, options);
  const payload = await readJsonBody(response);
  await ensureOk(response, "Lesson plan request failed");
  return payload;
};

class LessonPlanService {
  async generate(payload: GenerateLessonPlanPayload) {
    const response = await request("/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      skipAuthRedirect: true,
    });

    return normalizePlan(unwrapData(response));
  }

  async getStudentPlans(studentId?: string) {
    if (!studentId) return [];

    const response = await request(
      `/student/${encodeURIComponent(studentId)}`,
      {
        method: "GET",
        skipAuthRedirect: true,
      },
    );

    const data = unwrapData(response);
    if (!Array.isArray(data)) return [];
    return data.map((item) => normalizePlan(item)).filter((plan) => plan.id);
  }

  async getSinglePlan(planId: string) {
    const response = await request(`/${planId}`, {
      method: "GET",
      skipAuthRedirect: true,
    });

    return normalizePlan(unwrapData(response));
  }

  async updatePlanStatus(planId: string, status: LessonPlanStatus) {
    const response = await request(`/${planId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
      skipAuthRedirect: true,
    });

    return normalizePlan(unwrapData(response));
  }

  async deletePlan(planId: string) {
    const response = await request(`/${planId}`, {
      method: "DELETE",
      skipAuthRedirect: true,
    });

    return unwrapData(response);
  }
}

export const lessonPlanService = new LessonPlanService();
