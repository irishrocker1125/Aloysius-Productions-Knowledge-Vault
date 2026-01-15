---
title: "SoundBoard"
created: 2026-01-15
updated: 2026-01-15
type: project
project: soundboard
platform: web
version: v0.1
status: active
tags:
  - project
  - web
  - typescript
  - react
  - audio
source: "SoundBoard/.management/knowledge.md"
---

# SoundBoard

A web-based sound synthesizer using the Web Audio API. Users can trigger sounds via a 3x3 grid with keyboard shortcuts.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Synthesized sounds over audio files | Eliminates asset management, enables real-time customization | Good |
| Singleton AudioService pattern | Single AudioContext, centralized buffer/node management | Good |
| ADSR envelope system | Professional sound shaping, matches user expectations | Good |
| Keyboard bindings 1-9 | Intuitive mapping, matches 3x3 grid layout | Good |
| Web Audio API only | No external dependencies, full browser control | Good |
| React hooks for state | useAudio and useKeyboard separation of concerns | Good |

## Patterns Established

| Pattern | Description | Reusable |
|---------|-------------|----------|
| AudioService singleton | Centralized Web Audio context management | Yes |
| SoundGenerator with presets | Oscillator synthesis with ADSR envelopes | Yes |
| useAudio hook | Playback state management for React | Yes |
| useKeyboard hook | Key binding to actions with repeat prevention | Yes |
| CSS co-location | Component.tsx paired with Component.css | Yes |

## Lessons Learned

| Lesson | Impact | Recommendation |
|--------|--------|----------------|
| Browser autoplay policy requires user gesture | Must call resumeContext() on first click | Always handle AudioContext resume |
| Web Audio rate/volume can't change mid-play | Need to stop and restart sound | Document this constraint upfront |
| Oscillator presets are more flexible than files | Customization becomes trivial | Consider synthesis before file-based audio |

## Technical Debt

| Item | Priority | Notes |
|------|----------|-------|
| No persistence for custom sounds | Medium | Planned for v0.3 |
| Limited to 9 sounds | Low | Grid layout constraint |

## Related

- [[patterns/typescript/web-audio|Web Audio Patterns]]
- [[references/testkitchen/typescript-conventions|TypeScript Conventions]]
