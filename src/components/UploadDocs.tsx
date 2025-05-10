
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Upload, FileText, Loader } from "lucide-react";

interface UploadDocsProps {
  onComplete: () => void;
}

interface UploadedFile {
  id: string;
  name: string;
  progress: number;
  status: "uploading" | "processing" | "complete" | "error";
}

const UploadDocs = ({ onComplete }: UploadDocsProps) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (fileList: FileList) => {
    // Convert FileList to array and process
    const newFiles = Array.from(fileList).map(file => ({
      id: Math.random().toString(36).substring(7),
      name: file.name,
      progress: 0,
      status: "uploading" as const
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
    
    // Simulate upload and OCR process
    newFiles.forEach(file => {
      simulateUploadProgress(file.id);
    });
  };

  const simulateUploadProgress = (fileId: string) => {
    let progress = 0;
    
    const interval = setInterval(() => {
      progress += 10;
      
      if (progress <= 100) {
        setFiles(prev => 
          prev.map(file => 
            file.id === fileId 
              ? { 
                  ...file, 
                  progress, 
                  status: progress < 100 ? "uploading" : "processing" 
                }
              : file
          )
        );
      } else {
        clearInterval(interval);
        
        // After upload, simulate OCR processing
        setTimeout(() => {
          setFiles(prev => 
            prev.map(file => 
              file.id === fileId 
                ? { ...file, status: "complete" }
                : file
            )
          );
        }, 1500);
      }
    }, 300);
  };

  const handleCameraCapture = () => {
    // In a real app, this would open the camera
    console.log("Camera capture requested");
    
    // Simulate a captured document
    const capturedFile = {
      id: Math.random().toString(36).substring(7),
      name: "Camera_Capture_" + new Date().toISOString().slice(0, 10) + ".jpg",
      progress: 0,
      status: "uploading" as const
    };
    
    setFiles(prev => [...prev, capturedFile]);
    simulateUploadProgress(capturedFile.id);
  };

  return (
    <div>
      <h2 className="text-2xl font-serif mb-4">Document Upload</h2>
      
      <p className="mb-6 text-gray-600">
        Please upload your insurance card, ID, and any relevant medical documents.
      </p>
      
      {/* Upload zone */}
      <div 
        className={`border-2 border-dashed rounded-lg p-8 mb-6 flex flex-col items-center justify-center cursor-pointer transition-all ${
          isDragging ? "border-primary bg-primary/5" : "border-primary/30"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById("file-input")?.click()}
      >
        <input 
          type="file" 
          id="file-input" 
          multiple 
          className="hidden" 
          onChange={handleFileInput}
          accept="image/*,.pdf"
        />
        
        <Upload size={40} className="text-primary mb-4" />
        <p className="text-center mb-2">Drag and drop files here or click to browse</p>
        <p className="text-sm text-gray-500">Supports images and PDF documents</p>
        
        <div className="mt-4 flex items-center">
          <Button 
            variant="outline" 
            onClick={(e) => {
              e.stopPropagation();
              handleCameraCapture();
            }}
            className="flex items-center gap-2"
          >
            <Camera size={16} />
            Capture with camera
          </Button>
        </div>
      </div>
      
      {/* Uploaded files list */}
      {files.length > 0 && (
        <div className="mb-6">
          <h3 className="font-medium mb-3">Uploaded Files</h3>
          <div className="space-y-3">
            {files.map(file => (
              <div key={file.id} className="border rounded-md p-3 flex items-center">
                <FileText className="text-primary mr-3" />
                <div className="flex-grow">
                  <p className="font-medium">{file.name}</p>
                  
                  {file.status === "uploading" && (
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                      <div 
                        className="bg-primary h-1.5 rounded-full" 
                        style={{ width: `${file.progress}%` }}
                      ></div>
                    </div>
                  )}
                  
                  {file.status === "processing" && (
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Loader size={12} className="animate-spin mr-1" />
                      OCR Processing...
                    </div>
                  )}
                  
                  {file.status === "complete" && (
                    <p className="text-sm text-green-600 mt-1">
                      Processed successfully
                    </p>
                  )}
                  
                  {file.status === "error" && (
                    <p className="text-sm text-red-600 mt-1">
                      Error processing file
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <Button 
        onClick={onComplete}
        disabled={!files.some(file => file.status === "complete")}
        className="bg-primary text-white rounded-xl"
      >
        Continue
      </Button>
    </div>
  );
};

export default UploadDocs;
