
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/components/chat/types";

export const useFileUpload = (setMessages: React.Dispatch<React.SetStateAction<Message[]>>) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    
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

  return {
    isAnalyzing,
    handleFileUpload
  };
};
