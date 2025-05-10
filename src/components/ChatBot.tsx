import React, { useState, useRef, useEffect } from "react";
// Allow using SpeechRecognition on window without TS errors
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
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

export const ChatBot: React.FC<ChatBotProps> = ({ onComplete }) => {
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
    },
  ]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState(-1);
  // speech recognition instance
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Questions flow
  const questions = [
    "What is your date of birth? (DD/MM/YYYY)",
    "What is the reason for your visit today?",
    "Please summarize your concerns as concretely as possible in one sentence.",
  ];

  useEffect(() => {
    // set up SpeechRecognition on mount
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.interimResults = false;
      recog.lang = "en-US"; // or detect / make configurable
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recog.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((r) => r[0].transcript)
          .join("");
        setIsRecording(false);
        recog.stop();
        handleSend(transcript);
      };
      recog.onerror = (err) => {
        console.error("Speech recognition error", err);
        toast({
          title: "Speech Recognition Error",
          description: err.error,
          variant: "destructive",
        });
        setIsRecording(false);
      };
      recog.onend = () => {
        setIsRecording(false);
      };
      recognitionRef.current = recog;
    }
  }, [toast]);

  const handleSend = (overrideText?: string) => {
    // determine text from override or input state
    const toSend = overrideText !== undefined ? overrideText : input;
    if (!toSend.trim()) return;

    // append user message
    const newMsg: Message = {
      id: messages.length + 1,
      text: toSend,
      sender: "user",
    };
    setMessages(prev => [...prev, newMsg]);

    setInput("");

    // advance conversation
    if (step < questions.length - 1) {
      const nextStep = step + 1;
      setStep(nextStep);
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          { id: prev.length + 1, text: questions[nextStep], sender: "bot" },
        ]);
      }, 500);
    } else {
      setTimeout(() => {
        setMessages(prev => [
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
    const recog = recognitionRef.current;
    if (!recog) {
      toast({
        title: "Not supported",
        description: "Speech recognition is not supported in this browser.",
        variant: "warning",
      });
      return;
    }
    setInput("");
    setIsRecording(true);
    recog.start();
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    const objectUrl = URL.createObjectURL(file);
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        text: "Document uploaded",
        sender: "user",
        documentUrl: objectUrl,
        documentName: file.name,
      },
    ]);
    setIsAnalyzing(true);
    e.target.value = "";
    setTimeout(() => {
      setIsAnalyzing(false);
      let docType = "Unknown document";
      const name = file.name.toLowerCase();
      if (name.includes("insurance")) docType = "Insurance card";
      else if (name.includes("referral")) docType = "Doctor's referral";
      else if (name.includes("report")) docType = "Medical report";

      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          text: `I've analyzed your document. It appears to be: ${docType}. Is this correct?`,
          sender: "bot",
        },
      ]);
      toast({
        title: "Document analyzed",
        description: `Document recognized as ${docType}`,
      });
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-2xl font-serif font-bold mb-4">Digital Check-in</h2>
      {/* Voice info */}
      <div className="bg-primary/10 rounded-lg p-3 mb-4 flex items-center border border-primary/20">
        <Mic className="h-5 w-5 text-primary mr-2" />
        <p className="text-sm">
          <span className="font-medium">Voice-enabled assistant:</span> You can
          talk to Ava directly. Press the mic and speak.
        </p>
      </div>
      {/* Photo info */}
      <div className="bg-blue-50 rounded-lg p-3 mb-4 flex items-start border border-blue-200">
        <Camera className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
        <p className="text-sm">
          <span className="font-medium">Photo upload:</span> Snap medical
          documents, prescriptions or symptoms for better assistance.
        </p>
      </div>
      {/* Ava avatar */}
      <div className="flex justify-center mb-6">
        <div className="w-64 h-64 rounded-full overflow-hidden">
          <img
            src="/lovable-uploads/4b4e8c7a-0eea-4672-a169-74b5a16d3295.png"
            alt="Ava"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      {/* Chat window */}
      <div className="flex-grow bg-gray-50 rounded-lg p-4 overflow-y-auto mb-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`mb-2 flex ${
              m.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`p-3 rounded-lg max-w-[80%] ${
                m.sender === "user"
                  ? "bg-primary text-white"
                  : "bg-white border border-gray-300"
              }`}
            >
              {m.text}
              {m.documentUrl && (
                <div className="mt-2 flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  <a
                    href={m.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm underline"
                  >
                    {m.documentName}
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
                  <div
                    className="h-2 w-2 bg-gray-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <div
                    className="h-2 w-2 bg-gray-500 rounded-full animate-bounce"
                    style={{ animationDelay: "200ms" }}
                  />
                  <div
                    className="h-2 w-2 bg-gray-500 rounded-full animate-bounce"
                    style={{ animationDelay: "400ms" }}
                  />
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
          className="p-2 rounded-full mr-2 bg-gray-200 hover:bg-gray-300"
          title="Upload document or photo"
        >
          <Camera size={24} />
        </button>
        <button
          onClick={
            isRecording ? () => recognitionRef.current?.stop() : startRecording
          }
          className={`p-2 rounded-full mr-2 ${
            isRecording
              ? "bg-red-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
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
          onClick={() => handleSend()}
          disabled={!input.trim()}
          className={`ml-2 p-2 rounded-full ${
            input.trim() ? "bg-primary text-white" : "bg-gray-200"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
      {/* Continue */}
      <div className="flex justify-end">
        <Button onClick={onComplete}>Continue</Button>
      </div>
    </div>
  );
};

export default ChatBot;
