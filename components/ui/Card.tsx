import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-200/50 hover:shadow-md hover:shadow-slate-200/60 transition-shadow duration-300 ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }: CardProps) {
  return <div className={`px-6 py-5 border-b border-slate-100 ${className}`}>{children}</div>;
}

export function CardBody({ children, className = "" }: CardProps) {
  return <div className={`px-6 py-5 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = "" }: CardProps) {
  return <div className={`px-6 py-4 border-t border-slate-100 ${className}`}>{children}</div>;
}
