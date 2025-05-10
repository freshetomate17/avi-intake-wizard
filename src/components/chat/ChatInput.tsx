
import React, { useRef } from "react";
import { Camera, Mic, MicOff } from "lucide-react";

interface ChatInputProps {
  input: string;
  setInput: (input: string) => void;
  handleSend: () => void;
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
  triggerFileUpload: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  input,
  setInput,
  handleSend,
  isRecording,
  startRecording,
  stopRecording,
  triggerFileUpload,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-center mb-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            triggerFileUpload();
          }
        }}
        accept=".pdf,.jpg,.jpeg,.png"
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="p-2 rounded-full mr-2 bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
        title="Upload document or photo"
      >
        <Camera size={24} />
      </button>
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`p-2 rounded-full mr-2 ${
          isRecording ? "bg-red-500 text-white" : "bg-gray-200 hover:bg-gray-300"
        } flex items-center justify-center`}
        title={isRecording ? "Stop recording" : "Start voice input"}
      >
        {isRecording ? <MicOff size={24} /> : <Mic size={24} />}
      </button>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && handleSend()}
        placeholder="Enter your response..."
        className="flex-grow border rounded-lg p-2"
      />
      <button
        onClick={handleSend}
        disabled={!input.trim()}
        className={`ml-2 p-2 rounded-full ${
          input.trim() ? "bg-primary text-white" : "bg-gray-200"
        } flex items-center justify-center`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="22" x2="11" y1="2" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      </button>
    </div>
  );
};

export default ChatInput;
