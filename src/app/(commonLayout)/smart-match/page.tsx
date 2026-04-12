import { SmartMatch } from "@/components/SmartMatch";

export const metadata = {
  title: "Smart Match - Find Your Perfect Tutor",
  description:
    "AI-powered tutor recommendations based on your learning goals. Find the best tutors tailored to your needs.",
  openGraph: {
    title: "Smart Match - Find Your Perfect Tutor",
    description:
      "AI-powered tutor recommendations based on your learning goals.",
  },
};

export default function SmartMatchPage() {
  return <SmartMatch />;
}
