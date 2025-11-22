import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { CheckCircle, XCircle } from "lucide-react";

interface RequestDetailsDialogProps {
  request: any;
  open: boolean;
  onClose: () => void;
  userRole: 'department_admin' | 'security_admin';
}

const RequestDetailsDialog = ({ request, open, onClose, userRole }: RequestDetailsDialogProps) => {
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleApprove = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const updates: any = {
        status: userRole === 'department_admin' ? 'pending_security' : 'approved',
      };

      if (userRole === 'department_admin') {
        updates.department_approved_by = user.id;
        updates.department_approved_at = new Date().toISOString();
        updates.department_remarks = remarks || null;
      } else {
        updates.security_approved_by = user.id;
        updates.security_approved_at = new Date().toISOString();
        updates.security_remarks = remarks || null;
      }

      const { error } = await supabase
        .from("visitor_requests")
        .update(updates)
        .eq("id", request.id);

      if (error) throw error;

      toast({
        title: "Request Approved",
        description: "The visitor permission request has been approved successfully.",
      });
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleReject = async () => {
    if (!remarks.trim()) {
      toast({
        title: "Rejection Reason Required",
        description: "Please provide a reason for rejection.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("visitor_requests")
        .update({
          status: 'rejected',
          rejection_reason: remarks,
          rejected_by: user.id,
          rejected_at: new Date().toISOString(),
        })
        .eq("id", request.id);

      if (error) throw error;

      toast({
        title: "Request Rejected",
        description: "The visitor permission request has been rejected.",
      });
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Visitor Request Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Visitor Information */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Visitor Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium">{request.full_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">ID / Iqama Number</p>
                <p className="font-medium">{request.id_number}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Nationality</p>
                <p className="font-medium">{request.nationality}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Company</p>
                <p className="font-medium">{request.company_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Department to Visit</p>
                <Badge>{request.department_to_visit}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Submitted On</p>
                <p className="font-medium">{format(new Date(request.submitted_at), "PPP")}</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">Purpose of Visit</p>
            <p className="p-3 bg-muted rounded-lg">{request.purpose_of_visit}</p>
          </div>

          {/* Vehicle Information */}
          {request.has_vehicle && request.vehicle_type !== 'none' && (
            <div>
              <h3 className="font-semibold text-lg mb-3">Vehicle Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Vehicle Type</p>
                  <Badge>{request.vehicle_type}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Plate Number</p>
                  <p className="font-medium">{request.plate_number}</p>
                </div>
                {request.truck_operation && (
                  <div>
                    <p className="text-sm text-muted-foreground">Truck Operation</p>
                    <Badge variant="secondary">{request.truck_operation}</Badge>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Approval Actions */}
          <div className="space-y-4 pt-4 border-t">
            <div>
              <Label htmlFor="remarks">Remarks {userRole === 'department_admin' ? '(Optional)' : '(Required for rejection)'}</Label>
              <Textarea
                id="remarks"
                placeholder="Add your remarks here..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="mt-2"
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={loading}
                className="gap-2"
              >
                <XCircle className="h-4 w-4" />
                Reject
              </Button>
              <Button
                variant="success"
                onClick={handleApprove}
                disabled={loading}
                className="gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Approve
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RequestDetailsDialog;
