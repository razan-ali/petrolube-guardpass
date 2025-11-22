import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, CheckCircle, Clock, XCircle, Truck, Car } from "lucide-react";

interface DepartmentOverviewProps {
  department: 'shipping' | 'raw_material' | 'lab' | 'coordinator' | 'bulk_oil';
}

const DepartmentOverview = ({ department }: DepartmentOverviewProps) => {
  const { data: stats } = useQuery({
    queryKey: ["department-stats", department],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      
      const [pending, approved, rejected, entries, exits] = await Promise.all([
        supabase
          .from("visitor_requests")
          .select("*", { count: 'exact', head: true })
          .eq("department_to_visit", department)
          .eq("status", "pending_department"),
        supabase
          .from("visitor_requests")
          .select("*", { count: 'exact', head: true })
          .eq("department_to_visit", department)
          .eq("status", "approved"),
        supabase
          .from("visitor_requests")
          .select("*", { count: 'exact', head: true })
          .eq("department_to_visit", department)
          .eq("status", "rejected"),
        supabase
          .from("entry_exit_logs")
          .select("*, visitor_requests!inner(*)", { count: 'exact', head: true })
          .eq("visitor_requests.department_to_visit", department)
          .gte("entry_time", `${today}T00:00:00`)
          .lte("entry_time", `${today}T23:59:59`),
        supabase
          .from("entry_exit_logs")
          .select("*, visitor_requests!inner(*)", { count: 'exact', head: true })
          .eq("visitor_requests.department_to_visit", department)
          .not("exit_time", "is", null)
          .gte("exit_time", `${today}T00:00:00`)
          .lte("exit_time", `${today}T23:59:59`),
      ]);

      return {
        pendingCount: pending.count || 0,
        approvedCount: approved.count || 0,
        rejectedCount: rejected.count || 0,
        entriesToday: entries.count || 0,
        exitsToday: exits.count || 0,
      };
    },
  });

  const statCards = [
    {
      title: "Pending Requests",
      value: stats?.pendingCount || 0,
      icon: ClipboardList,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
    },
    {
      title: "Approved Permissions",
      value: stats?.approvedCount || 0,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      title: "Rejected",
      value: stats?.rejectedCount || 0,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-900/20",
    },
    {
      title: "Entries Today",
      value: stats?.entriesToday || 0,
      icon: Truck,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      title: "Exits Today",
      value: stats?.exitsToday || 0,
      icon: Car,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Dashboard</h2>
        <p className="text-muted-foreground mt-1">Overview of visitor requests and activities</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DepartmentOverview;
