"use client";

import { useState, useEffect } from "react";

const STEPS = [
  {
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 16 16">
        <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
      </svg>
    ),
    label: "Git Push",
    sublabel: "Webhook fires",
    color: "text-github-green",
    bgColor: "bg-github-green/10",
    borderColor: "border-github-green/20",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    label: "AI Summarize",
    sublabel: "GPT-4o-mini",
    color: "text-brand-accent",
    bgColor: "bg-brand-accent/10",
    borderColor: "border-brand-accent/20",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
    label: "SagaPad Skill",
    sublabel: "Draft via agent",
    color: "text-brand-primary",
    bgColor: "bg-brand-primary/10",
    borderColor: "border-brand-primary/20",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    label: "Post to X",
    sublabel: "Auto-published",
    color: "text-x-blue",
    bgColor: "bg-x-blue/10",
    borderColor: "border-x-blue/20",
  },
];

export function FlowDiagram() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % STEPS.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-panel rounded-xl p-6">
      <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-muted mb-6 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse" />
        Pipeline Flow
      </h3>
      <div className="flex items-center justify-between gap-2">
        {STEPS.map((step, i) => (
          <div key={step.label} className="flex items-center gap-2 flex-1">
            <div
              className={`flow-step flex flex-col items-center gap-2 flex-1 p-3 rounded-lg border transition-all duration-500 ${
                activeStep === i
                  ? `${step.bgColor} ${step.borderColor} ${step.color} scale-105`
                  : "border-transparent text-brand-muted"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-500 ${
                  activeStep === i
                    ? `${step.bgColor} ${step.color}`
                    : "bg-brand-surface text-brand-muted"
                }`}
              >
                {step.icon}
              </div>
              <div className="text-center">
                <div className="text-xs font-bold font-mono">{step.label}</div>
                <div className="text-[10px] text-brand-muted">{step.sublabel}</div>
              </div>
            </div>
            {i < STEPS.length - 1 && (
              <div className="shrink-0 w-6 flex items-center justify-center">
                <svg
                  className={`w-4 h-4 transition-all duration-500 ${
                    activeStep > i ? "text-brand-primary" : "text-brand-border"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
