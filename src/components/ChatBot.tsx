
import React, { useState, useRef, useEffect } from "react";
// Allow using SpeechRecognition on window without TS errors
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
import { Camera, FileText, Mic, MicOff, FileImage, FileMinus, FilePlus, FileX, Bandage, Pill } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "./ui/button";
import { stringify } from "querystring";

interface Document {
  id: number;
  name: string;
  uploaded: boolean;
  type: string;
}

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  documentUrl?: string;
  documentName?: string;
}

interface ChatBotProps {
  onComplete: () => void;
  name: string;
  birthdate: string;
  reason: string;
}

export const ChatBot: React.FC<ChatBotProps> = ({ onComplete, name, birthdate, reason }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesRef = useRef<Message[]>([]);

  const [leonsNervigesZeug, setLeonsNervigesZeug] = useState<string[]>([]);
  const [input, setInput] = useState("");
  // Removed step state and questions array as per instructions
  const [isSpeaking, setIsSpeaking] = useState(false);

  // speech recognition instance
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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
    sendInitialDetails();
    // Prime voices for mobile Safari TTS
    if ("speechSynthesis" in window) {
      window.speechSynthesis.getVoices();
    }
  }, [toast]);

  useEffect(() => {
    if (!("speechSynthesis" in window)) return;
    if (messages.length === 0) return;
    const last = messages[messages.length - 1];
    if (last.sender !== "bot") return;
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utter = new SpeechSynthesisUtterance(last.text);
    utter.onstart = () => setIsSpeaking(true);
    utter.onend = () => setIsSpeaking(false);
    // Use browser language or fallback
    utter.lang = navigator.language || "en-US";

    // Attempt to select a matching voice
    const loadAndSpeak = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        const voice = voices.find(v => v.lang.startsWith(utter.lang)) || voices[0];
        utter.voice = voice;
        window.speechSynthesis.speak(utter);
      }
    };

    // Some mobile browsers emit voiceschanged event
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.addEventListener("voiceschanged", loadAndSpeak);
    }
    loadAndSpeak();
  }, [messages]);

  // Keep messagesRef in sync with latest messages
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const sendInitialDetails = async () => {
    console.log("setting initial details")
    setIsLoadingChat(true);
    const details = `My name is ${name}\n and Date of Birth is ${birthdate}\n and my reason for Visit is ${reason}`;
    try {
      const res = await fetch(
        "https://avibackend-be6209427017.herokuapp.com/api/generate_answer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "123"
          },
          body: JSON.stringify({ "Chat History": [{ role: "user", content: details }] })
        }
      );
      const data = await res.json();
      if (data["Chat History"]) {
        setMessages(
          
          data["Chat History"].map((entry: any, idx: number) => ({
            id: idx + 1,
            text: entry.content,
            sender: "user"
          }))
        );
      } else if (data.answer) {
        setMessages([{ id: 1, text: data.answer, sender: "bot" }]);
      }
    } catch (err: any) {
      toast({ title: "Error", description: "Failed to load initial chat", variant: "destructive" });
    } finally {
      setIsLoadingChat(false);
    }
  };

  const handleSend = async (overrideText?: string) => {
    console.log(messages);
    if (overrideText !== undefined && (typeof overrideText == 'string')) {
      console.log("string");
    }

    const toSend = overrideText !== undefined ? overrideText : input;
    if (!toSend.trim()) return;

    // append user message
    setMessages(prev => [
      ...prev,
      { id: messagesRef.current.length + 1, text: toSend, sender: "user" }
    ]);
    setInput("");
    setIsLoadingChat(true);

    // build chat history payload
    const chatHistory = [
      ...messagesRef.current.map(m => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.text
      })),
      { role: "user", content: toSend }
    ];

    try {
      const res = await fetch(
        "https://avibackend-be6209427017.herokuapp.com/api/generate_answer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "123"
          },
          body: JSON.stringify({ "Chat History": chatHistory })
        }
      );
      const data = await res.json();
      if (data["Chat History"]) {
        console.log("Replacing history");
        // replace entire conversation
        setMessages(
          data["Chat History"].map((entry: any, idx: number) => ({
            id: idx + 1,
            text: entry.content,
            sender:
              entry.role === "user" ? "user" : "bot"
          }))
        );
      } else if (data.answer) {
        // Create the new bot message object
        const newBotMsg: Message = {
          id: messagesRef.current.length + 1,
          text: data.answer,
          sender: "bot",
        };
        // Append it to messages
        setMessages(prev => [...prev, newBotMsg]);

        // If this message contains "QR-Code", report bad API
        if (newBotMsg.text.toLowerCase().includes("boarding")) {
          console.log("sending everything");
          // Build the full chat history as string
          const allHistory = [...messages, newBotMsg]
            .map(msg => `${msg.sender}: ${msg.text}`)
            .join("\n");
          // Append leonsNervigesZeug entries
          const leonText = leonsNervigesZeug.join("\n");
          const payload = `${allHistory}\n${leonText}`;
          console.log("Reporting bad API with payload:", payload);
          // Call generate_summary endpoint
          const summaryResp = await fetch(
            "https://avibackend-be6209427017.herokuapp.com/api/generate_summary",
            {
              method: "POST",
              headers: {
                "Content-Type": "text/plain",
                "x-api-key": "123",
              },
              body: payload,  // send raw text
            }
          );
          console.log("generate_summary status:", summaryResp.status);
          const summaryData = await summaryResp.json();
          console.log("generate_summary data:", summaryData);
          if (summaryData.answer) {
            const newerBotMsg: Message = {
              id: messages.length + 2,
              text: summaryData.answer,
              sender: "bot",
            };
            console.log(summaryData.answer)
            //setMessages(prev => [...prev, newerBotMsg]);
          } else {
            console.warn("No answer in generate_summary response");
          }


        }
      }
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    } finally {
      setIsLoadingChat(false);
    }
  };

  const showDocumentList = () => {
    setShowingDocumentList(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          text: "Here are examples of documents that might be helpful for your visit. You can upload photos of any of these, or other relevant items like wounds, injuries, blisters, etc.:\n\n" +
                documents.map(doc => `• ${doc.name}`).join("\n\n") +
                "\n\nPlease upload any relevant documents using the camera button below. When you're finished, just let me know that you're done.",
          sender: "bot",
        },
      ]);
    }, 500);
  };

  const completeDocumentUpload = () => {
    setDocumentUploadCompleted(true);
    const uploadedDocs = documents.filter(doc => doc.uploaded);
    const missingDocs = documents.filter(doc => !doc.uploaded);
    
    setTimeout(() => {
      let message = "Thank you for your uploads! ";
      
      if (uploadedDocs.length > 0) {
        message += `I've received the following documents:\n\n${uploadedDocs.map(doc => `✅ ${doc.name}`).join("\n\n")}`;
      }
      
      if (missingDocs.length > 0 && uploadedDocs.length > 0) {
        message += "\n\nThe following documents were not uploaded, but that's okay if they're not relevant for your visit:";
        message += `\n\n${missingDocs.map(doc => `❌ ${doc.name}`).join("\n\n")}`;
      }
      
      message += "\n\nIs this list of uploaded documents complete? If yes, we can proceed to the next step.";
      
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          text: message,
          sender: "bot",
        },
      ]);
    }, 500);
  };

  const startRecording = () => {
    const recog = recognitionRef.current;
    if (!recog) {
      toast({
        title: "Not supported",
        description: "Speech recognition is not supported in this browser.",
        variant: "destructive",
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
    console.log("Uploading document to analyze:", file.name);

    // append user "Document uploaded" message
    setMessages(prev => [
      ...prev,
      {
        id: prev.length + 1,
        text: "Document uploaded",
        sender: "user",
        documentUrl: URL.createObjectURL(file),
        documentName: file.name,
      },
    ]);

    setIsAnalyzing(true);
    e.target.value = "";

    try {
      const formData = new FormData();
      formData.append("images", file);

      // First API call: analyze_image_type
      const response = await fetch(
        "https://avibackend-be6209427017.herokuapp.com/api/analyze_image_type",
        {
          method: "POST",
          headers: {
            "x-api-key": "123"
          },
          body: formData,
        }
      );
      console.log("Analyze response status:", response.status);
      const data = await response.json();

      if (data.answer) {
        setMessages(prev => [
          ...prev,
          { id: prev.length + 1, text: data.answer, sender: "bot" }
        ]);
      } else {
        console.warn("No answer field in analysis response");
      }

      // Second API call: analyze_image
      console.log("Sending document to /api/analyze_image");
      const response2 = await fetch(
        "https://avibackend-be6209427017.herokuapp.com/api/analyze_image",
        {
          method: "POST",
          headers: {
            "x-api-key": "123"
          },
          body: formData,
        }
      );
      console.log("Analyze_image status:", response2.status);
      const data2 = await response2.json();
      console.log("Analyze_image data:", data2.answer);
      
      if (data2.answer) {
        setLeonsNervigesZeug( prev => [...prev, data2.answer])
      } else {
        console.warn("No answer field in /api/analyze_image response");
      }
    } catch (err: any) {
      console.error("Error uploading document", err);
      toast({
        title: "Upload error",
        description: "Failed to analyze document",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
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

      {/* Ava animation */}
      <div className="flex justify-center">
        <div className="w-64 h-64 rounded-full overflow-hidden relative">
          <video
            src="/videos/waiting.mp4"
            autoPlay
            loop
            muted
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${!isLoadingChat && !isSpeaking ? 'opacity-100' : 'opacity-0'}`}
          />
          <video
            src="/videos/thinking.mp4"
            autoPlay
            loop
            muted
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isLoadingChat && !isSpeaking ? 'opacity-100' : 'opacity-0'}`}
          />
          <video
            src="/videos/speaking.mp4"
            autoPlay
            loop
            muted
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isSpeaking ? 'opacity-100' : 'opacity-0'}`}
          />
        </div>
      </div>
      {/* Chat window */}
      <div className="flex-grow bg-gray-50 rounded-lg p-4 overflow-y-auto mb-4">
        {messages.map((m, idx) => (
          <div
            key={`${m.id}-${idx}`}
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

      {/* Next button (previously Continue button) */}
      <div className="flex justify-end">
      </div>
    </div>
  );
};

export default ChatBot;
