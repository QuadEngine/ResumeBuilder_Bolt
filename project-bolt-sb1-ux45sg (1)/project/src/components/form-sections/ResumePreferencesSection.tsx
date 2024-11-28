import React from 'react';
import { FormField } from '../common';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { ProfileData } from '../../types/profile';

type Props = {
  register: UseFormRegister<ProfileData>;
  errors: FieldErrors<ProfileData>;
};

const RESUME_FORMATS = ['Chronological', 'Functional', 'Hybrid'];
const RESUME_TEMPLATES = ['Modern', 'Classic', 'Creative', 'Professional'];

export default function ResumePreferencesSection({ register, errors }: Props) {
  return (
    <>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Resume Preferences</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Resume Format</label>
            <select
              {...register('preferred_format', { required: 'Please select a resume format' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Select a format</option>
              {RESUME_FORMATS.map((format) => (
                <option key={format} value={format}>{format}</option>
              ))}
            </select>
            {errors.preferred_format && (
              <p className="mt-1 text-sm text-red-600">{errors.preferred_format.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Template Style</label>
            <select
              {...register('template', { required: 'Please select a template style' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Select a template</option>
              {RESUME_TEMPLATES.map((template) => (
                <option key={template} value={template}>{template}</option>
              ))}
            </select>
            {errors.template && (
              <p className="mt-1 text-sm text-red-600">{errors.template.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Notes</h3>
        <FormField
          label="Notes"
          name="notes"
          register={register}
          error={errors.notes}
          type="textarea"
          rows={4}
        />
      </div>
    </>
  );
}