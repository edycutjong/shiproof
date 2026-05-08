import { NextResponse } from "next/server";
import { sagaPadService } from "@/lib/sagapad";

// POST /api/webhook/github — Receive GitHub push event, generate tweet draft
export async function POST(request: Request) {
  try {
    const payload = await request.json();

    const repo = payload.repository?.full_name || "unknown/repo";
    const commits = payload.commits || [];
    const latestCommit = commits[0] || {};
    const commitMsg = latestCommit.message || "No message";
    const hash = (latestCommit.id || "0000000").substring(0, 7);
    const author = latestCommit.author?.name || "Unknown";
    const filesChanged = [
      ...(latestCommit.added || []),
      ...(latestCommit.modified || []),
      ...(latestCommit.removed || []),
    ].length;

    // Generate tweet draft via SagaPad agent
    const draft = await sagaPadService.generateDraft(commitMsg);

    return NextResponse.json({
      status: "success",
      data: {
        repo,
        hash,
        author,
        commitMsg,
        filesChanged,
        tweetDraft: draft,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (_err) {
    return NextResponse.json(
      { status: "error", message: "Failed to process webhook" },
      { status: 500 }
    );
  }
}

// GET /api/webhook/github — Verify webhook is alive
export async function GET() {
  return NextResponse.json({
    status: "listening",
    endpoint: "/api/webhook/github",
    method: "POST",
    events: ["push"],
    agent: "shiproof-sagapad-skill",
  });
}
