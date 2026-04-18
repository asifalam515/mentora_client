"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  LessonPlan,
  LessonPlanExercise,
  lessonPlanService,
  LessonPlanStatus,
  StudentLevel,
} from "@/services/lessonPlan";
import { useAuthStore } from "@/store/useAuthStore.ts";
import {
  Archive,
  BookOpen,
  CheckCircle2,
  Clock3,
  Loader2,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type FormErrors = {
  studentGoal?: string;
  duration?: string;
  studentLevel?: string;
};

const LEVELS: StudentLevel[] = ["beginner", "intermediate", "advanced"];
const SUGGESTED_DURATIONS = [4, 6, 8, 12];
const STATUS_FILTERS: Array<"ALL" | LessonPlanStatus> = [
  "ALL",
  "active",
  "completed",
  "archived",
];

const getDifficultyClasses = (difficulty: string) => {
  const normalized = difficulty.toLowerCase();
  if (normalized.includes("easy")) {
    return "bg-green-100 text-green-700 border-green-300";
  }
  if (normalized.includes("hard")) {
    return "bg-red-100 text-red-700 border-red-300";
  }
  return "bg-yellow-100 text-yellow-800 border-yellow-300";
};

const formatDate = (value?: string) => {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "-";
  return parsed.toLocaleString();
};

const normalizeStatusLabel = (status: LessonPlanStatus) => {
  if (status === "active") return "Active";
  if (status === "completed") return "Completed";
  return "Archived";
};

const normalizeLevelLabel = (level: StudentLevel) =>
  level.charAt(0).toUpperCase() + level.slice(1);

const isLink = (value: string) => /^https?:\/\//i.test(value);

const getExerciseKey = (exercise: LessonPlanExercise, index: number) =>
  `${exercise.title}-${index}`;

interface LessonPlanGeneratorProps {
  defaultTab?: "generate" | "dashboard";
}

export function LessonPlanGenerator({
  defaultTab = "generate",
}: LessonPlanGeneratorProps) {
  const { user } = useAuthStore();
  const searchParams = useSearchParams();
  const tutorIdFromQuery = searchParams.get("tutorId") ?? "";
  const [activeTab, setActiveTab] = useState<"generate" | "dashboard">(
    defaultTab,
  );

  const [studentGoal, setStudentGoal] = useState("");
  const [duration, setDuration] = useState<string>("8");
  const [studentLevel, setStudentLevel] =
    useState<StudentLevel>("intermediate");
  const [tutorId, setTutorId] = useState(tutorIdFromQuery);
  const [errors, setErrors] = useState<FormErrors>({});

  const [plans, setPlans] = useState<LessonPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<LessonPlan | null>(null);
  const [statusFilter, setStatusFilter] = useState<"ALL" | LessonPlanStatus>(
    "ALL",
  );

  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);
  const [hasLoadedDashboard, setHasLoadedDashboard] = useState(false);
  const [dashboardError, setDashboardError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [progressSeconds, setProgressSeconds] = useState(0);

  const loadPlans = async () => {
    setIsLoadingPlans(true);
    setDashboardError(null);

    try {
      const list = await lessonPlanService.getStudentPlans(user?.id);
      setPlans(list);

      const lastPlanId =
        typeof window !== "undefined"
          ? localStorage.getItem("lessonPlan:lastPlanId")
          : null;
      const fromStorage = list.find((plan) => plan.id === lastPlanId);

      if (fromStorage) {
        setSelectedPlan(fromStorage);
      } else if (list.length > 0 && !selectedPlan) {
        setSelectedPlan(list[0]);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load lesson plans";

      if (message.includes("HTTP 404")) {
        setPlans([]);
        setDashboardError(null);
      } else {
        setDashboardError(message);
        toast.error(message);
      }
    } finally {
      setIsLoadingPlans(false);
      setHasLoadedDashboard(true);
    }
  };

  useEffect(() => {
    if (activeTab !== "dashboard" || hasLoadedDashboard) return;
    loadPlans();
  }, [activeTab, hasLoadedDashboard, user?.id]);

  useEffect(() => {
    setHasLoadedDashboard(false);
    setDashboardError(null);
  }, [user?.id]);

  const filteredPlans = useMemo(() => {
    if (statusFilter === "ALL") return plans;
    return plans.filter((plan) => plan.status === statusFilter);
  }, [plans, statusFilter]);

  const validate = () => {
    const nextErrors: FormErrors = {};
    const trimmedGoal = studentGoal.trim();
    const parsedDuration = Number(duration);

    if (trimmedGoal.length < 10) {
      nextErrors.studentGoal = "Goal must be at least 10 characters.";
    }

    if (
      !Number.isInteger(parsedDuration) ||
      parsedDuration < 1 ||
      parsedDuration > 52
    ) {
      nextErrors.duration = "Duration must be between 1 and 52 weeks.";
    }

    if (!LEVELS.includes(studentLevel)) {
      nextErrors.studentLevel = "Select a valid skill level.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleGenerate = async (event: FormEvent) => {
    event.preventDefault();
    setFormError(null);

    if (!validate()) return;

    setIsGenerating(true);
    setProgressSeconds(0);

    const startedAt = Date.now();
    const timer = window.setInterval(() => {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000);
      setProgressSeconds(elapsed);
    }, 250);

    try {
      const generatedPlan = await lessonPlanService.generate({
        studentGoal: studentGoal.trim(),
        duration: Number(duration),
        studentLevel,
        studentId: user?.id,
        tutorId: tutorId.trim() || undefined,
      });

      const elapsedMs = Date.now() - startedAt;
      const nextPlan: LessonPlan = {
        ...generatedPlan,
        responseTimeMs: generatedPlan.responseTimeMs ?? elapsedMs,
      };

      setPlans((prev) => {
        const withoutDuplicate = prev.filter((plan) => plan.id !== nextPlan.id);
        return [nextPlan, ...withoutDuplicate];
      });
      setSelectedPlan(nextPlan);

      if (typeof window !== "undefined" && nextPlan.id) {
        localStorage.setItem("lessonPlan:lastPlanId", nextPlan.id);
      }

      toast.success("Lesson plan generated successfully");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to generate lesson plan";
      setFormError(message);
      toast.error(message);
    } finally {
      window.clearInterval(timer);
      setIsGenerating(false);
    }
  };

  const handleViewPlan = async (planId: string) => {
    try {
      const plan = await lessonPlanService.getSinglePlan(planId);
      setSelectedPlan(plan);
      setPlans((prev) =>
        prev.map((item) => (item.id === plan.id ? plan : item)),
      );

      if (typeof window !== "undefined") {
        localStorage.setItem("lessonPlan:lastPlanId", plan.id);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load lesson plan";
      setDashboardError(message);
      toast.error(message);
    }
  };

  const handleStatusUpdate = async (
    planId: string,
    status: LessonPlanStatus,
  ) => {
    try {
      const updated = await lessonPlanService.updatePlanStatus(planId, status);
      setPlans((prev) =>
        prev.map((plan) => (plan.id === updated.id ? updated : plan)),
      );
      setSelectedPlan((prev) => (prev?.id === updated.id ? updated : prev));
      toast.success(`Plan marked as ${normalizeStatusLabel(status)}`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update status";
      setDashboardError(message);
      toast.error(message);
    }
  };

  const handleDelete = async (planId: string) => {
    try {
      await lessonPlanService.deletePlan(planId);
      setPlans((prev) => prev.filter((plan) => plan.id !== planId));
      setSelectedPlan((prev) => (prev?.id === planId ? null : prev));
      toast.success("Plan deleted successfully");

      if (typeof window !== "undefined") {
        const lastPlanId = localStorage.getItem("lessonPlan:lastPlanId");
        if (lastPlanId === planId) {
          localStorage.removeItem("lessonPlan:lastPlanId");
        }
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete lesson plan";
      setDashboardError(message);
      toast.error(message);
    }
  };

  return (
    <section className="mx-auto max-w-6xl space-y-6 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            AI-Powered Lesson Plan Generator
          </CardTitle>
          <CardDescription>
            Generate personalized week-by-week curriculum based on your learning
            goal.
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs
        value={activeTab}
        onValueChange={(value) =>
          setActiveTab(value as "generate" | "dashboard")
        }
        className="space-y-4"
      >
        <TabsList className="grid grid-cols-2 w-full md:w-90">
          <TabsTrigger value="generate">Generate Curriculum</TabsTrigger>
          <TabsTrigger value="dashboard">My Plans Dashboard</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Lesson Plan Generator</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGenerate} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="goal">Learning Goal</Label>
                  <Textarea
                    id="goal"
                    value={studentGoal}
                    onChange={(event) => setStudentGoal(event.target.value)}
                    minLength={10}
                    disabled={isGenerating}
                    placeholder="Learn React and Next.js for fullstack development"
                    className="min-h-28"
                  />
                  {errors.studentGoal && (
                    <p className="text-sm text-red-600">{errors.studentGoal}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Duration (weeks)</Label>
                    <Select
                      value={duration}
                      onValueChange={setDuration}
                      disabled={isGenerating}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        {SUGGESTED_DURATIONS.map((week) => (
                          <SelectItem
                            key={`suggested-${week}`}
                            value={String(week)}
                          >
                            {week} weeks (suggested)
                          </SelectItem>
                        ))}
                        {Array.from({ length: 52 }, (_, index) => index + 1)
                          .filter((week) => !SUGGESTED_DURATIONS.includes(week))
                          .map((week) => (
                            <SelectItem
                              key={`week-${week}`}
                              value={String(week)}
                            >
                              {week} week{week > 1 ? "s" : ""}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    {errors.duration && (
                      <p className="text-sm text-red-600">{errors.duration}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tutorId">Tutor ID (optional)</Label>
                    <Input
                      id="tutorId"
                      value={tutorId}
                      onChange={(event) => setTutorId(event.target.value)}
                      disabled={isGenerating}
                      placeholder="Attach a tutor to this plan"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Skill Level</Label>
                  <div className="flex flex-wrap gap-3">
                    {LEVELS.map((item) => (
                      <label
                        key={item}
                        className="flex items-center gap-2 text-sm cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="skillLevel"
                          value={item}
                          checked={studentLevel === item}
                          disabled={isGenerating}
                          onChange={() => setStudentLevel(item)}
                        />
                        {normalizeLevelLabel(item)}
                      </label>
                    ))}
                  </div>
                  {errors.studentLevel && (
                    <p className="text-sm text-red-600">
                      {errors.studentLevel}
                    </p>
                  )}
                </div>

                {formError && (
                  <p className="text-sm text-red-600">{formError}</p>
                )}

                {formError && (
                  <Button
                    type="submit"
                    variant="outline"
                    disabled={isGenerating}
                  >
                    Retry Generate
                  </Button>
                )}

                <Button
                  type="submit"
                  disabled={isGenerating}
                  className="w-full md:w-auto"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Lesson Plan...
                    </>
                  ) : (
                    "Generate Curriculum"
                  )}
                </Button>

                {isGenerating && (
                  <p className="text-sm text-muted-foreground">
                    🚀 Generating your personalized lesson plan...{" "}
                    {progressSeconds}s
                  </p>
                )}
              </form>
            </CardContent>
          </Card>

          {selectedPlan && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Generated Lesson Plan</CardTitle>
                <CardDescription>{selectedPlan.goal}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="rounded-md border p-3">
                    <p className="text-xs text-muted-foreground">Total Weeks</p>
                    <p className="text-lg font-semibold">
                      {selectedPlan.totalWeeks}
                    </p>
                  </div>
                  <div className="rounded-md border p-3">
                    <p className="text-xs text-muted-foreground">Total Hours</p>
                    <p className="text-lg font-semibold">
                      {selectedPlan.totalHours}
                    </p>
                  </div>
                  <div className="rounded-md border p-3">
                    <p className="text-xs text-muted-foreground">Status</p>
                    <p className="text-lg font-semibold">
                      {normalizeStatusLabel(selectedPlan.status)}
                    </p>
                  </div>
                  <div className="rounded-md border p-3">
                    <p className="text-xs text-muted-foreground">
                      Generation Time
                    </p>
                    <p className="text-lg font-semibold">
                      {selectedPlan.responseTimeMs
                        ? `${(selectedPlan.responseTimeMs / 1000).toFixed(2)}s`
                        : "-"}
                    </p>
                  </div>
                </div>

                <Accordion type="single" collapsible className="space-y-2">
                  {selectedPlan.weeks.map((week) => (
                    <AccordionItem
                      key={`week-${week.weekNumber}`}
                      value={`week-${week.weekNumber}`}
                      className="border rounded-lg px-4"
                    >
                      <AccordionTrigger className="hover:no-underline">
                        <div className="text-left">
                          <p className="font-semibold">
                            Week {week.weekNumber}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {week.title}
                          </p>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <div>
                          <p className="text-sm font-medium mb-2">Topics</p>
                          <ul className="list-disc pl-5 space-y-1 text-sm">
                            {week.topics.map((topic, index) => (
                              <li key={`${week.weekNumber}-topic-${index}`}>
                                {topic}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <p className="text-sm font-medium mb-2">Exercises</p>
                          <div className="space-y-2">
                            {week.exercises.map((exercise, index) => (
                              <div
                                key={getExerciseKey(exercise, index)}
                                className="flex items-center justify-between border rounded-md px-3 py-2"
                              >
                                <span className="text-sm">
                                  {exercise.title}
                                </span>
                                <Badge
                                  variant="outline"
                                  className={getDifficultyClasses(
                                    exercise.difficulty,
                                  )}
                                >
                                  {exercise.difficulty}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="rounded-md border p-3 bg-muted/40">
                          <p className="text-sm font-medium mb-1">Milestone</p>
                          <p className="text-sm text-muted-foreground">
                            {week.milestone || "No milestone provided"}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock3 className="h-4 w-4" />
                          Estimated study time: {week.estimatedHours}h
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>

                <Card className="py-4">
                  <CardContent className="space-y-4">
                    <div>
                      <p className="font-medium mb-2 flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        Resources
                      </p>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {selectedPlan.resources.length === 0 && (
                          <li>No resources listed.</li>
                        )}
                        {selectedPlan.resources.map((resource, index) => (
                          <li key={`resource-${index}`}>
                            {isLink(resource) ? (
                              <a
                                href={resource}
                                target="_blank"
                                rel="noreferrer"
                                className="text-primary underline"
                              >
                                {resource}
                              </a>
                            ) : (
                              resource
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="font-medium mb-2">Assessment Strategy</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedPlan.assessmentStrategy ||
                          "No assessment strategy provided."}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="dashboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lesson Plans Dashboard</CardTitle>
              <CardDescription>
                View and manage your generated curriculum plans.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="flex items-center gap-2">
                  {STATUS_FILTERS.map((status) => (
                    <Button
                      key={status}
                      variant={statusFilter === status ? "default" : "outline"}
                      size="sm"
                      onClick={() => setStatusFilter(status)}
                    >
                      {status === "ALL" ? "All" : normalizeStatusLabel(status)}
                    </Button>
                  ))}
                </div>

                <p className="text-sm text-muted-foreground">
                  {filteredPlans.length} plan
                  {filteredPlans.length === 1 ? "" : "s"}
                </p>
              </div>

              {dashboardError && (
                <div className="space-y-2">
                  <p className="text-sm text-red-600">{dashboardError}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => void loadPlans()}
                  >
                    Retry
                  </Button>
                </div>
              )}

              {isLoadingPlans ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading lesson plans...
                </div>
              ) : filteredPlans.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No lesson plans found for this filter.
                </p>
              ) : (
                <div className="space-y-3">
                  {filteredPlans.map((plan) => (
                    <Card key={plan.id} className="py-4">
                      <CardContent className="space-y-3">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                          <div>
                            <p className="font-medium">{plan.goal}</p>
                            <p className="text-sm text-muted-foreground">
                              {plan.totalWeeks} weeks • {plan.totalHours} hours
                              • {normalizeStatusLabel(plan.status)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Created:{" "}
                              {formatDate(plan.createdAt || plan.generatedAt)}
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewPlan(plan.id)}
                            >
                              View
                            </Button>

                            {plan.status !== "completed" && (
                              <Button
                                size="sm"
                                onClick={() =>
                                  handleStatusUpdate(plan.id, "completed")
                                }
                              >
                                <CheckCircle2 className="mr-1 h-4 w-4" />
                                Mark Complete
                              </Button>
                            )}

                            {plan.status !== "archived" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleStatusUpdate(plan.id, "archived")
                                }
                              >
                                <Archive className="mr-1 h-4 w-4" />
                                Archive
                              </Button>
                            )}

                            {plan.status !== "active" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleStatusUpdate(plan.id, "active")
                                }
                              >
                                Mark Active
                              </Button>
                            )}

                            {plan.status !== "archived" && (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDelete(plan.id)}
                              >
                                <Trash2 className="mr-1 h-4 w-4" />
                                Delete
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
}
