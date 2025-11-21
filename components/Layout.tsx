import React from 'react';
import { ViewState } from '../types';
import { Icons } from './Icons';
import { supabase } from '../services/supabaseClient'; // Import Supabase client
import { Session } from '@supabase/supabase-js'; // Import Session type

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  setView: (view: ViewState) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  session: Session | null; // Add session prop
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, setView, isDarkMode, toggleTheme, session }) => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setView(ViewState.HOME); // Redirect to landing page after logout
  };

  const showBottomNav = session && (currentView === ViewState.EDITOR || currentView === ViewState.HISTORY || currentView === ViewState.UPGRADE);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-100 dark:selection:bg-blue-900 selection:text-blue-900 dark:selection:text-blue-100 transition-colors duration-300">
      {/* Top right buttons for theme toggle and logout */}
      <div className="fixed top-4 right-4 z-50 flex space-x-2">
        {session && ( // Show logout button if session exists
          <button
            onClick={handleLogout}
            className="p-2 rounded-full bg-red-500/80 dark:bg-red-700/80 backdrop-blur-sm border border-red-200 dark:border-red-600 text-white shadow-lg transition-all hover:scale-110"
            aria-label="Logout"
          >
            <Icons.LogOut size={20} />
          </button>
        )}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-amber-400 shadow-lg transition-all hover:scale-110"
          aria-label="Toggle Dark Mode"
        >
          {isDarkMode ? <Icons.Sun size={20} /> : <Icons.Moon size={20} />}
        </button>
      </div>

      {/* Main Content Area */}
      <main className={`${currentView === ViewState.HOME ? '' : 'container mx-auto px-4'} min-h-screen flex flex-col relative transition-colors duration-300`}>
         {children}
      </main>

      {/* Bottom Navigation for Mobile feel (Sticky) - Only for logged-in users on specific views */}
      {showBottomNav && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 pb-safe pt-3 px-6 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.2)] z-50 transition-colors duration-300">
          <div className="max-w-md mx-auto flex justify-around items-center pb-4">
            <button
              onClick={() => setView(ViewState.EDITOR)}
              className={`flex flex-col items-center space-y-1 transition-colors duration-200 ${currentView === ViewState.EDITOR ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
            >
              <Icons.FileText size={24} strokeWidth={currentView === ViewState.EDITOR ? 2.5 : 2} />
              <span className="text-[10px] font-bold">Create</span>
            </button>
            
            <button
               onClick={() => setView(ViewState.HISTORY)}
               className={`flex flex-col items-center space-y-1 transition-colors duration-200 ${currentView === ViewState.HISTORY ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
            >
              <Icons.Clock size={24} strokeWidth={currentView === ViewState.HISTORY ? 2.5 : 2} />
              <span className="text-[10px] font-bold">History</span>
            </button>
            
            <button
               onClick={() => setView(ViewState.UPGRADE)}
               className={`flex flex-col items-center space-y-1 transition-colors duration-200 ${currentView === ViewState.UPGRADE ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
            >
              <Icons.Crown size={24} strokeWidth={currentView === ViewState.UPGRADE ? 2.5 : 2} />
              <span className="text-[10px] font-bold">Upgrade</span>
            </button>
          </div>
        </nav>
      )}
    </div>
  );
};