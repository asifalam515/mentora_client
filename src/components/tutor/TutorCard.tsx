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
    <Card className="hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md group">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12 rounded-lg ring-1 ring-border">
            <AvatarImage src={image} alt={name} className="object-cover" />
            <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <h3 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                    {name}
                  </h3>
                  {isVerified && (
                    <ShieldCheck className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate font-medium">
                  {subjects.slice(0, 2).join(" • ")}
                </p>
              </div>

              {showSaveButton && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 -mr-2"
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

            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-bold">{rating}</span>
                </div>
                <div className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
                  ${pricePerHr}/hr
                </div>
              </div>
              <Link
                href={`/tutors/${id}`}
                className="text-[11px] font-semibold text-primary hover:underline"
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
    <Card className="flex flex-col h-full hover:border-primary/40 transition-all duration-300 shadow-sm hover:shadow-xl group overflow-hidden">
      <CardContent className="p-0 flex flex-col h-full">
        {/* Top Section */}
        <div className="p-6 pb-4">
          <div className="flex justify-between items-start">
            <div className="flex gap-4">
              <div className="relative">
                <Avatar className="h-16 w-16 rounded-xl ring-2 ring-background shadow-sm">
                  <AvatarImage
                    src={image}
                    alt={name}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-secondary text-secondary-foreground font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                {isOnline && (
                  <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-background"></span>
                  </span>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold tracking-tight group-hover:text-primary transition-colors">
                    {name}
                  </h3>
                  {isVerified && (
                    <Badge
                      variant="secondary"
                      className="bg-blue-50 text-blue-600 hover:bg-blue-50 border-none h-5 px-1.5 py-0 text-[10px] font-bold uppercase tracking-wider"
                    >
                      <ShieldCheck className="h-3 w-3 mr-1" /> Verified
                    </Badge>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  {education && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                      <GraduationCap className="h-3.5 w-3.5" />
                      <span className="truncate">{education}</span>
                    </div>
                  )}
                  {location && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
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
                className={`h-9 w-9 rounded-full transition-colors ${saved ? "border-primary bg-primary/5" : ""}`}
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
          <div className="flex items-center gap-5 mt-5">
            <div className="flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-bold text-sm">{rating}</span>
              <span className="text-xs text-muted-foreground">
                ({totalReviews})
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-sm font-medium">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{experience}+ yrs exp.</span>
            </div>
            {totalStudents && (
              <div className="flex items-center gap-1.5 text-sm font-medium">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{totalStudents} students</span>
              </div>
            )}
          </div>

          {/* Bio (Detailed variant only) */}
          {bio && variant === "detailed" && (
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed line-clamp-3 italic">
              "{bio}"
            </p>
          )}

          {/* Availability */}
          {availability.length > 0 && (
            <div className="mt-5">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
                <Calendar className="h-3.5 w-3.5" />
                Next Available
              </div>
              <div className="flex flex-wrap gap-1.5">
                {availability.slice(0, 3).map((slot, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-[10px] bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-none font-semibold"
                  >
                    {slot}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-auto">
          <Separator className="opacity-50" />
          <div className="p-4 bg-muted/30 flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-foreground">
                  ${pricePerHr}
                </span>
                <span className="text-xs text-muted-foreground font-medium">
                  /hr
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="font-semibold text-xs"
                asChild
              >
                <Link href={`/tutors/${id}`}>Show Details</Link>
              </Button>

              {showBookButton && (
                <Button
                  size="sm"
                  className="px-4 font-bold shadow-sm"
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
