
import React from "react";
import ProgramCard, { ProgramProps } from "./ProgramCard";

interface BonusProgramStepProps {
  onComplete: () => void;
}

const BonusProgramStep: React.FC<BonusProgramStepProps> = ({ onComplete }) => {
  const programs: ProgramProps[] = [
    {
      id: "hausarzt-plus",
      title: "avi Hausarzt Plus",
      subtitle: "Profitieren Sie von exklusiven Zusatzleistungen",
      features: [
        { text: "Regelmäßige Vorsorge – jährliche Blutbilder & zweijährige Vorsorge" },
        { text: "Medizinischer Rückrufservice – Rezepte, Überweisungen & Krankschreibung" },
        { text: "Schnellere Beantwortung Ihrer Anfragen – prioritierter Support" }
      ]
    },
    {
      id: "impact",
      title: "avi Impact",
      subtitle: "Verbessern Sie Ihre Gesundheit kontinuierlich",
      features: [
        { text: "Remote Monitoring – regelmäßige Messung Ihrer Gesundheitsdaten" },
        { text: "Telemedizin – Begleitung durch Teleärzt:innen & MFAs" },
        { text: "Therapieoptimierung – Lebensstilinterventionen & Kontrolle" }
      ]
    }
  ];

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-2xl font-serif font-bold mb-4">Bonus Programme</h2>
      
      <div className="flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {programs.map((program) => (
            <ProgramCard 
              key={program.id}
              id={program.id}
              title={program.title}
              subtitle={program.subtitle}
              features={program.features}
            />
          ))}
        </div>
      </div>
      
      <div className="flex justify-end mt-4">
        <button
          onClick={onComplete}
          className="px-4 py-2 bg-primary text-white rounded-xl"
        >
          Weiter
        </button>
      </div>
    </div>
  );
};

export default BonusProgramStep;
