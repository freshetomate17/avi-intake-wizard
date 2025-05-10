
import React from "react";
import { Camera, Mic } from "lucide-react";

interface InfoMessagesProps {
  isRecording: boolean;
}

const InfoMessages: React.FC<InfoMessagesProps> = ({ isRecording }) => {
  return (
    <>
      {/* Voice interaction notification */}
      <div className="bg-primary/10 rounded-lg p-3 mb-4 flex items-center border border-primary/20">
        <Mic className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
        <p className="text-sm">
          <span className="font-medium">Voice-enabled assistant:</span> You can communicate with Ava through voice. Click the microphone button to start or stop recording.
        </p>
      </div>
      
      {/* Photo capabilities information */}
      <div className="bg-blue-50 rounded-lg p-3 mb-4 flex items-start border border-blue-200">
        <Camera className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
        <p className="text-sm">
          <span className="font-medium">Photo upload available:</span> You can take photos of medical documents, prescriptions, medical devices (blood pressure/glucose monitors), medication packages, or physical symptoms for better assistance.
        </p>
      </div>
      
      {/* Microphone status indicator when recording */}
      {isRecording && (
        <div className="bg-red-50 rounded-lg p-3 mb-4 flex items-center border border-red-200">
          <Mic className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 animate-pulse" />
          <p className="text-sm">
            <span className="font-medium">Recording:</span> Speak clearly into your microphone. Click the microphone button again to stop.
          </p>
        </div>
      )}
    </>
  );
};

export default InfoMessages;
