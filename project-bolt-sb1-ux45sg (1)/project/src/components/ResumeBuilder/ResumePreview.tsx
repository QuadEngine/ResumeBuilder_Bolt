import React from 'react';
import { Edit2, Download, RefreshCw } from 'lucide-react';

interface ResumePreviewProps {
  content: string;
  onEdit: () => void;
  onRegenerate: () => void;
  onApprove: () => void;
  isGenerating: boolean;
  format: string;
  template: string;
}

export default function ResumePreview({
  content,
  onEdit,
  onRegenerate,
  onApprove,
  isGenerating,
  format,
  template
}: ResumePreviewProps) {
  return (
    <div className="bg-white shadow-lg">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Resume Preview</h2>
            <p className="mt-1 text-sm text-gray-600">
              Format: <span className="font-medium">{format}</span> | 
              Template: <span className="font-medium">{template}</span>
            </p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={onEdit}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Edit
            </button>
            <button
              onClick={onRegenerate}
              disabled={isGenerating}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
              Regenerate
            </button>
            <button
              onClick={onApprove}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-8">
        {isGenerating ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: content }} 
          />
        )}
      </div>
    </div>
  );
}