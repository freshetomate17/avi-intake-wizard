import React, { useState, useRef } from "react";
import { Camera, FileText, Mic, MicOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "./ui/button";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  documentUrl?: string;
  documentName?: string;
}

interface ChatBotProps {
  onComplete: () => void;
}

const ChatBot: React.FC<ChatBotProps> = ({ onComplete }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Welcome to the digital check-in! I'm Ava, your digital assistant. I'll help you with the check-in process. 😊",
      sender: "bot",
    },
    {
      id: 2,
      text: "What is your full name?",
      sender: "bot",
    }
  ]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Questions flow
  const questions = [
    "What is your date of birth? (DD/MM/YYYY)",
    "What is the reason for your visit today?",
    "Please summarize your concerns as concretely as possible in one sentence."
  ];

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    const newMessages = [
      ...messages,
      { id: messages.length + 1, text: input, sender: "user" as const },
    ];

    setMessages(newMessages);
    setInput("");

    // Add bot response after a short delay
    if (step < questions.length - 1) {
      const nextStep = step + 1;
      setStep(nextStep);
      
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            text: questions[nextStep],
            sender: "bot",
          },
        ]);
      }, 500);
    } else {
      // Final response
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            text: "Thank you! Your check-in information has been recorded.",
            sender: "bot",
          },
        ]);
      }, 500);
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    
    // Simulate recording for 2 seconds
    setTimeout(() => {
      setIsRecording(false);
      setInput("This is a simulated voice input");
    }, 2000);
  };

  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    
    // Create object URL for preview
    const objectUrl = URL.createObjectURL(file);
    
    // Add user message with document
    setMessages((prev) => [
      ...prev,
      { 
        id: prev.length + 1, 
        text: "Document uploaded", 
        sender: "user",
        documentUrl: objectUrl,
        documentName: file.name
      },
    ]);
    
    // Set analyzing state
    setIsAnalyzing(true);
    
    // Reset file input for future uploads
    if (fileInputRef.current) fileInputRef.current.value = '';
    
    // Simulate document analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      
      // Determine document type based on filename
      let docType = "Unknown document";
      if (file.name.toLowerCase().includes("insurance")) {
        docType = "Insurance card";
      } else if (file.name.toLowerCase().includes("referral")) {
        docType = "Doctor's referral";
      } else if (file.name.toLowerCase().includes("report")) {
        docType = "Medical report";
      }
      
      // Add bot response with document analysis
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          text: `I've analyzed your document. It appears to be: ${docType}. Is this correct?`,
          sender: "bot",
        },
      ]);
      
      // Show toast notification
      toast({
        title: "Document analyzed",
        description: `Document recognized as ${docType}`,
      });
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-2xl font-serif font-bold mb-4">Digital Check-in</h2>
      
      {/* Voice interaction notification */}
      <div className="bg-primary/10 rounded-lg p-3 mb-4 flex items-center border border-primary/20">
        <Mic className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
        <p className="text-sm">
          <span className="font-medium">Voice-enabled assistant:</span> You can communicate with Ava primarily through voice. This chat is for reviewing the conversation.
        </p>
      </div>
      
      {/* Photo capabilities information */}
      <div className="bg-blue-50 rounded-lg p-3 mb-4 flex items-start border border-blue-200">
        <Camera className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
        <p className="text-sm">
          <span className="font-medium">Photo upload available:</span> You can take photos of medical documents, prescriptions, medical devices (blood pressure/glucose monitors), medication packages, or physical symptoms for better assistance.
        </p>
      </div>
      
      {/* Ava animation */}
      <div className="flex justify-center mb-6">
        <div className="w-64 h-64 rounded-full overflow-hidden">
          <img
            src="/lovable-uploads/4b4e8c7a-0eea-4672-a169-74b5a16d3295.png"
            alt="Ava"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      
      {/* Messages container */}
      <div className="flex-grow bg-gray-50 rounded-lg p-4 overflow-y-auto mb-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-2 flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`p-3 rounded-lg max-w-[80%] ${
                message.sender === "user"
                  ? "bg-primary text-white"
                  : "bg-white border border-gray-300"
              }`}
            >
              {message.text}
              {message.documentUrl && (
                <div className="mt-2 flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  <a 
                    href={message.documentUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm underline"
                  >
                    {message.documentName}
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
        {isAnalyzing && (
          <div className="flex justify-start mb-2">
            <div className="bg-white border border-gray-300 p-3 rounded-lg">
              <div className="flex items-center">
                <span className="mr-2">Analyzing document</span>
                <div className="flex space-x-1">
                  <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                  <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Input area */}
      <div className="flex items-center mb-4">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".pdf,.jpg,.jpeg,.png"
          className="hidden"
        />
        <button
          onClick={triggerFileUpload}
          className="p-2 rounded-full mr-2 bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
          title="Upload document or photo"
        >
          <Camera size={24} />
        </button>
        <button
          onClick={isRecording ? () => setIsRecording(false) : startRecording}
          className={`p-2 rounded-full mr-2 ${
            isRecording ? "bg-red-500 text-white" : "bg-gray-200 hover:bg-gray-300"
          } flex items-center justify-center`}
          title={isRecording ? "Stop recording" : "Start voice input"}
        >
          {isRecording ? (
            <MicOff size={24} />
          ) : (
            <Mic size={24} />
          )}
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
      
      {/* Next button (previously Continue button) */}
      <div className="flex justify-end">
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

export default ChatBot;
