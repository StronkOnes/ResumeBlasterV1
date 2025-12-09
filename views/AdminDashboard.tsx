import React, { useState, useEffect } from 'react';
import { ViewState } from '../types';
import { Icons } from '../components/Icons';
import { Button } from '../components/Button';
import { supabase } from '../services/supabaseClient';

interface AdminDashboardMetrics {
  total_users: number;
  total_resumes: number;
  resumes_today: number;
  resumes_this_week: number;
  resumes_this_month: number;
  active_users_today: number;
  most_used_template: string | null;
  most_used_mode: string | null;
  avg_resumes_per_user: number;
}

export const AdminDashboard: React.FC<{ setView: (view: ViewState) => void }> = ({ setView }) => {
  const [metrics, setMetrics] = useState<AdminDashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .rpc('get_comprehensive_admin_metrics');

      if (error) {
        console.error('Error fetching admin metrics:', error);
        setError('Failed to fetch metrics: ' + error.message);
        return;
      }

      if (data && data.length > 0) {
        setMetrics(data[0]);
      }
    } catch (err) {
      console.error('Error fetching admin metrics:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if user is logged in as admin
    if (!localStorage.getItem('adminLoggedIn')) {
      setView(ViewState.HOME);
      return;
    }

    fetchMetrics();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    setView(ViewState.HOME);
  };

  const handleRefresh = () => {
    fetchMetrics();
  };

  if (!localStorage.getItem('adminLoggedIn')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-blue-900 p-4">
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 max-w-md w-full border border-slate-200 dark:border-slate-800">
          <div className="text-center">
            <Icons.Lock className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Access Denied</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              You must be logged in as admin to access this page.
            </p>
            <Button
              onClick={() => setView(ViewState.HOME)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Return to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const StatCard: React.FC<{ 
    title: string, 
    value: string | number, 
    icon: React.ReactNode,
    subtitle?: string
  }> = ({ title, value, icon, subtitle }) => (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</h3>
          {subtitle && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{subtitle}</p>}
        </div>
        <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
            <p className="text-slate-500 dark:text-slate-400">
              Monitor platform usage and performance metrics
            </p>
          </div>
          <div className="flex space-x-3">
            <div className="relative group">
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center"
              >
                <Icons.Sparkles className="mr-2" size={18} />
                Refresh
              </Button>
            </div>
            <div className="relative group">
              <button
                onClick={() => {
                  const newPassword = prompt('Enter new admin password:');
                  if (newPassword !== null) { // User didn't cancel
                    if (newPassword.trim() !== '') {
                      localStorage.setItem('adminPassword', newPassword);
                      alert('Admin password updated successfully!');
                    } else {
                      alert('Password cannot be empty!');
                    }
                  }
                }}
                className="flex items-center px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
              >
                <Icons.Lock className="mr-2" size={18} />
                Change Password
              </button>
            </div>
            <div className="relative group">
              <Button
                variant="outline"
                onClick={handleLogout}
                className="flex items-center text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
              >
                <Icons.LogOut className="mr-2" size={18} />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 px-4 py-3 rounded-xl text-sm flex items-center border border-red-100 dark:border-red-800 mb-6">
            <span className="mr-2">⚠️</span> {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center">
              <Icons.Sparkles className="w-8 h-8 text-blue-600 animate-spin mb-3" />
              <p className="text-slate-600 dark:text-slate-400">Loading metrics...</p>
            </div>
          </div>
        ) : metrics ? (
          <div className="space-y-8">
            {/* Main Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <StatCard
                title="Total Users"
                value={metrics.total_users}
                icon={<Icons.User size={24} />}
              />
              <StatCard
                title="Total Resumes"
                value={metrics.total_resumes}
                icon={<Icons.FileText size={24} />}
              />
              <StatCard
                title="Today's Resumes"
                value={metrics.resumes_today}
                icon={<Icons.Clock size={24} />}
              />
              <StatCard
                title="Avg. Per User"
                value={metrics.avg_resumes_per_user?.toFixed(2)}
                icon={<Icons.Briefcase size={24} />}
              />
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                title="This Week"
                value={metrics.resumes_this_week}
                icon={<Icons.Zap size={24} />}
              />
              <StatCard
                title="This Month"
                value={metrics.resumes_this_month}
                icon={<Icons.Sparkles size={24} />}
              />
              <StatCard
                title="Active Today"
                value={metrics.active_users_today}
                icon={<Icons.Eye size={24} />}
              />
            </div>

            {/* Template and Mode Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Most Used Template</h3>
                <div className="flex items-center">
                  <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-full text-amber-600 dark:text-amber-400 mr-4">
                    <Icons.Briefcase size={24} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {metrics.most_used_template || 'N/A'}
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                      Most popular template choice
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Most Used Mode</h3>
                <div className="flex items-center">
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-full text-purple-600 dark:text-purple-400 mr-4">
                    <Icons.Shield size={24} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {metrics.most_used_mode || 'N/A'}
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                      Most popular enhancement mode
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-600 dark:text-slate-400">
                    <span className="font-semibold">Platform Growth:</span> {metrics.total_users} registered users, 
                    with {metrics.active_users_today} active today
                  </p>
                </div>
                <div>
                  <p className="text-slate-600 dark:text-slate-400">
                    <span className="font-semibold">Usage Pattern:</span> {metrics.avg_resumes_per_user?.toFixed(2)} 
                    avg. resumes per user
                  </p>
                </div>
                <div>
                  <p className="text-slate-600 dark:text-slate-400">
                    <span className="font-semibold">Weekly Activity:</span> {metrics.resumes_this_week} resumes created
                  </p>
                </div>
                <div>
                  <p className="text-slate-600 dark:text-slate-400">
                    <span className="font-semibold">Popular Choice:</span> {metrics.most_used_template || 'N/A'} 
                    template with {metrics.most_used_mode || 'N/A'} mode
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-lg text-center">
            <Icons.FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No Metrics Available</h3>
            <p className="text-slate-500 dark:text-slate-400">
              There might be an issue retrieving metrics from the database.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};