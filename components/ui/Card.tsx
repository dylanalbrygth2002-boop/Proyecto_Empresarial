import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  color?: "default" | "indigo" | "blue" | "emerald" | "amber" | "purple";
}

export function Card({ children, className = "", color = "default" }: CardProps) {
  const colorBorders: Record<string, string> = {
    default: "border-slate-200/80",
    indigo: "border-indigo-200/80",
    blue: "border-blue-200/80",
    emerald: "border-emerald-200/80",
    amber: "border-amber-200/80",
    purple: "border-purple-200/80",
  };

  const colorTops: Record<string, string> = {
    default: "",
    indigo: "border-t-indigo-400",
    blue: "border-t-blue-400",
    emerald: "border-t-emerald-400",
    amber: "border-t-amber-400",
    purple: "border-t-purple-400",
  };

  const topBorder = color !== "default" ? colorTops[color] : "";

  return (
    <div className={`rounded-2xl border ${colorBorders[color]} bg-white shadow-sm shadow-slate-200/40 hover:shadow-md hover:shadow-slate-200/60 transition-shadow duration-300 ${topBorder} ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`px-6 py-4 border-b border-slate-100 ${className}`}>{children}</div>;
}

export function CardBody({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`px-6 py-4 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`px-6 py-4 border-t border-slate-100 ${className}`}>{children}</div>;
}
