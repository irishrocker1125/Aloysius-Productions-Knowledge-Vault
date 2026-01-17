---
title: "Web Audio Patterns"
created: 2026-01-15
type: pattern
language: typescript
reusable: true
source_project: soundboard
tags:
  - pattern
  - typescript
  - web-audio
  - audio
---

# Web Audio Patterns

Working with the Web Audio API for sound synthesis and playback.

## Problem

Web Audio API has complex lifecycle requirements (user gesture for start, node management, context state). We need patterns for reliable audio handling.

## Solution: AudioService Singleton

Centralize AudioContext management:

```typescript
class AudioService {
  private static instance: AudioService;
  private context: AudioContext | null = null;
  private isResumed = false;

  private constructor() {}

  static getInstance(): AudioService {
    if (!AudioService.instance) {
      AudioService.instance = new AudioService();
    }
    return AudioService.instance;
  }

  async resumeContext(): Promise<void> {
    if (!this.context) {
      this.context = new AudioContext();
    }

    if (this.context.state === "suspended") {
      await this.context.resume();
    }

    this.isResumed = true;
  }

  getContext(): AudioContext {
    if (!this.context) {
      this.context = new AudioContext();
    }
    return this.context;
  }

  isReady(): boolean {
    return this.isResumed && this.context?.state === "running";
  }
}

export const audioService = AudioService.getInstance();
```

## ADSR Envelope System

Professional-sounding synthesis with Attack-Decay-Sustain-Release:

```typescript
interface ADSRParams {
  attack: number; // seconds
  decay: number; // seconds
  sustain: number; // 0-1 level
  release: number; // seconds
}

function createEnvelope(context: AudioContext, params: ADSRParams): GainNode {
  const { attack, decay, sustain, release } = params;
  const now = context.currentTime;

  const gainNode = context.createGain();
  gainNode.gain.setValueAtTime(0, now);

  // Attack
  gainNode.gain.linearRampToValueAtTime(1, now + attack);

  // Decay to sustain level
  gainNode.gain.linearRampToValueAtTime(sustain, now + attack + decay);

  return gainNode;
}

function releaseEnvelope(gainNode: GainNode, release: number): void {
  const context = gainNode.context;
  const now = context.currentTime;

  gainNode.gain.cancelScheduledValues(now);
  gainNode.gain.setValueAtTime(gainNode.gain.value, now);
  gainNode.gain.linearRampToValueAtTime(0, now + release);
}
```

## Sound Generator with Presets

```typescript
interface SoundPreset {
  type: OscillatorType;
  frequency: number;
  adsr: ADSRParams;
}

const PRESETS: Record<string, SoundPreset> = {
  kick: {
    type: "sine",
    frequency: 60,
    adsr: { attack: 0.01, decay: 0.2, sustain: 0, release: 0.1 },
  },
  snare: {
    type: "triangle",
    frequency: 200,
    adsr: { attack: 0.01, decay: 0.1, sustain: 0.1, release: 0.2 },
  },
  hihat: {
    type: "square",
    frequency: 800,
    adsr: { attack: 0.01, decay: 0.05, sustain: 0, release: 0.05 },
  },
};

function playSound(presetName: string): void {
  const preset = PRESETS[presetName];
  if (!preset) return;

  const context = audioService.getContext();
  const osc = context.createOscillator();
  const gain = createEnvelope(context, preset.adsr);

  osc.type = preset.type;
  osc.frequency.value = preset.frequency;

  osc.connect(gain);
  gain.connect(context.destination);

  osc.start();

  // Auto-stop after envelope completes
  const duration = preset.adsr.attack + preset.adsr.decay + preset.adsr.release;
  osc.stop(context.currentTime + duration + 0.1);
}
```

## React Integration

### useAudio Hook

```typescript
import { useState, useCallback, useEffect } from "react";

export function useAudio() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(audioService.isReady());
  }, []);

  const initialize = useCallback(async () => {
    await audioService.resumeContext();
    setIsReady(true);
  }, []);

  const play = useCallback(
    (preset: string) => {
      if (!isReady) return;
      playSound(preset);
    },
    [isReady],
  );

  return { isReady, initialize, play };
}
```

### useKeyboard Hook

```typescript
import { useEffect, useCallback, useRef } from "react";

export function useKeyboard(keyMap: Record<string, () => void>) {
  const pressedKeys = useRef(new Set<string>());

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (pressedKeys.current.has(e.key)) return; // Prevent repeat
      pressedKeys.current.add(e.key);

      const handler = keyMap[e.key];
      if (handler) {
        e.preventDefault();
        handler();
      }
    },
    [keyMap],
  );

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    pressedKeys.current.delete(e.key);
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);
}
```

## Key Lessons

| Lesson                                     | Solution                              |
| ------------------------------------------ | ------------------------------------- |
| Browser requires user gesture              | Call `resumeContext()` on first click |
| Can't change oscillator frequency mid-play | Stop and restart with new params      |
| AudioContext should be singleton           | Prevent multiple contexts             |
| Oscillators are one-shot                   | Create new for each sound             |

## Trade-offs

### Synthesized vs Sample-Based

- **Synthesized**: No assets, infinite customization, smaller bundle
- **Sample-Based**: Realistic sounds, simpler code, larger assets

## Source

Extracted from [[projects/web/soundboard|SoundBoard]] - Web Audio synthesis patterns.

## Related

- [[patterns/typescript/factory-di|Factory Pattern with DI]]
- [[references/testkitchen/typescript-conventions|TypeScript Conventions]]
