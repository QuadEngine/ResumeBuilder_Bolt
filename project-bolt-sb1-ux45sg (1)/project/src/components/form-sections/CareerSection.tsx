import React from 'react';
import { FormField } from '../common';
import { UseFormRegister, FieldErrors, UseFieldArrayReturn } from 'react-hook-form';
import { ProfileData } from '../../types/profile';
import { Plus, Trash2 } from 'lucide-react';

type Props = {
  register: UseFormRegister<ProfileData>;
  errors: FieldErrors<ProfileData>;
  targetRolesArray: UseFieldArrayReturn<ProfileData, 'target_roles'>;
  industriesArray: UseFieldArrayReturn<ProfileData, 'industries'>;
};

export default function CareerSection({ 
  register, 
  errors,
  targetRolesArray,
  industriesArray
}: Props) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Career Preferences</h3>
      
      {/* About & Career Objective */}
      <div className="space-y-6 mb-6">
        <FormField
          label="About Me"
          name="about"
          register={register}
          error={errors.about}
          type="textarea"
          rows={4}
          required
        />
        <FormField
          label="Career Objective"
          name="careerObjective"
          register={register}
          error={errors.careerObjective}
          type="textarea"
          rows={4}
          required
        />
      </div>
      
      {/* Target Roles */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-gray-700 mb-2">Target Roles</h4>
        {targetRolesArray.fields.map((field, index) => (
          <div key={field.id} className="flex items-center space-x-2 mb-2">
            <FormField
              label=""
              name={`target_roles.${index}`}
              register={register}
              error={errors.target_roles?.[index]}
            />
            <button
              type="button"
              onClick={() => targetRolesArray.remove(index)}
              className="p-2"
            >
              <Trash2 className="h-5 w-5 text-red-500" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => targetRolesArray.append('')}
          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Target Role
        </button>
      </div>

      {/* Industries */}
      <div>
        <h4 className="text-md font-medium text-gray-700 mb-2">Industries of Interest</h4>
        {industriesArray.fields.map((field, index) => (
          <div key={field.id} className="flex items-center space-x-2 mb-2">
            <FormField
              label=""
              name={`industries.${index}`}
              register={register}
              error={errors.industries?.[index]}
            />
            <button
              type="button"
              onClick={() => industriesArray.remove(index)}
              className="p-2"
            >
              <Trash2 className="h-5 w-5 text-red-500" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => industriesArray.append('')}
          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Industry
        </button>
      </div>
    </div>
  );
}