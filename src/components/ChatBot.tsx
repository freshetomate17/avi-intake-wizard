
import React, { useState, useRef, useEffect } from "react";
import { ChatProps, Message } from "./chat/types";
import { useSpeechToText } from "@/hooks/useSpeechToText";
import { useFileUpload } from "@/hooks/useFileUpload";
import MessageList from "./chat/MessageList";
import ChatInput from "./chat/ChatInput";
import InfoMessages from "./chat/InfoMessages";

const ChatBot: React.FC<ChatProps> = ({ onComplete }) => {
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Custom hooks
  const { transcript, isRecording, startRecording, stopRecording, resetTranscript } = useSpeechToText();
  const { isAnalyzing, handleFileUpload } = useFileUpload(setMessages);

  // Update input field when transcript changes
  useEffect(() => {
    if (transcript && isRecording) {
      setInput(transcript);
    }
  }, [transcript, isRecording]);

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
    resetTranscript();

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

  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    handleFileUpload(file);
    
    // Reset file input for future uploads
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-2xl font-serif font-bold mb-4">Digital Check-in</h2>
      
      <InfoMessages isRecording={isRecording} />
      
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
      
      <MessageList messages={messages} isAnalyzing={isAnalyzing} />
      
      <div className="flex items-center mb-4">
        <input
          type="file"
          ref={fileInputRef}
          onChange={onFileChange}
          accept=".pdf,.jpg,.jpeg,.png"
          className="hidden"
        />
        <ChatInput 
          input={input}
          setInput={setInput}
          handleSend={handleSend}
          isRecording={isRecording}
          startRecording={startRecording}
          stopRecording={stopRecording}
          triggerFileUpload={triggerFileUpload}
        />
      </div>
      
      {/* Continue button */}
      <div className="flex justify-end">
        <button
          onClick={onComplete}
          className="px-4 py-2 bg-primary text-white rounded-xl"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
