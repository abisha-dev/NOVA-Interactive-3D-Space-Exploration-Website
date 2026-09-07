/**
 * audio.js — Procedural Web Audio API Space Synthesizer
 *
 * Generates an ambient celestial drone without any external MP3 files.
 * Uses Web Audio API Oscillators, Biquad Lowpass Filter, and GainNodes.
 */

let audioCtx = null;
let isPlaying = false;
let masterGain = null;

export function toggleCosmicAudio(btnElement) {
  const allAudioBtns = document.querySelectorAll('.audio-btn');
  if (!isPlaying) {
    startCosmicAudio();
    isPlaying = true;
    allAudioBtns.forEach(btn => {
      btn.classList.add('active');
      btn.innerHTML = '<span>🔊</span> Sound: ON';
    });
  } else {
    stopCosmicAudio();
    isPlaying = false;
    allAudioBtns.forEach(btn => {
      btn.classList.remove('active');
      btn.innerHTML = '<span>🔇</span> Sound: OFF';
    });
  }
}

function startCosmicAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  masterGain = audioCtx.createGain();
  masterGain.gain.setValueAtTime(0.001, audioCtx.currentTime);
  masterGain.gain.exponentialRampToValueAtTime(0.2, audioCtx.currentTime + 3);
  masterGain.connect(audioCtx.destination);

  // Filter for deep warm cosmic resonance
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(420, audioCtx.currentTime);
  filter.Q.setValueAtTime(3.5, audioCtx.currentTime);
  filter.connect(masterGain);

  // Deep space harmonic chord frequencies: C2, G2, D3, A3, E4
  const freqs = [65.41, 98.0, 146.83, 220.0, 329.63];

  freqs.forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    const oscGain = audioCtx.createGain();

    osc.type = i % 2 === 0 ? 'sine' : 'triangle';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    // Subtle drift detune
    osc.detune.setValueAtTime((Math.random() - 0.5) * 12, audioCtx.currentTime);

    oscGain.gain.setValueAtTime(0.18 / freqs.length, audioCtx.currentTime);
    osc.connect(oscGain);
    oscGain.connect(filter);

    osc.start();
  });
}

function stopCosmicAudio() {
  if (masterGain && audioCtx) {
    masterGain.gain.setValueAtTime(masterGain.gain.value, audioCtx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.5);
    setTimeout(() => {
      if (audioCtx) audioCtx.suspend();
    }, 1600);
  }
}
