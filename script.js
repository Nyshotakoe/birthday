/* ===================================================================
   INTERACTIVE SCRIPT FOR BIRTHDAY WEBSITE
   - Envelope Opening & Closing
   - Cake & Candle Blowing with Web Audio Sound Effects & Confetti
   - Ambient Canvas (Petals & Sparkles)
   - Built-in Romantic Piano/Lofi Chime Generator (No external MP3 needed!)
   - Photo Lightbox
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // -----------------------------------------------------------------
  // 1. DATE FORMATTING
  // -----------------------------------------------------------------
  const heroDate = document.getElementById('hero-date');
  if (heroDate) {
    heroDate.textContent = '9 ОКТЯБРЯ 2026';
  }

  // -----------------------------------------------------------------
  // 2. WEB AUDIO SYNTHESIZER (Guaranteed sound with zero external files)
  // -----------------------------------------------------------------
  let audioCtx = null;

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // Sound: Blowing out candles (whoosh wind sound)
  function playBlowSound() {
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const bufferSize = ctx.sampleRate * 0.8;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.25));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.7);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.7);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  // Sound: Magical celebration chime
  function playMagicChime() {
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);

        gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + idx * 0.1 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.1 + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.1);
        osc.stop(ctx.currentTime + idx * 0.1 + 1.3);
      });
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }



  // -----------------------------------------------------------------
  // 4. INTERACTIVE ENVELOPE & LETTER
  // -----------------------------------------------------------------
  const waxSeal = document.getElementById('wax-seal');
  const envelope = document.getElementById('envelope');
  const envelopeWrapper = document.getElementById('envelope-wrapper');
  const closeLetterBtn = document.getElementById('close-letter-btn');

  function openEnvelope() {
    if (envelope.classList.contains('open')) return;
    
    envelope.classList.add('open');
    envelopeWrapper.classList.add('open');
    playMagicChime();

    // Trigger sweet gentle celebration sparkles
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#D48C84', '#C9A86A', '#FAF7F2']
      });
    }
  }

  function closeEnvelope() {
    envelope.classList.remove('open');
    envelopeWrapper.classList.remove('open');
  }

  if (waxSeal) {
    waxSeal.addEventListener('click', (e) => {
      e.stopPropagation();
      openEnvelope();
    });
    waxSeal.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openEnvelope();
      }
    });
  }

  if (envelope) {
    envelope.addEventListener('click', () => {
      if (!envelope.classList.contains('open')) {
        openEnvelope();
      }
    });
  }

  if (closeLetterBtn) {
    closeLetterBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeEnvelope();
    });
  }

  // -----------------------------------------------------------------
  // 5. INTERACTIVE CAKE & CANDLE BLOWING
  // -----------------------------------------------------------------
  const blowCandlesBtn = document.getElementById('blow-candles-btn');
  const reLightBtn = document.getElementById('re-light-btn');
  const candles = document.querySelectorAll('.candle');
  const wishRevealBox = document.getElementById('wish-reveal-box');
  let areCandlesBlown = false;

  function blowOutCandles() {
    if (areCandlesBlown) return;
    areCandlesBlown = true;

    playBlowSound();

    candles.forEach((candle, idx) => {
      setTimeout(() => {
        candle.classList.add('blown');
      }, idx * 120);
    });

    // Magic celebration after candles are out
    setTimeout(() => {
      playMagicChime();
      
      // Multi-burst confetti celebration
      if (typeof confetti === 'function') {
        const count = 200;
        const defaults = {
          origin: { y: 0.7 },
          colors: ['#D48C84', '#C9A86A', '#FFB3BA', '#FFFFBA', '#BAE1FF']
        };

        function fire(particleRatio, opts) {
          confetti(Object.assign({}, defaults, opts, {
            particleCount: Math.floor(count * particleRatio)
          }));
        }

        fire(0.25, { spread: 26, startVelocity: 55 });
        fire(0.2, { spread: 60 });
        fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
        fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
        fire(0.1, { spread: 120, startVelocity: 45 });
      }

      // Show the wish revealed message
      wishRevealBox.classList.add('active');
      blowCandlesBtn.style.display = 'none';
      reLightBtn.style.display = 'inline-flex';
    }, 600);
  }

  function reLightCandles() {
    areCandlesBlown = false;
    candles.forEach(candle => {
      candle.classList.remove('blown');
    });
    wishRevealBox.classList.remove('active');
    blowCandlesBtn.style.display = 'inline-flex';
    reLightBtn.style.display = 'none';
  }

  if (blowCandlesBtn) {
    blowCandlesBtn.addEventListener('click', blowOutCandles);
  }

  if (reLightBtn) {
    reLightBtn.addEventListener('click', reLightCandles);
  }

  // Also allow clicking individual candles
  candles.forEach(candle => {
    candle.addEventListener('click', () => {
      if (!candle.classList.contains('blown')) {
        playBlowSound();
        candle.classList.add('blown');
        const allBlown = Array.from(candles).every(c => c.classList.contains('blown'));
        if (allBlown) {
          blowOutCandles();
        }
      }
    });
  });

  // -----------------------------------------------------------------
  // 6. HEART BURST FOOTER BUTTON
  // -----------------------------------------------------------------
  const heartBurstBtn = document.getElementById('heart-burst-btn');
  if (heartBurstBtn) {
    heartBurstBtn.addEventListener('click', () => {
      playMagicChime();
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 50,
          spread: 80,
          origin: { y: 0.9 },
          shapes: ['circle'],
          colors: ['#E63946', '#F4A261', '#E76F51', '#D48C84']
        });
      }
      // Floating CSS hearts
      for (let i = 0; i < 15; i++) {
        createFloatingHeart();
      }
    });
  }

  function createFloatingHeart() {
    const heart = document.createElement('div');
    heart.textContent = ['💖', '💕', '🌸', '✨', '🤍'][Math.floor(Math.random() * 5)];
    heart.style.position = 'fixed';
    heart.style.left = `${Math.random() * 90 + 5}vw`;
    heart.style.bottom = '-20px';
    heart.style.fontSize = `${Math.random() * 20 + 20}px`;
    heart.style.zIndex = '9999';
    heart.style.pointerEvents = 'none';
    heart.style.transition = 'all 2.5s cubic-bezier(0.25, 1, 0.5, 1)';
    heart.style.opacity = '1';
    document.body.appendChild(heart);

    requestAnimationFrame(() => {
      heart.style.transform = `translateY(-${Math.random() * 400 + 300}px) rotate(${Math.random() * 60 - 30}deg)`;
      heart.style.opacity = '0';
    });

    setTimeout(() => {
      heart.remove();
    }, 2600);
  }

  // -----------------------------------------------------------------
  // 8. BACKGROUND AMBIENT PARTICLES (Rose petals & gold dust)
  // -----------------------------------------------------------------
  const canvas = document.getElementById('ambient-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const count = 35;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 4 + 1.5,
        dx: (Math.random() - 0.5) * 0.4,
        dy: Math.random() * 0.5 + 0.3,
        alpha: Math.random() * 0.5 + 0.2,
        isPetal: Math.random() > 0.6,
        angle: Math.random() * Math.PI * 2,
        angleSpeed: (Math.random() - 0.5) * 0.02
      });
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.x += p.dx;
        p.y += p.dy;
        p.angle += p.angleSpeed;

        if (p.y > height + 10) {
          p.y = -10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.globalAlpha = p.alpha;

        if (p.isPetal) {
          // Soft pink petal
          ctx.fillStyle = '#E8B4B8';
          ctx.beginPath();
          ctx.ellipse(0, 0, p.r * 1.8, p.r, 0, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Golden sparkle dust
          ctx.fillStyle = '#D4AF37';
          ctx.beginPath();
          ctx.arc(0, 0, p.r * 0.7, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      requestAnimationFrame(animateParticles);
    }

    animateParticles();
  }

  // -----------------------------------------------------------------
  // 9. CLICK-ANYWHERE FLOATING SPARKLE MICRO-INTERACTION
  // -----------------------------------------------------------------
  const sparkleSymbols = ['✨', '💕', '🌸', '🤍', '⭐', '💖'];
  document.addEventListener('click', (e) => {
    // Avoid interfering with interactive elements
    if (e.target.closest('button, a, .wax-seal, .candle, input, .modal-close')) return;

    const spark = document.createElement('span');
    spark.className = 'click-sparkle';
    spark.textContent = sparkleSymbols[Math.floor(Math.random() * sparkleSymbols.length)];
    spark.style.left = `${e.pageX}px`;
    spark.style.top = `${e.pageY}px`;
    document.body.appendChild(spark);

    setTimeout(() => {
      spark.remove();
    }, 1250);
  });

});
