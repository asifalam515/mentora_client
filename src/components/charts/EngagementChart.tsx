import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

interface EngagementChartProps {
  data: any[];
  isLoading: boolean;
}

export function EngagementChart({ data, isLoading }: EngagementChartProps) {
  if (isLoading) {
    return <Skeleton className="h-[380px] w-full rounded-2xl" />;
  }

  const chartData = data?.length ? data : [
    { name: "Mon", completions: 40, active: 24 },
    { name: "Tue", completions: 30, active: 13 },
    { name: "Wed", completions: 20, active: 98 },
    { name: "Thu", completions: 27, active: 39 },
    { name: "Fri", completions: 18, active: 48 },
    { name: "Sat", completions: 23, active: 38 },
    { name: "Sun", completions: 34, active: 43 },
  ];

  return (
    <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">User Engagement</h3>
          <p className="text-sm text-muted-foreground">Course completions vs Active users</p>
        </div>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={20}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip
              cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }}
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                borderRadius: "8px",
                border: "1px solid hsl(var(--border))",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                color: "hsl(var(--foreground))"
              }}
            />
            <Bar dataKey="active" fill="hsl(var(--primary))" radius={[4, 4, 4, 4]} />
            <Bar dataKey="completions" fill="hsl(var(--muted-foreground))" radius={[4, 4, 4, 4]} opacity={0.5} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
