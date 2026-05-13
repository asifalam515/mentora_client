import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

export type IconColor = "orange" | "blue" | "yellow" | "green" | "red";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: IconColor;
  trend?: number;
  trendLabel?: string;
  index?: number;
}

const colorMap: Record<IconColor, string> = {
  orange: "bg-orange-500/20 text-orange-500",
  blue: "bg-blue-500/20 text-blue-500",
  yellow: "bg-yellow-500/20 text-yellow-500",
  green: "bg-emerald-500/20 text-emerald-500",
  red: "bg-rose-500/20 text-rose-500",
};

export function StatsCard({ title, value, icon: Icon, iconColor = "blue", trend, trendLabel, index = 0 }: StatsCardProps) {
  const isPositive = trend !== undefined && trend > 0;
  const isNegative = trend !== undefined && trend < 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group relative flex flex-col items-center justify-center rounded-2xl border border-border/50 bg-[#25294a] p-6 shadow-sm transition-all hover:shadow-md hover:border-border/80 text-center"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent rounded-2xl pointer-events-none" />
      
      <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full ${colorMap[iconColor]}`}>
        <Icon className="h-6 w-6" />
      </div>

      <span className="text-3xl font-bold tracking-tight text-white mb-1">{value}</span>
      <h3 className="text-sm font-medium text-slate-300 mb-2">{title}</h3>
      
      {(trend !== undefined || trendLabel) && (
        <div className="flex items-center text-xs mt-1">
          {trend !== undefined && (
            <span
              className={`font-semibold mr-1 ${
                isPositive ? "text-emerald-400" : isNegative ? "text-rose-400" : "text-slate-400"
              }`}
            >
              {isPositive ? "↑ +" : isNegative ? "↓ " : ""}
              {trend}%
            </span>
          )}
          {trendLabel && <span className="text-slate-400">{trendLabel}</span>}
        </div>
      )}
    </motion.div>
  );
}
