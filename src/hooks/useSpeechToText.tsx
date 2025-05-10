
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

  // Check for microphone access when starting to record
  useEffect(() => {
    if (isRecording && !isMicrophoneAvailable) {
      stopRecording();
      toast({
        title: "Microphone Access",
        description: "Please allow microphone access to use voice input.",
        variant: "destructive",
      });
    }
  }, [isRecording, isMicrophoneAvailable, toast]);

  const startRecording = () => {
    if (!browserSupportsSpeechRecognition) {
      toast({
        title: "Error",
        description: "Your browser doesn't support speech recognition.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsRecording(true);
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
    } catch (error) {
      console.error("Failed to start speech recognition:", error);
      toast({
        title: "Error",
        description: "Failed to start speech recognition. Please try again.",
        variant: "destructive",
      });
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    try {
      setIsRecording(false);
      SpeechRecognition.stopListening();
    } catch (error) {
      console.error("Failed to stop speech recognition:", error);
    }
  };

  return {
    transcript,
    listening,
    resetTranscript,
    isRecording,
    startRecording,
    stopRecording,
    browserSupportsSpeechRecognition
  };
};
