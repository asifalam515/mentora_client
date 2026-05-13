import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardData } from "@/hooks/useDashboardAnalytics";

interface EmployeeStructureChartProps {
  data: DashboardData["monthlyTrends"];
  isLoading: boolean;
}

export function EmployeeStructureChart({ data, isLoading }: EmployeeStructureChartProps) {
  if (isLoading) {
    return <Skeleton className="h-[380px] w-full rounded-2xl bg-[#25294a]" />;
  }

  return (
    <div className="rounded-2xl border border-border/20 bg-[#25294a] p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Employee Structure</h3>
        <button className="text-xs px-3 py-1.5 rounded-md border border-border/30 text-slate-300 hover:bg-white/5 transition-colors">
          Download Report
        </button>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.05)" }}
              contentStyle={{
                backgroundColor: "#1e213a",
                borderRadius: "8px",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#fff"
              }}
            />
            <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#94a3b8', paddingTop: '20px' }} />
            <Bar dataKey="commission" name="Net Profit" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={8} />
            <Bar dataKey="revenue" name="Revenue" fill="#f97316" radius={[4, 4, 0, 0]} barSize={8} />
            <Bar dataKey="bookings" name="Free Cash Flow" fill="#06b6d4" radius={[4, 4, 0, 0]} barSize={8} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
