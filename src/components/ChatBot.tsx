
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, Loader } from "lucide-react";

interface ChatBotProps {
  onComplete: () => void;
}

interface Message {
  id: number;
  text: string;
  sender: "bot" | "user";
}

const ChatBot = ({ onComplete }: ChatBotProps) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hi! I'm avi. I'll help you check in. What's your full name?", sender: "bot" }
  ]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState(0);
  const [isRecording, setIsRecording] = useState(false);

  // Questions flow
  const questions = [
    "What's your full name?",
    "What's your date of birth? (DD/MM/YYYY)",
    "What's the reason for your visit today?"
  ];

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add user message
    const newUserMessage = { id: messages.length + 1, text: input, sender: "user" as const };
    setMessages([...messages, newUserMessage]);
    setInput("");
    
    // Move to next question if available
    if (step < questions.length - 1) {
      setTimeout(() => {
        const nextStep = step + 1;
        const nextQuestion = { id: messages.length + 2, text: questions[nextStep], sender: "bot" as const };
        setMessages(prev => [...prev, nextQuestion]);
        setStep(nextStep);
      }, 500);
    } else {
      // Final step - show completion message
      setTimeout(() => {
        const completionMessage = { 
          id: messages.length + 2, 
          text: "Thank you! Your check-in information has been recorded.", 
          sender: "bot" as const 
        };
        setMessages(prev => [...prev, completionMessage]);
      }, 500);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // In a real app, this would connect to speech-to-text API
    if (!isRecording) {
      console.log("Started recording");
      // Simulate recording for demo
      setTimeout(() => {
        setIsRecording(false);
        setInput("This is a simulated voice input");
      }, 2000);
    }
  };

  return (
    <div className="flex flex-col h-[80vh]">
      <h2 className="text-2xl font-serif mb-4">Digital Check-in</h2>
      
      <div className="flex-grow bg-gray-50 rounded-lg p-4 overflow-y-auto mb-4">
        <div className="flex items-center mb-6">
          <div className="bg-primary text-white p-3 rounded-full">
            avi
          </div>
          <h3 className="ml-3 font-semibold text-lg">Digital Assistant</h3>
        </div>
        
        {/* Messages */}
        <div className="space-y-4">
          {messages.map(message => (
            <div 
              key={message.id} 
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div 
                className={`p-3 rounded-lg max-w-[80%] ${
                  message.sender === "user" 
                    ? "bg-primary text-white rounded-tr-none" 
                    : "bg-white border rounded-tl-none"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Input area */}
      <div className="flex items-center gap-2">
        <Button 
          type="button" 
          variant="outline" 
          className={`rounded-full p-2 ${isRecording ? "bg-red-100" : ""}`}
          onClick={toggleRecording}
        >
          {isRecording ? <Loader className="animate-spin" /> : <Mic />}
        </Button>
        
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your response..."
          className="flex-grow"
        />
        
        <Button onClick={handleSend} disabled={!input.trim()}>
          Send
        </Button>
      </div>
      
      <div className="mt-6 flex justify-end">
        <Button 
          onClick={onComplete}
          variant="outline"
          className="border-primary text-primary"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ChatBot;
