import { PremiumReviews } from "@/components/(shared)/CustomerReview";
import Footer from "@/components/(shared)/Footer";
import { PremiumHowItWorks } from "@/components/(shared)/HowWorks";
import SectionReveal from "@/components/(shared)/SectionReveal";
import HeroSection from "@/components/home/HeroSection";
import StatisticsImpact from "@/components/home/StatisticsImpact";
import TrustedCompanies from "@/components/home/TrustedCompanies";
import Tutors from "./tutors/page";
import { AnalyticsShape } from "@/types/statistics-impact";

export const revalidate = 3600; // Cache for 1 hour

const getBackendApiBase = () => {
  const base = (
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.REACT_APP_API_URL ||
    "http://localhost:5000/api/v1"
  ).replace(/\/$/, "");

  return base.endsWith("/api/v1") ? base : `${base}/api/v1`;
};

async function getAnalytics(): Promise<AnalyticsShape | undefined> {
  try {
    const res = await fetch(`${getBackendApiBase()}/analytics`, {
      next: { revalidate: 3600 },
      headers: { Accept: "application/json" },
    });
    
    if (!res.ok) return undefined;
    
    const payload = await res.json();
    return payload.analytics;
  } catch (error) {
    console.error("Failed to fetch analytics for SSR", error);
    return undefined;
  }
}

const HomePage = async () => {
  const analyticsData = await getAnalytics();

  return (
    <div className="bg-background text-foreground">
      <SectionReveal>
        <HeroSection></HeroSection>
      </SectionReveal>
      <SectionReveal delay={0.05}>
        <Tutors></Tutors>
      </SectionReveal>

      <SectionReveal delay={0.08}>
        <PremiumHowItWorks></PremiumHowItWorks>
      </SectionReveal>
      <SectionReveal delay={0.1}>
        <PremiumReviews></PremiumReviews>
      </SectionReveal>
      <SectionReveal delay={0.12}>
        <div className="mx-auto max-w-6xl px-4 py-12">
          <StatisticsImpact variant="featured" fallback={analyticsData} />
        </div>
      </SectionReveal>
      
      <TrustedCompanies />
      <Footer></Footer>
    </div>
  );
};

export default HomePage;
