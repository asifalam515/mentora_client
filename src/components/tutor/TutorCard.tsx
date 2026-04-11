"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Bookmark,
  BookmarkCheck,
  Calendar,
  Clock,
  GraduationCap,
  MapPin,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";
import Link from "next/link";

interface Tutor {
  id: string;
  name: string;
  subjects: string[];
  rating: number;
  totalReviews?: number;
  totalStudents?: number;
  experience: number;
  pricePerHr: number;
  bio?: string;
  image?: string;
  isOnline?: boolean;
  isVerified?: boolean;
  languages?: string[];
  education?: string;
  location?: string;
  availability?: string[];
}

interface SingleTutorCardProps {
  tutor: Tutor;
  showBookButton?: boolean;
  showSaveButton?: boolean;
  variant?: "default" | "compact" | "detailed";
  onBookClick?: (tutorId: string) => void;
  onSaveClick?: (tutorId: string, saved: boolean) => void;
  saved?: boolean;
}

const SingleTutorCard = ({
  tutor,
  showBookButton = true,
  showSaveButton = true,
  variant = "default",
  onBookClick,
  onSaveClick,
  saved = false,
}: SingleTutorCardProps) => {
  const {
    id,
    name,
    subjects,
    rating,
    totalReviews,
    totalStudents,
    experience,
    pricePerHr,
    bio,
    image,
    isOnline = false,
    isVerified = true,
    education,
    location,
    availability = [],
  } = tutor;

  const handleBookClick = () => onBookClick?.(id);
  const handleSaveClick = () => onSaveClick?.(id, !saved);

  // Helper for Initials
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const renderCompactCard = () => (
    <Card className="group overflow-hidden border-border/70 bg-card/80 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_16px_40px_-22px_rgba(15,23,42,0.45)]">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12 rounded-lg ring-1 ring-border/70 shadow-sm">
            <AvatarImage src={image} alt={name} className="object-cover" />
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <h3 className="font-semibold text-sm truncate text-foreground/95 group-hover:text-primary transition-colors">
                    {name}
                  </h3>
                  {isVerified && (
                    <ShieldCheck className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate font-medium tracking-wide">
                  {subjects.slice(0, 2).join(" • ")}
                </p>
              </div>

              {showSaveButton && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 -mr-2 text-muted-foreground hover:text-primary"
                  onClick={handleSaveClick}
                >
                  {saved ? (
                    <BookmarkCheck className="h-4 w-4 text-primary fill-primary/10" />
                  ) : (
                    <Bookmark className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              )}
            </div>

            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-bold">{rating}</span>
                </div>
                <div className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                  ${pricePerHr}/hr
                </div>
              </div>
              <Link
                href={`/tutors/${id}`}
                className="text-[11px] font-semibold text-primary hover:underline underline-offset-4"
              >
                View
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderDefaultCard = () => (
    <Card className="group relative flex h-full flex-col overflow-hidden border-border/70 bg-card/95 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_28px_70px_-34px_rgba(15,23,42,0.55)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-linear-to-r from-primary/12 via-primary/5 to-transparent" />
      <CardContent className="p-0 flex flex-col h-full">
        {/* Top Section */}
        <div className="relative p-6 pb-5">
          <div className="flex justify-between items-start">
            <div className="flex gap-4">
              <div className="relative">
                <Avatar className="h-16 w-16 rounded-xl ring-2 ring-background shadow-md">
                  <AvatarImage
                    src={image}
                    alt={name}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                {isOnline && (
                  <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex h-4 w-4 rounded-full border-2 border-background bg-emerald-500"></span>
                  </span>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold tracking-tight text-foreground/95 group-hover:text-primary transition-colors">
                    {name}
                  </h3>
                  {isVerified && (
                    <Badge
                      variant="secondary"
                      className="h-5 border-none bg-blue-50 px-2 py-0 text-[10px] font-bold uppercase tracking-wider text-blue-700 hover:bg-blue-100"
                    >
                      <ShieldCheck className="h-3 w-3 mr-1" /> Verified
                    </Badge>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  {education && (
                    <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <GraduationCap className="h-3.5 w-3.5 text-primary/70" />
                      <span className="truncate">{education}</span>
                    </div>
                  )}
                  {location && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 text-primary/70" />
                      <span>{location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {showSaveButton && (
              <Button
                variant="outline"
                size="icon"
                className={`h-9 w-9 rounded-full border-border/70 bg-background/70 transition-all hover:border-primary/50 hover:text-primary ${saved ? "border-primary bg-primary/10 text-primary" : ""}`}
                onClick={handleSaveClick}
              >
                {saved ? (
                  <BookmarkCheck className="h-4 w-4 text-primary fill-primary/10" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>

          {/* Stats Bar */}
          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
            <div className="rounded-lg border border-border/60 bg-muted/40 px-2.5 py-2">
              <div className="flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-bold text-sm">{rating}</span>
              </div>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                ({totalReviews})
              </p>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/40 px-2.5 py-2">
              <div className="flex items-center gap-1.5 text-sm font-semibold">
                <Clock className="h-4 w-4 text-primary/70" />
                <span>{experience}+ yrs</span>
              </div>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                Experience
              </p>
            </div>
            {totalStudents && (
              <div className="rounded-lg border border-border/60 bg-muted/40 px-2.5 py-2">
                <div className="flex items-center gap-1.5 text-sm font-semibold">
                  <Users className="h-4 w-4 text-primary/70" />
                  <span>{totalStudents}</span>
                </div>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  Students
                </p>
              </div>
            )}
          </div>

          {/* Bio (Detailed variant only) */}
          {bio && variant === "detailed" && (
            <p className="mt-4 rounded-xl border border-border/60 bg-muted/35 px-3 py-2.5 text-sm italic leading-relaxed text-muted-foreground line-clamp-3">
              &ldquo;{bio}&rdquo;
            </p>
          )}

          {/* Availability */}
          {availability.length > 0 && (
            <div className="mt-5">
              <div className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                Next Available
              </div>
              <div className="flex flex-wrap gap-1.5">
                {availability.slice(0, 3).map((slot, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="border-none bg-emerald-50 text-[10px] font-semibold text-emerald-700 hover:bg-emerald-100"
                  >
                    {slot}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-auto">
          <Separator className="opacity-40" />
          <div className="flex items-center justify-between bg-muted/35 p-4">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black tracking-tight text-foreground">
                  ${pricePerHr}
                </span>
                <span className="text-xs font-medium text-muted-foreground">
                  /hr
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Starting price
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-border/70 bg-background/80 text-xs font-semibold hover:border-primary/40"
                asChild
              >
                <Link href={`/tutors/${id}`}>Show Details</Link>
              </Button>

              {showBookButton && (
                <Button
                  size="sm"
                  className="bg-primary px-4 font-bold shadow-[0_10px_24px_-12px_rgba(14,116,144,0.9)] hover:bg-primary/90"
                  onClick={handleBookClick}
                >
                  Book Session
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  switch (variant) {
    case "compact":
      return renderCompactCard();
    default:
      return renderDefaultCard();
  }
};

export default SingleTutorCard;
export type { SingleTutorCardProps, Tutor };
