"use client";

import Link from "next/link";
import { ScrambleText } from "@/components/ScrambleText";
import { ParticleBackground } from "@/components/ParticleBackground";
import { StatusBar } from "@/components/StatusBar";
import { Footer } from "@/components/Footer";

const FEATURES = [
  {
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 16 16">
        <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
      </svg>
    ),
    title: "GitHub Webhook",
    desc: "Listens for push events on any branch. Validates signatures and extracts diffs automatically.",
    color: "text-github-green",
    bgColor: "bg-github-green/10",
    borderColor: "border-github-green/15",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "AI Summarizer",
    desc: "GPT-4o-mini reads the diff and generates engagement-optimized copy. Not just commit messages.",
    color: "text-brand-accent",
    bgColor: "bg-brand-accent/10",
    borderColor: "border-brand-accent/15",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
    title: "SagaPad Skill",
    desc: "Registered on the SagaPad Skill Marketplace as an installable, configurable agent action.",
    color: "text-brand-primary",
    bgColor: "bg-brand-primary/10",
    borderColor: "border-brand-primary/15",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    title: "X API v2 Posting",
    desc: "Auto-drafts and queues tweets with hashtags, emojis, and optimal timing for maximum reach.",
    color: "text-x-blue",
    bgColor: "bg-x-blue/10",
    borderColor: "border-x-blue/15",
  },
];

const FLOW_STEPS = [
  { step: "01", title: "Developer pushes code to GitHub", detail: "Any commit to main branch triggers webhook" },
  { step: "02", title: "Webhook sends payload to Shiproof", detail: "POST /api/webhook/github with commit data" },
  { step: "03", title: "AI reads the diff and writes a tweet", detail: "GPT-4o-mini: technical → engaging copy" },
  { step: "04", title: "SagaPad skill drafts X post", detail: "Human-in-the-loop approval or auto-post" },
];

export default function AboutPage() {
  return (
    <>
      <ParticleBackground />
      <StatusBar />

      <div className="relative z-10 min-h-screen grid-bg">
        <main className="max-w-4xl mx-auto px-6 py-12">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-brand-primary hover:text-brand-accent transition-colors mb-8"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>

          {/* Hero */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-primary/20 bg-brand-primary/5 text-[11px] font-mono text-brand-primary mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
              How It Works
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
              <ScrambleText
                text="Proof of Ship,"
                className="text-white"
                delay={100}
                speed={35}
              />
              <br />
              <ScrambleText
                text="Automated."
                className="neon-text text-brand-primary"
                delay={600}
                speed={50}
              />
            </h1>
            <p className="text-brand-muted text-lg max-w-2xl leading-relaxed">
              Shiproof is an agentic SagaPad skill that turns every git push into a build-in-public
              moment. No more forgetting to tweet about what you shipped.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 gap-4 mb-12 stagger-children">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className={`glass-panel rounded-xl p-5 border-l-2 ${f.borderColor}`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${f.bgColor} ${f.color}`}
                  >
                    {f.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm mb-1">{f.title}</h3>
                    <p className="text-xs text-brand-muted leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Flow */}
          <div className="glass-panel rounded-xl p-6 mb-12">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-muted mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
              Step-by-Step Flow
            </h2>
            <div className="space-y-4">
              {FLOW_STEPS.map((s, i) => (
                <div
                  key={s.step}
                  className="flex items-start gap-4 p-3 rounded-lg hover:bg-brand-surface/50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold font-mono text-brand-primary">{s.step}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">{s.title}</p>
                    <p className="text-xs text-brand-muted mt-0.5">{s.detail}</p>
                  </div>
                  {i < FLOW_STEPS.length - 1 && (
                    <div className="hidden sm:block text-brand-border text-xs mt-2">→</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack */}
          <div className="glass-panel rounded-xl p-6 mb-12">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-muted mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
              Tech Stack
            </h2>
            <div className="flex flex-wrap gap-2">
              {[
                { name: "Next.js 16", color: "text-white" },
                { name: "React 19", color: "text-brand-accent" },
                { name: "Tailwind v4", color: "text-sky-400" },
                { name: "TypeScript", color: "text-blue-400" },
                { name: "SagaPad SDK", color: "text-brand-primary" },
                { name: "OpenAI API", color: "text-emerald-400" },
                { name: "X API v2", color: "text-x-blue" },
                { name: "GitHub Webhooks", color: "text-github-green" },
              ].map((tech) => (
                <span
                  key={tech.name}
                  className={`text-xs font-mono px-3 py-1.5 rounded-lg border border-brand-border bg-brand-surface/50 ${tech.color} hover:border-brand-primary/30 transition-colors`}
                >
                  {tech.name}
                </span>
              ))}
            </div>
          </div>

          {/* Hackathon */}
          <div className="glass-panel rounded-xl p-6 mb-12">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-muted mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-status-warning" />
              Hackathon
            </h2>
            <p className="text-sm text-brand-muted leading-relaxed">
              Built for{" "}
              <span className="text-white font-semibold">Colosseum Frontier Hackathon 2026</span> —
              SagaPad Agentic Skills Track. Solo developer submission showcasing deep SDK integration
              and production-grade automation.
            </p>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link
              href="/"
              className="neon-btn inline-flex items-center gap-2 bg-brand-primary text-white font-bold px-8 py-3 rounded-xl text-sm"
            >
              Launch Dashboard →
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
