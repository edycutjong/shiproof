import { NextResponse } from "next/server";

// GET /api/skill/manifest — Return SagaPad skill manifest
export async function GET() {
  const manifest = {
    name: "shiproof",
    displayName: "Shiproof — Proof of Ship Automator",
    version: "1.0.0",
    description:
      "Automatically generate and post 'Proof of Ship' tweets when code is pushed to GitHub. Turns every commit into a build-in-public narrative.",
    author: "edycutjong",
    category: "Colosseum Hackathon",
    type: "action",
    trigger: {
      type: "webhook",
      event: "github.push",
      endpoint: "/api/webhook/github",
    },
    capabilities: [
      {
        name: "commit_summarize",
        description: "AI-powered commit message to tweet conversion",
        model: "gpt-4o-mini",
      },
      {
        name: "x_post_draft",
        description: "Auto-draft X/Twitter posts with engagement-optimized copy",
        api: "X API v2",
      },
      {
        name: "scheduled_posting",
        description: "Queue posts for optimal engagement windows",
        timing: "peak_hours",
      },
    ],
    authentication: {
      github: "webhook_secret",
      x_api: "oauth2_pkce",
      sagapad: "api_key",
    },
    config: {
      tone: ["excited_builder", "technical", "casual", "hype"],
      maxTweetLength: 280,
      includeHashtags: true,
      defaultHashtags: ["#ProofOfShip", "#BuildInPublic", "#SagaPad"],
    },
    marketplace: {
      published: true,
      url: "https://sagapad.com/skills/shiproof",
      category: "Colosseum Hackathon",
    },
  };

  return NextResponse.json(manifest);
}
