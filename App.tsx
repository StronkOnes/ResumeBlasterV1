import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Home } from './views/Home';
import { Editor } from './views/Editor';
import { Preview } from './views/Preview';
import { History } from './views/History';
import { Upgrade } from './views/Upgrade';
import { Auth } from './views/Auth'; // Import Auth component
import { ViewState, ResumeData, OptimizationMode } from './types';
import { supabase } from './services/supabaseClient'; // Import Supabase client
import { Session } from '@supabase/supabase-js'; // Import Session type
import { fetchUserResumes } from './services/resumeService';

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME); // Always start at the Home/Landing page
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [currentResume, setCurrentResume] = useState<ResumeData | null>(null);
  const [isPro, setIsPro] = useState(false);
  const [resumes, setResumes] = useState<ResumeData[]>([]); // Initialize empty, will fetch from Supabase
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch user's resumes from Supabase
  const loadUserResumes = async (userId: string) => {
    console.log('🔍 Loading resumes for user:', userId);
    try {
      const userResumes = await fetchUserResumes(userId);
      console.log('✅ Fetched resumes:', userResumes.length, 'resumes found');
      console.log('📄 Resume data:', userResumes);
      setResumes(userResumes);
    } catch (error) {
      console.error('❌ Error loading resumes:', error);
    }
  };

  useEffect(() => {
    setLoading(true);
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user?.id) {
        loadUserResumes(session.user.id);
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      // On login, go to the editor and load resumes
      if (_event === 'SIGNED_IN' && session?.user?.id) {
        setCurrentView(ViewState.EDITOR);
        loadUserResumes(session.user.id);
      } else if (_event === 'SIGNED_OUT') {
        setCurrentView(ViewState.HOME);
        setResumes([]); // Clear resumes on logout
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Initialize dark mode from system preference or local storage could go here
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handlePreviewSavedResume = (resume: ResumeData) => {
    setCurrentResume(resume);
    setGeneratedContent(resume.enhanced_content);
    setCurrentView(ViewState.PREVIEW);
  };

  const handleResumeGeneration = async (originalContent: string, enhancedContent: string, mode: OptimizationMode, jobDescription?: string, jobTitle?: string) => {
    setGeneratedContent(enhancedContent);
    
    if (session?.user?.id) {
      const newResume: ResumeData = {
        user_id: session.user.id,
        job_title: jobTitle,
        original_content: originalContent,
        enhanced_content: enhancedContent,
        enhancement_mode: mode,
        job_description_used: jobDescription,
        generated_at: new Date().toISOString(),
        // template_selected, file_path_pdf, file_path_docx will be added in later stages
      };

      const { data, error } = await supabase
        .from('resumes')
        .insert([newResume])
        .select(); // Select the inserted data to get the ID

      if (error) {
        console.error('Error saving resume to Supabase:', error);
        setCurrentResume(newResume); // Still set it locally even if save fails
      } else if (data && data[0]) {
        const savedResume = data[0];
        setResumes([savedResume, ...resumes]); // Add the newly saved resume to the top of the list
        setCurrentResume(savedResume); // Set the current resume with the Supabase ID
        console.log('Resume saved:', savedResume);
      }
    } else {
      console.warn('Cannot save resume: User not logged in. Redirecting to login.');
      setCurrentView(ViewState.AUTH);
    }
  };

  const renderView = () => {
    if (loading) {
      return <div>Loading...</div>; // Or a proper loading spinner component
    }

    const protectedViews: ViewState[] = [ViewState.EDITOR, ViewState.TAILOR, ViewState.PREVIEW, ViewState.HISTORY, ViewState.UPGRADE];
    if (protectedViews.includes(currentView) && !session) {
      // If user tries to access a protected view without being logged in, show Auth
      return <Auth onAuthSuccess={() => setCurrentView(ViewState.EDITOR)} setView={setCurrentView} />;
    }

    switch (currentView) {
      case ViewState.HOME:
        return <Home setView={setCurrentView} />;
      case ViewState.AUTH:
        return <Auth onAuthSuccess={() => setCurrentView(ViewState.EDITOR)} setView={setCurrentView} />;
      case ViewState.EDITOR:
        return <Editor setView={setCurrentView} setGeneratedResume={(originalContent, enhancedContent, mode, jobDescription, jobTitle) => handleResumeGeneration(originalContent, enhancedContent, mode, jobDescription, jobTitle)} />;
      case ViewState.TAILOR:
        return <Editor setView={setCurrentView} setGeneratedResume={(originalContent, enhancedContent, mode, jobDescription, jobTitle) => handleResumeGeneration(originalContent, enhancedContent, mode, jobDescription, jobTitle)} initialJobMode={true} />;
      case ViewState.PREVIEW:
        return <Preview setView={setCurrentView} content={generatedContent} resumeData={currentResume} onSaveSuccess={(resume) => {
          if (resume.id) {
            setResumes([resume, ...resumes.filter(r => r.id !== resume.id)]);
          }
        }} />;
      case ViewState.HISTORY:
        // Pass user ID to History to fetch user-specific resumes
        return <History 
          setView={setCurrentView} 
          resumes={resumes} 
          isPro={isPro}
          onPreviewResume={handlePreviewSavedResume}
        />;
      case ViewState.UPGRADE:
        return <Upgrade setView={setCurrentView} onUpgrade={() => setIsPro(true)} />;
      default:
        return <Home setView={setCurrentView} />;
    }
  };

  return (
    <Layout currentView={currentView} setView={setCurrentView} isDarkMode={isDarkMode} toggleTheme={toggleTheme} session={session}>
      {renderView()}
    </Layout>
  );
}