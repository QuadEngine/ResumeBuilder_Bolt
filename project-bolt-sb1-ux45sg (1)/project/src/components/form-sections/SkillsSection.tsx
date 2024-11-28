import React from 'react';
import { FormField } from '../common';
import { UseFormRegister, FieldErrors, UseFieldArrayReturn } from 'react-hook-form';
import { ProfileData } from '../../types/profile';
import { Plus, Trash2 } from 'lucide-react';

type Props = {
  register: UseFormRegister<ProfileData>;
  errors: FieldErrors<ProfileData>;
  skillsArray: UseFieldArrayReturn<ProfileData, 'top_skills'>;
  achievementsArray: UseFieldArrayReturn<ProfileData, 'achievements'>;
  certificationsArray: UseFieldArrayReturn<ProfileData, 'certifications'>;
};

export default function SkillsSection({
  register,
  errors,
  skillsArray,
  achievementsArray,
  certificationsArray
}: Props) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Skills and Achievements</h3>
      
      {/* Skills */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-gray-700 mb-2">Skills</h4>
        {skillsArray.fields.map((field, index) => (
          <div key={field.id} className="flex items-center space-x-2 mb-2">
            <FormField
              label=""
              name={`top_skills.${index}`}
              register={register}
              error={errors.top_skills?.[index]}
            />
            <button
              type="button"
              onClick={() => skillsArray.remove(index)}
              className="p-2"
            >
              <Trash2 className="h-5 w-5 text-red-500" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => skillsArray.append('')}
          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Skill
        </button>
      </div>

      {/* Achievements */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-gray-700 mb-2">Achievements</h4>
        {achievementsArray.fields.map((field, index) => (
          <div key={field.id} className="flex items-center space-x-2 mb-2">
            <div className="flex-grow">
              <FormField
                label=""
                name={`achievements.${index}`}
                register={register}
                error={errors.achievements?.[index]}
                type="textarea"
                rows={4}
              />
            </div>
            <button
              type="button"
              onClick={() => achievementsArray.remove(index)}
              className="p-2 self-start"
            >
              <Trash2 className="h-5 w-5 text-red-500" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => achievementsArray.append('')}
          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Achievement
        </button>
      </div>

      {/* Certifications */}
      <div>
        <h4 className="text-md font-medium text-gray-700 mb-2">Certifications</h4>
        {certificationsArray.fields.map((field, index) => (
          <div key={field.id} className="flex items-center space-x-2 mb-2">
            <FormField
              label=""
              name={`certifications.${index}`}
              register={register}
              error={errors.certifications?.[index]}
            />
            <button
              type="button"
              onClick={() => certificationsArray.remove(index)}
              className="p-2"
            >
              <Trash2 className="h-5 w-5 text-red-500" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => certificationsArray.append('')}
          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Certification
        </button>
      </div>
    </div>
  );
}