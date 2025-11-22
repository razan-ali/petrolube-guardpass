import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Shield, FileText, LogIn } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import petrolubelogo from "@/assets/petrolube-logo.png";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={petrolubelogo} alt="Petrolube" className="h-10 w-10" />
            <h1 className="text-xl font-bold text-foreground">Petrolube Visitor Management</h1>
          </div>
          <Link to="/login">
            <Button variant="outline" className="gap-2">
              <LogIn className="h-4 w-4" />
              Admin Login
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/90 to-primary/80" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center text-white animate-fade-in">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Visitor Permission System
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto">
            Streamlined visitor access management for Petrolube facilities
          </p>
          <Link to="/request-permission">
            <Button variant="hero" size="lg" className="text-lg px-8 py-6 h-auto">
              <FileText className="h-5 w-5" />
              Request Visitor Permission
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 text-foreground">
            How It Works
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <h4 className="text-xl font-semibold mb-3 text-foreground">1. Submit Request</h4>
              <p className="text-muted-foreground">
                Fill out the visitor permission form with your details, purpose of visit, and vehicle information if applicable.
              </p>
            </div>
            
            <div className="bg-card p-8 rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h4 className="text-xl font-semibold mb-3 text-foreground">2. Department Review</h4>
              <p className="text-muted-foreground">
                Your request is reviewed by the relevant department admin for initial approval.
              </p>
            </div>
            
            <div className="bg-card p-8 rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h4 className="text-xl font-semibold mb-3 text-foreground">3. Security Clearance</h4>
              <p className="text-muted-foreground">
                Security admin performs final review and issues your visitor permit upon approval.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white/80">
            © 2024 Petrolube. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
