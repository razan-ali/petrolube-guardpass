import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Building } from "lucide-react";
import { Link } from "react-router-dom";
import petrolubelogo from "@/assets/petrolube-logo.png";

const Login = () => {
  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <img src={petrolubelogo} alt="Petrolube" className="h-16 w-16 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
          <p className="text-white/80">Select your login type to continue</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Link to="/department-login">
            <Card className="hover:shadow-xl transition-all cursor-pointer border-2 hover:border-primary h-full">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Department Admin</CardTitle>
                <CardDescription className="text-base">
                  Manage visitor requests for your department
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Review visitor permission requests
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Approve or reject applications
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Manage delivery notes
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    View department metrics
                  </li>
                </ul>
                <Button variant="hero" className="w-full mt-6">
                  Login as Department Admin
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link to="/security-login">
            <Card className="hover:shadow-xl transition-all cursor-pointer border-2 hover:border-primary h-full">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Security Admin</CardTitle>
                <CardDescription className="text-base">
                  Final approval and security clearance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Final approval authority
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Entry/exit logging
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Blacklist management
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Security oversight dashboard
                  </li>
                </ul>
                <Button variant="hero" className="w-full mt-6">
                  Login as Security Admin
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="text-center mt-8">
          <Link to="/">
            <Button variant="ghost" className="text-white hover:text-white hover:bg-white/10">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
