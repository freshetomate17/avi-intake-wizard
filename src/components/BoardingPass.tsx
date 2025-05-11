
import React, { useState, useEffect } from "react";
import { QRCodeCanvas } from 'qrcode.react';
import { Check, Calendar, User, MapPin, Award } from "lucide-react";

interface BoardingPassProps {
  onComplete: () => void;
  selectedPrograms?: string[];
  patientName: string;
  birthdate: string;             // ISO date string, e.g. "1980-01-23"
  appointmentDate: string;       // ISO date string for the appointment
  appointmentTime: string;       // time string, e.g. "10:30"
  location: string;              // full address or location name
}

const BoardingPass: React.FC<BoardingPassProps> = ({
  onComplete,
  selectedPrograms = [],
  patientName,
  birthdate,
  appointmentDate,
  appointmentTime,
  location,
}) => {
  const [isGenerated, setIsGenerated] = useState(false);

  // Simulate loading time for boarding pass generation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsGenerated(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Function to format program names for display
  const formatProgramName = (id: string): string => {
    switch (id) {
      case "hausarzt-plus": return "avi Primary Care Plus";
      case "impact": return "avi Impact";
      default: return id;
    }
  };

  const qrValue = "https://www.notion.so/Welcome-to-your-appointment-1f0224effc858048a736e6e6d1d678bb?pvs=4";

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-2xl font-serif font-bold mb-4">Your Digital Boarding Pass</h2>

      {!isGenerated ? (
        <div className="flex flex-col items-center justify-center flex-grow">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-700">Generating your boarding pass...</p>
        </div>
      ) : (
        <div className="flex-grow flex flex-col">
          {/* Digital Boarding Pass */}
          <div className="bg-white rounded-lg border shadow-lg overflow-hidden mb-6">
            {/* Header with Logo */}
            <div className="bg-primary text-white p-4 flex justify-between items-center">
              <h3 className="text-xl font-bold">Appointment Confirmed</h3>
              <img src="/avi-logo.png" alt="avi logo" className="h-8" />
            </div>

            {/* Pass Content */}
            <div className="p-6">
              <div className="flex items-center mb-4">
                <User className="h-5 w-5 text-gray-500 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Patient</p>
                  <p className="font-medium">Tobias Winkler</p>
                </div>
              </div>

              <div className="flex items-center mb-4">
                <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Appointment</p>
                  <p className="font-medium">Monday, May 12, 2025</p>
                  <p className="font-medium">10:30 AM</p>
                </div>
              </div>

              <div className="flex items-center mb-6">
                <MapPin className="h-5 w-5 text-gray-500 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">Hausarztpraxis Avi Hauptbahnhof</p>
                  <p className="text-sm">Luisenstraße 1</p>
                  <p className="text-sm">80333 München</p>
                </div>
              </div>

              {/* Bonus Programs */}
              {selectedPrograms && selectedPrograms.length > 0 ? (
                <div className="flex items-center mb-6">
                  <Award className="h-5 w-5 text-gray-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Bonus Programs</p>
                    {selectedPrograms.map((program, index) => (
                      <p key={program} className="font-medium">{formatProgramName(program)}</p>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center mb-6">
                  <Award className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-400">Bonus Programs</p>
                    <p className="text-sm text-gray-500 italic">No bonus programs selected</p>
                  </div>
                </div>
              )}

              {/* QR Code */}
              <div className="flex justify-center mb-4">
                <div className="bg-gray-100 w-40 h-40 rounded-lg flex items-center justify-center">
                  <QRCodeCanvas value={qrValue} size={144} />
                </div>
              </div>

              <p className="text-center text-sm text-gray-500">
                Code: AVIPAT-2505-1230
              </p>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-medium mb-2">Notes:</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">
                  Please scan this pass at the terminal upon arrival
                </span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">
                  Please arrive 10 minutes before your appointment
                </span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">
                  Bring your insurance card and other relevant documents
                </span>
              </li>
            </ul>
          </div>
        </div>
      )}

      <div className="flex justify-end mt-auto">
      </div>
    </div>
  );
};

export default BoardingPass;
