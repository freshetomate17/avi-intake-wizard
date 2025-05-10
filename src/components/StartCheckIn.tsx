
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
          Digitaler Check-in starten
        </h1>
        
        <p className="text-base md:text-lg text-gray-600 mb-8 max-w-md">
          In wenigen Schritten erfassen Sie Ihre Daten sicher und schnell.
        </p>
        
        <div className="flex flex-col items-center mt-6">
          <Button 
            onClick={handleStartCheckIn}
            className="rounded-3xl py-6 px-8 text-base flex gap-2 shadow-md hover:shadow-lg transition-all"
          >
            Jetzt starten
            <ChevronRight className="ml-1" />
          </Button>
          
          <Button 
            variant="link" 
            onClick={handleShowInfo}
            className="text-primary mt-4 flex items-center gap-1"
          >
            <Info className="h-4 w-4" />
            Mehr erfahren
          </Button>
        </div>
      </div>

      {/* Information dialog */}
      <Dialog open={showInfoDialog} onOpenChange={setShowInfoDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif">Über den Check-in Prozess</DialogTitle>
            <DialogDescription>
              Der digitale Check-in von avi ermöglicht es Ihnen, alle notwendigen Daten vor Ihrem Arztbesuch bequem einzugeben.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-gray-600">
              In diesem Prozess werden Sie:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>Ihre persönlichen Daten bestätigen</li>
              <li>Informationen zu Ihrem Besuchsgrund angeben</li>
              <li>Relevante Dokumente hochladen</li>
              <li>Optional Bonus-Programme kennenlernen</li>
              <li>Ihre digitale Boardingkarte erhalten</li>
            </ul>
            <p className="text-sm text-gray-600 mt-4">
              Alle Ihre Daten werden verschlüsselt übertragen und gemäß den deutschen Datenschutzbestimmungen verarbeitet.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StartCheckIn;
