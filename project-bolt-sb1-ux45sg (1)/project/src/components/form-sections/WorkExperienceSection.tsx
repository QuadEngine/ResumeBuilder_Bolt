import React from 'react';
import { FormField } from '../common';
import { UseFormRegister, FieldErrors, UseFieldArrayReturn } from 'react-hook-form';
import { ProfileData } from '../../types/profile';
import { Plus, Trash2 } from 'lucide-react';

type Props = {
  register: UseFormRegister<ProfileData>;
  errors: FieldErrors<ProfileData>;
  rolesArray: UseFieldArrayReturn<ProfileData, 'relevant_roles'>;
};

export default function WorkExperienceSection({ register, errors, rolesArray }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Work Experience</h3>
      {rolesArray.fields.map((field, index) => (
        <div key={field.id} className="mb-6 p-4 border rounded-lg">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              label="Company Name"
              name={`relevant_roles.${index}.companyName`}
              register={register}
              error={errors.relevant_roles?.[index]?.companyName}
            />
            <FormField
              label="Job Title"
              name={`relevant_roles.${index}.jobTitle`}
              register={register}
              error={errors.relevant_roles?.[index]?.jobTitle}
            />
            <FormField
              label="Start Date"
              name={`relevant_roles.${index}.startDate`}
              register={register}
              error={errors.relevant_roles?.[index]?.startDate}
            />
            <FormField
              label="End Date"
              name={`relevant_roles.${index}.endDate`}
              register={register}
              error={errors.relevant_roles?.[index]?.endDate}
            />
            <div className="sm:col-span-2">
              <FormField
                label="Description"
                name={`relevant_roles.${index}.description`}
                register={register}
                error={errors.relevant_roles?.[index]?.description}
                type="textarea"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={() => rolesArray.remove(index)}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => rolesArray.append({
          companyName: '',
          jobTitle: '',
          startDate: '',
          endDate: '',
          description: ''
        })}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Work Experience
      </button>
    </div>
  );
}