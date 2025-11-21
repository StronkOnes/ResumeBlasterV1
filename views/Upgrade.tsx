import React from 'react';
import { ViewState } from '../types';
import { Icons } from '../components/Icons';
import { Button } from '../components/Button';

interface UpgradeProps {
  setView: (view: ViewState) => void;
  onUpgrade: () => void;
}

export const Upgrade: React.FC<UpgradeProps> = ({ setView, onUpgrade }) => {
  return (
    <div className="max-w-md mx-auto pb-24 pt-6">
      <div className="flex items-center mb-8">
        <button onClick={() => setView(ViewState.HOME)} className="mr-4 p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-600 dark:text-slate-300">
          <Icons.Back size={24} />
        </button>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Upgrade Plan</h2>
      </div>

      <div className="space-y-6">
        {/* Free Tier */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-black/30 transition-colors">
          <div className="flex justify-between items-start mb-2">
             <h3 className="text-xl font-bold text-slate-900 dark:text-white">Free</h3>
          </div>
          <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">Perfect for getting started</p>
          <ul className="space-y-3 mb-6">
            <li className="flex items-center text-sm text-slate-700 dark:text-slate-300">
              <Icons.CheckCircle className="text-teal-600 dark:text-teal-400 mr-2" size={18} />
              Up to 3 resumes per month
            </li>
            <li className="flex items-center text-sm text-slate-400 dark:text-slate-600">
              <div className="w-[18px] h-[18px] mr-2 flex items-center justify-center">
                 <div className="w-1.5 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
              </div>
              No email delivery
            </li>
            <li className="flex items-center text-sm text-slate-400 dark:text-slate-600">
              <div className="w-[18px] h-[18px] mr-2 flex items-center justify-center">
                 <div className="w-1.5 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
              </div>
              No history saving
            </li>
          </ul>
        </div>

        {/* Pro Tier */}
        <div className="relative bg-slate-900 dark:bg-blue-900/50 rounded-3xl p-8 shadow-2xl shadow-slate-900/30 dark:shadow-blue-900/20 overflow-hidden group transform transition-transform hover:scale-[1.02] border border-transparent dark:border-blue-700/50">
           {/* Subtle effects */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
           
           <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-yellow-500 text-white text-xs font-bold px-4 py-1.5 rounded-bl-2xl shadow-lg">
             BEST VALUE
           </div>
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
            <div className="flex items-baseline mb-1">
                <span className="text-4xl font-extrabold text-white tracking-tight">$12</span>
                <span className="text-slate-400 dark:text-slate-300 ml-2 font-medium">/month</span>
            </div>
            <p className="text-slate-300 dark:text-slate-200 mb-8 text-sm font-medium">For serious job seekers</p>
            
            <ul className="space-y-4 mb-8">
                <li className="flex items-center text-sm text-slate-100">
                <div className="p-0.5 bg-slate-800 dark:bg-slate-950/50 rounded-full mr-3">
                    <Icons.CheckCircle className="text-teal-400" size={14} />
                </div>
                Unlimited resumes
                </li>
                <li className="flex items-center text-sm text-slate-100">
                <div className="p-0.5 bg-slate-800 dark:bg-slate-950/50 rounded-full mr-3">
                    <Icons.CheckCircle className="text-teal-400" size={14} />
                </div>
                Email delivery included
                </li>
                <li className="flex items-center text-sm text-slate-100">
                <div className="p-0.5 bg-slate-800 dark:bg-slate-950/50 rounded-full mr-3">
                    <Icons.CheckCircle className="text-teal-400" size={14} />
                </div>
                Save up to 100 resumes
                </li>
                <li className="flex items-center text-sm text-slate-100">
                <div className="p-0.5 bg-slate-800 dark:bg-slate-950/50 rounded-full mr-3">
                    <Icons.Sparkles className="text-amber-400" size={14} />
                </div>
                <span className="font-semibold text-white">"Power Boost"</span> <span className="ml-1">AI Mode</span>
                </li>
            </ul>
            
            <Button fullWidth variant="primary" onClick={onUpgrade} className="!bg-white !text-slate-900 !shadow-white/10 hover:!bg-slate-100 dark:!bg-blue-500 dark:!text-white dark:hover:!bg-blue-400">
                Upgrade to Pro
            </Button>
          </div>
        </div>

        {/* One Time */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-black/30 flex items-center justify-between transition-transform hover:scale-[1.01]">
           <div className="flex items-center space-x-4">
             <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 rounded-xl flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Icons.Zap size={24} />
             </div>
             <div>
                <h3 className="font-bold text-slate-900 dark:text-white">One-Time Boost</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Single premium generation</p>
             </div>
           </div>
           <div className="text-right">
              <span className="block text-2xl font-bold text-slate-900 dark:text-white">$5</span>
           </div>
        </div>
      </div>
    </div>
  );
};