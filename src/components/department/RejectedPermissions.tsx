import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface RejectedPermissionsProps {
  department: 'shipping' | 'raw_material' | 'lab' | 'coordinator' | 'bulk_oil';
}

const RejectedPermissions = ({ department }: RejectedPermissionsProps) => {
  const { data: requests } = useQuery({
    queryKey: ["rejected-requests", department],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("visitor_requests")
        .select("*")
        .eq("department_to_visit", department)
        .eq("status", "rejected")
        .order("rejected_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Rejected Permissions</h2>
        <p className="text-muted-foreground mt-1">View rejected visitor requests</p>
      </div>

      <div className="grid gap-4">
        {requests?.map((request) => (
          <Card key={request.id} className="border-destructive/50">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{request.full_name}</CardTitle>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="outline">{request.id.slice(0, 8)}</Badge>
                    {request.vehicle_type !== 'none' && (
                      <Badge>{request.vehicle_type}</Badge>
                    )}
                    <Badge variant="destructive">
                      Rejected on {request.rejected_at && format(new Date(request.rejected_at), "PPp")}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Company</p>
                    <p className="font-medium">{request.company_name}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Submitted</p>
                    <p className="font-medium">
                      {format(new Date(request.submitted_at), "PPp")}
                    </p>
                  </div>
                </div>
                
                {request.rejection_reason && (
                  <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <p className="text-sm font-medium text-destructive mb-1">Rejection Reason:</p>
                    <p className="text-sm">{request.rejection_reason}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {requests?.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No rejected requests</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RejectedPermissions;
