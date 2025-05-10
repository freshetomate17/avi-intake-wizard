
import React, { useState } from "react";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
}

interface ChatBotProps {
  onComplete: () => void;
}

const ChatBot: React.FC<ChatBotProps> = ({ onComplete }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Willkommen zum digitalen Check-in! Ich bin Ava, Ihre digitale Assistentin. Ich werde Ihnen helfen, den Check-in-Prozess abzuschließen. Was ist Ihr vollständiger Name?",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState(0);
  const [isRecording, setIsRecording] = useState(false);

  // Questions flow
  const questions = [
    "Was ist Ihr vollständiger Name?",
    "Was ist Ihr Geburtsdatum? (TT/MM/JJJJ)",
    "Was ist der Grund für Ihren Besuch heute?",
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
            text: "Vielen Dank! Ihre Check-in-Informationen wurden erfasst.",
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
      setInput("Dies ist eine simulierte Spracheingabe");
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-2xl font-serif font-bold mb-4">Digitaler Check-in</h2>
      
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
            </div>
          </div>
        ))}
      </div>
      
      {/* Input area */}
      <div className="flex items-center mb-4">
        <button
          onClick={isRecording ? () => setIsRecording(false) : startRecording}
          className={`p-2 rounded-full mr-2 ${
            isRecording ? "bg-red-500 text-white" : "bg-gray-200"
          }`}
        >
          {isRecording ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="6" y="6" width="12" height="12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" x2="12" y1="19" y2="22" />
            </svg>
          )}
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          placeholder="Geben Sie Ihre Antwort ein..."
          className="flex-grow border rounded-lg p-2"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className={`ml-2 p-2 rounded-full ${
            input.trim() ? "bg-primary text-white" : "bg-gray-200"
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" x2="11" y1="2" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
      
      <div className="flex justify-end">
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

export default ChatBot;
