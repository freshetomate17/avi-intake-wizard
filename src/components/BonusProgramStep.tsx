
import React from "react";
import { Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface BonusProgramStepProps {
  onComplete: () => void;
}

const BonusProgramStep: React.FC<BonusProgramStepProps> = ({ onComplete }) => {
  // Stubbed method for enrollment
  const enrollInHausarztPlus = () => {
    console.log("User enrolled in Hausarzt Plus program");
    // TODO: Integrate with actual enrollment API (FHIR extension / Kasse-API)
    onComplete();
  };

  // Stub for more information
  const showMoreInfo = () => {
    console.log("User requested more information about Hausarzt Plus");
    // TODO: Implement detailed information modal or navigation
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-2xl font-serif font-bold mb-4">Bonusprogramm</h2>
      
      <Card className="bg-white rounded-xl shadow-md p-6 mb-6 flex-grow">
        <CardContent className="p-0">
          {/* Title and Subtitle */}
          <h3 className="text-xl font-serif font-bold text-black">
            Jetzt avi Hausarzt Plus aktivieren?
          </h3>
          <p className="text-base text-[#666666] mt-2 mb-6">
            Profitieren Sie von exklusiven Zusatzleistungen.
          </p>
          
          {/* Features in two columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-start">
              <Check className="h-5 w-5 text-primary mt-1 mr-2 flex-shrink-0" />
              <p className="text-sm">
                Regelmäßige Vorsorge – jährliche Blutbilder & zweijährige Vorsorge
              </p>
            </div>
            
            <div className="flex items-start">
              <Check className="h-5 w-5 text-primary mt-1 mr-2 flex-shrink-0" />
              <p className="text-sm">
                Medizinischer Rückrufservice – für Rezepte, Überweisungen & Krankschreibung
              </p>
            </div>
            
            <div className="flex items-start">
              <Check className="h-5 w-5 text-primary mt-1 mr-2 flex-shrink-0" />
              <p className="text-sm">
                Schnellere Beantwortung Ihrer Anfragen – prioritierter Support
              </p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end mt-4">
            <Button 
              onClick={showMoreInfo} 
              variant="outline" 
              className="border-primary text-primary"
            >
              Mehr Infos
            </Button>
            <Button 
              onClick={enrollInHausarztPlus}
              variant="default"
              className="bg-primary text-white"
            >
              Jetzt aktivieren
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button
          onClick={onComplete}
          className="px-4 py-2 bg-primary text-white rounded-xl"
        >
          Weiter
        </Button>
      </div>
    </div>
  );
};

export default BonusProgramStep;
