import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { format } from "date-fns";
import RequestDetailsDialog from "@/components/dialogs/RequestDetailsDialog";
import { useState } from "react";

interface PendingRequestsProps {
  department: 'shipping' | 'raw_material' | 'lab' | 'coordinator' | 'bulk_oil';
}

const PendingRequests = ({ department }: PendingRequestsProps) => {
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);

  const { data: requests, refetch } = useQuery({
    queryKey: ["pending-requests", department],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("visitor_requests")
        .select("*")
        .eq("department_to_visit", department)
        .eq("status", "pending_department")
        .order("submitted_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Pending Requests</h2>
        <p className="text-muted-foreground mt-1">Review and approve visitor permission requests</p>
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
                    <Badge variant="secondary">
                      {format(new Date(request.submitted_at), "PPp")}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedRequest(request)}
                  className="gap-2"
                >
                  <Eye className="h-4 w-4" />
                  View Details
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Company</p>
                  <p className="font-medium">{request.company_name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Purpose</p>
                  <p className="font-medium line-clamp-2">{request.purpose_of_visit}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {requests?.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No pending requests</p>
            </CardContent>
          </Card>
        )}
      </div>

      {selectedRequest && (
        <RequestDetailsDialog
          request={selectedRequest}
          open={!!selectedRequest}
          onClose={() => {
            setSelectedRequest(null);
            refetch();
          }}
          userRole="department_admin"
        />
      )}
    </div>
  );
};

export default PendingRequests;
