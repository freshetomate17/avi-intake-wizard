
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, Info } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface StartCheckInProps {
  onComplete: () => void;
}

const StartCheckIn: React.FC<StartCheckInProps> = ({ onComplete }) => {
  const [showInfoDialog, setShowInfoDialog] = React.useState(false);

  const handleStartCheckIn = () => {
    onComplete();
  };

  const handleShowInfo = () => {
    setShowInfoDialog(true);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Progress indicator at 0% */}
      <Progress value={0} className="w-full mb-8" />
      
      <div className="flex-grow flex flex-col items-center justify-center text-center px-4 py-8 md:py-12">
        <h1 className="text-2xl md:text-3xl font-serif font-bold mb-4">
          Digital Check-in
        </h1>
        
        <div className="text-base md:text-lg text-gray-600 mb-8 max-w-md space-y-4">
          <p>Hi and welcome to avi! We're glad you're here. 🙂</p>
          
          <p>Since this is your first visit with us, we'd like to get to know you a little better. Please complete the check-in process below. When you're finished, you'll receive your boarding pass. 🪪</p>
          
          <p>With this pass, you can check in independently when you visit us!</p>
        </div>
        
        <div className="flex flex-col items-center mt-6">
          <Button 
            onClick={handleStartCheckIn}
            className="rounded-3xl py-6 px-8 text-base flex gap-2 shadow-md hover:shadow-lg transition-all"
          >
            Start now
            <ChevronRight className="ml-1" />
          </Button>
          
          <Button 
            variant="link" 
            onClick={handleShowInfo}
            className="text-primary mt-4 flex items-center gap-1"
          >
            <Info className="h-4 w-4" />
            Learn more
          </Button>
        </div>
      </div>

      {/* Information dialog */}
      <Dialog open={showInfoDialog} onOpenChange={setShowInfoDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif">About the Check-in Process</DialogTitle>
            <DialogDescription>
              avi's digital check-in allows you to conveniently enter all necessary data before your doctor's appointment.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-gray-600">
              During this process, you will:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>Confirm your personal information</li>
              <li>Provide details about the reason for your visit</li>
              <li>Upload relevant documents</li>
              <li>Optionally learn about bonus programs</li>
              <li>Receive your digital boarding pass</li>
            </ul>
            <p className="text-sm text-gray-600 mt-4">
              All your data is transmitted securely and processed in accordance with data protection regulations.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StartCheckIn;
