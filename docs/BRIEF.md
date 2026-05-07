# Shiproof — Full Project Brief

## PRD
**Problem**: Founders ship code but forget to tweet about it. "Proof of Ship" is the hottest narrative but nobody automates it.
**Solution**: GitHub webhook → AI summarizes commit → SagaPad skill auto-drafts X post. <2 hour bolt-on.

**Core Features**: GitHub webhook listener, OpenAI commit summarizer, SagaPad skill manifest, X API draft.
**Difficulty**: 2/10. **Time**: 2 hours. **Bolt-on to**: Any primary project.

---

## BUILD PLAN
- Hour 0-0.5: GitHub webhook endpoint
- Hour 0.5-1: OpenAI summarize diff → draft tweet
- Hour 1-1.5: SagaPad skill wrapper
- Hour 1.5-2: Test end-to-end, deploy

---

## SUBMISSION
**Demo**: Push commit to GitHub → webhook fires → AI drafts tweet "🚢 Just shipped: encrypted order matching for Oblivion. 47 lines of Rust." → SagaPad posts.

---

## SEED DATA
5 sample commits with pre-generated tweet drafts.

---

## UI
Minimal — SagaPad skill runs headless. Optional: small "Recent Ships" feed widget.
