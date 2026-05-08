"use client";

import StatisticsImpact from "@/components/home/StatisticsImpact";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Quote,
  Star,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";

import { WHY_CHOOSING_US_MOCK_DATA } from "@/components/home/why-choosing-us-data";
import type {
  WhyChoosingUsApiResponse,
  WhyChoosingUsProps,
  WhyChoosingUsStrings,
} from "@/types/why-choosing-us";

const DEFAULT_STRINGS: WhyChoosingUsStrings = {
  eyebrow: "Why choosing us",
  heading: "Social proof that feels real, not recycled.",
  intro:
    "Short testimonials, measurable outcomes, and a clear next step help learners move from curiosity to booking without friction.",
  ctaLabel: "Start your learning journey",
  ctaDescription:
    "Explore tutors, compare fit, and get matched with the right expert.",
  testimonialsLabel: "Testimonials",
  metricsLabel: "Key metrics",
  previousLabel: "Previous testimonial",
  nextLabel: "Next testimonial",
  pauseLabel: "Pause auto-rotation",
  playLabel: "Resume auto-rotation",
  readMoreLabel: "Read more",
  showLessLabel: "Show less",
  verifiedLabel: "Verified review",
  placeholderTitle: "No testimonials yet",
  placeholderBody:
    "Once testimonials are available, they will appear here in a rotating carousel.",
  liveRegionLabel: (current, total) =>
    `Showing testimonial ${current} of ${total}.`,
};

const getInitials = (name: string) =>
  name
    .split(/\s+/)
    .map((part) => part[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase();

const clampQuoteStyle = {
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical" as const,
  overflow: "hidden",
};

const usePrefersReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof window.matchMedia !== "function"
    ) {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", updatePreference);
      return () => mediaQuery.removeEventListener("change", updatePreference);
    }

    mediaQuery.addListener(updatePreference);
    return () => mediaQuery.removeListener(updatePreference);
  }, []);

  return prefersReducedMotion;
};

const useCarouselWidth = (ref: RefObject<HTMLDivElement | null>) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof window === "undefined") {
      return;
    }

    const measure = () => {
      setWidth(element.getBoundingClientRect().width || window.innerWidth || 0);
    };

    measure();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }

    const observer = new ResizeObserver(measure);
    observer.observe(element);
    window.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [ref]);

  return width;
};

const getVisibleSlides = (width: number) => {
  if (width >= 1280) return 3;
  if (width >= 768) return 2;
  return 1;
};

const RatingStars = ({ rating, label }: { rating: number; label: string }) => {
  return (
    <div
      className="flex items-center gap-0.5"
      role="img"
      aria-label={label}
      data-testid="rating-stars"
    >
      {Array.from({ length: 5 }).map((_, index) => {
        const filled = index < rating;
        return (
          <Star
            key={`${label}-${index}`}
            className={cn(
              "h-3.5 w-3.5",
              filled ? "fill-amber-400 text-amber-400" : "text-slate-300",
            )}
            aria-hidden="true"
          />
        );
      })}
    </div>
  );
};

const resolveStrings = (strings?: Partial<WhyChoosingUsStrings>) => ({
  ...DEFAULT_STRINGS,
  ...strings,
});

export default function WhyChoosingUs({
  testimonials,
  metrics,
  variant = "expanded",
  autoRotate = true,
  onCtaClick,
  strings,
}: WhyChoosingUsProps) {
  const labels = resolveStrings(strings);
  const reducedMotion = usePrefersReducedMotion();
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const viewportWidth = useCarouselWidth(carouselRef);
  const [remoteData, setRemoteData] = useState<WhyChoosingUsApiResponse | null>(
    null,
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [expandedQuotes, setExpandedQuotes] = useState<Record<string, boolean>>(
    {},
  );
  const [isHovered, setIsHovered] = useState(false);
  const [isFocusWithin, setIsFocusWithin] = useState(false);

  useEffect(() => {
    if (testimonials !== undefined && metrics !== undefined) {
      return;
    }

    let isMounted = true;

    const loadRemoteData = async () => {
      try {
        const response = await fetch("/api/testimonials", {
          headers: { Accept: "application/json" },
        });

        if (!response.ok) {
          throw new Error(`Failed to load testimonials: ${response.status}`);
        }

        const payload = (await response.json()) as WhyChoosingUsApiResponse;

        if (isMounted) {
          setRemoteData(payload);
        }
      } catch {
        if (isMounted) {
          setRemoteData(null);
        }
      }
    };

    loadRemoteData();

    return () => {
      isMounted = false;
    };
  }, [metrics, testimonials]);

  const resolvedTestimonials =
    testimonials ??
    remoteData?.testimonials ??
    WHY_CHOOSING_US_MOCK_DATA.testimonials;
  const visibleSlides = useMemo(
    () =>
      Math.min(
        getVisibleSlides(viewportWidth),
        Math.max(resolvedTestimonials.length, 1),
      ),
    [resolvedTestimonials.length, viewportWidth],
  );

  const maxStartIndex = Math.max(
    resolvedTestimonials.length - visibleSlides,
    0,
  );
  const activeIndex = resolvedTestimonials.length
    ? Math.min(currentIndex, maxStartIndex)
    : 0;
  const activeTestimonial = resolvedTestimonials[activeIndex];
  const shouldPause = isHovered || isFocusWithin;
  const shouldAutoRotate =
    autoRotate &&
    !reducedMotion &&
    !shouldPause &&
    resolvedTestimonials.length > visibleSlides;

  useEffect(() => {
    if (currentIndex > maxStartIndex) {
      setCurrentIndex(maxStartIndex);
    }
  }, [currentIndex, maxStartIndex]);

  useEffect(() => {
    if (!shouldAutoRotate) {
      return;
    }

    const timer = window.setInterval(() => {
      setCurrentIndex((current) => {
        if (current >= maxStartIndex) {
          return 0;
        }

        return current + 1;
      });
    }, 4500);

    return () => window.clearInterval(timer);
  }, [maxStartIndex, shouldAutoRotate]);

  const goToPrevious = () => {
    setCurrentIndex((current) => (current <= 0 ? maxStartIndex : current - 1));
  };

  const goToNext = () => {
    setCurrentIndex((current) => (current >= maxStartIndex ? 0 : current + 1));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goToPrevious();
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      goToNext();
    }

    if (event.key === "Home") {
      event.preventDefault();
      setCurrentIndex(0);
    }

    if (event.key === "End") {
      event.preventDefault();
      setCurrentIndex(maxStartIndex);
    }
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    carouselRef.current?.setAttribute(
      "data-touch-start-x",
      String(event.touches[0]?.clientX ?? 0),
    );
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    const rawStart = carouselRef.current?.getAttribute("data-touch-start-x");
    const startX = Number(rawStart ?? 0);
    const endX = event.changedTouches[0]?.clientX ?? startX;
    const delta = startX - endX;

    if (Math.abs(delta) < 40) {
      return;
    }

    if (delta > 0) {
      goToNext();
    } else {
      goToPrevious();
    }
  };

  const toggleQuoteExpansion = (testimonialId: string) => {
    setExpandedQuotes((current) => ({
      ...current,
      [testimonialId]: !current[testimonialId],
    }));
  };

  const slideWidth = viewportWidth > 0 ? viewportWidth / visibleSlides : 0;
  const showCarouselControls = resolvedTestimonials.length > visibleSlides;
  const liveRegionMessage = resolvedTestimonials.length
    ? `${labels.liveRegionLabel(activeIndex + 1, resolvedTestimonials.length)} ${activeTestimonial?.name ?? ""}`
    : labels.placeholderTitle;

  const introClasses = cn(
    "space-y-5 rounded-[28px] border border-slate-200/80 bg-white/85 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur xl:p-6",
    variant === "compact" && "p-4 xl:p-5",
  );

  const carouselCardClasses = cn(
    "rounded-[28px] border border-slate-200/80 bg-white/92 p-5 shadow-[0_20px_50px_rgba(2,8,23,0.08)] backdrop-blur transition-transform duration-300 ease-out",
    variant === "compact" && "p-4",
  );

  return (
    <section
      aria-labelledby="why-choosing-us-heading"
      className="relative isolate overflow-hidden bg-linear-to-b from-[#F8FAFF] via-white to-[#EEF4FF] py-16 sm:py-20"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(0,102,255,0.16),transparent_34%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.12),transparent_30%),linear-gradient(to_bottom,rgba(255,255,255,0.5),transparent)]" />
      <div className="container relative z-10 mx-auto px-4">
        <div className="grid gap-6 lg:grid-cols-3 lg:gap-8 xl:gap-10">
          <div className={introClasses}>
            <Badge className="inline-flex w-fit rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary shadow-none">
              {labels.eyebrow}
            </Badge>

            <div className="space-y-3">
              <h2
                id="why-choosing-us-heading"
                className={cn(
                  "max-w-xl text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl",
                  variant === "compact" && "text-2xl sm:text-3xl",
                )}
              >
                {labels.heading}
              </h2>
              <p className="max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
                {labels.intro}
              </p>
            </div>

            <div className="hidden lg:block">
              <Button
                type="button"
                onClick={onCtaClick}
                className="h-12 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-[0_18px_42px_rgba(0,102,255,0.28)] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-primary/90"
                data-testid="why-choosing-us-cta"
              >
                {labels.ctaLabel}
              </Button>
              <p className="mt-3 max-w-sm text-sm text-slate-500">
                {labels.ctaDescription}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  {labels.testimonialsLabel}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {resolvedTestimonials.length
                    ? `${resolvedTestimonials.length} testimonial${resolvedTestimonials.length === 1 ? "" : "s"}`
                    : labels.placeholderTitle}
                </p>
              </div>

              {showCarouselControls ? (
                <div className="hidden items-center gap-2 sm:flex">
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="outline"
                    onClick={goToPrevious}
                    aria-label={labels.previousLabel}
                    className="h-10 w-10 rounded-full border-slate-200 bg-white/90 text-slate-700 shadow-sm hover:bg-slate-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="outline"
                    onClick={goToNext}
                    aria-label={labels.nextLabel}
                    className="h-10 w-10 rounded-full border-slate-200 bg-white/90 text-slate-700 shadow-sm hover:bg-slate-50"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              ) : null}
            </div>

            <div
              ref={carouselRef}
              role="region"
              aria-roledescription="carousel"
              aria-label={labels.testimonialsLabel}
              tabIndex={0}
              onKeyDown={handleKeyDown}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onFocusCapture={() => setIsFocusWithin(true)}
              onBlurCapture={(event) => {
                if (
                  !event.currentTarget.contains(
                    event.relatedTarget as Node | null,
                  )
                ) {
                  setIsFocusWithin(false);
                }
              }}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="outline-none"
              data-testid="why-choosing-us-carousel"
            >
              <p
                className="sr-only"
                aria-live="polite"
                aria-atomic="true"
                data-testid="why-choosing-us-live-region"
              >
                {liveRegionMessage}
              </p>

              {resolvedTestimonials.length === 0 ? (
                <Card className="border border-dashed border-slate-300 bg-white/90 shadow-[0_18px_50px_rgba(2,8,23,0.06)]">
                  <CardContent className="flex min-h-55 flex-col items-center justify-center gap-3 p-6 text-center">
                    <div className="rounded-full bg-primary/10 p-3 text-primary">
                      <Quote className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold text-slate-950">
                        {labels.placeholderTitle}
                      </h3>
                      <p className="text-sm leading-6 text-slate-600">
                        {labels.placeholderBody}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="overflow-hidden rounded-[32px]">
                  <div
                    className={cn(
                      "flex will-change-transform",
                      !reducedMotion &&
                        "transition-transform duration-300 ease-out",
                      reducedMotion && "transition-none",
                    )}
                    style={{
                      transform: `translate3d(-${activeIndex * slideWidth}px, 0, 0)`,
                    }}
                  >
                    {resolvedTestimonials.map((testimonial) => {
                      const isExpanded = Boolean(
                        expandedQuotes[testimonial.id],
                      );
                      const isLongQuote = testimonial.quote.length > 110;

                      return (
                        <article
                          key={testimonial.id}
                          data-testid="testimonial-card"
                          className="px-2 pb-1 pt-1"
                          style={{
                            flex: `0 0 ${slideWidth || 100 / visibleSlides}%`,
                          }}
                        >
                          <Card className={carouselCardClasses}>
                            <CardContent className="p-0">
                              <div className="space-y-4">
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex min-w-0 items-center gap-3">
                                    <Avatar className="h-12 w-12 shrink-0 border border-slate-200 shadow-sm">
                                      <AvatarImage
                                        src={testimonial.avatarUrl ?? undefined}
                                        alt={testimonial.name}
                                      />
                                      <AvatarFallback className="bg-primary/10 text-primary">
                                        {getInitials(testimonial.name)}
                                      </AvatarFallback>
                                    </Avatar>

                                    <div className="min-w-0 space-y-1">
                                      <div className="flex flex-wrap items-center gap-2">
                                        <h3 className="truncate text-base font-semibold text-slate-950">
                                          {testimonial.name}
                                        </h3>
                                        {testimonial.verified ? (
                                          <Badge className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 shadow-none">
                                            <BadgeCheck className="mr-1 h-3 w-3" />
                                            {labels.verifiedLabel}
                                          </Badge>
                                        ) : null}
                                      </div>
                                      <p className="truncate text-sm text-slate-500">
                                        {testimonial.role}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex flex-col items-end gap-1">
                                    <RatingStars
                                      rating={testimonial.rating}
                                      label={`${testimonial.rating} out of 5 stars`}
                                    />
                                    <span className="text-xs font-medium text-slate-500">
                                      {testimonial.rating.toFixed(1)} / 5
                                    </span>
                                  </div>
                                </div>

                                <blockquote
                                  className="text-sm leading-6 text-slate-700 sm:text-[15px]"
                                  style={
                                    !isExpanded ? clampQuoteStyle : undefined
                                  }
                                >
                                  {testimonial.quote}
                                </blockquote>

                                {isLongQuote ? (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      toggleQuoteExpansion(testimonial.id)
                                    }
                                    className="inline-flex w-fit items-center gap-1 rounded-full text-sm font-semibold text-primary underline-offset-4 transition hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                                  >
                                    {isExpanded
                                      ? labels.showLessLabel
                                      : labels.readMoreLabel}
                                  </button>
                                ) : null}
                              </div>
                            </CardContent>
                          </Card>
                        </article>
                      );
                    })}
                  </div>
                </div>
              )}

              {showCarouselControls ? (
                <div className="mt-4 flex items-center justify-between gap-4 sm:hidden">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={goToPrevious}
                    aria-label={labels.previousLabel}
                    className="rounded-full border-slate-200 bg-white/90 px-4 text-slate-700 shadow-sm"
                  >
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    Prev
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={goToNext}
                    aria-label={labels.nextLabel}
                    className="rounded-full border-slate-200 bg-white/90 px-4 text-slate-700 shadow-sm"
                  >
                    Next
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              ) : null}
            </div>
          </div>

          <div className="space-y-3 rounded-[28px] border border-slate-200/80 bg-white/85 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur xl:p-5">
            <StatisticsImpact variant="compact" />
          </div>

          <div className="lg:hidden">
            <Button
              type="button"
              onClick={onCtaClick}
              className="h-12 w-full rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-[0_18px_42px_rgba(0,102,255,0.28)] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-primary/90"
              data-testid="why-choosing-us-cta"
            >
              {labels.ctaLabel}
            </Button>
            <p className="mt-3 text-sm text-slate-500">
              {labels.ctaDescription}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
