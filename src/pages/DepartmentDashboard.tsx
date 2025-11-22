import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, ClipboardList, CheckCircle, XCircle } from "lucide-react";
import petrolubelogo from "@/assets/petrolube-logo.png";
import DepartmentOverview from "@/components/department/DepartmentOverview";
import PendingRequests from "@/components/department/PendingRequests";
import ApprovedPermissions from "@/components/department/ApprovedPermissions";
import RejectedPermissions from "@/components/department/RejectedPermissions";

const DepartmentDashboard = () => {
  const { profile, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    if (!loading && (!profile || profile.role !== 'department_admin')) {
      navigate("/department-login");
    }
  }, [profile, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={petrolubelogo} alt="Petrolube" className="h-10 w-10" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Department Admin Portal</h1>
              <p className="text-sm text-muted-foreground">{profile.full_name} - {profile.department}</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleSignOut} className="gap-2">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard" className="gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="pending" className="gap-2">
              <ClipboardList className="h-4 w-4" />
              Pending Requests
            </TabsTrigger>
            <TabsTrigger value="approved" className="gap-2">
              <CheckCircle className="h-4 w-4" />
              Approved
            </TabsTrigger>
            <TabsTrigger value="rejected" className="gap-2">
              <XCircle className="h-4 w-4" />
              Rejected
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <DepartmentOverview department={profile.department} />
          </TabsContent>

          <TabsContent value="pending" className="space-y-6">
            <PendingRequests department={profile.department} />
          </TabsContent>

          <TabsContent value="approved" className="space-y-6">
            <ApprovedPermissions department={profile.department} adminId={profile.id} />
          </TabsContent>

          <TabsContent value="rejected" className="space-y-6">
            <RejectedPermissions department={profile.department} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DepartmentDashboard;
