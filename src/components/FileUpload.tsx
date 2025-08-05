'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, Hourglass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Analysis } from '@/types';

interface FileUploadProps {
  onFileUpload: (file: File, analysis: Analysis) => void;
  isUploading: boolean;
}

export default function FileUpload({ onFileUpload, isUploading }: FileUploadProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploadedFile(file);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        onFileUpload(file, result.analysis);
      } else {
        const error = await response.json();
        alert(`Upload failed: ${error.error}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx']
    },
    multiple: false
  });

  const removeFile = () => {
    setUploadedFile(null);
    setUploadProgress(0);
  };

  return (
    <div className="w-[800px] h-[600px] bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col overflow-hidden relative z-10" style={{ backgroundColor: '#ffffff' }}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 flex-shrink-0">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Upload Your Pitch Deck</h2>
          <p className="text-sm text-gray-600">
            Upload your PDF or PPTX file to get your investor readiness score
          </p>
        </div>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        <div className="space-y-6">
          {!uploadedFile ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive 
                  ? 'border-blue-400 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              {isDragActive ? (
                <p className="text-sm">Drop your pitch deck here...</p>
              ) : (
                <div>
                  <p className="text-sm mb-2">
                    Drag and drop your pitch deck here, or click to browse
                  </p>
                  <p className="text-xs text-gray-500">
                    Supports PDF and PPTX files
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <File className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">{uploadedFile.name}</p>
                    <p className="text-xs text-gray-500">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={removeFile}
                  disabled={isUploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-center space-x-2">
                    <Hourglass className="h-4 w-4 animate-spin text-blue-500" />
                    <span className="text-sm">Analyzing your pitch deck...</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Features Overview - Fixed at bottom */}
      <div className="p-6 border-t border-gray-200 flex-shrink-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center flex flex-col items-center justify-center min-h-[80px]">
            <div className="h-8 w-8 mx-auto mb-2 text-blue-600 flex items-center justify-center">
              <Upload className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm mb-1">Upload & Analyze</h3>
            <p className="text-xs text-gray-600">Upload your PDF or PPTX pitch deck for instant analysis</p>
          </div>
          <div className="text-center flex flex-col items-center justify-center min-h-[80px]">
            <div className="h-8 w-8 mx-auto mb-2 text-green-600 flex items-center justify-center">
              <span className="text-lg font-bold">5.0</span>
            </div>
            <h3 className="font-bold text-sm mb-1">Get Your Score</h3>
            <p className="text-xs text-gray-600">Receive a detailed investor readiness score out of 5.0</p>
          </div>
          <div className="text-center flex flex-col items-center justify-center min-h-[80px]">
            <div className="h-8 w-8 mx-auto mb-2 text-purple-600 flex items-center justify-center">
              <span className="text-lg">💬</span>
            </div>
            <h3 className="font-bold text-sm mb-1">Ask Questions</h3>
            <p className="text-xs text-gray-600">Chat with AI to get personalized improvement advice</p>
          </div>
        </div>
      </div>
    </div>
  );
} 