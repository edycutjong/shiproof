"use client";

import { StatusBar } from "@/components/StatusBar";
import { Footer } from "@/components/Footer";
import { ParticleBackground } from "@/components/ParticleBackground";
import { ScrambleText } from "@/components/ScrambleText";
import { FlowDiagram } from "@/components/FlowDiagram";
import { TerminalLog } from "@/components/TerminalLog";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { useState, useCallback } from "react";
import { sagaPadService } from "@/lib/sagapad";

// ─── Sample webhook events ─────────────────────────────────
interface WebhookLog {
  id: string;
  repo: string;
  commitMsg: string;
  hash: string;
  status: "received" | "summarizing" | "drafted";
  xDraft: string;
  filesChanged: number;
  timestamp: string;
}

const now = () =>
  new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });

const SAMPLE_COMMITS = [
  "feat: implement sagapad skill manifest generator",
  "fix: resolve reentrancy in vault contract",
  "feat: add lazy minting with compressed NFTs",
  "refactor: optimize WebSocket connection pooling",
  "feat: integrate on-chain governance voting UI",
  "fix: patch token approval race condition",
  "feat: add real-time P&L tracking dashboard",
  "chore: upgrade Solana SDK to v2.1.0",
];

const SAMPLE_DRAFTS = [
  "Just shipped the SagaPad skill manifest generator for Shiproof! 🚢 The agent can now automatically register itself. Build in public just got easier. #ProofOfShip #SagaPad",
  "Security first 🛡️ Just patched a potential reentrancy vulnerability in the vault contracts. Staying SAFU. #DeFi #BuildInPublic",
  "🎨 Lazy minting is LIVE! Compressed NFTs on Solana = 99.9% cheaper minting costs. The future of digital art is here. #Solana #NFTs #BuildInPublic",
];

const INITIAL_LOGS: WebhookLog[] = [
  {
    id: "wh_1",
    repo: "user/shiproof-core",
    commitMsg: "feat: implement sagapad skill manifest generator",
    hash: "a1b2c3d",
    status: "drafted",
    xDraft: SAMPLE_DRAFTS[0],
    filesChanged: 4,
    timestamp: "14:22:07",
  },
  {
    id: "wh_2",
    repo: "user/defi-agent",
    commitMsg: "fix: resolve reentrancy in vault contract",
    hash: "f4e5d6c",
    status: "drafted",
    xDraft: SAMPLE_DRAFTS[1],
    filesChanged: 2,
    timestamp: "13:48:31",
  },
];

// ─── X (Twitter) icon ───────────────────────────────────────
function XIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

// ─── GitHub icon ────────────────────────────────────────────
function GitHubIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 16 16">
      <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
    </svg>
  );
}

// ─── Status Badge ───────────────────────────────────────────
function StatusBadge({ status }: { status: WebhookLog["status"] }) {
  const configs = {
    received: {
      label: "WEBHOOK RECEIVED",
      color: "text-status-warning",
      dot: "bg-status-warning",
      animate: true,
    },
    summarizing: {
      label: "AI PROCESSING",
      color: "text-brand-accent",
      dot: "bg-brand-accent",
      animate: true,
    },
    drafted: {
      label: "DRAFT READY",
      color: "text-status-success",
      dot: "bg-status-success",
      animate: false,
    },
  };
  const cfg = configs[status];

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider ${cfg.color} bg-brand-surface border border-brand-border`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${cfg.animate ? "animate-pulse" : ""}`} />
      {cfg.label}
    </div>
  );
}

// ─── Pipeline Card ──────────────────────────────────────────
function PipelineCard({ log }: { log: WebhookLog }) {
  return (
    <div className={`pipeline-card status-${log.status} glass-panel rounded-xl p-5 animate-float-in`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="font-mono flex-1 min-w-0">
          <div className="flex items-center gap-2 text-[10px] text-brand-muted mb-1.5">
            <GitHubIcon className="w-3 h-3 text-brand-muted shrink-0" />
            <span className="truncate">{log.repo}</span>
            <span className="text-brand-border">•</span>
            <span className="text-brand-primary">{log.hash}</span>
            <span className="text-brand-border">•</span>
            <span>{log.filesChanged} files</span>
            <span className="text-brand-border">•</span>
            <span className="tabular-nums">{log.timestamp}</span>
          </div>
          <p className="text-sm font-semibold text-white/95 leading-snug">&ldquo;{log.commitMsg}&rdquo;</p>
        </div>
        <StatusBadge status={log.status} />
      </div>

      {/* Processing state */}
      {log.status === "summarizing" && (
        <div className="bg-brand-bg/50 rounded-lg border border-brand-accent/10 p-4 font-mono text-xs space-y-1.5">
          <div className="flex items-center gap-2 text-brand-accent">
            <span className="w-1 h-1 rounded-full bg-brand-accent animate-ping" />
            Calling OpenAI gpt-4o-mini...
          </div>
          <div className="text-brand-muted animate-pulse">Extracting key changes from diff...</div>
          <div className="text-brand-muted animate-pulse" style={{ animationDelay: "0.3s" }}>
            Generating engagement-optimized copy...
          </div>
        </div>
      )}

      {log.status === "received" && (
        <div className="bg-brand-bg/50 rounded-lg border border-status-warning/10 p-4 font-mono text-xs">
          <div className="flex items-center gap-2 text-status-warning">
            <span className="w-1 h-1 rounded-full bg-status-warning animate-ping" />
            Validating webhook signature...
          </div>
        </div>
      )}

      {/* Draft tweet */}
      {log.status === "drafted" && (
        <div className="tweet-card rounded-lg p-4 mt-1">
          <div className="absolute top-4 right-4 text-x-blue/40">
            <XIcon className="w-4 h-4" />
          </div>
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-brand-primary/30 to-brand-accent/30 border border-brand-border shrink-0 flex items-center justify-center">
              <span className="text-xs font-bold text-brand-primary">🚢</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="font-bold text-sm text-white">Founder</span>
                <span className="text-xs text-brand-muted">@builder</span>
                <span className="text-xs text-brand-border">•</span>
                <span className="text-xs text-brand-muted">just now</span>
              </div>
              <p className="text-sm text-white/85 leading-relaxed">{log.xDraft}</p>

              {/* Engagement preview */}
              <div className="flex items-center gap-6 mt-3 pt-3 border-t border-brand-border/30">
                <span className="flex items-center gap-1.5 text-[11px] text-brand-muted hover:text-brand-primary transition-colors cursor-pointer">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97-4.97 7.5-7.5 7.5-10.5A5.25 5.25 0 0012 4.5 5.25 5.25 0 004.5 9.75c0 3 2.53 5.53 7.5 10.5z" /></svg>
                  47
                </span>
                <span className="flex items-center gap-1.5 text-[11px] text-brand-muted hover:text-status-success transition-colors cursor-pointer">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" /></svg>
                  12
                </span>
                <span className="flex items-center gap-1.5 text-[11px] text-brand-muted">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  1.2K
                </span>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 mt-3">
                <button className="neon-btn px-3.5 py-1.5 bg-brand-primary text-white rounded-lg text-xs font-bold">
                  Post via SagaPad
                </button>
                <button className="px-3.5 py-1.5 bg-brand-surface text-brand-muted rounded-lg text-xs font-bold border border-brand-border hover:text-white hover:border-brand-primary/30 transition-all">
                  Edit Draft
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MAIN DASHBOARD
// ═══════════════════════════════════════════════════════════

export default function ShiproofDashboard() {
  const [logs, setLogs] = useState<WebhookLog[]>(() => INITIAL_LOGS);
  const [isListening] = useState(true);

  const simulateIncomingCommit = useCallback(async () => {
    const commitMsg = SAMPLE_COMMITS[Math.floor(Math.random() * SAMPLE_COMMITS.length)];
    const newLog: WebhookLog = {
      id: `wh_${Date.now()}`,
      repo: "user/frontier-hack",
      commitMsg,
      hash: Math.random().toString(16).slice(2, 9),
      status: "received",
      xDraft: "",
      filesChanged: Math.floor(Math.random() * 8) + 1,
      timestamp: now(),
    };

    setLogs((prev) => [newLog, ...prev]);

    // Stage 2: summarizing
    setTimeout(() => {
      setLogs((prev) =>
        prev.map((log) => (log.id === newLog.id ? { ...log, status: "summarizing" } : log))
      );
    }, 800);

    // Stage 3: drafted
    setTimeout(async () => {
      const draft = await sagaPadService.generateDraft(commitMsg);
      setLogs((prev) =>
        prev.map((log) =>
          log.id === newLog.id ? { ...log, status: "drafted", xDraft: draft } : log
        )
      );
    }, 2500);
  }, []);

  return (
    <>
      <ParticleBackground />
      <StatusBar />

      <div className="relative z-10 min-h-screen grid-bg scan-line">
        {/* ─── Hero Section ─────────────────────────────── */}
        <div className="relative max-w-7xl mx-auto px-6 pt-12 pb-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-primary/20 bg-brand-primary/5 text-[11px] font-mono text-brand-primary mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
              SagaPad Agentic Skill
            </div>

            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4">
              <ScrambleText
                text="Shiproof"
                className="neon-text bg-linear-to-r from-white via-brand-glow to-brand-accent bg-clip-text text-transparent"
                delay={200}
                speed={40}
              />
            </h1>

            <p className="text-lg text-brand-muted max-w-xl mx-auto leading-relaxed">
              Push code → AI drafts your{" "}
              <span className="text-white font-medium">&ldquo;Proof of Ship&rdquo;</span> tweet.
              <br />
              <span className="text-brand-accent">Zero effort. Pure automation.</span>
            </p>

            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={simulateIncomingCommit}
                className="neon-btn px-6 py-2.5 bg-brand-primary text-white rounded-xl font-bold text-sm flex items-center gap-2"
              >
                <GitHubIcon className="w-4 h-4" />
                Simulate Git Push
              </button>
              <a
                href="/about"
                className="px-6 py-2.5 text-brand-muted rounded-xl font-bold text-sm border border-brand-border hover:border-brand-primary/30 hover:text-white transition-all"
              >
                How It Works
              </a>
            </div>
          </div>

          {/* ─── Flow Diagram ──────────────────────────── */}
          <FlowDiagram />
        </div>

        {/* ─── Dashboard Grid ──────────────────────────── */}
        <div className="max-w-7xl mx-auto px-6 pb-12">
          <div className="grid lg:grid-cols-[1fr_380px] gap-6">
            {/* ─── Left: Pipeline Activity ──────────────── */}
            <section className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-muted flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                  Pipeline Activity
                </h2>
                {/* v8 ignore start */}
                <div className="flex items-center gap-2 font-mono text-[10px] border border-brand-border rounded-lg px-2.5 py-1 bg-brand-surface/50">
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      isListening ? "bg-status-success animate-pulse" : "bg-status-error"
                    }`}
                  />
                  {isListening ? "LISTENING" : "OFFLINE"}
                </div>
                {/* v8 ignore stop */}
              </div>

              <div className="space-y-3 stagger-children">
                {logs.map((log) => (
                  <PipelineCard key={log.id} log={log} />
                ))}
              </div>
            </section>

            {/* ─── Right: Sidebar ──────────────────────── */}
            <aside className="space-y-4">
              {/* Stats */}
              <div className="glass-panel rounded-xl p-5">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-muted mb-5 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
                  Agent Metrics
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="stat-glow">
                    <div className="text-[10px] font-mono text-brand-muted mb-1">PROCESSED</div>
                    <div className="text-2xl font-bold stat-value">
                      <AnimatedCounter target={124} />
                    </div>
                    <div className="text-[10px] text-status-success font-mono mt-0.5">+12 today</div>
                  </div>
                  <div className="stat-glow">
                    <div className="text-[10px] font-mono text-brand-muted mb-1">DRAFTED</div>
                    <div className="text-2xl font-bold stat-value">
                      <AnimatedCounter target={42} duration={1800} />
                    </div>
                    <div className="text-[10px] text-status-success font-mono mt-0.5">98% rate</div>
                  </div>
                  <div className="stat-glow">
                    <div className="text-[10px] font-mono text-brand-muted mb-1">POSTED</div>
                    <div className="text-2xl font-bold stat-value">
                      <AnimatedCounter target={38} duration={2000} />
                    </div>
                    <div className="text-[10px] text-brand-accent font-mono mt-0.5">90% hit</div>
                  </div>
                </div>
              </div>

              {/* Skill Manifest */}
              <div className="glass-panel rounded-xl p-5">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-muted mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                  SagaPad Skill
                </h3>
                <div className="font-mono text-[11px] space-y-2.5">
                  <div className="flex justify-between items-center">
                    <span className="text-brand-muted">Type</span>
                    <span className="px-2 py-0.5 rounded bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                      Action
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-brand-muted">Trigger</span>
                    <span className="text-white flex items-center gap-1.5">
                      <GitHubIcon className="w-3 h-3" />
                      Webhook
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-brand-muted">AI Model</span>
                    <span className="text-brand-accent">gpt-4o-mini</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-brand-muted">Output</span>
                    <span className="text-white flex items-center gap-1.5">
                      <XIcon className="w-3 h-3" />
                      X Post
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-brand-muted">Auth</span>
                    <span className="text-white">OAuth 2.0 PKCE</span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-brand-border/30">
                    <div className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-status-success/5 border border-status-success/15 text-status-success text-center">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Manifest Validated
                    </div>
                  </div>
                </div>
              </div>

              {/* Terminal */}
              <TerminalLog />

              {/* Engagement */}
              <div className="glass-panel rounded-xl p-5">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-muted mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-x-blue" />
                  X Engagement (7d)
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-brand-muted">Impressions</span>
                    <span className="text-white font-bold">
                      <AnimatedCounter target={12400} duration={2200} />
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-brand-surface overflow-hidden">
                    <div className="h-full rounded-full bg-linear-to-r from-brand-primary to-brand-accent animate-shimmer w-3/4" />
                  </div>
                  <div className="grid grid-cols-3 gap-3 mt-2">
                    <div className="text-center p-2 rounded-lg bg-brand-surface/50 border border-brand-border/30">
                      <div className="text-xs font-bold text-white">
                        <AnimatedCounter target={296} duration={1600} />
                      </div>
                      <div className="text-[9px] text-brand-muted">LIKES</div>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-brand-surface/50 border border-brand-border/30">
                      <div className="text-xs font-bold text-white">
                        <AnimatedCounter target={97} duration={1700} />
                      </div>
                      <div className="text-[9px] text-brand-muted">RETWEETS</div>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-brand-surface/50 border border-brand-border/30">
                      <div className="text-xs font-bold text-white">
                        <AnimatedCounter target={44} duration={1800} />
                      </div>
                      <div className="text-[9px] text-brand-muted">REPLIES</div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
