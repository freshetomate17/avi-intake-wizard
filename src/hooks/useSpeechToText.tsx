
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

export const useSpeechToText = () => {
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();

  // Speech recognition setup
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable
  } = useSpeechRecognition();

  // Show browser compatibility message if speech recognition is not supported
  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      toast({
        title: "Browser not supported",
        description: "Your browser doesn't support speech recognition. Please use Chrome for the best experience.",
        variant: "destructive",
      });
    }
  }, [browserSupportsSpeechRecognition, toast]);

  const startRecording = () => {
    if (!browserSupportsSpeechRecognition) {
      toast({
        title: "Error",
        description: "Your browser doesn't support speech recognition.",
        variant: "destructive",
      });
      return;
    }

    if (!isMicrophoneAvailable) {
      toast({
        title: "Microphone Access",
        description: "Please allow microphone access to use voice input.",
        variant: "destructive",
      });
      return;
    }

    setIsRecording(true);
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true });
  };

  const stopRecording = () => {
    setIsRecording(false);
    SpeechRecognition.stopListening();
  };

  return {
    transcript,
    listening,
    resetTranscript,
    isRecording,
    startRecording,
    stopRecording
  };
};
