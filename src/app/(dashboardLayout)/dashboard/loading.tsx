import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-muted/20">
      <div className="grid min-h-screen md:grid-cols-[280px_1fr]">
        <div className="hidden border-r bg-background/60 p-5 md:block">
          <Skeleton className="h-8 w-40" />
          <div className="mt-8 space-y-3">
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        </div>

        <div className="space-y-4 p-6">
          <Skeleton className="h-10 w-72" />
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-44 w-full rounded-xl" />
            <Skeleton className="h-44 w-full rounded-xl" />
          </div>
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
