"use client";

import { useDashboardData } from "@/hooks/useDashboardAnalytics";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { EmployeeStructureChart } from "@/components/charts/EmployeeStructureChart";
import { CompanyPayChart } from "@/components/charts/CompanyPayChart";
import { RecentApplicationsTable } from "@/components/tables/RecentApplicationsTable";
import { LeaveTable } from "@/components/tables/LeaveTable";
import { Users, UserPlus, CalendarOff, Briefcase, Clock } from "lucide-react";

export default function DashboardPage() {
  const { data, isLoading } = useDashboardData();

  const kpis = data?.globalStats.kpis;
  const bookingStats = data?.bookingStats;

  return (
    <div className="space-y-6">
      {/* Date Range & Help is already handled by layout, but we can put it here if needed */}
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-slate-400">Mon, Aug 01, 2024 - Sep 01, 2024</p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-medium rounded-lg transition-colors shadow-sm">
          + Add Employee
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatsCard
          title="Total Student"
          value={isLoading ? "..." : (kpis?.totalStudents || 0)}
          icon={Users}
          iconColor="orange"
          trend={5}
          trendLabel="Last Month"
          index={0}
        />
        <StatsCard
          title="New Employee"
          value={isLoading ? "..." : (kpis?.totalTutors || 0)}
          icon={UserPlus}
          iconColor="blue"
          trend={3.2}
          trendLabel="Last Month"
          index={1}
        />
        <StatsCard
          title="On Leave"
          value={isLoading ? "..." : (kpis?.totalBookings || 0)}
          icon={CalendarOff}
          iconColor="yellow"
          trend={-2}
          trendLabel="Last Month"
          index={2}
        />
        <StatsCard
          title="Job Applicants"
          value={isLoading ? "..." : (bookingStats?.pending || 0)}
          icon={Briefcase}
          iconColor="green"
          trend={1.8}
          trendLabel="Last Month"
          index={3}
        />
        <StatsCard
          title="Over Time"
          value={isLoading ? "..." : (kpis?.completedBookings || 0)}
          icon={Clock}
          iconColor="red"
          trend={-8}
          trendLabel="Last Month"
          index={4}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <EmployeeStructureChart data={data?.monthlyTrends || []} isLoading={isLoading} />
        <CompanyPayChart data={data?.revenueBreakdown as any} isLoading={isLoading} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentApplicationsTable data={data?.recentBookings || []} />
        <LeaveTable data={data?.bookingStats as any} />
      </div>
    </div>
  );
}
