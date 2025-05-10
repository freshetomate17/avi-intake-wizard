
import React from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface ProgramFeature {
  text: string;
}

export interface ProgramProps {
  id: string;
  title: string;
  subtitle: string;
  features: ProgramFeature[];
  detailsDescription?: string;
  monthlyFee?: string;
  benefits?: string[];
}

const ProgramCard: React.FC<ProgramProps> = ({ 
  id, 
  title, 
  subtitle, 
  features, 
  detailsDescription, 
  monthlyFee, 
  benefits 
}) => {
  const [showDetails, setShowDetails] = React.useState(false);
  const { toast } = useToast();

  const enrollInProgram = (programId: string) => {
    // Stub method - would integrate with FHIR extension / Krankenkasse enrollment API
    console.info(`User requested enrollment in ${programId}`);
    toast({
      title: "Programm aktiviert",
      description: `Sie wurden erfolgreich für ${title} angemeldet.`,
    });
  };

  return (
    <>
      <Card className="h-full flex flex-col">
        <CardHeader>
          <h3 className="font-serif text-xl font-bold text-black">{title}</h3>
          <p className="text-sm text-gray-600">{subtitle}</p>
        </CardHeader>
        <CardContent className="flex-grow">
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <Check className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{feature.text}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter className="flex gap-2 pt-4 justify-between">
          <Button 
            variant="outline" 
            className="border-primary text-primary flex-1"
            onClick={() => setShowDetails(true)}
          >
            Mehr Infos
          </Button>
          <Button 
            variant="default"
            className="bg-primary text-white flex-1"
            onClick={() => enrollInProgram(id)}
          >
            Jetzt aktivieren
          </Button>
        </CardFooter>
      </Card>

      {/* Program Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">{title}</DialogTitle>
            <DialogDescription>
              {subtitle}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm leading-relaxed">{detailsDescription}</p>
            
            {monthlyFee && (
              <div className="mt-4">
                <p className="font-medium">Monatlicher Beitrag:</p>
                <p className="font-bold text-primary text-lg">{monthlyFee}</p>
              </div>
            )}
            
            {benefits && benefits.length > 0 && (
              <div className="mt-4">
                <p className="font-medium mb-2">Ihre Vorteile:</p>
                <ul className="space-y-2">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <p className="text-sm text-muted-foreground mt-4">
              Für detailliertere Informationen oder bei Fragen kontaktieren Sie bitte unser Service-Team.
            </p>
            
            <div className="flex justify-end pt-4">
              <Button 
                variant="default"
                className="bg-primary text-white"
                onClick={() => {
                  enrollInProgram(id);
                  setShowDetails(false);
                }}
              >
                Jetzt aktivieren
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProgramCard;
