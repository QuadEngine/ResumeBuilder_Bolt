import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Loader, FileType, X, File } from 'lucide-react';
import { SUPPORTED_FILE_TYPES, MAX_FILE_SIZE } from '../lib/constants';

interface ResumeUploaderProps {
  isProcessing: boolean;
  onUpload: (files: File[]) => Promise<void>;
}

export default function ResumeUploader({ isProcessing, onUpload }: ResumeUploaderProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    accept: SUPPORTED_FILE_TYPES,
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setUploadedFile(acceptedFiles[0]);
        await onUpload(acceptedFiles);
      }
    }
  });

  const handleNewUpload = (e: React.MouseEvent) => {
    e.stopPropagation();
    setUploadedFile(null);
  };

  if (uploadedFile && !isProcessing) {
    return (
      <div className="mb-8">
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <File className="h-6 w-6 text-indigo-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">{uploadedFile.name}</p>
                <p className="text-xs text-gray-500">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleNewUpload}
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                Upload new
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setUploadedFile(null);
                }}
                className="p-1 rounded-full hover:bg-gray-200"
                title="Remove file"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-500'}`}
      >
        <input {...getInputProps()} />
        {isProcessing ? (
          <div className="flex flex-col items-center">
            <Loader className="h-12 w-12 text-indigo-500 animate-spin" />
            <p className="mt-2 text-sm text-gray-600">Processing resume...</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center">
              {fileRejections.length > 0 ? (
                <>
                  <FileType className="h-12 w-12 text-red-400" />
                  <p className="mt-2 text-sm text-red-600">
                    Please upload a PDF or Word document (max 5MB)
                  </p>
                </>
              ) : (
                <>
                  <Upload className="h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    {isDragActive ? 'Drop your resume here...' : 'Drag and drop your resume, or click to select'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">PDF or Word document (max 5MB)</p>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}