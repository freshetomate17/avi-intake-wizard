
import { useState } from "react";
import ChatBot from "@/components/ChatBot";
import BoardingPass from "@/components/BoardingPass";
import BonusProgramStep from "@/components/BonusProgramStep";
import StartCheckIn from "@/components/StartCheckIn";
import UploadDocs from "@/components/UploadDocs";

// Main flow steps
enum FlowStep {
  START_CHECKIN,
  CHATBOT,
  BONUS_PROGRAM,
  BOARDING_PASS
}

const Index = () => {
  const [currentStep, setCurrentStep] = useState<FlowStep>(FlowStep.START_CHECKIN);
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);

  // Function to navigate to next step
  const goToNextStep = () => {
    setCurrentStep(prev => {
      if (prev < FlowStep.BOARDING_PASS) {
        return prev + 1;
      }
      return prev;
    });
  };

  // Function to navigate to a specific step
  const goToStep = (step: FlowStep) => {
    setCurrentStep(step);
  };

  // Function to handle selected programs
  const handleProgramsSelected = (programs: string[]) => {
    setSelectedPrograms(programs);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      <div className="w-full max-w-3xl p-4">
        {/* Removed AviLogo from the top right corner */}
        
        {/* Progress indicator */}
        <div className="w-full mb-6 mt-16 flex justify-between">
          {Object.keys(FlowStep)
            .filter(key => !isNaN(Number(key)))
            .map((step, index) => (
              <div 
                key={step}
                className={`w-full h-1 ${
                  Number(step) <= currentStep ? "bg-primary" : "bg-gray-200"
                } ${index < 3 ? "mr-1" : ""}`}
              />
            ))}
        </div>

        {/* Current step component */}
        {currentStep === FlowStep.START_CHECKIN && (
          <StartCheckIn onComplete={goToNextStep} />
        )}
        {currentStep === FlowStep.CHATBOT && (
          <ChatBot onComplete={goToNextStep} />
        )}
        {currentStep === FlowStep.BONUS_PROGRAM && (
          <BonusProgramStep 
            onComplete={goToNextStep}
            onProgramsSelected={handleProgramsSelected}
          />
        )}
        {currentStep === FlowStep.BOARDING_PASS && (
          <BoardingPass 
            onComplete={goToNextStep} 
            selectedPrograms={selectedPrograms}
          />
        )}

        {/* Navigation buttons - Only show for steps after START_CHECKIN */}
        {currentStep > FlowStep.START_CHECKIN && (
          <div className="mt-8 flex justify-between">
            {currentStep > FlowStep.START_CHECKIN && (
              <button
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="px-4 py-2 border border-primary text-primary rounded-xl"
              >
                Back
              </button>
            )}
            
            {currentStep < FlowStep.BOARDING_PASS && (
              <button
                onClick={goToNextStep}
                className="px-4 py-2 bg-primary text-white rounded-xl ml-auto"
              >
                Next
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
