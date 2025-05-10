
import React, { useState, useRef, useEffect } from "react";
// Allow using SpeechRecognition on window without TS errors
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
import { Camera, FileText, Mic, MicOff, FileImage, FileMinus, FilePlus, FileX, Bandage, Pill, FileMedical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "./ui/button";

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
  const [showingDocumentList, setShowingDocumentList] = useState(false);
  const [documentUploadCompleted, setDocumentUploadCompleted] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([
    { id: 1, name: "Versicherungskarte (elektronisch per Foto oder NFC)", uploaded: false, type: "insurance" },
    { id: 2, name: "Ärztliche Überweisung(en) (z. B. zum Spezialisten oder Labor)", uploaded: false, type: "referral" },
    { id: 3, name: "Vorhandene Laborbefunde (Blutwerte, Urinanalysen etc.)", uploaded: false, type: "lab" },
    { id: 4, name: "Vorhandene Bildgebende Befunde (Röntgen-, CT-, MRT-Berichte)", uploaded: false, type: "imaging" },
    { id: 5, name: "Impfpass bzw. Impfnachweise", uploaded: false, type: "vaccination" },
    { id: 6, name: "Medikationsplan oder aktuelle Rezept-Packungsbeilagen", uploaded: false, type: "medication" },
    { id: 7, name: "Entlassungsberichte aus Krankenhäusern oder Reha", uploaded: false, type: "discharge" },
    { id: 8, name: "Befunde zu chronischen Erkrankungen (z. B. Diabetes, COPD, KHK)", uploaded: false, type: "chronic" },
    { id: 9, name: "Aktuelle Messdaten von Wearables oder Home-Monitoring-Geräten", uploaded: false, type: "monitoring" },
    { id: 10, name: "Fotos von akuten Symptomen (z. B. Hautveränderungen, Schwellungen)", uploaded: false, type: "symptoms" },
    { id: 11, name: "Ernährungs- & Lebensstil-Checkliste (falls vorhanden)", uploaded: false, type: "lifestyle" },
    { id: 12, name: "Vollmachten oder Patientenverfügungen (sofern relevant)", uploaded: false, type: "directive" },
  ]);
  
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
    "Thank you. Now I'd like you to upload any relevant documents or photos that could help the doctor. This could include medical records, insurance cards, or photos of symptoms. Would you like to see a list of examples?",
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
    setMessages((prev) => [...prev, newMsg]);

    setInput("");

    // Check for document-related inputs
    const lowerCaseText = toSend.toLowerCase();
    
    // If user asks for document list
    if ((lowerCaseText.includes("yes") || lowerCaseText.includes("list") || lowerCaseText.includes("example")) && step === questions.length - 1 && !showingDocumentList) {
      showDocumentList();
      return;
    }
    
    // If user says they're done with documents
    if ((lowerCaseText.includes("complete") || lowerCaseText.includes("finished") || lowerCaseText.includes("done")) && showingDocumentList) {
      completeDocumentUpload();
      return;
    }

    // advance conversation for normal flow
    if (step < questions.length - 1) {
      const nextStep = step + 1;
      setStep(nextStep);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { id: prev.length + 1, text: questions[nextStep], sender: "bot" },
        ]);
      }, 500);
    } else if (!documentUploadCompleted) {
      // If we're at the document upload step but haven't completed it yet
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            text: "Would you like to upload some documents or photos? I can show you examples of what might be useful.",
            sender: "bot",
          },
        ]);
      }, 500);
    } else {
      // Conversation completion
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
      
      // Try to match the uploaded document with our list
      const fileName = file.name.toLowerCase();
      let matchedDoc: Document | undefined;
      
      if (fileName.includes("versicherung") || fileName.includes("insurance") || fileName.includes("card"))
        matchedDoc = documents.find(d => d.type === "insurance");
      else if (fileName.includes("überweisung") || fileName.includes("referral"))
        matchedDoc = documents.find(d => d.type === "referral");
      else if (fileName.includes("labor") || fileName.includes("lab"))
        matchedDoc = documents.find(d => d.type === "lab");
      else if (fileName.includes("röntgen") || fileName.includes("ct") || fileName.includes("mrt") || fileName.includes("xray"))
        matchedDoc = documents.find(d => d.type === "imaging");
      else if (fileName.includes("impf") || fileName.includes("vaccination"))
        matchedDoc = documents.find(d => d.type === "vaccination");
      else if (fileName.includes("medikation") || fileName.includes("medication"))
        matchedDoc = documents.find(d => d.type === "medication");
      else if (fileName.includes("entlassung") || fileName.includes("discharge"))
        matchedDoc = documents.find(d => d.type === "discharge");
      else if (fileName.includes("chronisch") || fileName.includes("chronic"))
        matchedDoc = documents.find(d => d.type === "chronic");
      else if (fileName.includes("monitor") || fileName.includes("wearable"))
        matchedDoc = documents.find(d => d.type === "monitoring");
      else if (fileName.includes("symptom") || fileName.includes("wound") || fileName.includes("injury") || fileName.includes("blister"))
        matchedDoc = documents.find(d => d.type === "symptoms");
      else if (fileName.includes("ernährung") || fileName.includes("nutrition") || fileName.includes("lifestyle"))
        matchedDoc = documents.find(d => d.type === "lifestyle");
      else if (fileName.includes("vollmacht") || fileName.includes("directive") || fileName.includes("verfügung"))
        matchedDoc = documents.find(d => d.type === "directive");
      
      // If we found a match, mark it as uploaded
      if (matchedDoc) {
        setDocuments(prev => prev.map(doc => 
          doc.id === matchedDoc?.id ? { ...doc, uploaded: true } : doc
        ));
        
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            text: `I've analyzed your document. It appears to be: ${matchedDoc.name}. Is this correct? You can continue uploading more documents, or let me know when you're finished.`,
            sender: "bot",
          },
        ]);
      } else {
        // If no match found
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            text: "Thank you for uploading this document. You can continue uploading more documents, or let me know when you're finished.",
            sender: "bot",
          },
        ]);
      }

      toast({
        title: "Document uploaded",
        description: matchedDoc 
          ? `Document recognized as ${matchedDoc.name}`
          : "Document uploaded successfully",
      });
    }, 2000);
  };

  const getDocumentIcon = (docType: string) => {
    switch(docType) {
      case "insurance": return <FilePlus className="h-4 w-4" />;
      case "referral": return <FileText className="h-4 w-4" />;
      case "lab": return <FileMedical className="h-4 w-4" />;
      case "imaging": return <FileImage className="h-4 w-4" />;
      case "vaccination": return <FileMedical className="h-4 w-4" />;
      case "medication": return <Pill className="h-4 w-4" />;
      case "symptoms": return <Bandage className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
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
