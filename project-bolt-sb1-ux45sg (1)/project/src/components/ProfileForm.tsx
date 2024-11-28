import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Save, ArrowRight } from 'lucide-react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../lib';
import { processResume } from '../lib/services';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ResumeUploader from './ResumeUploader';
import {
  BasicInfoSection,
  CareerSection,
  EducationSection,
  SkillsSection,
  WorkExperienceSection,
  ResumePreferencesSection
} from './form-sections';
import type { ProfileData } from '../types/profile';

export default function ProfileForm({ userId }: { userId: string }) {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [photoURL, setPhotoURL] = useState<string>('');
  const [initialData, setInitialData] = useState<ProfileData | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  
  const { register, control, handleSubmit, setValue, reset, watch, formState: { errors } } = useForm<ProfileData>({
    defaultValues: {
      education: [],
      relevant_roles: [],
      top_skills: [],
      achievements: [],
      certifications: [],
      target_roles: [],
      industries: []
    }
  });

  // Watch all form fields for changes
  const formValues = watch();

  useEffect(() => {
    if (initialData) {
      const hasChanges = JSON.stringify(formValues) !== JSON.stringify(initialData);
      setIsDirty(hasChanges);
    }
  }, [formValues, initialData]);

  // Field arrays for dynamic sections
  const educationArray = useFieldArray({ control, name: 'education' });
  const rolesArray = useFieldArray({ control, name: 'relevant_roles' });
  const skillsArray = useFieldArray({ control, name: 'top_skills' });
  const achievementsArray = useFieldArray({ control, name: 'achievements' });
  const certificationsArray = useFieldArray({ control, name: 'certifications' });
  const targetRolesArray = useFieldArray({ control, name: 'target_roles' });
  const industriesArray = useFieldArray({ control, name: 'industries' });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const docRef = doc(db, 'profiles', userId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data() as ProfileData;
          reset(data);
          setInitialData(data);
          if (data.photoURL) {
            setPhotoURL(data.photoURL);
          }
        }
      } catch (error) {
        toast.error('Failed to load profile');
      }
    };

    loadProfile();
  }, [userId, reset]);

  const handleResumeUpload = async (files: File[]) => {
    if (files.length === 0) return;
    
    setIsProcessing(true);
    try {
      const { parsedData } = await processResume(files[0], userId);
      
      if (parsedData) {
        console.log('Setting form values with parsed data:', parsedData);
        
        // Set basic fields
        setValue('name', parsedData.fullName);
        setValue('email', parsedData.email);
        setValue('phone', parsedData.phone);
        setValue('about', parsedData.summary);
        
        // Set arrays
        skillsArray.replace(parsedData.skills || []);
        
        // Map experience to relevant roles
        if (parsedData.experience) {
          const roles = parsedData.experience.map(exp => ({
            companyName: exp.company,
            jobTitle: exp.position,
            startDate: exp.startDate,
            endDate: exp.endDate,
            description: exp.description
          }));
          rolesArray.replace(roles);
        }
        
        // Map education
        if (parsedData.education) {
          const education = parsedData.education.map(edu => ({
            degree: edu.degree,
            institution: edu.institution,
            graduationYear: edu.graduationYear,
            field: edu.field
          }));
          educationArray.replace(education);
        }
      }
      
      toast.success('Resume processed successfully!');
    } catch (error) {
      console.error('Resume processing error:', error);
      toast.error('Failed to process resume');
    } finally {
      setIsProcessing(false);
    }
  };

  const onSubmit = async (data: ProfileData) => {
    try {
      const docRef = doc(db, 'profiles', userId);
      await setDoc(docRef, {
        ...data,
        photoURL,
        userId,
        last_updated: new Date().toISOString()
      });
      setInitialData(data);
      toast.success(isDirty ? 'Profile updated successfully!' : 'Profile saved successfully!');
      navigate('/resume-builder');
    } catch (error) {
      toast.error('Failed to save profile');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Your Resume</h3>
          <ResumeUploader isProcessing={isProcessing} onUpload={handleResumeUpload} />
        </div>

        <BasicInfoSection
          register={register}
          errors={errors}
          userId={userId}
          photoURL={photoURL}
          onPhotoChange={setPhotoURL}
        />

        <CareerSection
          register={register}
          errors={errors}
          targetRolesArray={targetRolesArray}
          industriesArray={industriesArray}
        />

        <EducationSection
          register={register}
          errors={errors}
          educationArray={educationArray}
        />

        <WorkExperienceSection
          register={register}
          errors={errors}
          rolesArray={rolesArray}
        />

        <SkillsSection
          register={register}
          errors={errors}
          skillsArray={skillsArray}
          achievementsArray={achievementsArray}
          certificationsArray={certificationsArray}
        />

        <ResumePreferencesSection
          register={register}
          errors={errors}
        />

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isDirty ? (
              <>
                <Save className="h-4 w-4 mr-2" />
                Update Profile
              </>
            ) : (
              <>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}