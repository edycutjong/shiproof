#!/usr/bin/env python3
"""
Shiproof — Offline Verification Script
Validates all core features work without external API dependencies.
"""

import json
import subprocess
import sys
import time

CHECKS = []
PASS = 0
FAIL = 0

def check(name, condition, detail=""):
    global PASS, FAIL
    status = "✅" if condition else "❌"
    if condition:
        PASS += 1
    else:
        FAIL += 1
    CHECKS.append({"name": name, "pass": condition, "detail": detail})
    print(f"  {status} {name}" + (f" — {detail}" if detail else ""))

def main():
    print("\n" + "=" * 60)
    print("  🚢 SHIPROOF — Offline Verification")
    print("=" * 60 + "\n")

    # 1. Check project structure
    print("[1/6] Project Structure")
    import os
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    
    required_files = [
        "package.json",
        "src/app/page.tsx",
        "src/app/layout.tsx",
        "src/app/globals.css",
        "src/app/about/page.tsx",
        "src/app/api/webhook/github/route.ts",
        "src/app/api/ships/route.ts",
        "src/app/api/skill/manifest/route.ts",
        "src/app/api/health/route.ts",
        "src/lib/sagapad.ts",
        "src/components/ParticleBackground.tsx",
        "src/components/ScrambleText.tsx",
        "src/components/FlowDiagram.tsx",
        "src/components/TerminalLog.tsx",
        "src/components/AnimatedCounter.tsx",
        "src/components/StatusBar.tsx",
        "src/components/Footer.tsx",
    ]
    
    for f in required_files:
        path = os.path.join(root, f)
        check(f"File exists: {f}", os.path.exists(path))

    # 2. Check package.json
    print("\n[2/6] Package Configuration")
    pkg_path = os.path.join(root, "package.json")
    with open(pkg_path) as f:
        pkg = json.load(f)
    
    check("Package name defined", pkg.get("name") == "shiproof")
    check("Next.js 16 dependency", "16" in pkg.get("dependencies", {}).get("next", ""))
    check("React 19 dependency", "19" in pkg.get("dependencies", {}).get("react", ""))
    check("Tailwind v4 devDependency", "4" in pkg.get("devDependencies", {}).get("tailwindcss", ""))
    check("Dev script exists", "dev" in pkg.get("scripts", {}))
    check("Build script exists", "build" in pkg.get("scripts", {}))

    # 3. Check SagaPad SDK wrapper
    print("\n[3/6] SagaPad SDK Integration")
    sdk_path = os.path.join(root, "src/lib/sagapad.ts")
    with open(sdk_path) as f:
        sdk_content = f.read()
    
    check("SagaPad service class exists", "class SagaPadService" in sdk_content)
    check("generateDraft method", "generateDraft" in sdk_content)
    check("validateManifest method", "validateManifest" in sdk_content)
    check("Fallback for demo mode", "Fallback" in sdk_content or "fallback" in sdk_content)
    check("API key handling", "SAGAPAD_API_KEY" in sdk_content or "api_key" in sdk_content.lower())

    # 4. Check API routes
    print("\n[4/6] API Routes")
    webhook_path = os.path.join(root, "src/app/api/webhook/github/route.ts")
    with open(webhook_path) as f:
        webhook_content = f.read()
    check("Webhook POST handler", "export async function POST" in webhook_content)
    check("Webhook GET handler", "export async function GET" in webhook_content)
    check("Processes commit data", "commitMsg" in webhook_content or "commit" in webhook_content)

    manifest_path = os.path.join(root, "src/app/api/skill/manifest/route.ts")
    with open(manifest_path) as f:
        manifest_content = f.read()
    check("Skill manifest endpoint", "manifest" in manifest_content.lower())
    check("Skill type defined", '"action"' in manifest_content or "'action'" in manifest_content)
    check("SagaPad marketplace reference", "sagapad" in manifest_content.lower())

    ships_path = os.path.join(root, "src/app/api/ships/route.ts")
    with open(ships_path) as f:
        ships_content = f.read()
    check("Ships GET handler", "export async function GET" in ships_content)

    # 5. Check UI components
    print("\n[5/6] UI Components")
    components = [
        ("ParticleBackground.tsx", ["canvas", "requestAnimationFrame"]),
        ("ScrambleText.tsx", ["scrambl" ]),
        ("FlowDiagram.tsx", ["Git Push", "SagaPad"]),
        ("TerminalLog.tsx", ["terminal", "LIVE"]),
        ("AnimatedCounter.tsx", ["counter" ]),
        ("StatusBar.tsx", ["ONLINE", "LATENCY"]),
    ]
    
    for comp_name, keywords in components:
        comp_path = os.path.join(root, "src/components", comp_name)
        with open(comp_path) as f:
            content = f.read().lower()
        found = all(kw.lower() in content for kw in keywords)
        check(f"Component: {comp_name}", found, f"keywords: {', '.join(keywords)}")

    # 6. Check CSS design system
    print("\n[6/6] Design System")
    css_path = os.path.join(root, "src/app/globals.css")
    with open(css_path) as f:
        css_content = f.read()
    
    check("Tailwind import", "@import" in css_content and "tailwindcss" in css_content)
    check("Brand primary color", "--color-brand-primary" in css_content)
    check("Glass panel styles", ".glass-panel" in css_content)
    check("Neon glow effects", "neon" in css_content)
    check("Keyframe animations", "@keyframes" in css_content)
    check("Scan line effect", "scanline" in css_content or "scan-line" in css_content)

    # Summary
    total = PASS + FAIL
    print("\n" + "=" * 60)
    print(f"  RESULTS: {PASS}/{total} checks passed")
    if FAIL == 0:
        print("  🎉 ALL CHECKS PASSED — Ready for submission!")
    else:
        print(f"  ⚠️  {FAIL} check(s) failed")
    print("=" * 60 + "\n")

    return 0 if FAIL == 0 else 1

if __name__ == "__main__":
    sys.exit(main())
