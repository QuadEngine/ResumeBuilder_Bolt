import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { generateResume } from '../../lib/resumeGenerator';
import ResumeTemplates from './ResumeTemplates';
import ResumePreview from './ResumePreview';
import ResumeEditor from './ResumeEditor';
import toast from 'react-hot-toast';
import { ProfileData } from '../../types/profile';

interface ResumeBuilderProps {
  userId: string;
}

export default function ResumeBuilder({ userId }: ResumeBuilderProps) {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [resumeContent, setResumeContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [format, setFormat] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const docRef = doc(db, 'profiles', userId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data() as ProfileData;
          setProfileData(data);
          setSelectedTemplate(data.template || '');
          setFormat(data.preferred_format || '');
          
          if (data.optimized_resume) {
            setResumeContent(data.optimized_resume);
          }
        } else {
          toast.error('Please complete your profile first');
        }
      } catch (error) {
        toast.error('Failed to load profile');
      }
    };

    loadProfile();
  }, [userId]);

  const handleTemplateSelect = async (templateId: string) => {
    setSelectedTemplate(templateId);
    await generateResumeContent(templateId);
  };

  const generateResumeContent = async (templateId: string, isRegeneration = false) => {
    if (!profileData) {
      toast.error('Profile data is required');
      return;
    }

    setIsGenerating(true);
    try {
      const content = await generateResume(profileData, templateId, isRegeneration);
      setResumeContent(content);
      toast.success(isRegeneration ? 'Resume regenerated!' : 'Resume template applied!');
    } catch (error) {
      toast.error('Failed to generate resume');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = async (editedContent: string) => {
    setResumeContent(editedContent);
    setIsEditing(false);
    toast.success('Changes saved successfully');
  };

  const handleRegenerate = () => {
    generateResumeContent(selectedTemplate, true);
  };

  const handleApprove = async () => {
    try {
      // Implement PDF generation and download
      toast.success('Resume approved! Download starting...');
    } catch (error) {
      toast.error('Failed to download resume');
    }
  };

  if (!profileData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        <ResumeTemplates
          selectedTemplate={selectedTemplate}
          onTemplateSelect={handleTemplateSelect}
          format={format}
        />
        
        {resumeContent && (
          <ResumePreview
            content={resumeContent}
            onEdit={handleEdit}
            onRegenerate={handleRegenerate}
            onApprove={handleApprove}
            isGenerating={isGenerating}
            format={format}
            template={selectedTemplate}
          />
        )}
        
        {isEditing && (
          <ResumeEditor
            content={resumeContent}
            onSave={handleSaveEdit}
            onCancel={() => setIsEditing(false)}
          />
        )}
      </div>
    </div>
  );
}