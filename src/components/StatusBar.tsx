"use client";

import { useState, useEffect } from "react";

export function StatusBar() {
  const [latency, setLatency] = useState(12);
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(Math.floor(Math.random() * 8) + 8);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="sticky top-0 z-50 backdrop-blur-xl bg-brand-bg/80 border-b border-brand-border/50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-1.5 text-[10px] font-mono">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse" />
            <span className="text-status-success font-bold tracking-widest">ONLINE</span>
          </div>
          <span className="text-brand-border">│</span>
          <span className="text-brand-muted">
            v1.0.0 • <span className="text-brand-accent">SagaPad Agent</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-brand-muted">
            LATENCY <span className="text-brand-accent">{latency}ms</span>
          </span>
          <span className="text-brand-border">│</span>
          <span className="text-brand-muted">
            UPTIME <span className="text-status-success">99.9%</span>
          </span>
          <span className="text-brand-border">│</span>
          <span className="text-brand-accent tabular-nums">{time}</span>
        </div>
      </div>
    </div>
  );
}
