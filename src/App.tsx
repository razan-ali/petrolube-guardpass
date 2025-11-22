import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/lib/auth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import RequestPermission from "./pages/RequestPermission";
import Login from "./pages/Login";
import DepartmentLogin from "./pages/DepartmentLogin";
import SecurityLogin from "./pages/SecurityLogin";
import DepartmentDashboard from "./pages/DepartmentDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/request-permission" element={<RequestPermission />} />
            <Route path="/login" element={<Login />} />
            <Route path="/department-login" element={<DepartmentLogin />} />
            <Route path="/security-login" element={<SecurityLogin />} />
            <Route path="/department-dashboard" element={<DepartmentDashboard />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
