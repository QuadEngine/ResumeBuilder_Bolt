import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { auth } from '../lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, AuthError } from 'firebase/auth';
import { Mail, Lock, Loader, LogIn } from 'lucide-react';

type FormData = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string>('');
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const handleAuthError = (error: AuthError) => {
    switch (error.code) {
      case 'auth/invalid-credential':
        setAuthError('Invalid email or password. New user? Click "Need an account? Sign up" below.');
        break;
      case 'auth/user-not-found':
        setIsLogin(false);
        setAuthError('No account found with this email. Please sign up for a new account.');
        break;
      case 'auth/wrong-password':
        setAuthError('Incorrect password. Please try again or reset your password.');
        break;
      case 'auth/email-already-in-use':
        setIsLogin(true);
        setAuthError('An account already exists with this email. Please sign in instead.');
        break;
      case 'auth/weak-password':
        setAuthError('Password should be at least 6 characters long.');
        break;
      case 'auth/invalid-email':
        setAuthError('Please enter a valid email address.');
        break;
      case 'auth/network-request-failed':
        setAuthError('Network error. Please check your internet connection.');
        break;
      default:
        setAuthError('Authentication failed. Please try again.');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setAuthError('');
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      if (error instanceof Error) {
        setAuthError('Failed to sign in with Google: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setAuthError('');
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, data.email, data.password);
        if (data.rememberMe) {
          auth.setPersistence('local');
        }
      } else {
        await createUserWithEmailAndPassword(auth, data.email, data.password);
      }
    } catch (error) {
      if (error instanceof Error) {
        handleAuthError(error as AuthError);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            {isLogin ? 'Welcome back' : 'Create account'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isLogin ? 'Sign in to your account' : 'Start optimizing your resume'}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  type="email"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  type="password"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Password"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
              {authError && (
                <p className="mt-2 text-sm text-red-600 font-medium">{authError}</p>
              )}
            </div>

            {isLogin && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    {...register('rememberMe')}
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? (
                <Loader className="animate-spin h-5 w-5" />
              ) : (
                <>
                  <LogIn className="h-5 w-5 mr-2" />
                  {isLogin ? 'Sign in' : 'Create account'}
                </>
              )}
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="h-5 w-5 mr-2" />
            Continue with Google
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setAuthError('');
              }}
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}