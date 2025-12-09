import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { User } from '../types';
import { authService, initializeProfile, supabase } from '../services/supabaseService';

// Define the shape of our auth context
interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (fullName?: string, avatarUrl?: string) => Promise<void>;
}

// Create the context with a default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define actions for the reducer
type AuthAction =
  | { type: 'LOADING_START' }
  | { type: 'LOADING_END' }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SIGN_OUT' };

// Reducer function
const authReducer = (state: { user: User | null; loading: boolean }, action: AuthAction): { user: User | null; loading: boolean } => {
  switch (action.type) {
    case 'LOADING_START':
      return { ...state, loading: true };
    case 'LOADING_END':
      return { ...state, loading: false };
    case 'SET_USER':
      return { ...state, user: action.payload, loading: false };
    case 'SIGN_OUT':
      return { ...state, user: null, loading: false };
    default:
      return state;
  }
};

// Provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    loading: true,
  });

  // Initialize the auth state
  useEffect(() => {
    const initializeAuth = async () => {
      dispatch({ type: 'LOADING_START' });
      
      try {
        const user = await authService.getCurrentUser();
        if (user) {
          // Initialize profile if it doesn't exist
          await initializeProfile(user);
        }
        dispatch({ type: 'SET_USER', payload: user });
      } catch (error) {
        console.error('Error initializing auth:', error);
        dispatch({ type: 'SET_USER', payload: null });
      } finally {
        dispatch({ type: 'LOADING_END' });
      }
    };

    initializeAuth();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          try {
            // Get full user data
            const user = await authService.getCurrentUser();
            if (user) {
              await initializeProfile(user);
            }
            dispatch({ type: 'SET_USER', payload: user });
          } catch (error) {
            console.error('Error on sign in:', error);
          }
        } else if (event === 'SIGNED_OUT') {
          dispatch({ type: 'SIGN_OUT' });
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    dispatch({ type: 'LOADING_START' });
    try {
      const result = await authService.signUp(email, password, fullName);
      // The auth state listener will handle updating the context
    } catch (error: any) {
      dispatch({ type: 'LOADING_END' });
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    dispatch({ type: 'LOADING_START' });
    try {
      await authService.signIn(email, password);
      // The auth state listener will handle updating the context
    } catch (error: any) {
      dispatch({ type: 'LOADING_END' });
      throw error;
    }
  };

  const signOut = async () => {
    dispatch({ type: 'LOADING_START' });
    try {
      await authService.signOut();
      // The auth state listener will handle updating the context
    } catch (error: any) {
      dispatch({ type: 'LOADING_END' });
      throw error;
    }
  };

  const updateUser = async (fullName?: string, avatarUrl?: string) => {
    try {
      await authService.updateProfile(fullName, avatarUrl);
      // Refresh user data
      const updatedUser = await authService.getCurrentUser();
      dispatch({ type: 'SET_USER', payload: updatedUser });
    } catch (error: any) {
      throw error;
    }
  };

  const value = {
    user: state.user,
    loading: state.loading,
    signUp,
    signIn,
    signOut,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};