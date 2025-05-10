
import React, { useState } from "react";
import { Upload, FileText, Check } from "lucide-react";

interface UploadDocsProps {
  onComplete: () => void;
}

const UploadDocs: React.FC<UploadDocsProps> = ({ onComplete }) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
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

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (files: File[]) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    const validFiles = files.filter(file => allowedTypes.includes(file.type));
    setUploadedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-2xl font-serif font-bold mb-4">
        Please upload your documents
      </h2>
      
      <p className="mb-6 text-gray-700">
        To complete your registration, please upload your insurance card and any medical referrals.
      </p>

      {/* Upload area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 mb-6 flex flex-col items-center justify-center cursor-pointer ${
          isDragging ? "border-primary bg-primary/5" : "border-gray-300"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById("fileInput")?.click()}
      >
        <Upload className="h-12 w-12 text-gray-400 mb-4" />
        <p className="text-lg font-medium mb-1">
          Drag files here or click to browse
        </p>
        <p className="text-sm text-gray-500">
          Supports PDF, JPG and PNG (max. 10MB)
        </p>
        <input
          id="fileInput"
          type="file"
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileChange}
          multiple
        />
      </div>

      {/* Uploaded files list */}
      {uploadedFiles.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-medium mb-2">Uploaded Files</h3>
          {uploadedFiles.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center justify-between py-2 border-b last:border-0"
            >
              <div className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-gray-500" />
                <span className="text-sm">{file.name}</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="text-red-500 text-sm hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-end mt-auto">
      </div>
    </div>
  );
};

export default UploadDocs;
