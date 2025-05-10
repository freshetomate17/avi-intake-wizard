
import React from "react";
import { FileText } from "lucide-react";
import { Message } from "./types";

interface MessageListProps {
  messages: Message[];
  isAnalyzing: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isAnalyzing }) => {
  return (
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
            {message.documentUrl && (
              <div className="mt-2 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                <a 
                  href={message.documentUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm underline"
                >
                  {message.documentName}
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
                <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageList;
