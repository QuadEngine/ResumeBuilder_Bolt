import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function ConfigWarning() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center text-amber-500 mb-4">
          <AlertTriangle size={48} />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">Configuration Required</h2>
        <p className="text-gray-600 text-center mb-6">
          Please set up your Firebase configuration in the <code className="bg-gray-100 px-2 py-1 rounded">.env</code> file 
          with your Firebase project credentials.
        </p>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500 mb-2">Required environment variables:</p>
          <ul className="list-disc list-inside text-sm text-gray-500 space-y-1">
            <li>VITE_FIREBASE_API_KEY</li>
            <li>VITE_FIREBASE_AUTH_DOMAIN</li>
            <li>VITE_FIREBASE_PROJECT_ID</li>
            <li>VITE_FIREBASE_STORAGE_BUCKET</li>
            <li>VITE_FIREBASE_MESSAGING_SENDER_ID</li>
            <li>VITE_FIREBASE_APP_ID</li>
          </ul>
        </div>
      </div>
    </div>
  );
}