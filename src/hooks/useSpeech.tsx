
import { useState, useCallback } from 'react';

interface UseSpeechProps {
  onSpeechEnd?: () => void;
}

export const useSpeech = ({ onSpeechEnd }: UseSpeechProps = {}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const speak = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) {
      console.error('Text-to-speech not supported in this browser');
      return;
    }
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    utterance.onstart = () => {
      setIsSpeaking(true);
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
      if (onSpeechEnd) {
        onSpeechEnd();
      }
    };
    
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
    };
    
    // Get available voices and set a preferred one if available
    const voices = window.speechSynthesis.getVoices();
    
    // Try to find a female English voice as it might sound better for an assistant
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Female') && voice.lang.includes('en')
    ) || voices.find(voice => 
      voice.lang.includes('en')
    );
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    window.speechSynthesis.speak(utterance);
  }, [onSpeechEnd]);
  
  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);
  
  return {
    speak,
    stopSpeaking,
    isSpeaking
  };
};
