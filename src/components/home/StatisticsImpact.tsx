"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type {
  AnalyticsApiResponse,
  AnalyticsShape,
  StatisticsImpactProps,
  StatisticsImpactStrings,
} from "@/types/statistics-impact";
import {
  CalendarCheck2,
  MessageSquareText,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  Star,
  UserCheck,
} from "lucide-react";

const DEFAULT_STRINGS: StatisticsImpactStrings = {
  eyebrow: "Statistics / Impact",
  heading: "Our impact, in numbers",
  subhead: "Trusted by learners and tutors worldwide",
  loadingLabel: "Loading impact metrics",
  errorTitle: "Live analytics are unavailable",
  errorBody:
    "We could not load the latest numbers right now. Try again or seed the backend with real data.",
  emptyTitle: "Data coming soon",
  emptyBody:
    "Analytics will appear once the backend has been seeded with real platform activity.",
  retryLabel: "Retry",
  adminSeedLabel: "Open admin dashboard",
  activeTutorsLabel: "Active Tutors",
  sessionsBookedLabel: "Sessions Booked",
  avgRatingLabel: "Avg. Rating",
  totalReviewsLabel: "Reviews",
};

const METRIC_ORDER: Array<keyof AnalyticsShape> = [
  "activeTutors",
  "sessionsBooked",
  "avgRating",
  "totalReviews",
];

const METRIC_META: Record<
  keyof AnalyticsShape,
  { icon: typeof UserCheck; tone: string }
> = {
  activeTutors: {
    icon: UserCheck,
    tone: "from-sky-50 to-blue-50 text-primary dark:from-white/[0.05] dark:to-white/[0.08]",
  },
  sessionsBooked: {
    icon: CalendarCheck2,
    tone: "from-emerald-50 to-emerald-100 text-emerald-700 dark:from-emerald-500/10 dark:to-emerald-500/15 dark:text-emerald-300",
  },
  avgRating: {
    icon: Star,
    tone: "from-amber-50 to-amber-100 text-amber-600 dark:from-amber-500/10 dark:to-amber-500/15 dark:text-amber-300",
  },
  totalReviews: {
    icon: MessageSquareText,
    tone: "from-violet-50 to-indigo-50 text-indigo-600 dark:from-slate-500/10 dark:to-slate-500/15 dark:text-slate-200",
  },
};

const getLabelForMetric = (
  metric: keyof AnalyticsShape,
  strings: StatisticsImpactStrings,
) => {
  switch (metric) {
    case "activeTutors":
      return strings.activeTutorsLabel;
    case "sessionsBooked":
      return strings.sessionsBookedLabel;
    case "avgRating":
      return strings.avgRatingLabel;
    case "totalReviews":
      return strings.totalReviewsLabel;
  }
};

const useReducedMotion = () => {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof window.matchMedia !== "function"
    ) {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mediaQuery.matches);

    update();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", update);
      return () => mediaQuery.removeEventListener("change", update);
    }

    mediaQuery.addListener(update);
    return () => mediaQuery.removeListener(update);
  }, []);

  return reducedMotion;
};

const useCountUp = (target: number, animate: boolean) => {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    if (!animate) {
      return;
    }

    const duration = 900;
    const startValue = 0;
    const startTime = window.performance.now();
    let frameId = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedValue(startValue + (target - startValue) * eased);

      if (progress < 1) {
        frameId = window.requestAnimationFrame(tick);
      }
    };

    frameId = window.requestAnimationFrame(tick);

    return () => window.cancelAnimationFrame(frameId);
  }, [animate, target]);

  return animate ? animatedValue : target;
};

const isZeroAnalytics = (analytics: AnalyticsShape) =>
  analytics.activeTutors === 0 &&
  analytics.sessionsBooked === 0 &&
  analytics.avgRating === 0 &&
  analytics.totalReviews === 0;

const isAnalyticsShape = (value: unknown): value is AnalyticsShape => {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;

  return METRIC_ORDER.every((key) => typeof candidate[key] === "number");
};

const formatDisplayValue = (metric: keyof AnalyticsShape, value: number) => {
  if (metric === "avgRating") {
    return new Intl.NumberFormat(undefined, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value);
  }

  const formatted = new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 0,
  }).format(Math.round(value));

  return value >= 1000 ? `${formatted}+` : formatted;
};

const resolveStrings = (strings?: Partial<StatisticsImpactStrings>) => ({
  ...DEFAULT_STRINGS,
  ...strings,
});

const SkeletonCard = ({ showIcons }: { showIcons: boolean }) => (
  <div className="flex min-h-36 flex-col justify-between gap-3 p-4 sm:p-5">
    <div className="flex items-start gap-3 sm:flex-col sm:items-start">
      {showIcons ? (
        <div className="h-11 w-11 rounded-2xl bg-slate-200/80 animate-pulse" />
      ) : null}
      <div className="space-y-2">
        <div className="h-4 w-24 rounded-full bg-slate-200/80 animate-pulse" />
        <div className="h-10 w-28 rounded-full bg-slate-200/80 animate-pulse sm:h-12 sm:w-32" />
      </div>
    </div>
    <div className="h-3 w-20 rounded-full bg-slate-200/80 animate-pulse" />
  </div>
);

const AnalyticsMetricCard = ({
  metric,
  value,
  showIcons,
  animate,
  strings,
  variant,
}: {
  metric: keyof AnalyticsShape;
  value: number;
  showIcons: boolean;
  animate: boolean;
  strings: StatisticsImpactStrings;
  variant: "compact" | "featured";
}) => {
  const animatedValue = useCountUp(value, animate);
  const displayValue = formatDisplayValue(metric, animatedValue);
  const label = getLabelForMetric(metric, strings);
  const Icon = METRIC_META[metric].icon;

  return (
    <Card
      role="group"
      aria-label={`${label}: ${formatDisplayValue(metric, value)}`}
      className="border-0 bg-transparent shadow-none rounded-none p-0 py-0"
      data-testid={`analytics-card-${metric}`}
    >
      <CardContent
        className={cn(
          "flex min-h-36 items-center justify-center p-0 sm:items-start sm:justify-start",
          variant === "featured" ? "p-5 sm:p-6" : "p-4 sm:p-5",
        )}
      >
        <div className="flex w-full flex-col items-center gap-3 text-center sm:items-start sm:text-left">
          {showIcons ? (
            <div
              className={cn(
                "flex h-14 w-14 items-center justify-center rounded-3xl shadow-md",
                METRIC_META[metric].tone,
              )}
            >
              <Icon className="h-6 w-6" aria-hidden="true" />
            </div>
          ) : null}

          <div className="space-y-1">
            <div
              className={cn(
                "font-semibold tracking-tight text-slate-900 dark:text-white",
                variant === "featured"
                  ? "text-4xl sm:text-5xl"
                  : "text-3xl sm:text-4xl",
              )}
              aria-hidden="true"
            >
              {displayValue}
            </div>
            <p
              className={cn(
                "text-sm font-medium text-slate-600",
                variant === "featured" && "sm:text-[15px]",
              )}
            >
              {label}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function StatisticsImpact({
  variant = "featured",
  showIcons = true,
  onRetry,
  fallback,
  autoRefreshIntervalMs = null,
  strings,
}: StatisticsImpactProps) {
  const labels = resolveStrings(strings);
  const reducedMotion = useReducedMotion();
  const [analytics, setAnalytics] = useState<AnalyticsShape | null>(null);
  const [status, setStatus] = useState<
    "loading" | "success" | "error" | "empty"
  >("loading");
  const [refreshNonce, setRefreshNonce] = useState(0);
  const requestRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (autoRefreshIntervalMs == null || autoRefreshIntervalMs <= 0) {
      return;
    }

    const interval = window.setInterval(() => {
      setRefreshNonce((current) => current + 1);
    }, autoRefreshIntervalMs);

    return () => window.clearInterval(interval);
  }, [autoRefreshIntervalMs]);

  useEffect(() => {
    const controller = new AbortController();
    requestRef.current?.abort();
    requestRef.current = controller;

    const loadAnalytics = async () => {
      setStatus("loading");

      try {
        const response = await fetch("/api/v1/analytics", {
          method: "GET",
          headers: { Accept: "application/json" },
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Analytics request failed with ${response.status}`);
        }

        const payload =
          (await response.json()) as Partial<AnalyticsApiResponse>;
        const resolvedAnalytics = payload.analytics;

        if (!isAnalyticsShape(resolvedAnalytics)) {
          throw new Error("Invalid analytics response");
        }

        if (isZeroAnalytics(resolvedAnalytics)) {
          setAnalytics(null);
          setStatus("empty");
          return;
        }

        setAnalytics(resolvedAnalytics);
        setStatus("success");
      } catch {
        if (controller.signal.aborted) {
          return;
        }

        if (fallback) {
          setAnalytics(fallback);
          setStatus("success");
          return;
        }

        setAnalytics(null);
        setStatus("error");
      }
    };

    void loadAnalytics();

    return () => controller.abort();
  }, [fallback, refreshNonce]);

  const metricCards = useMemo(
    () =>
      METRIC_ORDER.map((metric) => ({
        metric,
        value: analytics?.[metric] ?? 0,
      })),
    [analytics],
  );

  const handleRetry = () => {
    onRetry?.();
    setRefreshNonce((current) => current + 1);
  };

  return (
    <section
      aria-labelledby="statistics-impact-heading"
      className={cn(
        "relative overflow-hidden rounded-[28px] border border-slate-200 bg-white/90 backdrop-blur-sm bg-linear-to-br from-white via-slate-50 to-slate-100 shadow-[0_24px_70px_rgba(15,23,42,0.08)] dark:border-white/[0.08] dark:bg-white/[0.04] dark:from-white/[0.06] dark:via-white/[0.03] dark:to-transparent dark:shadow-[0_24px_70px_rgba(0,0,0,0.28)]",
        variant === "featured" ? "p-6 sm:p-8" : "p-4 sm:p-6",
      )}
      aria-busy={status === "loading"}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.08),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.05),transparent_26%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.14),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.08),transparent_26%)]" />
      <div className="relative z-10 space-y-4">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            {labels.eyebrow}
          </p>
          <div className="space-y-1">
            <h3
              id="statistics-impact-heading"
              className={cn(
                "font-semibold tracking-tight text-[#052033]",
                variant === "featured"
                  ? "text-3xl sm:text-4xl"
                  : "text-2xl sm:text-3xl",
              )}
            >
              {labels.heading}
            </h3>
            <p className="max-w-md text-sm leading-6 text-slate-600 sm:text-[15px] dark:text-slate-400">
              {labels.subhead}
            </p>
          </div>
        </div>

        <div className="h-px w-full bg-linear-to-r from-transparent via-slate-200/80 to-transparent dark:via-white/10" />

        {status === "loading" ? (
          <div
            className="grid grid-cols-1 overflow-hidden rounded-2xl border border-slate-200 bg-white sm:grid-cols-2 lg:grid-cols-4 dark:border-white/[0.08] dark:bg-white/[0.03]"
            data-testid="statistics-impact-loading"
          >
            {METRIC_ORDER.map((metric) => (
              <div
                key={metric}
                className="border-b border-slate-200 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0 dark:border-white/[0.08]"
              >
                <SkeletonCard showIcons={showIcons} />
              </div>
            ))}
          </div>
        ) : null}

        {status === "success" && analytics ? (
          <div
            className={cn(
              "grid grid-cols-1 gap-4 overflow-hidden rounded-2xl sm:grid-cols-2 lg:grid-cols-4",
              variant === "featured" && "",
            )}
            data-testid="statistics-impact-grid"
          >
            {metricCards.map(({ metric, value }) => (
              <div key={metric}>
                <div className="rounded-2xl border border-slate-200 bg-white/95 shadow-lg dark:border-white/[0.08] dark:bg-white/[0.03] dark:shadow-[0_18px_42px_rgba(0,0,0,0.18)]">
                  <AnalyticsMetricCard
                    metric={metric}
                    value={value}
                    showIcons={showIcons}
                    animate={!reducedMotion}
                    strings={labels}
                    variant={variant}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {status === "empty" ? (
          <Card className="border-slate-200 bg-white/95 shadow-[0_18px_42px_rgba(2,8,23,0.06)] dark:border-white/[0.08] dark:bg-white/[0.03] dark:shadow-[0_18px_42px_rgba(0,0,0,0.18)]">
            <CardContent className="flex flex-col gap-4 p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 flex-none items-center justify-center rounded-2xl bg-primary/10 text-primary dark:bg-white/[0.06] dark:text-primary-200">
                  <Sparkles className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {labels.emptyTitle}
                  </h4>
                  <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
                    {labels.emptyBody}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button
                  type="button"
                  onClick={handleRetry}
                  variant="outline"
                  className="rounded-full border-slate-200 bg-white text-slate-700 shadow-sm dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-slate-200"
                >
                  <RefreshCw className="h-4 w-4" />
                  {labels.retryLabel}
                </Button>

                <Link
                  href="/dashboard"
                  className="text-sm font-semibold text-primary underline-offset-4 transition hover:underline"
                >
                  {labels.adminSeedLabel}
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : null}

        {status === "error" ? (
          <Card className="border-slate-200 bg-white/95 shadow-[0_18px_42px_rgba(2,8,23,0.06)] dark:border-white/[0.08] dark:bg-white/[0.03] dark:shadow-[0_18px_42px_rgba(0,0,0,0.18)]">
            <CardContent className="flex flex-col gap-4 p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 flex-none items-center justify-center rounded-2xl bg-slate-100 text-slate-600 dark:bg-white/[0.06] dark:text-slate-200">
                  <ShieldAlert className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {labels.errorTitle}
                  </h4>
                  <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
                    {labels.errorBody}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button
                  type="button"
                  onClick={handleRetry}
                  className="rounded-full bg-primary text-primary-foreground shadow-[0_16px_30px_rgba(0,102,255,0.18)] dark:shadow-[0_16px_30px_rgba(0,0,0,0.28)]"
                >
                  <RefreshCw className="h-4 w-4" />
                  {labels.retryLabel}
                </Button>

                {fallback ? (
                  <p className="text-sm text-slate-500">
                    Preview values are available once analytics recover.
                  </p>
                ) : null}
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </section>
  );
}
