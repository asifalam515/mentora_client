"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FadeIn, FadeInStagger } from "@/components/ui/fade-in";
import { Input } from "@/components/ui/input";
import { apiJson } from "@/lib/api-client";
import {
  BookOpen,
  Calculator,
  CheckCircle,
  ChevronRight,
  Clock,
  GraduationCap,
  Play,
  Search,
  Shield,
  Star,
  Users
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface TutorCategoryAssignment {
  tutorId: string;
  categoryId: string;
  category?: {
    id: string;
    name: string;
  };
}

interface TopTutor {
  name: string;
  subject: string;
  rating: number;
  students: number;
  avatar?: string;
}

const SUBJECT_DOT_COLORS = [
  "bg-blue-500",
  "bg-green-500",
  "bg-amber-500",
  "bg-red-500",
  "bg-cyan-500",
  "bg-rose-500",
];

const HeroSection = () => {
  const searchQuery = "";
  const [selectedSubject, setSelectedSubject] = useState("");
  const [popularCategories, setPopularCategories] = useState<string[]>([]);
  const [topTutors, setTopTutors] = useState<TopTutor[]>([]);
  console.log("popularCategories", popularCategories);
  console.log("topTutors", topTutors);

  useEffect(() => {
    const fetchPopularCategories = async () => {
      try {
        const response = await apiJson<
          TutorCategoryAssignment[] | { data?: TutorCategoryAssignment[] }
        >("/tutor-categories", { skipAuthRedirect: true });

        const assignments = Array.isArray(response)
          ? response
          : Array.isArray(response?.data)
            ? response.data
            : [];

        const categoryCount = new Map<string, number>();

        assignments.forEach((item) => {
          const categoryName = item?.category?.name?.trim();
          if (!categoryName) return;

          const currentCount = categoryCount.get(categoryName) ?? 0;
          categoryCount.set(categoryName, currentCount + 1);
        });

        const topCategoryNames = [...categoryCount.entries()]
          .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
          .slice(0, 6)
          .map(([name]) => name);

        setPopularCategories(topCategoryNames);
      } catch (error) {
        console.error("Failed to load tutor categories", error);
        setPopularCategories([]);
      }
    };

    fetchPopularCategories();
  }, []);

  useEffect(() => {
    const fetchTopTutors = async () => {
      try {
        const response = await apiJson<TopTutor[] | { data?: TopTutor[] }>(
          "/tutor-profiles/top-tutors",
          { skipAuthRedirect: true },
        );

        const tutors = Array.isArray(response)
          ? response
          : Array.isArray(response?.data)
            ? response.data
            : [];

        setTopTutors(tutors);
      } catch (error) {
        console.error("Failed to load top tutors", error);
        setTopTutors([]);
      }
    };

    fetchTopTutors();
  }, []);

  const stats = [
    {
      number: "500+",
      label: "Expert Tutors",
      icon: <Users className="h-5 w-5" />,
    },
    {
      number: "10K+",
      label: "Students Helped",
      icon: <GraduationCap className="h-5 w-5" />,
    },
    { number: "50K+", label: "Sessions", icon: <Clock className="h-5 w-5" /> },
    {
      number: "4.9/5",
      label: "Avg Rating",
      icon: <Star className="h-5 w-5" />,
    },
  ];

  const features = [
    "1-on-1 personalized sessions",
    "Flexible scheduling",
    "Verified expert tutors",
    "100% satisfaction guarantee",
    "Interactive whiteboard",
    "Progress tracking",
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery) {
      // Handle search logic
      console.log("Searching for:", searchQuery);
    }
  };

  return (
    <section className="relative overflow-hidden bg-background">
      {/* Premium subtle grid background */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary opacity-20 blur-[100px]"></div>
      </div>

      <div className="container relative z-10 mx-auto px-4 py-12 sm:py-16 md:py-24 lg:py-32">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          {/* Left Content */}
          <FadeInStagger className="space-y-6 sm:space-y-8">
            {/* Badge */}
            <FadeIn>
              <div className="inline-flex max-w-full items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
                <Shield className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium text-primary sm:text-sm">
                  Trusted by 10,000+ learners worldwide
                </span>
              </div>
            </FadeIn>

            {/* Main Heading */}
            <FadeIn>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                <span className="block text-foreground">Unlock Your</span>
                <span className="block bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">Learning Potential</span>
                <span className="block text-foreground">with Expert Tutors</span>
              </h1>
            </FadeIn>

            {/* Description */}
            <FadeIn>
              <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg lg:w-5/6 lg:text-xl">
                Connect 1-on-1 with verified expert tutors across 50+ subjects.
                Flexible scheduling, personalized sessions, and guaranteed
                progress.
              </p>
            </FadeIn>

            {/* Features List */}
            <FadeIn>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 flex-none text-green-500 sm:h-5 sm:w-5" />
                    <span className="text-sm leading-snug">{feature}</span>
                  </div>
                ))}
              </div>
            </FadeIn>

            {/* Search Bar */}
            <FadeIn>
              <Card className="border-primary/20 shadow-lg">
                <CardContent className="p-4 sm:p-6">
                  <form onSubmit={handleSearch} className="space-y-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type="text"
                          placeholder="What do you want to learn?"
                          className="h-12 w-full bg-background pl-10 text-base"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <Button type="submit" size="lg" className="h-12 w-full sm:w-auto font-medium transition-all duration-200 active:scale-[0.98]">
                        Find Tutors
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>

                    {/* Popular Subjects */}
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Popular subjects:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {popularCategories.map((subject, index) => (
                          <Button
                            key={subject}
                            type="button"
                            variant="outline"
                            size="sm"
                            className={`rounded-full gap-2 transition-all duration-200 active:scale-[0.98] ${
                              selectedSubject === subject
                                ? "border-primary bg-primary/10"
                                : ""
                            }`}
                            onClick={() => setSelectedSubject(subject)}
                          >
                            <span
                              className={`${SUBJECT_DOT_COLORS[index % SUBJECT_DOT_COLORS.length]} h-2 w-2 rounded-full`}
                            />
                            {subject}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </FadeIn>

            {/* CTA Buttons */}
            <FadeIn>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button size="lg" className="h-12 w-full px-8 sm:w-auto transition-all duration-200 active:scale-[0.98]" asChild>
                  <Link href="/register">
                    Start Learning Free
                    <BookOpen className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 w-full px-8 sm:w-auto transition-all duration-200 active:scale-[0.98]"
                  asChild
                >
                  <Link href="/become-tutor">
                    Become a Tutor
                  </Link>
                </Button>
              </div>
            </FadeIn>

            {/* Stats */}
            <FadeIn>
              <div className="grid grid-cols-2 gap-4 pt-4 sm:gap-6 md:grid-cols-4">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <div className="flex h-5 w-5 items-center justify-center text-primary sm:h-auto sm:w-auto">
                        {stat.icon}
                      </div>
                      <div className="text-xl font-bold sm:text-2xl">
                        {stat.number}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </FadeInStagger>

          {/* Right Content */}
          <div className="relative mx-auto w-full max-w-2xl lg:max-w-none">
            {/* Main Illustration Card */}
            <Card className="relative overflow-hidden border-primary/20 shadow-2xl">
              <CardContent className="p-0">
                <div
                  className="
  relative overflow-hidden rounded-xl border
  bg-linear-to-br
  from-primary/10 via-primary/5 to-transparent
  dark:from-primary/20 dark:via-primary/10 dark:to-transparent
  p-4 sm:p-5 lg:p-6
"
                >
                  {/* Subtle background decoration */}
                  <div className="pointer-events-none absolute inset-0 opacity-40 dark:opacity-20">
                    <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
                    <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-primary/20 blur-2xl" />
                  </div>

                  <div className="relative z-10 flex flex-col gap-4 sm:gap-5">
                    {/* Top Section */}
                    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                      <div className="flex items-center gap-3 sm:gap-4">
                        {/* Play Button */}
                        <div className="relative">
                          <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
                          <div
                            className="
              relative flex h-10 w-10 items-center justify-center rounded-full sm:h-12 sm:w-12
              bg-primary text-primary-foreground
              shadow-md transition-transform
              hover:scale-105
            "
                          >
                            <Play className="h-5 w-5 fill-current sm:h-6 sm:w-6" />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-semibold text-foreground sm:text-lg">
                              Live Session Demo
                            </h3>
                            <Badge
                              variant="outline"
                              className="
                text-xs
                border-primary/30
                bg-primary/10
                text-primary
                dark:bg-primary/20
              "
                            >
                              Preview
                            </Badge>
                          </div>

                          <p className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Experience interactive learning
                          </p>
                        </div>
                      </div>

                      {/* Action Button */}
                      <Button
                        variant="outline"
                        size="sm"
                        className="
            w-full sm:w-auto
          border-primary/30
          text-primary
          hover:bg-primary/10
          dark:hover:bg-primary/20
        "
                      >
                        <Play className="mr-2 h-4 w-4" />
                        Watch Demo
                      </Button>
                    </div>

                    {/* Progress */}
                    <div>
                      <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                        <span>Session Preview</span>
                        <span>2:30</span>
                      </div>

                      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                        <div className="relative h-full w-2/3 rounded-full bg-primary">
                          <div className="absolute inset-0 bg-primary/40 animate-pulse" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tutor Card */}
                <div className="p-4 sm:p-6">
                  <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <Avatar className="h-14 w-14 border-2 border-primary sm:h-16 sm:w-16">
                        <AvatarImage
                          src="https://i.ibb.co.com/wW0P4Kk/profile.jpg"
                          alt="Tutor"
                        />
                        <AvatarFallback className="bg-primary/10">
                          <GraduationCap className="h-7 w-7 text-primary sm:h-8 sm:w-8" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-base font-bold sm:text-lg">
                          Dr. Sarah Chen
                        </h3>
                        <p className="text-sm text-muted-foreground sm:text-base">
                          Mathematics Expert
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">4.9</span>
                          <span className="text-xs text-muted-foreground sm:text-sm">
                            (250+ students)
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge className="self-start bg-green-500 hover:bg-green-600 sm:self-auto">
                      Online Now
                    </Badge>
                  </div>

                  {/* Session Preview */}
                  <div className="space-y-4">
                    <div className="rounded-lg bg-muted p-3 sm:p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">
                          Interactive Whiteboard
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Live
                        </span>
                      </div>
                      <div className="h-32 bg-background rounded border flex items-center justify-center">
                        <div className="text-center">
                          <Calculator className="h-8 w-8 mx-auto text-primary mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Calculus Problem Solving
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Top Tutors */}
                    <div>
                      <h4 className="font-semibold mb-3">Top Rated Tutors</h4>
                      <div className="space-y-3">
                        {topTutors.map((tutor, index) => (
                          <div
                            key={`${tutor.name}-${index}`}
                            className="flex items-center justify-between gap-3 rounded-lg border p-3 transition-colors hover:bg-accent"
                          >
                            <div className="flex min-w-0 items-center gap-3">
                              <Avatar className="h-9 w-9 flex-none sm:h-10 sm:w-10">
                                <AvatarImage
                                  src={tutor.avatar}
                                  alt={tutor.name}
                                />
                                <AvatarFallback className="bg-primary/10">
                                  {tutor.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <p className="truncate font-medium">
                                  {tutor.name}
                                </p>
                                <p className="truncate text-xs text-muted-foreground">
                                  {tutor.subject}
                                </p>
                              </div>
                            </div>
                            <div className="flex-none text-right">
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span className="font-medium">
                                  {tutor.rating}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {tutor.students} students
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Available Times */}
                    <div className="pt-4 border-t">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <h4 className="font-semibold">Available Today</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 flex-none px-2"
                        >
                          View All
                          <ChevronRight className="ml-1 h-3 w-3" />
                        </Button>
                      </div>
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {[
                          "10:00 AM",
                          "1:30 PM",
                          "3:00 PM",
                          "5:30 PM",
                          "7:00 PM",
                        ].map((time, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="rounded-lg whitespace-nowrap"
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Floating Elements */}
            <div className="absolute -bottom-4 -left-4 hidden md:block lg:-bottom-6 lg:-left-6">
              <Card className="border-primary/20 shadow-lg">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold">95% Success Rate</p>
                      <p className="text-xs text-muted-foreground">
                        Student satisfaction
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="absolute -top-4 -right-4 hidden md:block lg:-top-6 lg:-right-6">
              <Card className="border-primary/20 shadow-lg">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold">Flexible Hours</p>
                      <p className="text-xs text-muted-foreground">
                        24/7 availability
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </section>
  );
};

export default HeroSection;
