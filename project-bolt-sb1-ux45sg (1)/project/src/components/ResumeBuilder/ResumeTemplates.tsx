import React from 'react';
import { Check } from 'lucide-react';
import { RESUME_TEMPLATES } from '../../lib/templates';
import { modernTemplate } from '../../lib/templates/modern';
import { classicTemplate } from '../../lib/templates/classic';
import { creativeTemplate } from '../../lib/templates/creative';
import { executiveTemplate } from '../../lib/templates/executive';

const templates = [
  {
    id: 'modern',
    name: 'Modern Professional',
    description: 'Clean and contemporary design with a focus on readability',
    template: modernTemplate
  },
  {
    id: 'classic',
    name: 'Classic Traditional',
    description: 'Traditional layout perfect for corporate positions',
    template: classicTemplate
  },
  {
    id: 'creative',
    name: 'Creative Design',
    description: 'Unique design for creative industry professionals',
    template: creativeTemplate
  },
  {
    id: 'executive',
    name: 'Executive Leadership',
    description: 'Sophisticated design for senior positions',
    template: executiveTemplate
  }
];

interface ResumeTemplatesProps {
  selectedTemplate: string;
  onTemplateSelect: (templateId: string) => void;
  format: string;
}

export default function ResumeTemplates({ selectedTemplate, onTemplateSelect, format }: ResumeTemplatesProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Choose Your Resume Template</h2>
        <p className="mt-2 text-gray-600">Selected format: <span className="font-medium">{format}</span></p>
      </div>
      
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`relative cursor-pointer rounded-lg border-2 transition-all overflow-hidden
              ${selectedTemplate === template.id 
                ? 'border-indigo-500 ring-2 ring-indigo-500' 
                : 'border-gray-200 hover:border-indigo-200'}`}
            onClick={() => onTemplateSelect(template.id)}
          >
            <div className="p-4 bg-gray-50 border-b">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium text-gray-900">{template.name}</h3>
                {selectedTemplate === template.id && (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500">{template.description}</p>
            </div>
            
            <div className="relative h-[400px] overflow-y-auto p-4 bg-white">
              <div 
                className="transform scale-[0.4] origin-top"
                dangerouslySetInnerHTML={{ __html: template.template }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}