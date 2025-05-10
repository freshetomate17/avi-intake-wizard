
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
      ],
      detailsDescription: "Mit avi Hausarzt Plus bieten wir Ihnen ein umfassendes Vorsorgeprogramm. Sie erhalten jährliche Blutuntersuchungen und zweijährliche ausführliche Vorsorgeuntersuchungen, die über die Kassenleistung hinausgehen. Unser medizinischer Rückrufservice ermöglicht Ihnen, Rezepte, Überweisungen und Krankschreibungen bequem anzufordern, ohne persönlich in die Praxis kommen zu müssen. Zusätzlich genießen Sie einen priorisierten Support bei all Ihren Anfragen.",
      monthlyFee: "9,99€",
      benefits: [
        "Umfassende Gesundheitsvorsorge über die Kassenleistung hinaus",
        "Zeitersparnis durch digitale Services",
        "Bevorzugte Terminvergabe bei Spezialisten"
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
      ],
      detailsDescription: "avi Impact ist unser innovatives Programm zur kontinuierlichen Gesundheitsverbesserung. Mit Remote Monitoring werden Ihre Gesundheitsdaten regelmäßig erfasst und ausgewertet, um frühzeitig Veränderungen zu erkennen. Unsere Teleärzte und medizinischen Fachangestellten stehen Ihnen für alle Fragen zur Verfügung und bieten professionelle Begleitung. Die Therapieoptimierung beinhaltet personalisierte Lebensstilinterventionen und regelmäßige Kontrollen Ihrer Gesundheitsparameter.",
      monthlyFee: "14,99€",
      benefits: [
        "Frühzeitige Erkennung gesundheitlicher Veränderungen",
        "Persönlicher Gesundheitscoach",
        "Individuell angepasste Therapiepläne",
        "Digitale Dokumentation Ihrer Gesundheitsentwicklung"
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
          Weiter
        </button>
      </div>
    </div>
  );
};

export default BonusProgramStep;
