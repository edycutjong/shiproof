"use client";

import { useState, useEffect, useRef } from "react";

interface LogEntry {
  timestamp: string;
  level: "info" | "warn" | "success" | "error";
  message: string;
}

const INITIAL_LOGS: LogEntry[] = [
  { timestamp: "20:41:02", level: "info", message: "[SagaPad SDK] Initializing Proof of Ship Agent..." },
  { timestamp: "20:41:02", level: "success", message: "[SagaPad SDK] Manifest validated ✓" },
  { timestamp: "20:41:03", level: "info", message: "[Webhook] Listening on POST /api/webhook/github" },
  { timestamp: "20:41:03", level: "success", message: "[System] All services operational" },
];

const STREAMING_LOGS: LogEntry[] = [
  { timestamp: "", level: "info", message: "[Webhook] Received push event from user/frontier-hack" },
  { timestamp: "", level: "info", message: "[AI] Extracting diff from 3 changed files..." },
  { timestamp: "", level: "warn", message: "[AI] Processing 247 lines of additions" },
  { timestamp: "", level: "info", message: "[AI] Generating tweet draft via gpt-4o-mini..." },
  { timestamp: "", level: "success", message: "[SagaPad] Draft queued for X API posting" },
  { timestamp: "", level: "info", message: "[X API] OAuth2 token refreshed" },
  { timestamp: "", level: "success", message: "[X API] Tweet published successfully (id: 1920847362)" },
  { timestamp: "", level: "info", message: "[Webhook] Awaiting next push event..." },
];

const LEVEL_COLORS: Record<LogEntry["level"], string> = {
  info: "text-brand-muted",
  warn: "text-status-warning",
  success: "text-status-success",
  error: "text-status-error",
};

const LEVEL_PREFIX: Record<LogEntry["level"], string> = {
  info: "INF",
  warn: "WRN",
  success: "OK ",
  error: "ERR",
};

export function TerminalLog() {
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);
  const [, setStreamIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setStreamIndex((prev) => {
        const next = prev % STREAMING_LOGS.length;
        const now = new Date();
        const timestamp = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;
        const entry = { ...STREAMING_LOGS[next], timestamp };

        setLogs((prevLogs) => {
          const newLogs = [...prevLogs, entry];
          // Keep last 20 lines
          if (newLogs.length > 20) return newLogs.slice(-20);
          return newLogs;
        });

        return prev + 1;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    /* v8 ignore next 3 */
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="glass-panel rounded-xl overflow-hidden">
      {/* Terminal header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-brand-border bg-brand-surface/50">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-status-error/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-status-warning/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-status-success/70" />
          </div>
          <span className="text-[10px] font-mono text-brand-muted ml-2">shiproof — agent.log</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse" />
          <span className="text-[10px] font-mono text-status-success">LIVE</span>
        </div>
      </div>

      {/* Terminal body */}
      <div
        ref={scrollRef}
        className="p-4 h-52 overflow-y-auto font-mono text-xs leading-relaxed"
        style={{ scrollBehavior: "smooth" }}
      >
        {logs.map((log, i) => (
          <div
            key={`${log.timestamp}-${i}`}
            className={`flex gap-3 ${i === logs.length - 1 ? "animate-float-in" : ""}`}
          >
            <span className="text-brand-border shrink-0">{log.timestamp}</span>
            <span className={`shrink-0 ${LEVEL_COLORS[log.level]}`}>
              {LEVEL_PREFIX[log.level]}
            </span>
            <span className={LEVEL_COLORS[log.level]}>{log.message}</span>
          </div>
        ))}
        <div className="terminal-cursor text-brand-muted mt-1">$</div>
      </div>
    </div>
  );
}
