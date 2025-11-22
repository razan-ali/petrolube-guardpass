import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, FileDown } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import ApprovedDetailsDialog from "@/components/dialogs/ApprovedDetailsDialog";

interface ApprovedPermissionsProps {
  department: 'shipping' | 'raw_material' | 'lab' | 'coordinator' | 'bulk_oil';
  adminId: string;
}

const ApprovedPermissions = ({ department, adminId }: ApprovedPermissionsProps) => {
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);

  const { data: requests, refetch } = useQuery({
    queryKey: ["approved-requests", department],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("visitor_requests")
        .select(`
          *,
          entry_exit_logs(*),
          delivery_notes(*)
        `)
        .eq("department_to_visit", department)
        .eq("status", "approved")
        .order("security_approved_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Approved Permissions</h2>
        <p className="text-muted-foreground mt-1">Manage fully approved visitor permits</p>
      </div>

      <div className="grid gap-4">
        {requests?.map((request) => (
          <Card key={request.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{request.full_name}</CardTitle>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="outline">{request.id.slice(0, 8)}</Badge>
                    {request.vehicle_type !== 'none' && (
                      <Badge>{request.vehicle_type}</Badge>
                    )}
                    {request.plate_number && (
                      <Badge variant="secondary">{request.plate_number}</Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedRequest(request)}
                    className="gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Company</p>
                  <p className="font-medium">{request.company_name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Entries/Exits</p>
                  <p className="font-medium">{request.entry_exit_logs?.length || 0}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Approved</p>
                  <p className="font-medium">
                    {request.security_approved_at && format(new Date(request.security_approved_at), "PPp")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {requests?.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No approved permissions</p>
            </CardContent>
          </Card>
        )}
      </div>

      {selectedRequest && (
        <ApprovedDetailsDialog
          request={selectedRequest}
          open={!!selectedRequest}
          onClose={() => {
            setSelectedRequest(null);
            refetch();
          }}
          userRole="department_admin"
          userId={adminId}
        />
      )}
    </div>
  );
};

export default ApprovedPermissions;
