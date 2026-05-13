import { DashboardData } from "@/hooks/useDashboardAnalytics";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Props {
  data: DashboardData["recentBookings"];
}

export function RecentApplicationsTable({ data }: Props) {
  return (
    <div className="rounded-2xl border border-border/20 bg-[#25294a] p-6 shadow-sm flex flex-col h-full">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Recent Job Application</h3>
        <button className="text-sm text-blue-500 hover:text-blue-400 font-medium transition-colors">View All</button>
      </div>
      
      <div className="space-y-4">
        {data.map((booking) => (
          <div key={booking.id} className="flex items-center justify-between p-3 -mx-3 rounded-xl hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-4">
              <Avatar className="h-10 w-10 border border-border/10">
                <AvatarFallback className="bg-primary/20 text-primary">{booking.student.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold text-white">{booking.student.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">Front-End Developer</p>
              </div>
            </div>
            
            <select className="bg-[#1e213a] border border-border/30 text-xs text-slate-300 rounded-lg px-3 py-1.5 outline-none cursor-pointer">
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        ))}
        {data.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-4">No recent applications found</p>
        )}
      </div>
    </div>
  );
}
