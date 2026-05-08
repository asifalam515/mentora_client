import { PremiumReviews } from "@/components/(shared)/CustomerReview";
import Footer from "@/components/(shared)/Footer";
import { PremiumHowItWorks } from "@/components/(shared)/HowWorks";
import HeroSection from "@/components/home/HeroSection";
import StatisticsImpact from "@/components/home/StatisticsImpact";
import Tutors from "./tutors/page";

const HomePage = async () => {
  return (
    <div>
      <HeroSection></HeroSection>
      <Tutors></Tutors>

      <PremiumHowItWorks></PremiumHowItWorks>
      <PremiumReviews></PremiumReviews>
      <div className="mx-auto max-w-6xl px-4 py-12">
        <StatisticsImpact variant="featured" />
      </div>
      <Footer></Footer>
    </div>
  );
};

export default HomePage;
