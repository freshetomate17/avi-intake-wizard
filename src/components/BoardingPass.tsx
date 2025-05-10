
import React, { useState, useEffect } from "react";
import { Check, Calendar, User, MapPin } from "lucide-react";

interface BoardingPassProps {
  onComplete: () => void;
}

const BoardingPass: React.FC<BoardingPassProps> = ({ onComplete }) => {
  const [isGenerated, setIsGenerated] = useState(false);

  // Simulate loading time for boarding pass generation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsGenerated(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

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
                  <p className="font-medium">John Doe</p>
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
                  <p className="font-medium">Dr. Julia Schmidt</p>
                  <p className="text-sm">General Medicine Practice</p>
                  <p className="text-sm">123 Main Street, 10115 Berlin</p>
                </div>
              </div>

              {/* QR Code */}
              <div className="flex justify-center mb-4">
                <div className="bg-gray-100 w-40 h-40 rounded-lg flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-36 h-36">
                    {/* Simplified QR code for illustration */}
                    <rect x="5" y="5" width="90" height="90" fill="white" />
                    <rect x="15" y="15" width="10" height="10" />
                    <rect x="35" y="15" width="10" height="10" />
                    <rect x="55" y="15" width="10" height="10" />
                    <rect x="75" y="15" width="10" height="10" />
                    
                    <rect x="15" y="35" width="10" height="10" />
                    <rect x="45" y="35" width="10" height="10" />
                    <rect x="65" y="35" width="10" height="10" />
                    
                    <rect x="25" y="45" width="10" height="10" />
                    <rect x="55" y="45" width="10" height="10" />
                    <rect x="75" y="45" width="10" height="10" />
                    
                    <rect x="15" y="55" width="10" height="10" />
                    <rect x="35" y="55" width="10" height="10" />
                    <rect x="65" y="55" width="10" height="10" />
                    
                    <rect x="15" y="75" width="10" height="10" />
                    <rect x="35" y="75" width="10" height="10" />
                    <rect x="55" y="75" width="10" height="10" />
                    <rect x="75" y="75" width="10" height="10" />
                  </svg>
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
                  Please show this pass upon arrival
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
        <button
          onClick={onComplete}
          className={`px-4 py-2 bg-primary text-white rounded-xl ${
            !isGenerated ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={!isGenerated}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default BoardingPass;
