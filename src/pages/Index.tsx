
import { useState } from "react";
import ChatBot from "@/components/ChatBot";
import BoardingPass from "@/components/BoardingPass";
import DoctorDashboard from "@/components/DoctorDashboard";

// Main flow steps
enum FlowStep {
  CHATBOT,
  BOARDING_PASS,
  DOCTOR_DASHBOARD
}

const Index = () => {
  const [currentStep, setCurrentStep] = useState<FlowStep>(FlowStep.CHATBOT);

  // Function to navigate to next step
  const goToNextStep = () => {
    setCurrentStep(prev => {
      if (prev < FlowStep.DOCTOR_DASHBOARD) {
        return prev + 1;
      }
      return prev;
    });
  };

  // Function to navigate to a specific step
  const goToStep = (step: FlowStep) => {
    setCurrentStep(step);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      <div className="w-full max-w-3xl p-4">
        {/* Logo in the top right */}
        <div className="absolute top-10 right-8">
          <img src="/avi-logo.png" alt="avi logo" className="h-16" />
        </div>
        
        {/* Progress indicator */}
        <div className="w-full mb-6 flex justify-between">
          {Object.keys(FlowStep)
            .filter(key => !isNaN(Number(key)))
            .map((step, index) => (
              <div 
                key={step}
                className={`w-full h-1 ${
                  Number(step) <= currentStep ? "bg-primary" : "bg-gray-200"
                } ${index < 2 ? "mr-1" : ""}`}
              />
            ))}
        </div>

        {/* Current step component */}
        {currentStep === FlowStep.CHATBOT && (
          <ChatBot onComplete={goToNextStep} />
        )}
        {currentStep === FlowStep.BOARDING_PASS && (
          <BoardingPass onComplete={goToNextStep} />
        )}
        {currentStep === FlowStep.DOCTOR_DASHBOARD && (
          <DoctorDashboard />
        )}

        {/* Navigation buttons */}
        <div className="mt-8 flex justify-between">
          {currentStep > FlowStep.CHATBOT && (
            <button
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="px-4 py-2 border border-primary text-primary rounded-xl"
            >
              Back
            </button>
          )}
          
          {currentStep < FlowStep.DOCTOR_DASHBOARD && (
            <button
              onClick={goToNextStep}
              className="px-4 py-2 bg-primary text-white rounded-xl ml-auto"
            >
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
