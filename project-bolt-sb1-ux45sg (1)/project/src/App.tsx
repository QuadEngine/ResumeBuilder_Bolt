import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AuthForm from './components/AuthForm';
import ProfileForm from './components/ProfileForm';
import ResumeBuilder from './components/ResumeBuilder';
import ConfigWarning from './components/ConfigWarning';
import Navbar from './components/Navbar';
import { auth, isConfigured } from './lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

function App() {
  const [user, loading] = useAuthState(auth);

  if (!isConfigured) {
    return <ConfigWarning />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {user && <Navbar />}
        <Toaster position="top-right" />
        <Routes>
          <Route 
            path="/" 
            element={user ? <ProfileForm userId={user.uid} /> : <AuthForm />} 
          />
          <Route 
            path="/resume-builder" 
            element={
              user ? (
                <ResumeBuilder userId={user.uid} />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          <Route 
            path="*" 
            element={<Navigate to="/" replace />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;