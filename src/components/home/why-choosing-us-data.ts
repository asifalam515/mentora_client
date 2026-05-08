import {
  type Metric,
  type Testimonial,
  type WhyChoosingUsApiResponse,
} from "@/types/why-choosing-us";

export const WHY_CHOOSING_US_MOCK_DATA: WhyChoosingUsApiResponse = {
  testimonials: [
    {
      id: "aisha-r",
      name: "Aisha R.",
      role: "University Student",
      avatarUrl: "https://i.pravatar.cc/160?img=32",
      rating: 5,
      quote:
        "Mentora matched me with a tutor who understood my goals immediately. My grades improved and lessons are genuinely engaging.",
      verified: true,
    },
    {
      id: "daniel-s",
      name: "Daniel S.",
      role: "Working Professional",
      avatarUrl: "https://i.pravatar.cc/160?img=54",
      rating: 5,
      quote:
        "Found the right tutor within 24 hours and booked sessions around my schedule. Efficient, professional, and results-driven.",
      verified: true,
    },
    {
      id: "priya-k",
      name: "Priya K.",
      role: "Parent",
      avatarUrl: "https://i.pravatar.cc/160?img=47",
      rating: 5,
      quote:
        "Flexible scheduling and clear lesson plans made learning stress-free for my child. The progress tracking is a lifesaver.",
      verified: true,
    },
  ] as Testimonial[],
  metrics: [
    {
      id: "verified-tutors",
      label: "Verified Tutors",
      value: "1,200+",
      icon: "user-check",
    },
    {
      id: "successful-matches",
      label: "Successful Matches",
      value: "98%",
      icon: "heart",
    },
    {
      id: "avg-rating",
      label: "Avg. Rating",
      value: "4.8/5",
      icon: "star",
    },
  ] as Metric[],
};
