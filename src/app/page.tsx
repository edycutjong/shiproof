"use client";

import { useState } from "react";
import { sagaPadService } from "@/lib/sagapad";

// Mock Webhook Data
const MOCK_WEBHOOKS = [
  {
    id: "wh_1",
    repo: "user/shiproof-core",
    commitMsg: "feat: implement sagapad skill manifest generator",
    hash: "a1b2c3d",
    status: "drafted", // 'received', 'summarizing', 'drafted'
    xDraft: "Just shipped the SagaPad skill manifest generator for Shiproof! 🚢 The agent can now automatically register itself. Build in public just got easier. #ProofOfShip #SagaPad"
  },
  {
    id: "wh_2",
    repo: "user/defi-agent",
    commitMsg: "fix: resolve reentrancy in vault contract",
    hash: "f4e5d6c",
    status: "drafted",
    xDraft: "Security first 🛡️ Just patched a potential reentrancy vulnerability in the vault contracts. Staying SAFU. #DeFi #BuildInPublic"
  }
];

export default function ShiproofDashboard() {
  const [logs, setLogs] = useState<typeof MOCK_WEBHOOKS>(MOCK_WEBHOOKS);
  const [isListening, setIsListening] = useState(true);

  const simulateIncomingCommit = async () => {
    const newLog = {
      id: `wh_${Date.now()}`,
      repo: "user/frontier-hack",
      commitMsg: "feat: add real-time webhook listener to dashboard",
      hash: Math.random().toString(16).slice(2, 9),
      status: "received",
      xDraft: ""
    };
    
    setLogs(prev => [newLog, ...prev]);

    // Simulate flow
    setTimeout(async () => {
      setLogs(prev => prev.map(log => log.id === newLog.id ? { ...log, status: "summarizing" } : log));
      
      const draft = await sagaPadService.generateDraft(newLog.commitMsg);
      
      setLogs(prev => prev.map(log => log.id === newLog.id ? { 
        ...log, 
        status: "drafted",
        xDraft: draft
      } : log));
    }, 1000);
  };

  return (
    <div className="min-h-screen p-8 max-w-5xl mx-auto space-y-8">
      <header className="flex justify-between items-center pb-6 border-b border-brand-border">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <span className="text-brand-primary">Ship</span>roof
          </h1>
          <p className="text-brand-muted mt-1 text-sm">Automated Proof of Ship via SagaPad</p>
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2 font-mono text-sm border border-brand-border rounded-lg px-3 py-1 bg-brand-surface">
            <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-status-success animate-pulse' : 'bg-status-error'}`}></div>
            {isListening ? 'LISTENING (PORT 8080)' : 'OFFLINE'}
          </div>
          <button 
            onClick={simulateIncomingCommit}
            className="px-4 py-2 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-lg font-medium transition-colors text-sm shadow-[0_0_15px_rgba(59,130,246,0.3)]"
          >
            Simulate Git Push
          </button>
        </div>
      </header>

      <main className="grid md:grid-cols-[1fr_350px] gap-8">
        <section className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-brand-muted mb-4">Pipeline Activity</h2>
          
          <div className="space-y-4">
            {logs.map((log) => (
              <div key={log.id} className="glass-panel p-6 rounded-xl border-l-2 border-l-brand-primary">
                <div className="flex justify-between items-start mb-4 pb-4 border-b border-brand-border">
                  <div className="font-mono">
                    <div className="text-xs text-brand-muted mb-1">{log.repo} • commit <span className="text-brand-primary">{log.hash}</span></div>
                    <div className="font-bold text-white">"{log.commitMsg}"</div>
                  </div>
                  <div className="px-2 py-1 rounded text-xs uppercase font-bold tracking-wider bg-brand-surface text-brand-muted border border-brand-border">
                    {log.status === 'received' && <span className="text-white">Github Event</span>}
                    {log.status === 'summarizing' && <span className="text-status-warning flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-status-warning animate-ping"></span> AI Summarizing</span>}
                    {log.status === 'drafted' && <span className="text-status-success">Draft Ready</span>}
                  </div>
                </div>

                {log.status === 'drafted' && (
                  <div className="bg-brand-bg rounded-lg border border-brand-border p-4 relative">
                    <div className="absolute top-4 right-4 text-brand-primary">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-surface border border-brand-border flex-shrink-0"></div>
                      <div>
                        <div className="flex items-center gap-1 mb-1">
                          <span className="font-bold text-sm text-white">Founder</span>
                          <span className="text-brand-muted text-xs">@builder</span>
                        </div>
                        <p className="text-sm text-white/90">{log.xDraft}</p>
                        <div className="mt-4 flex gap-2">
                          <button className="px-3 py-1.5 bg-brand-primary text-white rounded text-xs font-bold shadow-[0_0_10px_rgba(59,130,246,0.3)] hover:bg-brand-primary/80">
                            Post via SagaPad Skill
                          </button>
                          <button className="px-3 py-1.5 bg-brand-surface text-brand-muted rounded text-xs font-bold border border-brand-border hover:text-white">
                            Edit Draft
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {log.status === 'summarizing' && (
                  <div className="bg-brand-bg rounded-lg border border-brand-border p-4 font-mono text-xs text-brand-muted">
                    <div className="animate-pulse">Calling OpenAI gpt-4o-mini...</div>
                    <div className="animate-pulse delay-150">Extracting key features from commit...</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <aside className="space-y-6">
          <div className="glass-panel p-6 rounded-xl">
            <h3 className="text-sm font-bold uppercase tracking-widest text-brand-muted mb-4 border-b border-brand-border pb-2">SagaPad Integration</h3>
            <div className="font-mono text-xs space-y-3">
              <div className="flex justify-between">
                <span className="text-brand-muted">Skill Type</span>
                <span className="text-brand-primary">Action</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-muted">Trigger</span>
                <span className="text-white">Webhook</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-muted">Auth</span>
                <span className="text-white">X API v2 OAuth</span>
              </div>
              <div className="mt-4 p-2 bg-brand-surface border border-brand-border rounded text-status-success text-center">
                Manifest Validated ✓
              </div>
            </div>
          </div>
          
          <div className="glass-panel p-6 rounded-xl">
            <h3 className="text-sm font-bold uppercase tracking-widest text-brand-muted mb-4 border-b border-brand-border pb-2">Stats</h3>
            <div className="space-y-4">
              <div>
                <div className="text-brand-muted text-xs font-mono mb-1">Commits Processed</div>
                <div className="text-3xl font-bold text-white">124</div>
              </div>
              <div>
                <div className="text-brand-muted text-xs font-mono mb-1">Posts Drafted</div>
                <div className="text-3xl font-bold text-white">42</div>
              </div>
              <div>
                <div className="text-brand-muted text-xs font-mono mb-1">Posts Published</div>
                <div className="text-3xl font-bold text-brand-primary">38</div>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
