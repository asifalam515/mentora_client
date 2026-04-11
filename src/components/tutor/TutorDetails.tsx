"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TutorDetailsPageProps } from "@/types/tutor/types";
import {
  Award,
  Bookmark,
  BookmarkCheck,
  BookOpen,
  Briefcase,
  Calendar,
  CheckCircle,
  Clock,
  Flag,
  Globe,
  MapPin,
  MessageSquare,
  Share2,
  Sparkles,
  Star,
  Users,
  Video,
} from "lucide-react";
import { useState } from "react";
import AvailableSlotsForBooking from "../booking/AvailableSlotsForBooking";

const TutorDetailsPage = ({
  tutor,
  isLoading = false,
  isSaved = false,
  onBookClick,
  onMessageClick,
  onSaveClick,
  onShareClick,
  onReportClick,
  onReviewClick,
}: TutorDetailsPageProps) => {
  const [activeTab, setActiveTab] = useState("about");
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  // Calculate average rating breakdown (mock data - replace with actual from API)
  const ratingBreakdown = [
    { stars: 5, percentage: 75 },
    { stars: 4, percentage: 20 },
    { stars: 3, percentage: 5 },
    { stars: 2, percentage: 0 },
    { stars: 1, percentage: 0 },
  ];

  const handleBookNow = () => {
    if (onBookClick) {
      onBookClick(
        tutor.id,
        selectedSubject || undefined,
        selectedSlot || undefined,
      );
    }
  };

  const handleSave = () => {
    if (onSaveClick) {
      onSaveClick(tutor.id, !isSaved);
    }
  };

  const handleMessage = () => {
    if (onMessageClick) {
      onMessageClick(tutor.id);
    }
  };

  const handleShare = () => {
    if (onShareClick) {
      onShareClick(tutor.id);
    }
  };

  const handleReport = () => {
    if (onReportClick) {
      onReportClick(tutor.id);
    }
  };

  // Loading skeleton
  if (isLoading) {
    return <TutorDetailsSkeleton />;
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Cover Image - Using user image as cover */}
      <div className="relative h-64 md:h-80 lg:h-96 bg-linear-to-r from-primary/20 to-primary/5">
        {tutor.user?.image ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${tutor.user.image})` }}
          />
        ) : (
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.05)_50%,transparent_75%)] bg-size-[20px_20px]" />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/50 to-transparent" />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 -mt-32 md:-mt-40 lg:-mt-48 relative z-10 pb-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header Card */}
            <Card className="border-2 shadow-xl">
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  {/* Avatar */}
                  <div className="relative">
                    <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background shadow-xl">
                      <AvatarImage
                        src={tutor.user?.image}
                        alt={tutor.user?.name}
                      />
                      <AvatarFallback className="bg-primary/10 text-2xl">
                        {tutor.user?.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    {/* Online status - you'll need to add this to your data structure */}
                    <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-green-500 border-4 border-background" />
                  </div>

                  {/* Basic Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <h1 className="text-2xl md:text-3xl font-bold">
                        {tutor.user?.name}
                      </h1>
                      {tutor.isVerified && (
                        <Badge className="bg-blue-500 hover:bg-blue-600 gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Verified
                        </Badge>
                      )}
                      {tutor.isFeatured && (
                        <Badge
                          variant="outline"
                          className="border-yellow-500 text-yellow-600 dark:text-yellow-400 gap-1"
                        >
                          <Sparkles className="h-3 w-3" />
                          Featured
                        </Badge>
                      )}
                    </div>

                    <p className="text-lg text-muted-foreground">
                      {tutor.bio?.substring(0, 100)}...
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>Online</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <span>UTC+6</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>Response: Within 24h</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold text-lg">
                          {tutor.rating?.toFixed(1) || "0.0"}
                        </span>
                        <span className="text-muted-foreground">
                          ({tutor.totalReviews || 0} reviews)
                        </span>
                      </div>
                      <Separator orientation="vertical" className="h-6" />
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{tutor.totalStudents || 0} students</span>
                      </div>
                      <Separator orientation="vertical" className="h-6" />
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        <span>{tutor.experience}+ years experience</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons - Mobile */}
                  <div className="flex md:hidden gap-2 w-full">
                    <Button
                      className="flex-1"
                      size="lg"
                      onClick={handleBookNow}
                    >
                      Book Now
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-12 w-12"
                      onClick={handleMessage}
                    >
                      <MessageSquare className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-12 w-12"
                      onClick={handleSave}
                    >
                      {isSaved ? (
                        <BookmarkCheck className="h-5 w-5 text-primary" />
                      ) : (
                        <Bookmark className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Action Buttons - Desktop */}
                <div className="hidden md:flex items-center justify-between mt-6 pt-6 border-t">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl font-bold text-primary">
                      ${tutor.pricePerHr}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      per hour
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={handleMessage}
                      className="gap-2"
                    >
                      <MessageSquare className="h-4 w-4" />
                      Message
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={handleShare}
                      className="gap-2"
                    >
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                    <Button
                      size="lg"
                      onClick={handleBookNow}
                      className="gap-2 px-8"
                    >
                      Book Now
                      <Calendar className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs Section */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-6"
            >
              <TabsList className="grid grid-cols-4 h-14 p-1">
                <TabsTrigger value="about" className="text-base gap-2">
                  <BookOpen className="h-4 w-4" />
                  About
                </TabsTrigger>
                <TabsTrigger value="subjects" className="text-base gap-2">
                  <Award className="h-4 w-4" />
                  Subjects
                </TabsTrigger>
                <TabsTrigger value="reviews" className="text-base gap-2">
                  <Star className="h-4 w-4" />
                  Reviews
                </TabsTrigger>
                <TabsTrigger value="availability" className="text-base gap-2">
                  <Calendar className="h-4 w-4" />
                  Availability
                </TabsTrigger>
              </TabsList>

              {/* About Tab */}
              <TabsContent value="about" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      About {tutor.user?.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                      {tutor.bio || "No bio provided yet."}
                    </p>

                    <Separator />

                    {/* Education - You'll need to add this to your data structure */}
                    <div className="space-y-4">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Award className="h-5 w-5 text-primary" />
                        Education
                      </h3>
                      <div className="text-muted-foreground">
                        Information not available
                      </div>
                    </div>

                    <Separator />

                    {/* Certifications - You'll need to add this to your data structure */}
                    <div className="space-y-4">
                      <h3 className="font-semibold flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-primary" />
                        Certifications
                      </h3>
                      <div className="text-muted-foreground">
                        Information not available
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Subjects Tab */}
              <TabsContent value="subjects" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      Subjects & Expertise
                    </CardTitle>
                    <CardDescription>
                      {tutor.user?.name} specializes in the following subjects
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* You'll need to add subjects to your data structure */}
                      <div className="flex gap-2 flex-wrap">
                        {tutor?.categories?.map((cat) => (
                          <span
                            key={cat.categoryId}
                            className="px-3 py-1 text-sm bg-primary/10 text-primary rounded-full"
                          >
                            {cat?.category.name}
                          </span>
                        ))}
                      </div>

                      <div className="text-center py-8 text-muted-foreground">
                        No subjects added yet.
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Star className="h-5 w-5 text-primary" />
                          Student Reviews
                        </CardTitle>
                        <CardDescription>
                          What students say about {tutor.user?.name}
                        </CardDescription>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => onReviewClick?.(tutor.id)}
                      >
                        Write a Review
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Rating Summary */}
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                      <div className="text-center md:text-left">
                        <div className="text-5xl font-bold text-primary">
                          {tutor.rating?.toFixed(1) || "0.0"}
                        </div>
                        <div className="flex items-center justify-center md:justify-start gap-1 mt-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-5 w-5 ${
                                star <= Math.round(tutor.rating || 0)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Based on {tutor.totalReviews || 0} reviews
                        </p>
                      </div>

                      <div className="md:col-span-2 space-y-2">
                        {ratingBreakdown.map((breakdown) => (
                          <div
                            key={breakdown.stars}
                            className="flex items-center gap-2"
                          >
                            <span className="text-sm w-12">
                              {breakdown.stars} stars
                            </span>
                            <Progress
                              value={breakdown.percentage}
                              className="h-2 flex-1"
                            />
                            <span className="text-sm text-muted-foreground w-12">
                              {breakdown.percentage}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator className="my-6" />

                    {/* Reviews List */}
                    <ScrollArea className="h-100 pr-4">
                      <div className="space-y-6">
                        {/* You'll need to add reviews to your data structure */}
                        <div className="text-center py-8 text-muted-foreground">
                          No reviews yet.
                        </div>
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Availability Tab */}
              <TabsContent value="availability" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      Available Time Slots
                    </CardTitle>
                    <CardDescription>
                      Select a time that works best for you
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* You'll need to add availability to your data structure */}
                      <AvailableSlotsForBooking
                        tutorId={tutor.id}
                        tutorHourlyRate={tutor.pricePerHr}
                      ></AvailableSlotsForBooking>
                      <div className="text-center py-8 text-muted-foreground">
                        No availability slots added yet.
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t bg-muted/30 px-6 py-4">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        All times are in UTC+6
                      </div>
                      <Button onClick={handleBookNow} disabled={!selectedSlot}>
                        Book Selected Slot
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Booking Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Booking Card */}
            <Card className="sticky top-24 border-2 shadow-lg">
              <CardHeader className="bg-linear-to-r from-primary/5 to-primary/10">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Book a Session
                </CardTitle>
                <CardDescription>
                  Schedule your personalized session
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                {/* Price Summary */}
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Hourly Rate</span>
                  <span className="text-2xl font-bold text-primary">
                    ${tutor.pricePerHr}
                  </span>
                </div>

                <Separator />

                {/* Subject Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Subject</label>

                  <select className="w-full h-10 px-3 rounded-md border bg-background">
                    {tutor.categories.length > 0 ? (
                      tutor.categories.map((subject) => (
                        <option
                          key={subject.categoryId}
                          value={subject.categoryId}
                        >
                          {subject.category.name}
                        </option>
                      ))
                    ) : (
                      <option value="">No subjects available</option>
                    )}
                  </select>
                </div>
                <div>
                  <AvailableSlotsForBooking
                    tutorId={tutor.id}
                    tutorHourlyRate={tutor.pricePerHr}
                  ></AvailableSlotsForBooking>
                </div>
                {/* Quick Stats */}
                <div className="space-y-3 pt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Response Rate</span>
                    <span className="font-medium">95%</span>
                  </div>
                  <Progress value={95} className="h-1.5" />

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Video className="h-4 w-4" />
                    <span>Video call via Zoom/Google Meet</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Cancel up to 24h in advance</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex-col gap-3 border-t p-6">
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={handleMessage}
                >
                  <MessageSquare className="h-4 w-4" />
                  Send Message
                </Button>
              </CardFooter>
            </Card>

            {/* Tutor Stats Card */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Tutor Statistics
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 rounded-lg bg-primary/5">
                      <div className="text-2xl font-bold text-primary">
                        {tutor._count?.bookings || 0}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Sessions
                      </div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-primary/5">
                      <div className="text-2xl font-bold text-primary">
                        {tutor.totalStudents || 0}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Students
                      </div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-primary/5">
                      <div className="text-2xl font-bold text-primary">
                        {tutor.experience}+
                      </div>
                      <div className="text-xs text-muted-foreground">Years</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-primary/5">
                      <div className="text-2xl font-bold text-primary">
                        {tutor._count?.reviews || 0}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Reviews
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions Card */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={handleSave}
                  >
                    {isSaved ? (
                      <BookmarkCheck className="h-4 w-4 text-primary" />
                    ) : (
                      <Bookmark className="h-4 w-4" />
                    )}
                    {isSaved ? "Saved to Favorites" : "Save to Favorites"}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={handleShare}
                  >
                    <Share2 className="h-4 w-4" />
                    Share Profile
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-destructive"
                    onClick={handleReport}
                  >
                    <Flag className="h-4 w-4" />
                    Report Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

// Loading Skeleton Component
const TutorDetailsSkeleton = () => {
  return (
    <div className="bg-background min-h-screen">
      <div className="relative h-64 md:h-80 lg:h-96 bg-gray-200 dark:bg-gray-800 animate-pulse" />

      <div className="container mx-auto px-4 -mt-32 md:-mt-40 lg:-mt-48 relative z-10 pb-16">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-2">
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="h-24 w-24 md:h-32 md:w-32 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                  <div className="flex-1 space-y-3">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse" />
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-2/3 animate-pulse" />
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 animate-pulse" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6 animate-pulse" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorDetailsPage;
