
import React from "react";
import DoctorDashboard from "@/components/DoctorDashboard";

const DoctorDashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="w-full max-w-6xl mx-auto p-4 pt-8">
        {/* Logo in the top right */}
        <div className="absolute top-10 right-8">
          <img src="/avi-logo.png" alt="avi logo" className="h-16" />
        </div>
        
        <DoctorDashboard />
      </div>
    </div>
  );
};

export default DoctorDashboardPage;
