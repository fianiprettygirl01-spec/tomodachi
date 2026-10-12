/**
 * KIZUNA - Web Ucapan Terima Kasih Sahabat
 * Pure Vanilla JavaScript: Interactive Animations, Canvas Particles,
 * Web Audio Synthesizer, and Celebration Surprise System.
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. WEB AUDIO API SYNTHESIZER (No external files needed, 100% reliable)
  // =========================================================================
  let audioCtx = null;
  let isLofiPlaying = false;
  let lofiTimer = null;

  function initAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Play a soft, pleasing chime/note
  function playNote(freq, type = 'sine', duration = 0.6, gainLevel = 0.08) {
    if (!audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(gainLevel, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio playback failsafe
    }
  }

  // Sound Effect: Fun Pop / Bubble
  function playPopSound() {
    initAudioContext();
    if (!audioCtx) return;
    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(680, now + 0.12);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch (e) {}
  }

  // Sound Effect: Card Flip
  function playFlipSound() {
    initAudioContext();
    if (!audioCtx) return;
    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(260, now + 0.08);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch (e) {}
  }

  // Sound Effect: Grand Fanfare / Sparkle Chime for Arigatou Surprise
  function playGrandFanfare() {
    initAudioContext();
    if (!audioCtx) return;
    // Pentatonic ascending celebration melody: C5, D5, E5, G5, A5, C6
    const melody = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50];
    melody.forEach((f, idx) => {
      setTimeout(() => {
        playNote(f, 'sine', 0.8, 0.12);
      }, idx * 110);
    });
  }

  // Ambient Lo-fi Generator
  const lofiChords = [
    [261.63, 329.63, 392.00, 493.88], // Cmaj7
    [220.00, 261.63, 329.63, 392.00], // Am7
    [349.23, 440.00, 523.25, 659.25], // Fmaj7
    [392.00, 493.88, 587.33, 698.46]  // G7
  ];
  let chordIndex = 0;

  function playLofiStep() {
    if (!isLofiPlaying || !audioCtx) return;
    const chord = lofiChords[chordIndex % lofiChords.length];
    chord.forEach((freq, i) => {
      setTimeout(() => {
        if (isLofiPlaying) {
          playNote(freq, 'triangle', 2.0, 0.035);
        }
      }, i * 140);
    });
    chordIndex++;
    lofiTimer = setTimeout(playLofiStep, 2800);
  }

  // Audio Toggle UI
  const audioBtn = document.getElementById('audio-toggle-btn');
  const audioText = document.getElementById('audio-text');

  audioBtn.addEventListener('click', () => {
    initAudioContext();
    isLofiPlaying = !isLofiPlaying;

    if (isLofiPlaying) {
      audioBtn.classList.add('playing');
      audioText.textContent = 'Suara: On 🎶';
      playLofiStep();
      showToast('🎵 Musik pengiring santai dinyalakan');
    } else {
      audioBtn.classList.remove('playing');
      audioText.textContent = 'Suara: Off';
      if (lofiTimer) clearTimeout(lofiTimer);
      showToast('🔇 Musik dimatikan');
    }
  });

  // =========================================================================
  // 2. AMBIENT SKY PARTICLES CANVAS (Floating Petals & Gentle Stars)
  // =========================================================================
  const canvas = document.getElementById('sky-canvas');
  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const PARTICLE_COUNT = Math.min(38, Math.floor(window.innerWidth / 30));

  class SkyParticle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -20;
      this.size = Math.random() * 5 + 3;
      this.speedX = Math.random() * 0.8 - 0.2;
      this.speedY = Math.random() * 0.9 + 0.4;
      this.opacity = Math.random() * 0.55 + 0.25;
      this.type = Math.random() > 0.45 ? 'petal' : 'star';
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.03;
      // Palette from theme: Soft Rose Petals & Sky sparkles
      this.color = this.type === 'petal' 
        ? `rgba(251, 113, 133, ${this.opacity})` 
        : `rgba(56, 189, 248, ${this.opacity})`;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.rotation += this.rotSpeed;

      if (this.y > height + 20 || this.x < -20 || this.x > width + 20) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);

      if (this.type === 'petal') {
        // Draw soft petal
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size, this.size * 1.6, 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Draw 4-point star sparkle
        ctx.fillStyle = this.color;
        ctx.beginPath();
        for (let i = 0; i < 4; i++) {
          ctx.lineTo(Math.cos((i * Math.PI) / 2) * this.size, Math.sin((i * Math.PI) / 2) * this.size);
          ctx.lineTo(
            Math.cos((i * Math.PI) / 2 + Math.PI / 4) * (this.size * 0.35),
            Math.sin((i * Math.PI) / 2 + Math.PI / 4) * (this.size * 0.35)
          );
        }
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new SkyParticle());
  }

  // Active Confetti Bursts Array
  const confettiParticles = [];

  class Confetti {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 9 + 4;
      this.vx = Math.cos(angle) * velocity;
      this.vy = Math.sin(angle) * velocity - 2;
      this.gravity = 0.22;
      this.friction = 0.96;
      this.size = Math.random() * 8 + 5;
      this.colors = ['#38bdf8', '#0284c7', '#fb7185', '#f43f5e', '#10b981', '#fbbf24', '#ffffff'];
      this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
      this.rotation = Math.random() * 360;
      this.rotSpeed = (Math.random() - 0.5) * 12;
      this.life = 1;
      this.decay = Math.random() * 0.015 + 0.01;
    }

    update() {
      this.vx *= this.friction;
      this.vy *= this.friction;
      this.vy += this.gravity;
      this.x += this.vx;
      this.y += this.vy;
      this.rotation += this.rotSpeed;
      this.life -= this.decay;
    }

    draw() {
      if (this.life <= 0) return;
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = Math.max(0, this.life);
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.6);
      ctx.restore();
    }
  }

  function launchConfetti(x = width / 2, y = height / 2, count = 70) {
    for (let i = 0; i < count; i++) {
      confettiParticles.push(new Confetti(x, y));
    }
  }

  function animateCanvas() {
    ctx.clearRect(0, 0, width, height);

    // Draw ambient sky particles
    particles.forEach(p => {
      p.update();
      p.draw();
    });

    // Draw active confetti
    for (let i = confettiParticles.length - 1; i >= 0; i--) {
      const c = confettiParticles[i];
      c.update();
      c.draw();
      if (c.life <= 0) {
        confettiParticles.splice(i, 1);
      }
    }

    requestAnimationFrame(animateCanvas);
  }
  animateCanvas();

  // =========================================================================
  // 3. GRAND SURPRISE MODAL ("ありがとうございます")
  // =========================================================================
  const modal = document.getElementById('surprise-modal');
  const modalClose = document.getElementById('modal-close');
  const modalDismiss = document.getElementById('modal-dismiss-btn');
  const modalConfettiBtn = document.getElementById('modal-confetti-btn');

  // Trigger buttons
  const heroSurpriseBtn = document.getElementById('hero-surprise-btn');
  const navSurpriseBtn = document.getElementById('nav-surprise-btn');
  const letterSurpriseBtn = document.getElementById('letter-surprise-btn');

  function openSurpriseModal() {
    initAudioContext();
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Sound and Visual fanfare
    playGrandFanfare();
    launchConfetti(window.innerWidth / 2, window.innerHeight * 0.45, 110);

    // Additional mini blast after 300ms
    setTimeout(() => {
      launchConfetti(window.innerWidth * 0.35, window.innerHeight * 0.4, 45);
      launchConfetti(window.innerWidth * 0.65, window.innerHeight * 0.4, 45);
    }, 300);
  }

  function closeSurpriseModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  [heroSurpriseBtn, navSurpriseBtn, letterSurpriseBtn].forEach(btn => {
    if (btn) btn.addEventListener('click', openSurpriseModal);
  });

  [modalClose, modalDismiss].forEach(btn => {
    if (btn) btn.addEventListener('click', closeSurpriseModal);
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeSurpriseModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeSurpriseModal();
    }
  });

  modalConfettiBtn.addEventListener('click', () => {
    playGrandFanfare();
    launchConfetti(window.innerWidth / 2, window.innerHeight * 0.5, 90);
    showToast('🎉 Kembang api meluncur lagi! Respect bro!');
  });

  // Modal Reaction Buttons
  const reactBtns = document.querySelectorAll('.react-btn');
  const reactToast = document.getElementById('reaction-toast');

  const reactionMessages = {
    '👊': 'Bro Fist diterima! Solid selalu selamanya! 👊',
    '🔥': 'Semangat membara pantang padam! Let’s go! 🔥',
    '🍻': 'Yuk agendain nongkrong santai segera! ☕🍻',
    '❤️': 'Big respect for you, my brother! ❤️'
  };

  reactBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const reaction = btn.dataset.reaction;
      playPopSound();
      launchConfetti(window.innerWidth / 2, window.innerHeight * 0.6, 25);
      
      reactToast.textContent = reactionMessages[reaction] || 'Respon tercatat!';
      reactToast.style.opacity = '1';

      btn.style.transform = 'scale(1.25)';
      setTimeout(() => {
        btn.style.transform = '';
      }, 200);

      setTimeout(() => {
        reactToast.style.opacity = '0';
      }, 3500);
    });
  });

  // =========================================================================
  // 4. INTERACTIVE CAT MASCOT (Speech Bubble + Bounce + Spawns)
  // =========================================================================
  const mascotZone = document.getElementById('mascot-interact-zone');
  const catImg = document.getElementById('cat-flower-img');
  const speechBubble = document.getElementById('cat-speech');
  const bubbleText = speechBubble.querySelector('.bubble-text');

  const catQuotes = [
    '"Nih bunga spesial buat lu, bro! Lu udah berjuang hebat hari ini!" 🌸',
    '"Capek itu wajar, bro. Yang penting lu gak pernah nyerah! Respect!" 👊',
    '"Jangan lupa istirahat yang cukup ya! Lu berharga banget buat kita!" ☕',
    '"Otsukaresama deshita! Dunia lebih seru karena ada sahabat kayak lu!" ✨',
    '"Lu lebih kuat dari apa pun yang lagi lu hadapi sekarang, percaya deh!" 💪',
    '"Senyum dulu bro, nih bunga wangi khusus didatengin buat lu!" 🌼',
    '"Bangga banget punya sahabat se-keren lu! Semangat terus, bro!" 🚀'
  ];

  let quoteIdx = 0;

  mascotZone.addEventListener('click', (e) => {
    playPopSound();

    // Trigger image bounce animation
    catImg.classList.remove('cat-bounce');
    void catImg.offsetWidth; // trigger reflow
    catImg.classList.add('cat-bounce');

    // Update speech bubble text
    quoteIdx = (quoteIdx + 1) % catQuotes.length;
    bubbleText.textContent = catQuotes[quoteIdx];
    speechBubble.style.transform = 'translateX(-50%) scale(1.08)';
    setTimeout(() => {
      speechBubble.style.transform = 'translateX(-50%) scale(1)';
    }, 250);

    // Spawn tiny floating petals near the click
    const rect = mascotZone.getBoundingClientRect();
    launchConfetti(rect.left + rect.width / 2, rect.top + rect.height * 0.35, 20);
  });

  // =========================================================================
  // 5. TOS SEMANGAT (BRO FIST COUNTER)
  // =========================================================================
  const fistBtn = document.getElementById('cheer-fist-btn');
  const fistCountBadge = document.getElementById('fist-count');
  let fistCount = 0;

  // Restore saved fist bumps from localStorage
  try {
    const saved = localStorage.getItem('kizuna_fist_count');
    if (saved) {
      fistCount = parseInt(saved, 10) || 0;
      fistCountBadge.textContent = fistCount;
    }
  } catch (e) {}

  fistBtn.addEventListener('click', (e) => {
    playPopSound();
    fistCount++;
    fistCountBadge.textContent = fistCount;
    try {
      localStorage.setItem('kizuna_fist_count', fistCount.toString());
    } catch (e) {}

    // Bounce button
    fistBtn.style.transform = 'scale(0.92)';
    setTimeout(() => {
      fistBtn.style.transform = '';
    }, 150);

    // Mini confetti near button
    const rect = fistBtn.getBoundingClientRect();
    launchConfetti(rect.left + rect.width / 2, rect.top, 16);

    const cheeringTexts = [
      '👊 Tos bro! Solid selamanya!',
      '🔥 Energi bertambah! Semangat terus!',
      '🤝 Sahabat sejati pantang mundur!',
      '✨ Bro power +100!'
    ];
    showToast(cheeringTexts[Math.floor(Math.random() * cheeringTexts.length)]);
  });

  // =========================================================================
  // 6. OMIKUJI BOOSTER CARDS (3D Flip)
  // =========================================================================
  const boosterCards = document.querySelectorAll('.booster-card');

  boosterCards.forEach(card => {
    card.addEventListener('click', () => {
      playFlipSound();
      card.classList.toggle('is-flipped');
    });
  });

  // =========================================================================
  // 7. FLOATING TOAST NOTIFIER
  // =========================================================================
  const toast = document.getElementById('floating-toast');
  let toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }
});
