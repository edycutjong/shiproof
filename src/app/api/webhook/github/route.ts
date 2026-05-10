import { NextResponse } from "next/server";
import { sagaPadService } from "@/lib/sagapad";

async function verifyHmac(secret: string, body: string, signatureHeader: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const mac = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
  const hex = Array.from(new Uint8Array(mac))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  const expected = `sha256=${hex}`;

  if (expected.length !== signatureHeader.length) return false;

  // Constant-time comparison
  const a = encoder.encode(expected);
  const b2 = encoder.encode(signatureHeader);
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a[i] ^ b2[i];
  }
  return diff === 0;
}

// POST /api/webhook/github — Receive GitHub push event, generate tweet draft
export async function POST(request: Request) {
  try {
    const body = await request.text();
    const secret = process.env.GITHUB_WEBHOOK_SECRET;

    // HMAC verification when secret is configured
    if (secret) {
      const signature = request.headers.get("x-hub-signature-256");
      if (!signature) {
        return NextResponse.json(
          { status: "error", message: "Missing signature header" },
          { status: 401 }
        );
      }
      const valid = await verifyHmac(secret, body, signature);
      if (!valid) {
        return NextResponse.json(
          { status: "error", message: "Invalid signature" },
          { status: 401 }
        );
      }
    }

    const payload = JSON.parse(body);

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
  } catch {
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
