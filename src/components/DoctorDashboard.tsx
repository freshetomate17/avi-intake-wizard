
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, AlertCircle, Activity, FileText, Shield } from "lucide-react";

const DoctorDashboard = () => {
  return (
    <div>
      <h2 className="text-2xl font-serif mb-6">Doctor Dashboard Preview</h2>
      
      <p className="mb-6 text-gray-600">
        Here's a preview of what your doctor will see when you arrive.
        Your digital check-in information has been processed and organized for your healthcare provider.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Insurance & Eligibility Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Shield className="mr-2 text-primary" size={20} />
              Insurance & Eligibility
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Insurance Status</span>
                <span className="flex items-center text-green-600">
                  <Check size={16} className="mr-1" /> Verified
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span>Coverage</span>
                <span>Full coverage (90%)</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span>Co-pay Amount</span>
                <span>€10.00</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span>Last Verification</span>
                <span>Today</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Vitals & Lab Trends Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Activity className="mr-2 text-primary" size={20} />
              Vitals & Lab Trends
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            {/* Placeholder for chart - in a real app, this would use Recharts */}
            <div className="bg-gray-50 rounded-md p-4 h-40 flex items-center justify-center mb-3">
              <div className="w-full h-full relative">
                {/* Simple line visualization placeholder */}
                <div className="absolute bottom-0 left-0 w-full h-px bg-gray-300"></div>
                <div className="absolute left-0 bottom-0 h-full w-px bg-gray-300"></div>
                
                <div className="absolute bottom-10 left-4 w-4 h-4 bg-primary rounded-full"></div>
                <div className="absolute bottom-16 left-16 w-4 h-4 bg-primary rounded-full"></div>
                <div className="absolute bottom-12 left-28 w-4 h-4 bg-primary rounded-full"></div>
                <div className="absolute bottom-20 left-40 w-4 h-4 bg-primary rounded-full"></div>
                <div className="absolute bottom-14 left-52 w-4 h-4 bg-primary rounded-full"></div>
                
                <div className="absolute bottom-10 left-4 w-48 h-px bg-primary"></div>
                <div className="absolute bottom-16 left-16 w-24 h-px bg-primary"></div>
                <div className="absolute bottom-12 left-28 w-12 h-px bg-primary"></div>
                <div className="absolute bottom-20 left-40 w-12 h-px bg-primary"></div>
              </div>
            </div>
            
            <div className="text-xs text-gray-500 text-center">
              Blood Pressure Trends (Last 6 Months)
            </div>
          </CardContent>
        </Card>
        
        {/* Pending Tasks Card */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <FileText className="mr-2 text-primary" size={20} />
              Pending Tasks
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center p-2 bg-amber-50 rounded-md">
                <AlertCircle size={16} className="text-amber-500 mr-2" />
                <span>Flu vaccination due</span>
              </div>
              
              <div className="flex items-center p-2 bg-amber-50 rounded-md">
                <AlertCircle size={16} className="text-amber-500 mr-2" />
                <span>Blood test results to review from 04/28/2025</span>
              </div>
              
              <div className="flex items-center p-2 bg-red-50 rounded-md">
                <AlertCircle size={16} className="text-red-500 mr-2" />
                <span>Missing allergy information</span>
              </div>
              
              <div className="flex items-center p-2 bg-gray-50 rounded-md">
                <Check size={16} className="text-gray-400 mr-2" />
                <span className="line-through text-gray-500">
                  Insurance card verification
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DoctorDashboard;
