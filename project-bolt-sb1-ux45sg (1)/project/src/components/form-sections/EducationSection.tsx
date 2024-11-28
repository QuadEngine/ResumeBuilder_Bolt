import React from 'react';
import { FormField } from '../common';
import { UseFormRegister, FieldErrors, UseFieldArrayReturn } from 'react-hook-form';
import { ProfileData } from '../../types/profile';
import { Plus, Trash2 } from 'lucide-react';

type Props = {
  register: UseFormRegister<ProfileData>;
  errors: FieldErrors<ProfileData>;
  educationArray: UseFieldArrayReturn<ProfileData, 'education'>;
};

export default function EducationSection({ register, errors, educationArray }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Education</h3>
      {educationArray.fields.map((field, index) => (
        <div key={field.id} className="mb-6 p-4 border rounded-lg">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              label="Degree"
              name={`education.${index}.degree`}
              register={register}
              error={errors.education?.[index]?.degree}
              required
            />
            <FormField
              label="Field of Study"
              name={`education.${index}.field`}
              register={register}
              error={errors.education?.[index]?.field}
              required
            />
            <FormField
              label="Institution"
              name={`education.${index}.institution`}
              register={register}
              error={errors.education?.[index]?.institution}
              required
            />
            <FormField
              label="Graduation Year"
              name={`education.${index}.graduationYear`}
              type="number"
              register={register}
              error={errors.education?.[index]?.graduationYear}
              required
            />
            <FormField
              label="Grade/GPA"
              name={`education.${index}.grade`}
              register={register}
              error={errors.education?.[index]?.grade}
            />
          </div>
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={() => educationArray.remove(index)}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => educationArray.append({
          degree: '',
          field: '',
          institution: '',
          graduationYear: new Date().getFullYear(),
          grade: ''
        })}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Education
      </button>
    </div>
  );
}