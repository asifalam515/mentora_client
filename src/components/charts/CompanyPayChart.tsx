import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardData } from "@/hooks/useDashboardAnalytics";

interface CompanyPayChartProps {
  data: DashboardData["revenueBreakdown"];
  isLoading: boolean;
}

export function CompanyPayChart({ data, isLoading }: CompanyPayChartProps) {
  if (isLoading) {
    return <Skeleton className="h-[380px] w-full rounded-2xl bg-[#25294a]" />;
  }

  // Map to the requested UI split for the donut
  const chartData = [
    { name: "Salary", value: 15, color: "#ef4444" },
    { name: "Bonus", value: 8, color: "#22c55e" },
    { name: "Commission", value: 20, color: "#3b82f6" },
    { name: "Overtime", value: 11, color: "#f97316" },
    { name: "Reimbursement", value: 28, color: "#06b6d4" },
    { name: "Benefits", value: 18, color: "#eab308" },
  ];

  return (
    <div className="rounded-2xl border border-border/20 bg-[#25294a] p-6 shadow-sm flex flex-col h-full">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Company Pay</h3>
        <select className="bg-[#1e213a] text-xs text-slate-300 border border-border/30 rounded-md px-2 py-1 outline-none">
          <option>2024</option>
        </select>
      </div>
      
      <div className="flex-1 flex items-center justify-between px-4">
        <div className="relative w-[180px] h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                innerRadius={65}
                outerRadius={85}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: "#1e213a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff" }}
                itemStyle={{ color: "#fff" }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold text-white">7433</span>
            <span className="text-xs text-slate-400">Total Data</span>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          {chartData.map((item) => (
            <div key={item.name} className="flex items-center gap-2 text-sm text-slate-300">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="w-9 font-medium">{item.value}%</span>
              <span className="text-xs text-slate-400">{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between pt-6 border-t border-border/10">
        <p className="text-xs text-slate-400 max-w-[200px] leading-relaxed">
          2024 Download Report Company Trends and Insights
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/20">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download Report
        </button>
      </div>
    </div>
  );
}
