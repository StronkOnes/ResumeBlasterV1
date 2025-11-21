import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  fullWidth?: boolean;
  isLoading?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  isLoading = false,
  size = 'md',
  className = '',
  disabled,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";
  
  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  const variants = {
    // Deep slate/blue for primary actions - Professional & Modern
    primary: "bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20 focus:ring-slate-900 border border-transparent dark:bg-blue-600 dark:hover:bg-blue-500 dark:shadow-blue-900/30 dark:focus:ring-blue-500",
    // White surface for secondary
    secondary: "bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 shadow-sm focus:ring-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700 dark:hover:bg-slate-700",
    // Outline with subtle blue-grey interaction
    outline: "bg-transparent border border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-400 focus:ring-slate-200 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white",
    // Ghost for less emphasis
    ghost: "bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${sizeStyles[size]} ${variants[variant]} ${widthClass} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span>Processing...</span>
        </div>
      ) : children}
    </button>
  );
};