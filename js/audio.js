'use strict';
// ---------------------------------------------------------------------------
// Procedural audio — every sound is synthesized with WebAudio, no assets.
// ---------------------------------------------------------------------------
const Sfx = {
  ctx: null, out: null, muted: false, noiseBuf: null, ambience: null, vol: 0.55,

  init() {
    if (this.ctx) { if (this.ctx.state === 'suspended') this.ctx.resume(); return; }
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      this.ctx = new AC();
      this.out = this.ctx.createGain();
      this.out.gain.value = this.muted ? 0 : this.vol;
      const comp = this.ctx.createDynamicsCompressor();
      this.out.connect(comp); comp.connect(this.ctx.destination);
      const len = this.ctx.sampleRate * 2;
      const b = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const d = b.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      this.noiseBuf = b;
    } catch (e) { this.ctx = null; }
  },

  toggleMute() {
    this.muted = !this.muted;
    if (this.out) this.out.gain.value = this.muted ? 0 : this.vol;
    return this.muted;
  },

  noise(o) {
    const c = this.ctx, t = c.currentTime + (o.delay || 0);
    const s = c.createBufferSource(); s.buffer = this.noiseBuf;
    const f = c.createBiquadFilter(); f.type = o.type || 'bandpass';
    f.frequency.setValueAtTime(o.freq || 1000, t);
    if (o.freqTo) f.frequency.exponentialRampToValueAtTime(o.freqTo, t + o.dur);
    f.Q.value = o.q || 1;
    const g = c.createGain(); const a = o.attack || 0.005;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(o.vol || 0.5, t + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t + o.dur);
    s.connect(f); f.connect(g); g.connect(this.out);
    s.start(t, Math.random()); s.stop(t + o.dur + 0.05);
  },

  tone(o) {
    const c = this.ctx, t = c.currentTime + (o.delay || 0);
    const osc = c.createOscillator(); osc.type = o.type || 'sine';
    osc.frequency.setValueAtTime(o.freq, t);
    if (o.freqTo) osc.frequency.exponentialRampToValueAtTime(o.freqTo, t + o.dur);
    const g = c.createGain(); const a = o.attack || 0.005;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(o.vol || 0.3, t + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t + o.dur);
    osc.connect(g); g.connect(this.out);
    osc.start(t); osc.stop(t + o.dur + 0.05);
  },

  play(name) {
    if (!this.ctx || this.muted) return;
    const fn = this.lib[name];
    if (fn) { try { fn.call(this); } catch (e) { /* ignore audio errors */ } }
  },

  lib: {
    swing() { this.noise({ dur: 0.2, freq: 700, freqTo: 2800, q: 1.4, vol: 0.3, attack: 0.05 }); },
    heavySwing() { this.noise({ dur: 0.34, freq: 260, freqTo: 1600, q: 1.1, vol: 0.45, attack: 0.1 }); },
    slash() {
      this.noise({ dur: 0.1, freq: 2400, q: 0.8, vol: 0.45 });
      this.noise({ dur: 0.26, type: 'lowpass', freq: 800, freqTo: 180, vol: 0.6 });
      this.tone({ freq: 130, freqTo: 45, dur: 0.16, type: 'sine', vol: 0.5 });
    },
    splat() { this.noise({ dur: 0.32, type: 'lowpass', freq: 900, freqTo: 160, vol: 0.5, attack: 0.01 }); },
    sever() {
      this.noise({ dur: 0.07, type: 'highpass', freq: 3200, vol: 0.45 });
      this.noise({ dur: 0.45, type: 'lowpass', freq: 1300, freqTo: 140, vol: 0.75 });
      this.tone({ freq: 90, freqTo: 30, dur: 0.32, type: 'triangle', vol: 0.6 });
    },
    clang() {
      this.tone({ freq: 1650, dur: 0.45, type: 'triangle', vol: 0.22 });
      this.tone({ freq: 2470, dur: 0.3, type: 'sine', vol: 0.16 });
      this.noise({ dur: 0.09, type: 'highpass', freq: 4000, vol: 0.4 });
    },
    parry() {
      this.tone({ freq: 2100, dur: 0.7, type: 'triangle', vol: 0.3 });
      this.tone({ freq: 3150, dur: 0.6, type: 'sine', vol: 0.2 });
      this.tone({ freq: 4200, dur: 0.4, type: 'sine', vol: 0.12 });
      this.noise({ dur: 0.12, type: 'highpass', freq: 3500, vol: 0.5 });
    },
    hurt() {
      this.tone({ freq: 170, freqTo: 85, dur: 0.24, type: 'sawtooth', vol: 0.18 });
      this.noise({ dur: 0.2, type: 'lowpass', freq: 700, vol: 0.5 });
    },
    roll() { this.noise({ dur: 0.32, type: 'lowpass', freq: 520, vol: 0.32, attack: 0.05 }); },
    step() { this.noise({ dur: 0.05, type: 'lowpass', freq: 320, vol: 0.12 }); },
    flask() {
      this.tone({ freq: 660, dur: 0.6, type: 'sine', vol: 0.12, attack: 0.05 });
      this.tone({ freq: 990, dur: 0.8, type: 'sine', vol: 0.09, attack: 0.1, delay: 0.12 });
      this.tone({ freq: 1320, dur: 0.9, type: 'sine', vol: 0.06, attack: 0.1, delay: 0.24 });
    },
    death() {
      this.tone({ freq: 110, freqTo: 36, dur: 1.8, type: 'sawtooth', vol: 0.25, attack: 0.05 });
      this.noise({ dur: 1.4, type: 'lowpass', freq: 500, freqTo: 80, vol: 0.4 });
      this.tone({ freq: 196, dur: 4, type: 'sine', vol: 0.2, delay: 0.6, attack: 0.02 });
    },
    enemyDie() {
      this.tone({ freq: 230, freqTo: 60, dur: 0.55, type: 'sawtooth', vol: 0.14 });
      this.noise({ dur: 0.4, type: 'lowpass', freq: 400, vol: 0.3 });
    },
    roar() {
      this.tone({ freq: 72, freqTo: 55, dur: 1.4, type: 'sawtooth', vol: 0.4, attack: 0.1 });
      this.tone({ freq: 108, freqTo: 70, dur: 1.4, type: 'sawtooth', vol: 0.25, attack: 0.1 });
      this.noise({ dur: 1.3, type: 'bandpass', freq: 380, q: 0.7, vol: 0.5, attack: 0.15 });
    },
    slam() {
      this.tone({ freq: 62, freqTo: 24, dur: 0.7, type: 'sine', vol: 0.9 });
      this.noise({ dur: 0.65, type: 'lowpass', freq: 320, freqTo: 60, vol: 0.85 });
    },
    shrine() {
      [262, 330, 392, 523].forEach((f, i) =>
        this.tone({ freq: f, dur: 2.2, type: 'sine', vol: 0.08, attack: 0.3, delay: i * 0.08 }));
    },
    ui() { this.tone({ freq: 420, dur: 0.06, type: 'square', vol: 0.04 }); },
    confirm() { this.tone({ freq: 523, dur: 0.15, type: 'triangle', vol: 0.08 }); this.tone({ freq: 784, dur: 0.2, type: 'triangle', vol: 0.06, delay: 0.06 }); },
    bell() {
      this.tone({ freq: 98, dur: 5, type: 'sine', vol: 0.32, attack: 0.01 });
      this.tone({ freq: 196, dur: 4, type: 'sine', vol: 0.14, attack: 0.01 });
      this.tone({ freq: 293, dur: 3, type: 'sine', vol: 0.07, attack: 0.01 });
      this.tone({ freq: 466, dur: 2, type: 'sine', vol: 0.04, attack: 0.01 });
    },
    execute() {
      this.tone({ freq: 55, freqTo: 28, dur: 0.9, type: 'sine', vol: 0.9 });
      this.noise({ dur: 0.12, type: 'highpass', freq: 2500, vol: 0.5 });
      this.noise({ dur: 0.7, type: 'lowpass', freq: 1100, freqTo: 120, vol: 0.8 });
    },
    ember() { this.tone({ freq: 880, freqTo: 1500, dur: 0.25, type: 'sine', vol: 0.06 }); },
    hemorrhage() {
      this.noise({ dur: 0.6, type: 'lowpass', freq: 1500, freqTo: 120, vol: 0.8 });
      this.tone({ freq: 70, freqTo: 35, dur: 0.5, type: 'sine', vol: 0.6 });
    },
  },

  startAmbience() {
    if (!this.ctx || this.ambience) return;
    try {
      const c = this.ctx;
      const g = c.createGain(); g.gain.value = 0.0001; g.connect(this.out);
      g.gain.exponentialRampToValueAtTime(0.07, c.currentTime + 4);
      const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 170; lp.connect(g);
      [55, 55.6, 82.4].forEach(f => {
        const o = c.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f; o.connect(lp); o.start();
      });
      // wind
      const n = c.createBufferSource(); n.buffer = this.noiseBuf; n.loop = true;
      const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 420; bp.Q.value = 0.6;
      const wg = c.createGain(); wg.gain.value = 0.35;
      const lfo = c.createOscillator(); lfo.frequency.value = 0.09;
      const lfoG = c.createGain(); lfoG.gain.value = 220;
      lfo.connect(lfoG); lfoG.connect(bp.frequency); lfo.start();
      n.connect(bp); bp.connect(wg); wg.connect(g); n.start();
      this.ambience = g;
    } catch (e) { /* ignore */ }
  },
};
