
export interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  documentUrl?: string;
  documentName?: string;
}

export interface ChatProps {
  onComplete: () => void;
}
