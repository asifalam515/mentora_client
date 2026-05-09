import { PremiumReviews } from "@/components/(shared)/CustomerReview";
import Footer from "@/components/(shared)/Footer";
import { PremiumHowItWorks } from "@/components/(shared)/HowWorks";
import SectionReveal from "@/components/(shared)/SectionReveal";
import HeroSection from "@/components/home/HeroSection";
import StatisticsImpact from "@/components/home/StatisticsImpact";
import Tutors from "./tutors/page";

const HomePage = async () => {
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
          <StatisticsImpact variant="featured" />
        </div>
      </SectionReveal>
      <Footer></Footer>
    </div>
  );
};

export default HomePage;
