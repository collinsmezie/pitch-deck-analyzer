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
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getFileTypeError = (file: File) => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    const mimeType = file.type;
    
    if (mimeType.startsWith('image/')) {
      return `Images are not supported. Please upload a PDF or PPTX file. (${file.name})`;
    } else if (mimeType.startsWith('video/')) {
      return `Video files are not supported. Please upload a PDF or PPTX file. (${file.name})`;
    } else if (mimeType.startsWith('audio/')) {
      return `Audio files are not supported. Please upload a PDF or PPTX file. (${file.name})`;
    } else if (extension === 'doc' || extension === 'docx') {
      return `Word documents are not supported. Please convert to PDF or PPTX. (${file.name})`;
    } else if (extension === 'txt') {
      return `Text files are not supported. Please upload a PDF or PPTX file. (${file.name})`;
    } else {
      return `File type not supported. Please upload a PDF or PPTX file. (${file.name})`;
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Validate file type on client side as well
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
    if (!allowedTypes.includes(file.type)) {
      console.log('📁 FileUpload: Invalid file type detected:', file.type, file.name);
      setError(getFileTypeError(file));
      return;
    }

    console.log('📁 FileUpload: File selected:', file.name, 'Size:', file.size, 'Type:', file.type);
    setUploadedFile(file);
    setUploadProgress(0);
    setIsProcessing(true); // Show loading immediately
    setError(null); // Clear any previous errors

    const formData = new FormData();
    formData.append('file', file);

    try {
      console.log('📁 FileUpload: Starting upload process...');
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log('📁 FileUpload: Upload successful, calling onFileUpload');
        setIsProcessing(false); // Clear processing state on success
        onFileUpload(file, result.analysis);
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.error || 'Upload failed. Please try again.';
        console.error('📁 FileUpload: Upload failed:', errorMessage);
        console.log('📁 FileUpload: Setting error state:', errorMessage);
        setError(errorMessage);
        setIsProcessing(false); // Clear loading on error
      }
    } catch (error) {
      console.error('📁 FileUpload: Network error:', error);
      const networkError = 'Network error. Please check your connection and try again.';
      console.log('📁 FileUpload: Setting network error state:', networkError);
      setError(networkError);
      setIsProcessing(false); // Clear loading on error
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx']
    },
    multiple: false,
    onDropRejected: (rejectedFiles) => {
      console.log('📁 FileUpload: File rejected:', rejectedFiles);
      const rejection = rejectedFiles[0];
      if (rejection) {
        console.log('📁 FileUpload: Setting rejection error for file:', rejection.file.name);
        setError(getFileTypeError(rejection.file));
      }
    }
  });

  const removeFile = () => {
    setUploadedFile(null);
    setUploadProgress(0);
    setError(null);
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
                    Supports PDF and PPTX files only
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Images, Word docs, and other formats are not supported
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
                  disabled={isUploading || isProcessing}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {(isUploading || isProcessing) && (
                <div className="space-y-2">
                  <div className="flex items-center justify-center space-x-2">
                    <Hourglass className="h-4 w-4 animate-spin text-gray-500" />
                    <span className="text-sm">
                      {isProcessing && !isUploading ? 'Processing file...' : 'Analyzing your pitch deck...'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  {isProcessing && !isUploading && (
                    <p className="text-xs text-gray-500 text-center">
                      Preparing your pitch deck for analysis...
                    </p>
                  )}
                </div>
              )}

              {error && (
                <div className="space-y-2">
                  <div className="flex items-center justify-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">!</span>
                    </div>
                    <span className="text-sm text-red-700 font-medium">Upload Failed</span>
                  </div>
                  <p className="text-sm text-red-600 text-center">{error}</p>
                  <div className="flex justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={removeFile}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      Try Again
                    </Button>
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