import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.97] hover:-translate-y-0.5";

  const variants = {
    primary: "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/50 hover:shadow-xl hover:from-indigo-500 hover:to-blue-500 focus:ring-indigo-500",
    secondary: "bg-slate-800 text-white shadow-lg shadow-slate-800/20 hover:bg-slate-700 hover:shadow-xl hover:shadow-slate-800/30 focus:ring-slate-500",
    danger: "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-500/25 hover:shadow-red-500/50 hover:shadow-xl hover:from-red-500 hover:to-rose-500 focus:ring-red-500",
    outline: "border-2 border-slate-200 text-slate-700 bg-white hover:border-indigo-300 hover:text-indigo-700 hover:bg-indigo-50/50 hover:shadow-lg hover:shadow-indigo-500/10 focus:ring-indigo-500",
    ghost: "text-slate-600 hover:text-slate-900 hover:bg-slate-100 hover:shadow-sm focus:ring-slate-500",
  };

  const sizes = {
    sm: "px-3 py-2 text-xs gap-1.5",
    md: "px-4 py-2.5 text-sm gap-2",
    lg: "px-6 py-3.5 text-base gap-2",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className} ${disabled || isLoading ? "opacity-50 cursor-not-allowed active:scale-100" : ""}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  );
}
