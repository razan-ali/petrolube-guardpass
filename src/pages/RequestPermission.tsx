import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Upload, Check } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import petrolubelogo from "@/assets/petrolube-logo.png";

const RequestPermission = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [hasVehicle, setHasVehicle] = useState<string>("");
  const [vehicleType, setVehicleType] = useState<string>("");
  const [truckOperation, setTruckOperation] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Request Submitted",
      description: "Your visitor permission request has been submitted successfully.",
    });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <img src={petrolubelogo} alt="Petrolube" className="h-10 w-10" />
            <h1 className="text-xl font-bold text-foreground">Request Visitor Permission</h1>
          </div>
        </div>
      </header>

      {/* Form */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Visitor Information */}
          <Card>
            <CardHeader>
              <CardTitle>Visitor Information</CardTitle>
              <CardDescription>All fields are mandatory</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input id="fullName" required placeholder="Enter full name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="idNumber">ID / Iqama Number *</Label>
                  <Input id="idNumber" required placeholder="Enter ID or Iqama number" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nationality">Nationality *</Label>
                  <Input id="nationality" required placeholder="Enter nationality" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company / Organization Name *</Label>
                  <Input id="company" required placeholder="Enter company name" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department to Visit *</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="shipping">Shipping</SelectItem>
                    <SelectItem value="raw-material">Raw Material</SelectItem>
                    <SelectItem value="lab">Lab</SelectItem>
                    <SelectItem value="coordinator">Coordinator</SelectItem>
                    <SelectItem value="bulk-oil">Bulk Oil</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose of Visit *</Label>
                <Textarea 
                  id="purpose" 
                  required 
                  placeholder="Describe the purpose of your visit"
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Document Uploads */}
          <Card>
            <CardHeader>
              <CardTitle>Document Uploads</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="idUpload">Upload ID / Iqama *</Label>
                <div className="flex items-center gap-2">
                  <Input id="idUpload" type="file" required accept="image/*,.pdf" />
                  <Upload className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="licenseUpload">Upload Driver's License (Optional)</Label>
                <div className="flex items-center gap-2">
                  <Input id="licenseUpload" type="file" accept="image/*,.pdf" />
                  <Upload className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Arrival Check */}
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Are you arriving with a vehicle? *</Label>
                <Select required value={hasVehicle} onValueChange={setHasVehicle}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="yes">Yes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {hasVehicle === "yes" && (
                <>
                  <div className="space-y-2">
                    <Label>Vehicle Type *</Label>
                    <Select required value={vehicleType} onValueChange={setVehicleType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select vehicle type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="truck">Truck</SelectItem>
                        <SelectItem value="car">Car</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Truck Section */}
                  {vehicleType === "truck" && (
                    <div className="space-y-4 border-l-4 border-primary pl-4">
                      <h4 className="font-semibold text-foreground">Truck Details</h4>
                      
                      <div className="space-y-2">
                        <Label htmlFor="plateNumber">Plate Number *</Label>
                        <Input id="plateNumber" required placeholder="Enter plate number" />
                      </div>

                      <div className="space-y-2">
                        <Label>Truck Operation *</Label>
                        <Select required value={truckOperation} onValueChange={setTruckOperation}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select operation" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="loading">Loading</SelectItem>
                            <SelectItem value="unloading">Unloading</SelectItem>
                            <SelectItem value="both">Both (Loading and Unloading)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-4">
                        <h5 className="font-medium text-sm text-foreground">Required Safety Documentation</h5>
                        
                        <div className="space-y-2">
                          <Label htmlFor="driverPhoto">Photo of driver in safety attire *</Label>
                          <Input id="driverPhoto" type="file" required accept="image/*" />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="truckPhoto">Photo of the truck *</Label>
                          <Input id="truckPhoto" type="file" required accept="image/*" />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="safetyEquipment">Photo of safety equipment *</Label>
                          <Input id="safetyEquipment" type="file" required accept="image/*" />
                          <p className="text-xs text-muted-foreground">
                            Must show warning triangle, fire extinguisher, and first aid kit
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Car Section */}
                  {vehicleType === "car" && (
                    <div className="space-y-4 border-l-4 border-accent pl-4">
                      <h4 className="font-semibold text-foreground">Car Details</h4>
                      
                      <div className="space-y-2">
                        <Label htmlFor="carPlate">Plate Number *</Label>
                        <Input id="carPlate" required placeholder="Enter plate number" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="carRegistration">Upload Vehicle Registration *</Label>
                        <Input id="carRegistration" type="file" required accept="image/*,.pdf" />
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Link to="/">
              <Button type="button" variant="outline">Cancel</Button>
            </Link>
            <Button type="submit" variant="hero" className="gap-2">
              <Check className="h-4 w-4" />
              Submit Request
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestPermission;
