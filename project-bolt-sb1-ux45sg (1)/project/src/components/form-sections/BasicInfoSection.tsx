import React, { useState } from 'react';
import { FormField } from '../common';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { ProfileData } from '../../types/profile';
import { Upload, X } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../lib/firebase';
import toast from 'react-hot-toast';

type Props = {
  register: UseFormRegister<ProfileData>;
  errors: FieldErrors<ProfileData>;
  userId: string;
  photoURL?: string;
  onPhotoChange: (url: string) => void;
};

const SENIORITY_LEVELS = ['Junior', 'Senior', 'Lead', 'Manager', 'Leadership'];

export default function BasicInfoSection({ 
  register, 
  errors, 
  userId,
  photoURL,
  onPhotoChange 
}: Props) {
  const [isUploading, setIsUploading] = useState(false);

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setIsUploading(true);
    try {
      const storageRef = ref(storage, `profile-photos/${userId}/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      onPhotoChange(url);
      toast.success('Photo uploaded successfully');
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error('Failed to upload photo');
    } finally {
      setIsUploading(false);
    }
  };

  const removePhoto = () => {
    onPhotoChange('');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
      
      {/* Photo Upload */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
        <div className="flex items-center space-x-4">
          {photoURL ? (
            <div className="relative">
              <img
                src={photoURL}
                alt="Profile"
                className="h-24 w-24 rounded-full object-cover"
              />
              <button
                type="button"
                onClick={removePhoto}
                className="absolute -top-2 -right-2 p-1 bg-red-100 rounded-full text-red-600 hover:bg-red-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                className={`flex flex-col items-center justify-center h-24 w-24 rounded-full border-2 border-dashed border-gray-300 cursor-pointer hover:border-indigo-500 ${
                  isUploading ? 'opacity-50' : ''
                }`}
              >
                <Upload className="h-6 w-6 text-gray-400" />
                <span className="mt-1 text-xs text-gray-500">Upload</span>
              </label>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FormField
          label="Full Name"
          name="name"
          register={register}
          error={errors.name}
          required
        />
        <FormField
          label="Email"
          name="email"
          type="email"
          register={register}
          error={errors.email}
          required
        />
        <FormField
          label="Phone"
          name="phone"
          type="tel"
          register={register}
          error={errors.phone}
          required
        />
        <FormField
          label="LinkedIn Profile"
          name="linkedin"
          register={register}
          error={errors.linkedin}
        />
        <FormField
          label="Portfolio Website"
          name="portfolio"
          register={register}
          error={errors.portfolio}
        />
        <div>
          <label className="block text-sm font-medium text-gray-700">Experience Level</label>
          <select
            {...register('seniority')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            {SENIORITY_LEVELS.map((level) => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>
        <FormField
          label="Years of Experience"
          name="experience_years"
          type="number"
          register={register}
          error={errors.experience_years}
        />
      </div>
    </div>
  );
}