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
    } catch (e) { }
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
    } catch (e) { }
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
    showToast('Haik, gil chan');
  });

  // Modal Reaction Buttons
  const reactBtns = document.querySelectorAll('.react-btn');
  const reactToast = document.getElementById('reaction-toast');

  const reactionMessages = {
    '👊': 'Ganbatte nee! 👊',
    '🔥': 'Ini api untuk bakar sate btw 🔥',
    '💫': 'Kakkoii nee, Gil chan 💫',
    '❤️': 'Big respect for, Gil chan ❤️'
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
    '"Nih bunga sakura, next time kamu liat sendiri di Jepang ya" 🌸',
    '"Ganbatte ne!" 👊',
    '"Jangan lupa istirahat ya Gil chan" ☕',
    '"Otsukaresama deshita! Bumi lebih seru karena ada kamu gil chan" ✨',
    '"Kimi wa tsuyoiiii" 💪',
    '"Ini bunga juga, jangan kamu taruh kulkas ya" 🌼',
    '"Ayo wujudkan anata no yumei!" 🚀'
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
  // 5. TOS SEMANGAT (BRO FIST COUNTER) & RESET
  // =========================================================================
  const fistBtn = document.getElementById('cheer-fist-btn');
  const fistCountBadge = document.getElementById('fist-count');
  const resetFistBtn = document.getElementById('reset-fist-btn');
  let fistCount = 0;

  // Reset hitungan tos ke 0 sesuai permintaan
  try {
    localStorage.removeItem('kizuna_fist_count');
    localStorage.setItem('kizuna_fist_count', '0');
  } catch (e) { }
  if (fistCountBadge) {
    fistCountBadge.textContent = '0';
  }

  if (fistBtn) {
    fistBtn.addEventListener('click', (e) => {
      playPopSound();
      fistCount++;
      fistCountBadge.textContent = fistCount;
      try {
        localStorage.setItem('kizuna_fist_count', fistCount.toString());
      } catch (e) { }

      // Bounce button
      fistBtn.style.transform = 'scale(0.92)';
      setTimeout(() => {
        fistBtn.style.transform = '';
      }, 150);

      // Mini confetti near button
      const rect = fistBtn.getBoundingClientRect();
      launchConfetti(rect.left + rect.width / 2, rect.top, 16);

      const cheeringTexts = [
        '👊 Ganbatte nee Gil chan!',
        '❤️‍🩹 Tsuyoii na gil chan!',
        '🤝 Nice to meet gil chan',
        '✨ Nee, ureshii?'
      ];
      showToast(cheeringTexts[Math.floor(Math.random() * cheeringTexts.length)]);
    });
  }

  // Tombol Reset Hitungan Tos
  if (resetFistBtn) {
    resetFistBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      playPopSound();
      fistCount = 0;
      fistCountBadge.textContent = '0';
      try {
        localStorage.setItem('kizuna_fist_count', '0');
      } catch (e) { }
      showToast('Hitungan tos di-reset ke 0! Ayo mulai lagi gil chan 👊');
    });
  }

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

  // =========================================================================
  // 8. FITUR FOTO 3 ICON (NIPPON, MIE GACOAN, MENG-MENG)
  // =========================================================================
  const galleryModal = document.getElementById('gallery-modal');
  const galleryClose = document.getElementById('gallery-close');
  const galleryDismiss = document.getElementById('gallery-dismiss-btn');
  const galleryBadge = document.getElementById('gallery-badge');
  const galleryTitle = document.getElementById('gallery-title');
  const gallerySubtitle = document.getElementById('gallery-subtitle');
  const galleryMainImg = document.getElementById('gallery-main-img');
  const galleryCaption = document.getElementById('gallery-caption');
  const galleryPrev = document.getElementById('gallery-prev');
  const galleryNext = document.getElementById('gallery-next');
  const galleryThumbs = document.getElementById('gallery-thumbs');
  const galleryCounter = document.getElementById('gallery-counter');

  const photoFeatures = {
    nippon: {
      badgeText: '🗾 NIPPON • JEPANG',
      badgeClass: 'badge-nippon',
      title: 'Ayo Kita ke Jepang Gil Chaaan!',
      subtitle: 'Ayo kita ke jepang gil chaaan, いっしょにがんばろう',
      photos: [
        {
          src: './Jepang 1.jpg',
          caption: 'Kireii'
        },
        {
          src: './Jepang 2.jpg',
          caption: 'Ini juga kireii'
        },
        {
          src: './Jepang 3.jpg',
          caption: 'Sugoiii!'
        }
      ]
    },
    gacoan: {
      badgeText: '🍝 MIE GACOAN',
      badgeClass: 'badge-gacoan',
      title: 'Ayo Kita Makan Mie Gacoan Gil Chan!',
      subtitle: 'Kita harus pindahin gacoan ke jepang',
      photos: [
        {
          src: './gacoan 1.jpg',
          caption: 'Ikuzooo'
        },
        {
          src: './gacoan 2.jpg',
          caption: 'Oishii'
        },
        {
          src: './gacoan 3.jpg',
          caption: 'Kamu harus yang level 10🌶️'
        }
      ]
    },
    meng: {
      badgeText: '🐈 MENG-MENG',
      badgeClass: 'badge-meng',
      title: 'Mengenang Meng-meng 😔',
      subtitle: 'Mari Mengenang meng-meng😔🤍',
      photos: [
        {
          src: './Meng meng sad.jpeg',
          caption: 'Rest in love meng meng'
        }
      ]
    }
  };

  let activeFeatureKey = null;
  let activePhotoIndex = 0;

  function renderGalleryPhoto(index) {
    if (!activeFeatureKey) return;
    const currentFeature = photoFeatures[activeFeatureKey];
    if (!currentFeature || !currentFeature.photos.length) return;

    activePhotoIndex = (index + currentFeature.photos.length) % currentFeature.photos.length;
    const currentPhoto = currentFeature.photos[activePhotoIndex];

    // Animasi transisi foto
    galleryMainImg.style.opacity = '0.2';
    galleryMainImg.style.transform = 'scale(0.97)';
    galleryMainImg.src = currentPhoto.src;
    galleryMainImg.alt = currentPhoto.caption;

    galleryMainImg.onload = () => {
      galleryMainImg.style.opacity = '1';
      galleryMainImg.style.transform = 'scale(1)';
    };

    galleryCaption.textContent = currentPhoto.caption;

    if (currentFeature.photos.length > 1) {
      galleryCounter.textContent = `${activePhotoIndex + 1} / ${currentFeature.photos.length}`;
      galleryPrev.classList.remove('hidden');
      galleryNext.classList.remove('hidden');
    } else {
      galleryCounter.textContent = '1 Foto Kenangan';
      galleryPrev.classList.add('hidden');
      galleryNext.classList.add('hidden');
    }

    // Update active thumbnail
    const thumbElements = galleryThumbs.querySelectorAll('.gallery-thumb');
    thumbElements.forEach((el, i) => {
      el.classList.toggle('active', i === activePhotoIndex);
    });
  }

  function openGalleryModal(featureKey) {
    const feature = photoFeatures[featureKey];
    if (!feature) return;

    initAudioContext();
    playPopSound();

    activeFeatureKey = featureKey;
    activePhotoIndex = 0;

    // Header info
    galleryBadge.textContent = feature.badgeText;
    galleryBadge.className = `gallery-badge ${feature.badgeClass}`;
    galleryTitle.textContent = feature.title;
    gallerySubtitle.textContent = feature.subtitle;

    // Render thumbnails
    galleryThumbs.innerHTML = '';
    if (feature.photos.length > 1) {
      feature.photos.forEach((photo, idx) => {
        const thumb = document.createElement('div');
        thumb.className = `gallery-thumb ${idx === 0 ? 'active' : ''}`;
        thumb.title = `Foto ${idx + 1}`;
        thumb.innerHTML = `<img src="${photo.src}" alt="Thumb ${idx + 1}">`;
        thumb.addEventListener('click', () => {
          playPopSound();
          renderGalleryPhoto(idx);
        });
        galleryThumbs.appendChild(thumb);
      });
      galleryThumbs.style.display = 'flex';
    } else {
      galleryThumbs.style.display = 'none';
    }

    // Render first photo
    renderGalleryPhoto(0);

    // Buka modal
    galleryModal.classList.add('active');
    galleryModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Efek partikel halus
    launchConfetti(window.innerWidth / 2, window.innerHeight * 0.45, 30);
  }

  function closeGalleryModal() {
    if (!galleryModal) return;
    galleryModal.classList.remove('active');
    galleryModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Event listener tombol close galeri
  if (galleryClose) galleryClose.addEventListener('click', closeGalleryModal);
  if (galleryDismiss) galleryDismiss.addEventListener('click', closeGalleryModal);

  if (galleryModal) {
    galleryModal.addEventListener('click', (e) => {
      if (e.target === galleryModal) {
        closeGalleryModal();
      }
    });
  }

  // Tombol navigasi foto
  if (galleryPrev) {
    galleryPrev.addEventListener('click', () => {
      playPopSound();
      renderGalleryPhoto(activePhotoIndex - 1);
    });
  }

  if (galleryNext) {
    galleryNext.addEventListener('click', () => {
      playPopSound();
      renderGalleryPhoto(activePhotoIndex + 1);
    });
  }

  // Pasang click listener pada 3 icon badge (Mie Gacoan, Meng-meng, Nippon)
  const clickableBadges = document.querySelectorAll('.clickable-badge');
  clickableBadges.forEach(badge => {
    badge.addEventListener('click', () => {
      const feat = badge.dataset.feature;
      if (feat) {
        openGalleryModal(feat);
      }
    });

    badge.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const feat = badge.dataset.feature;
        if (feat) {
          openGalleryModal(feat);
        }
      }
    });
  });

  // Navigasi keyboard saat modal terbuka
  document.addEventListener('keydown', (e) => {
    if (galleryModal && galleryModal.classList.contains('active')) {
      if (e.key === 'Escape') {
        closeGalleryModal();
      } else if (e.key === 'ArrowLeft') {
        renderGalleryPhoto(activePhotoIndex - 1);
      } else if (e.key === 'ArrowRight') {
        renderGalleryPhoto(activePhotoIndex + 1);
      }
    }
  });

  // =========================================================================
  // 9. HALAMAN AWAL: LOGIKA AMPLOP SURAT (FROM FIANI TO GIL CHAN)
  // =========================================================================
  const envelopeScreen = document.getElementById('welcome-envelope-screen');
  const envelopeBox = document.getElementById('envelope-clickable');
  const reopenEnvelopeBtn = document.getElementById('reopen-envelope-btn');

  // Kunci scroll halaman saat amplop awal aktif
  if (envelopeScreen && !envelopeScreen.classList.contains('opened')) {
    document.body.style.overflow = 'hidden';
  }

  function openEnvelope() {
    if (!envelopeBox || !envelopeScreen) return;
    if (envelopeBox.classList.contains('is-opening')) return;

    initAudioContext();
    playGrandFanfare();

    envelopeBox.classList.add('is-opening');

    // Partikel konfeti & kelopak bunga memancar dari amplop
    const rect = envelopeBox.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    launchConfetti(centerX, centerY, 60);

    setTimeout(() => {
      launchConfetti(centerX - 60, centerY, 30);
      launchConfetti(centerX + 60, centerY, 30);
    }, 250);

    // Masuk ke halaman utama secara mulus
    setTimeout(() => {
      envelopeScreen.classList.add('opened');
      document.body.style.overflow = '';
      showToast('🌸 Tadaaaaaa ✨');
    }, 850);
  }

  if (envelopeBox) {
    envelopeBox.addEventListener('click', openEnvelope);
    envelopeBox.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openEnvelope();
      }
    });
  }

  // Tombol untuk membuka amplop awal lagi kapan saja
  if (reopenEnvelopeBtn) {
    reopenEnvelopeBtn.addEventListener('click', () => {
      if (!envelopeScreen || !envelopeBox) return;
      playPopSound();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      envelopeBox.classList.remove('is-opening');
      envelopeScreen.classList.remove('opened');
      document.body.style.overflow = 'hidden';
      showToast('✉️ Amplop dari Fiani dibuka kembali');
    });
  }
});
