import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

interface Activity {
  id: string;
  user: { name: string; image?: string };
  action: string;
  target: string;
  timestamp: string;
}

interface ActivityFeedProps {
  data: Activity[];
  isLoading: boolean;
}

export function ActivityFeed({ data, isLoading }: ActivityFeedProps) {
  if (isLoading) {
    return <Skeleton className="h-[380px] w-full rounded-2xl" />;
  }

  const activities = data?.length ? data : [
    { id: "1", user: { name: "Sarah Jenkins", image: "" }, action: "enrolled in", target: "Advanced React Patterns", timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
    { id: "2", user: { name: "David Chen", image: "" }, action: "completed", target: "UI/UX Masterclass", timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
    { id: "3", user: { name: "Emily Watson", image: "" }, action: "joined as", target: "Senior Mentor", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
    { id: "4", user: { name: "Michael Ross", image: "" }, action: "booked session with", target: "Jessica Alba", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
    { id: "5", user: { name: "Alex Johnson", image: "" }, action: "reviewed", target: "Python Basics", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
  ];

  return (
    <div className="flex h-full flex-col rounded-2xl border border-border/50 bg-card shadow-sm">
      <div className="p-6 pb-2 border-b border-border/50">
        <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
        <p className="text-sm text-muted-foreground">Latest actions across the platform</p>
      </div>
      <div className="flex-1 overflow-auto p-6 pt-4">
        <div className="space-y-6">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4">
              <Avatar className="mt-0.5 h-9 w-9 border border-border/50">
                <AvatarImage src={activity.user.image} />
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                  {activity.user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm">
                  <span className="font-medium text-foreground">{activity.user.name}</span>{" "}
                  <span className="text-muted-foreground">{activity.action}</span>{" "}
                  <span className="font-medium text-foreground">{activity.target}</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
