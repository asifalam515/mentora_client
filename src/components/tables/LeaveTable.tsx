import { DashboardData } from "@/hooks/useDashboardAnalytics";
import { Search } from "lucide-react";

interface Props {
  data: DashboardData["bookingStats"];
}

export function LeaveTable({ data }: Props) {
  // Use booking stats directly to inform the fake rows to match the UI
  const leaves = [
    { name: "John Doe", dept: "Engineering", days: 3, date: "Aug 15", status: "Approved" },
    { name: "Jane Smith", dept: "Design", days: 1, date: "Aug 18", status: "Pending" },
    { name: "Mike Johnson", dept: "Marketing", days: 5, date: "Aug 20", status: "Rejected" },
  ];

  return (
    <div className="rounded-2xl border border-border/20 bg-[#25294a] shadow-sm flex flex-col h-full overflow-hidden">
      <div className="p-6 border-b border-border/10 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Employee's Leave</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search" 
            className="bg-[#1e213a] border border-border/20 text-sm text-slate-300 rounded-full pl-9 pr-4 py-1.5 outline-none focus:border-border/40 transition-colors w-48"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#1e213a]/50 text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
              <th className="px-6 py-4 cursor-pointer hover:text-white transition-colors">Name ↑↓</th>
              <th className="px-6 py-4 cursor-pointer hover:text-white transition-colors">Department ↑↓</th>
              <th className="px-6 py-4 cursor-pointer hover:text-white transition-colors">Days ↑↓</th>
              <th className="px-6 py-4 cursor-pointer hover:text-white transition-colors">Date ↑↓</th>
              <th className="px-6 py-4 cursor-pointer hover:text-white transition-colors text-right">Status ↑↓</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/10 text-sm text-slate-300">
            {leaves.map((leave, i) => (
              <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-white font-medium">{leave.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{leave.dept}</td>
                <td className="px-6 py-4 whitespace-nowrap">{leave.days}</td>
                <td className="px-6 py-4 whitespace-nowrap">{leave.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium tracking-wide ${
                    leave.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400' :
                    leave.status === 'Pending' ? 'bg-orange-500/10 text-orange-400' :
                    'bg-rose-500/10 text-rose-400'
                  }`}>
                    {leave.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
