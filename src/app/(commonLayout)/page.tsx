import { PremiumReviews } from "@/components/(shared)/CustomerReview";
import Footer from "@/components/(shared)/Footer";
import { PremiumHowItWorks } from "@/components/(shared)/HowWorks";
import HeroSection from "@/components/home/HeroSection";
import Tutors from "./tutors/page";

const HomePage = async () => {
  return (
    <div>
      <HeroSection></HeroSection>
      <Tutors></Tutors>
      <PremiumReviews></PremiumReviews>
      <PremiumHowItWorks></PremiumHowItWorks>
      <Footer></Footer>
    </div>
  );
};

export default HomePage;
