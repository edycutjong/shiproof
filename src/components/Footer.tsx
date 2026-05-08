export function Footer() {
  return (
    <footer className="relative border-t border-brand-border/30 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-md bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center">
            <span className="text-brand-primary text-xs font-bold">S</span>
          </div>
          <p className="text-xs text-brand-muted font-mono">
            Shiproof — Proof of Ship Automation
          </p>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/edycutjong/frontier-sagapad"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-brand-muted hover:text-white transition-colors font-mono"
          >
            GitHub ↗
          </a>
          <span className="text-brand-border">│</span>
          <a
            href="https://sagapad.com/skills"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-brand-muted hover:text-brand-primary transition-colors font-mono"
          >
            SagaPad Skills ↗
          </a>
          <span className="text-brand-border">│</span>
          <span className="text-xs text-brand-border font-mono">
            Colosseum Frontier 2026
          </span>
        </div>
      </div>
    </footer>
  );
}
