import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

interface RevenueChartProps {
  data: any[];
  isLoading: boolean;
}

export function RevenueChart({ data, isLoading }: RevenueChartProps) {
  if (isLoading) {
    return <Skeleton className="h-[380px] w-full rounded-2xl" />;
  }

  // Fallback data if empty to showcase the premium UI
  const chartData = data?.length ? data : [
    { name: "Jan", revenue: 4000, profit: 2400 },
    { name: "Feb", revenue: 3000, profit: 1398 },
    { name: "Mar", revenue: 2000, profit: 9800 },
    { name: "Apr", revenue: 2780, profit: 3908 },
    { name: "May", revenue: 1890, profit: 4800 },
    { name: "Jun", revenue: 2390, profit: 3800 },
    { name: "Jul", revenue: 3490, profit: 4300 },
  ];

  return (
    <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Revenue Analytics</h3>
          <p className="text-sm text-muted-foreground">Monthly revenue and profit trends</p>
        </div>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(value) => `$${value}`} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                borderRadius: "8px",
                border: "1px solid hsl(var(--border))",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                color: "hsl(var(--foreground))"
              }}
              itemStyle={{ color: "hsl(var(--foreground))" }}
            />
            <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
