import React, { useState } from 'react';
import { ViewState } from '../types';
import { Icons } from '../components/Icons';
import { Button } from '../components/Button';
import { AdminDashboard } from './AdminDashboard';

interface AdminLoginProps {
  setView: (view: ViewState) => void;
  onLoginSuccess: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ setView, onLoginSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  const handleLogin = async () => {
    console.log('Login button clicked');
    console.log('Entered password:', password);

    setIsLoading(true);
    setError('');

    // For this implementation, we'll use a password from environment variable or localStorage
    // In a real app, you would validate against a secure backend
    // In production, use proper authentication with JWT or session tokens

    // First check environment variable, then localStorage, then default
    const envPassword = import.meta.env.VITE_ADMIN_PASSWORD;
    const storedPassword = localStorage.getItem('adminPassword');
    const adminPassword = envPassword || storedPassword || 'admin123'; // Priority: env > localstorage > default

    console.log('Environment password:', envPassword ? 'SET' : 'NOT SET');
    console.log('Stored password:', storedPassword ? 'SET' : 'NOT SET');
    console.log('Final admin password (first 3 chars):', adminPassword ? adminPassword.substring(0, 3) + '...' : 'NOT SET');
    console.log('Password match:', password === adminPassword);

    if (password === adminPassword) {
      console.log('Password correct, setting localStorage and showing dashboard');
      localStorage.setItem('adminLoggedIn', 'true');
      setShowDashboard(true); // Directly show dashboard without going through App.tsx
      setIsLoading(false);
    } else {
      console.error('Password incorrect');
      setError('Invalid admin password');
      setIsLoading(false);
    }
  };

  // If dashboard should be shown, render it directly
  if (showDashboard) {
    return <AdminDashboard setView={setView} />;
  }

  const handleBack = () => {
    setView(ViewState.HOME);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-blue-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 border border-slate-200 dark:border-slate-800">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icons.Lock size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Access</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Enter the admin password to access dashboard
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 px-4 py-3 rounded-xl text-sm flex items-center border border-red-100 dark:border-red-800 mb-4">
            <span className="mr-2">⚠️</span> {error}
          </div>
        )}

        <div>
          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-900/10 dark:focus:ring-blue-500/20 focus:border-blue-900 dark:focus:border-blue-500 outline-none transition-all text-slate-900 dark:text-white"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button
            fullWidth
            size="lg"
            onClick={handleLogin}
            isLoading={isLoading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold shadow-lg"
          >
            <Icons.Lock className="mr-2" size={18} />
            Access Dashboard
          </Button>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={handleBack}
            className="flex items-center text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
          >
            <Icons.Back size={16} className="mr-2" />
            Back to Home
          </button>
        </div>

      </div>
    </div>
  );
};