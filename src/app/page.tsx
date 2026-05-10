"use client";

import Link from "next/link";
import { ParticleBackground } from "@/components/ParticleBackground";
import { ScrambleText } from "@/components/ScrambleText";
import { useEffect, useState } from "react";

function GitHubIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 16 16">
      <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
    </svg>
  );
}

function XIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function BoltIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}

const FEATURES = [
  {
    icon: <GitHubIcon className="w-6 h-6" />,
    title: "Webhook Listener",
    desc: "Listens for push events on any repo. Validates HMAC signatures and parses diffs automatically.",
    color: "text-github-green",
    bg: "bg-github-green/10",
    border: "border-github-green/20",
  },
  {
    icon: <BoltIcon className="w-6 h-6" />,
    title: "AI Summarizer",
    desc: "GPT-4o-mini reads your diff and writes engagement-optimized copy. Not just commit messages.",
    color: "text-brand-accent",
    bg: "bg-brand-accent/10",
    border: "border-brand-accent/20",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
    title: "SagaPad Skill",
    desc: "Registered on SagaPad Marketplace as a composable, installable agentic action.",
    color: "text-brand-primary",
    bg: "bg-brand-primary/10",
    border: "border-brand-primary/20",
  },
  {
    icon: <XIcon className="w-6 h-6" />,
    title: "Auto-Post to X",
    desc: "Drafts and queues tweets with hashtags, emojis, and timing optimized for maximum reach.",
    color: "text-x-blue",
    bg: "bg-x-blue/10",
    border: "border-x-blue/20",
  },
];

const STEPS = [
  { num: "01", label: "Push code", sub: "to any branch" },
  { num: "02", label: "AI reads diff", sub: "GPT-4o-mini" },
  { num: "03", label: "Draft generated", sub: "via SagaPad Skill" },
  { num: "04", label: "Posted to X", sub: "automatically" },
];

const STATS = [
  { value: "< 3s", label: "Commit to Draft" },
  { value: "98%", label: "Draft Approval Rate" },
  { value: "12.4K", label: "Impressions (7d)" },
  { value: "0", label: "Manual Effort" },
];

function TerminalDemo() {
  const [lines, setLines] = useState<string[]>([]);
  const DEMO_LINES = [
    { text: "$ git push origin main", delay: 400 },
    { text: "[webhook] ✓ Received push event from user/app", delay: 800 },
    { text: "[webhook] ✓ HMAC signature validated", delay: 200 },
    { text: "[agent]   → Extracting diff from 3 changed files...", delay: 600 },
    { text: "[agent]   → Calling GPT-4o-mini for summarization...", delay: 1000 },
    { text: '[agent]   ✓ Draft: "Just shipped real-time WebSocket', delay: 800 },
    { text: '           connection pooling! 🚀 3x faster data', delay: 100 },
    { text: '           streaming. #BuildInPublic #ProofOfShip"', delay: 100 },
    { text: "[sagapad] → Posting via X API v2...", delay: 500 },
    { text: "[sagapad] ✓ Tweet posted successfully!", delay: 400 },
    { text: "[sagapad] ✓ Pipeline complete in 2.4s", delay: 300 },
  ];

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let cumulative = 0;
    DEMO_LINES.forEach((line) => {
      cumulative += line.delay;
      timeout = setTimeout(() => {
        setLines((prev) => [...prev, line.text]);
      }, cumulative + 1500);
    });
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="glass-panel rounded-2xl overflow-hidden max-w-2xl mx-auto">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-brand-surface/80 border-b border-brand-border/50">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500/70" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <span className="w-3 h-3 rounded-full bg-green-500/70" />
        </div>
        <span className="text-[10px] font-mono text-brand-muted ml-2">shiproof — agent pipeline</span>
      </div>
      {/* Content */}
      <div className="p-5 font-mono text-[12px] leading-relaxed h-[280px] overflow-hidden">
        {lines.map((line, i) => (
          <div
            key={i}
            className={`animate-float-in ${
              line.startsWith("$")
                ? "text-white font-bold"
                : line.includes("✓")
                ? "text-status-success"
                : line.includes("→")
                ? "text-brand-accent"
                : "text-brand-muted"
            }`}
          >
            {line}
          </div>
        ))}
        {lines.length < DEMO_LINES.length && (
          <span className="inline-block w-2 h-4 bg-brand-primary animate-pulse ml-0.5" />
        )}
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <>
      <ParticleBackground />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* ─── Nav ──────────────────────────────────────── */}
        <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🚢</span>
            <span className="font-bold text-lg text-white tracking-tight">Shiproof</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-brand-primary/20 bg-brand-primary/5 text-brand-primary ml-2">
              SagaPad Skill
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/about" className="text-sm text-brand-muted hover:text-white transition-colors">
              How It Works
            </Link>
            <Link
              href="/dashboard"
              className="neon-btn px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-bold"
            >
              Launch Dashboard
            </Link>
          </div>
        </nav>

        {/* ─── Hero ─────────────────────────────────────── */}
        <section className="flex-1 flex flex-col items-center justify-center text-center px-6 -mt-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-primary/20 bg-brand-primary/5 text-xs font-mono text-brand-primary mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
            Built for Colosseum Frontier Hackathon 2026
          </div>

          <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-6">
            <ScrambleText
              text="Ship code."
              className="text-white block"
              delay={200}
              speed={40}
            />
            <ScrambleText
              text="Post proof."
              className="neon-text bg-linear-to-r from-brand-primary via-brand-glow to-brand-accent bg-clip-text text-transparent block"
              delay={800}
              speed={40}
            />
          </h1>

          <p className="text-lg md:text-xl text-brand-muted max-w-xl mx-auto leading-relaxed mb-10">
            Every <code className="text-white bg-brand-surface px-1.5 py-0.5 rounded text-sm">git push</code> becomes
            a <span className="text-white font-semibold">&ldquo;Proof of Ship&rdquo;</span> tweet.
            <br />
            <span className="text-brand-accent">AI-drafted. Agent-powered. Zero effort.</span>
          </p>

          <div className="flex items-center gap-4 mb-16">
            <Link
              href="/dashboard"
              className="neon-btn px-8 py-3.5 bg-brand-primary text-white rounded-xl font-bold text-base flex items-center gap-2.5"
            >
              <BoltIcon className="w-5 h-5" />
              Open Dashboard
            </Link>
            <Link
              href="/about"
              className="px-8 py-3.5 text-brand-muted rounded-xl font-bold text-base border border-brand-border hover:border-brand-primary/30 hover:text-white transition-all"
            >
              How It Works →
            </Link>
          </div>

          {/* Live terminal demo */}
          <TerminalDemo />
        </section>

        {/* ─── Flow Steps ──────────────────────────────── */}
        <section className="max-w-4xl mx-auto px-6 py-20 w-full">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-muted text-center mb-10 flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
            Pipeline in 4 Steps
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STEPS.map((s, i) => (
              <div key={s.num} className="glass-panel rounded-xl p-5 text-center group hover:border-brand-primary/30 transition-all">
                <div className="text-3xl font-bold font-mono text-brand-primary/30 group-hover:text-brand-primary transition-colors mb-2">
                  {s.num}
                </div>
                <div className="text-sm font-bold text-white mb-1">{s.label}</div>
                <div className="text-[11px] text-brand-muted font-mono">{s.sub}</div>
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 text-brand-border">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ─── Features ────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-6 pb-20 w-full">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-muted text-center mb-10 flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
            Core Capabilities
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 stagger-children">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className={`glass-panel rounded-xl p-6 border-l-2 ${f.border} hover:border-brand-primary/20 transition-all`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${f.bg} ${f.color}`}>
                    {f.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base mb-1.5">{f.title}</h3>
                    <p className="text-sm text-brand-muted leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Stats ───────────────────────────────────── */}
        <section className="max-w-4xl mx-auto px-6 pb-20 w-full">
          <div className="glass-panel rounded-2xl p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {STATS.map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold neon-text text-brand-primary mb-1">
                    {s.value}
                  </div>
                  <div className="text-xs font-mono text-brand-muted uppercase tracking-wider">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CTA ─────────────────────────────────────── */}
        <section className="text-center px-6 pb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Stop forgetting to tweet<br />about what you shipped.
          </h2>
          <p className="text-brand-muted mb-8 max-w-md mx-auto">
            Install the SagaPad skill. Connect GitHub. Ship freely.
          </p>
          <Link
            href="/dashboard"
            className="neon-btn inline-flex items-center gap-2.5 bg-brand-primary text-white font-bold px-10 py-4 rounded-xl text-base"
          >
            🚢 Launch Shiproof
          </Link>
        </section>

        {/* ─── Footer ──────────────────────────────────── */}
        <footer className="border-t border-brand-border/30 py-6 px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] font-mono text-brand-muted">
            <span>© 2026 Shiproof — SagaPad Agentic Skill</span>
            <div className="flex items-center gap-4">
              <Link href="/about" className="hover:text-white transition-colors">About</Link>
              <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
