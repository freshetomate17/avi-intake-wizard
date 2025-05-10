
import React, { useState } from "react";
import ProgramCard, { ProgramProps } from "./ProgramCard";

interface BonusProgramStepProps {
  onComplete: () => void;
  onProgramsSelected?: (selectedPrograms: string[]) => void;
}

const BonusProgramStep: React.FC<BonusProgramStepProps> = ({ onComplete, onProgramsSelected }) => {
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);

  const programs: ProgramProps[] = [
    {
      id: "hausarzt-plus",
      title: "avi Primary Care Plus",
      subtitle: "Benefit from exclusive additional services",
      features: [
        { text: "Regular preventive care – annual blood tests & biannual check-ups" },
        { text: "Medical callback service – prescriptions, referrals & sick notes" },
        { text: "Faster response to your inquiries – prioritized support" }
      ],
      detailsDescription: "With avi Primary Care Plus, we offer you a comprehensive preventive care program. You'll receive annual blood tests and biannual detailed preventive examinations that go beyond standard insurance coverage. Our medical callback service allows you to conveniently request prescriptions, referrals, and sick notes without having to come to the practice in person. Additionally, you'll enjoy prioritized support for all your inquiries.",
      monthlyFee: "9.99€",
      benefits: [
        "Comprehensive healthcare beyond standard insurance coverage",
        "Time savings through digital services",
        "Preferred appointment scheduling with specialists"
      ]
    },
    {
      id: "impact",
      title: "avi Impact",
      subtitle: "Continuously improve your health",
      features: [
        { text: "Remote Monitoring – regular measurement of your health data" },
        { text: "Telemedicine – support from teledoctors & medical assistants" },
        { text: "Therapy optimization – lifestyle interventions & monitoring" }
      ],
      detailsDescription: "avi Impact is our innovative program for continuous health improvement. With Remote Monitoring, your health data is regularly collected and evaluated to detect changes early. Our teledoctors and medical assistants are available to answer all your questions and provide professional guidance. Therapy optimization includes personalized lifestyle interventions and regular monitoring of your health parameters.",
      monthlyFee: "14.99€",
      benefits: [
        "Early detection of health changes",
        "Personal health coach",
        "Individually tailored therapy plans",
        "Digital documentation of your health development"
      ]
    }
  ];

  const handleProgramToggle = (programId: string) => {
    setSelectedPrograms(prev => {
      if (prev.includes(programId)) {
        return prev.filter(id => id !== programId);
      } else {
        return [...prev, programId];
      }
    });
  };

  const handleComplete = () => {
    if (onProgramsSelected) {
      onProgramsSelected(selectedPrograms);
    }
    onComplete();
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-2xl font-serif font-bold mb-4">Bonus Programs</h2>
      
      <div className="flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {programs.map((program) => (
            <div 
              key={program.id} 
              className={`relative ${selectedPrograms.includes(program.id) ? 'ring-2 ring-primary' : ''}`}
              onClick={() => handleProgramToggle(program.id)}
            >
              <ProgramCard 
                id={program.id}
                title={program.title}
                subtitle={program.subtitle}
                features={program.features}
                detailsDescription={program.detailsDescription}
                monthlyFee={program.monthlyFee}
                benefits={program.benefits}
              />
              {selectedPrograms.includes(program.id) && (
                <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-end mt-4">
        <button
          onClick={handleComplete}
          className="px-4 py-2 bg-primary text-white rounded-xl"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BonusProgramStep;
