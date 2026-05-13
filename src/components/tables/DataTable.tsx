import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DataTable() {
  const users = [
    { id: "1", name: "Sarah Jenkins", email: "sarah@example.com", role: "Student", status: "Active", joined: "Oct 24, 2024" },
    { id: "2", name: "David Chen", email: "david@example.com", role: "Tutor", status: "Active", joined: "Oct 22, 2024" },
    { id: "3", name: "Emily Watson", email: "emily@example.com", role: "Student", status: "Inactive", joined: "Sep 15, 2024" },
    { id: "4", name: "Michael Ross", email: "michael@example.com", role: "Admin", status: "Active", joined: "Aug 01, 2024" },
    { id: "5", name: "Alex Johnson", email: "alex@example.com", role: "Tutor", status: "Pending", joined: "Nov 02, 2024" },
  ];

  return (
    <div className="rounded-2xl border border-border/50 bg-card shadow-sm overflow-hidden">
      <div className="p-6 border-b border-border/50 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Recent Users</h3>
          <p className="text-sm text-muted-foreground">Manage your platform users</p>
        </div>
        <Button variant="outline" size="sm">View All</Button>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30 border-border/50">
              <TableHead className="w-[250px] text-muted-foreground">User</TableHead>
              <TableHead className="text-muted-foreground">Role</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground">Joined Date</TableHead>
              <TableHead className="text-right text-muted-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="border-border/50 hover:bg-muted/20 transition-colors">
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">{user.name}</span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-foreground">{user.role}</span>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={user.status === "Active" ? "default" : user.status === "Inactive" ? "secondary" : "outline"}
                    className={user.status === "Active" ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-transparent shadow-none" : "shadow-none"}
                  >
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {user.joined}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
