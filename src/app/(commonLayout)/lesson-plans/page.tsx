import { LessonPlanGenerator } from "@/components/lesson-plan/LessonPlanGenerator";

export const metadata = {
  title: "My Lesson Plans - Mentora",
  description: "View and manage your generated lesson plans.",
};

export default function StudentLessonPlansPage() {
  return <LessonPlanGenerator defaultTab="dashboard" />;
}
