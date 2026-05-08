import { NextResponse } from "next/server";

// GET /api/ships — Return recent Proof of Ship posts
export async function GET() {
  const ships = [
    {
      id: "ship_1",
      repo: "user/shiproof-core",
      commitMsg: "feat: implement sagapad skill manifest generator",
      hash: "a1b2c3d",
      tweetDraft:
        "Just shipped the SagaPad skill manifest generator for Shiproof! 🚢 The agent can now automatically register itself. Build in public just got easier. #ProofOfShip #SagaPad",
      postedAt: "2026-05-08T12:00:00Z",
      engagement: { likes: 47, retweets: 12, replies: 8 },
    },
    {
      id: "ship_2",
      repo: "user/defi-agent",
      commitMsg: "fix: resolve reentrancy in vault contract",
      hash: "f4e5d6c",
      tweetDraft:
        "Security first 🛡️ Just patched a potential reentrancy vulnerability in the vault contracts. Staying SAFU. #DeFi #BuildInPublic",
      postedAt: "2026-05-08T10:30:00Z",
      engagement: { likes: 93, retweets: 31, replies: 14 },
    },
    {
      id: "ship_3",
      repo: "user/nft-marketplace",
      commitMsg: "feat: add lazy minting with compressed NFTs",
      hash: "b7c8d9e",
      tweetDraft:
        "🎨 Lazy minting is LIVE! Compressed NFTs on Solana = 99.9% cheaper minting costs. The future of digital art is here. #Solana #NFTs #BuildInPublic",
      postedAt: "2026-05-08T08:15:00Z",
      engagement: { likes: 156, retweets: 54, replies: 22 },
    },
  ];

  return NextResponse.json({ ships, total: ships.length });
}
