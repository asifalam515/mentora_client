import { LessonPlanGenerator } from "@/components/lesson-plan/LessonPlanGenerator";

export const metadata = {
  title: "Generate Curriculum - Mentora",
  description:
    "Generate personalized AI lesson plans with week-by-week curriculum.",
};

export default function GenerateCurriculumPage() {
  return <LessonPlanGenerator />;
}
