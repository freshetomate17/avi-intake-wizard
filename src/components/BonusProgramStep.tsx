
import React from "react";
import ProgramCard, { ProgramProps } from "./ProgramCard";

interface BonusProgramStepProps {
  onComplete: () => void;
}

const BonusProgramStep: React.FC<BonusProgramStepProps> = ({ onComplete }) => {
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

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-2xl font-serif font-bold mb-4">Bonus Programs</h2>
      
      <div className="flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {programs.map((program) => (
            <ProgramCard 
              key={program.id}
              id={program.id}
              title={program.title}
              subtitle={program.subtitle}
              features={program.features}
              detailsDescription={program.detailsDescription}
              monthlyFee={program.monthlyFee}
              benefits={program.benefits}
            />
          ))}
        </div>
      </div>
      
      <div className="flex justify-end mt-4">
        <button
          onClick={onComplete}
          className="px-4 py-2 bg-primary text-white rounded-xl"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BonusProgramStep;
