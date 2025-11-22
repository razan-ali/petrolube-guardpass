import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Upload, Download, Calendar } from "lucide-react";

interface ApprovedDetailsDialogProps {
  request: any;
  open: boolean;
  onClose: () => void;
  userRole: 'department_admin' | 'security_admin';
  userId: string;
}

const ApprovedDetailsDialog = ({ request, open, onClose, userRole, userId }: ApprovedDetailsDialogProps) => {
  const { toast } = useToast();

  const canUploadDeliveryNote = 
    userRole === 'department_admin' &&
    request.vehicle_type === 'truck' &&
    (request.truck_operation === 'loading' || request.truck_operation === 'both');

  const handleDownloadPermit = () => {
    toast({
      title: "Generating Permit",
      description: "PDF generation feature will be implemented soon.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Approved Permission Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Request Details */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Visitor Information</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium">{request.full_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Company</p>
                <p className="font-medium">{request.company_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">ID Number</p>
                <p className="font-medium">{request.id_number}</p>
              </div>
            </div>
          </div>

          {/* Approval Timeline */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Approval Timeline</h3>
            <div className="space-y-2">
              {request.department_approved_at && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">Department Approved:</span>
                  <span className="font-medium">{format(new Date(request.department_approved_at), "PPp")}</span>
                </div>
              )}
              {request.security_approved_at && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">Security Approved:</span>
                  <span className="font-medium">{format(new Date(request.security_approved_at), "PPp")}</span>
                </div>
              )}
            </div>
          </div>

          {/* Entry/Exit Logs */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Entry/Exit History</h3>
            {request.entry_exit_logs && request.entry_exit_logs.length > 0 ? (
              <div className="space-y-2">
                {request.entry_exit_logs.map((log: any) => (
                  <div key={log.id} className="p-3 bg-muted rounded-lg">
                    <div className="grid md:grid-cols-2 gap-2 text-sm">
                      {log.entry_time && (
                        <div>
                          <span className="text-muted-foreground">Entry: </span>
                          <span className="font-medium">{format(new Date(log.entry_time), "PPp")}</span>
                        </div>
                      )}
                      {log.exit_time && (
                        <div>
                          <span className="text-muted-foreground">Exit: </span>
                          <span className="font-medium">{format(new Date(log.exit_time), "PPp")}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No entry/exit records yet</p>
            )}
          </div>

          {/* Delivery Notes */}
          {canUploadDeliveryNote && (
            <div>
              <h3 className="font-semibold text-lg mb-3">Delivery Notes</h3>
              {request.delivery_notes && request.delivery_notes.length > 0 ? (
                <div className="space-y-2">
                  {request.delivery_notes.map((note: any) => (
                    <div key={note.id} className="p-3 bg-muted rounded-lg flex items-center justify-between">
                      <div>
                        <p className="font-medium">{note.file_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(note.uploaded_at), "PPp")}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 border-2 border-dashed rounded-lg text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-3">No delivery notes uploaded</p>
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Delivery Note
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button variant="hero" onClick={handleDownloadPermit} className="gap-2">
              <Download className="h-4 w-4" />
              Download Permit PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApprovedDetailsDialog;
