/**
 * AUDI R8 SUPER SPORT EXPERIENCE - SCRIPT
 * High Performance 120 FPS Scroll, Interactive V10 Engine Disassembly & High-Visibility Magnetic Cursor
 */

document.addEventListener('DOMContentLoaded', () => {

  /* -------------------------------------------------------------------------- */
  /* 1. Ultra-Smooth Lenis Scroll & GSAP Ticker Integration                     */
  /* -------------------------------------------------------------------------- */
  let lenis;
  try {
    lenis = new Lenis({
      duration: 0.9,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      lerp: 0.09,
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.2
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  } catch (e) {
    console.warn("Lenis init fallback:", e);
  }

  gsap.registerPlugin(ScrollTrigger);

  /* Header scroll style toggle */
  const header = document.getElementById('main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }, { passive: true });


  /* -------------------------------------------------------------------------- */
  /* 2. High-Visibility Custom Magnetic Cursor System                           */
  /* -------------------------------------------------------------------------- */
  const cursorDot = document.getElementById('custom-cursor');
  const cursorFollower = document.getElementById('cursor-follower');
  const cursorTextLabel = document.getElementById('cursor-text-label');
  
  // Initialize in center of viewport so cursor is immediately visible on load
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let followerX = mouseX;
  let followerY = mouseY;

  function setCursorPos(x, y) {
    mouseX = x;
    mouseY = y;
    if (cursorDot) {
      cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    }
  }

  // Set initial position
  setCursorPos(mouseX, mouseY);

  window.addEventListener('mousemove', (e) => {
    setCursorPos(e.clientX, e.clientY);
  }, { passive: true });

  // Update hover state during scroll when mouse is stationary over elements
  window.addEventListener('scroll', () => {
    if (cursorDot) {
      cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    }
    const elemBelow = document.elementFromPoint(mouseX, mouseY);
    if (elemBelow) {
      const isInteractive = elemBelow.closest('a, button, .glass-card, .rotator-hotspot, input, select, .color-swatch, .color-dot');
      const isEngine = elemBelow.closest('#engine-stage-box');

      if (isEngine) {
        cursorFollower?.classList.add('hovering-engine');
        cursorFollower?.classList.remove('hovering');
        if (cursorTextLabel) cursorTextLabel.textContent = "EXPLODE V10";
      } else if (isInteractive) {
        cursorFollower?.classList.add('hovering');
        cursorFollower?.classList.remove('hovering-engine');
        if (cursorTextLabel) cursorTextLabel.textContent = "VIEW";
      } else {
        cursorFollower?.classList.remove('hovering');
        cursorFollower?.classList.remove('hovering-engine');
      }
    }
  }, { passive: true });

  function updateCursorFollower() {
    followerX += (mouseX - followerX) * 0.22;
    followerY += (mouseY - followerY) * 0.22;

    if (cursorFollower) {
      cursorFollower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) translate(-50%, -50%)`;
    }

    requestAnimationFrame(updateCursorFollower);
  }
  updateCursorFollower();

  // Hover states for generic interactive elements
  const hoverables = document.querySelectorAll('a, button, .glass-card, .rotator-hotspot, input, select, .color-swatch, .color-dot');
  hoverables.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorFollower?.classList.add('hovering');
      if (cursorTextLabel) cursorTextLabel.textContent = "VIEW";
    });
    el.addEventListener('mouseleave', () => {
      cursorFollower?.classList.remove('hovering');
    });
  });

  // Special Cursor Morphing over Engine Disassembly Box
  const engineStageBox = document.getElementById('engine-stage-box');
  engineStageBox?.addEventListener('mouseenter', () => {
    cursorFollower?.classList.add('hovering-engine');
    if (cursorTextLabel) cursorTextLabel.textContent = "EXPLODE V10";
  });
  engineStageBox?.addEventListener('mouseleave', () => {
    cursorFollower?.classList.remove('hovering-engine');
  });

  // Click animation
  window.addEventListener('mousedown', () => cursorFollower?.classList.add('clicking'));
  window.addEventListener('mouseup', () => cursorFollower?.classList.remove('clicking'));


  /* -------------------------------------------------------------------------- */
  /* 3. Ultra-Realistic Audi R8 V10 Exhaust Startup Audio Synthesizer            */
  /* -------------------------------------------------------------------------- */
  let audioCtx = null;
  let isSoundMuted = false;

  function initAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playV10RealisticStartup() {
    if (isSoundMuted) return;
    initAudioContext();
    if (!audioCtx) return;

    const now = audioCtx.currentTime;

    // Stage 1: Starter Motor Cranking Pulses
    const starterOsc = audioCtx.createOscillator();
    const starterGain = audioCtx.createGain();
    starterOsc.type = 'square';
    starterOsc.frequency.setValueAtTime(45, now);
    starterOsc.frequency.linearRampToValueAtTime(110, now + 0.35);

    starterGain.gain.setValueAtTime(0.01, now);
    starterGain.gain.linearRampToValueAtTime(0.15, now + 0.1);
    starterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    starterOsc.connect(starterGain);
    starterGain.connect(audioCtx.destination);
    starterOsc.start(now);
    starterOsc.stop(now + 0.4);

    // Stage 2: Ignition Combustion Explosion & Exhaust Flare
    const v10Saw1 = audioCtx.createOscillator();
    const v10Saw2 = audioCtx.createOscillator();
    const v10Sub = audioCtx.createOscillator();
    const filter = audioCtx.createBiquadFilter();
    const mainGain = audioCtx.createGain();

    v10Saw1.type = 'sawtooth';
    v10Saw2.type = 'sawtooth';
    v10Sub.type = 'triangle';

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, now + 0.35);
    filter.frequency.exponentialRampToValueAtTime(3200, now + 0.65);
    filter.frequency.exponentialRampToValueAtTime(450, now + 1.8);

    v10Saw1.frequency.setValueAtTime(90, now + 0.35);
    v10Saw1.frequency.exponentialRampToValueAtTime(480, now + 0.7);
    v10Saw1.frequency.exponentialRampToValueAtTime(130, now + 2.0);

    v10Saw2.frequency.setValueAtTime(92, now + 0.35);
    v10Saw2.frequency.exponentialRampToValueAtTime(485, now + 0.7);
    v10Saw2.frequency.exponentialRampToValueAtTime(132, now + 2.0);

    v10Sub.frequency.setValueAtTime(45, now + 0.35);
    v10Sub.frequency.exponentialRampToValueAtTime(240, now + 0.7);
    v10Sub.frequency.exponentialRampToValueAtTime(65, now + 2.0);

    mainGain.gain.setValueAtTime(0.001, now);
    mainGain.gain.setValueAtTime(0.01, now + 0.35);
    mainGain.gain.linearRampToValueAtTime(0.5, now + 0.55);
    mainGain.gain.exponentialRampToValueAtTime(0.08, now + 2.2);

    v10Saw1.connect(filter);
    v10Saw2.connect(filter);
    v10Sub.connect(filter);
    filter.connect(mainGain);
    mainGain.connect(audioCtx.destination);

    v10Saw1.start(now + 0.35);
    v10Saw2.start(now + 0.35);
    v10Sub.start(now + 0.35);

    v10Saw1.stop(now + 2.8);
    v10Saw2.stop(now + 2.8);
    v10Sub.stop(now + 2.8);
  }

  function playV10SoundEffect(type = 'rev') {
    if (isSoundMuted) return;
    initAudioContext();
    if (!audioCtx) return;

    const now = audioCtx.currentTime;

    if (type === 'rev') {
      const osc = audioCtx.createOscillator();
      const filter = audioCtx.createBiquadFilter();
      const gain = audioCtx.createGain();

      osc.type = 'sawtooth';
      filter.type = 'lowpass';

      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(780, now + 0.5);
      osc.frequency.exponentialRampToValueAtTime(160, now + 1.2);

      filter.frequency.setValueAtTime(500, now);
      filter.frequency.exponentialRampToValueAtTime(4000, now + 0.5);
      filter.frequency.exponentialRampToValueAtTime(600, now + 1.2);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.linearRampToValueAtTime(0.4, now + 0.5);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.3);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 1.3);
    } else if (type === 'idle') {
      playV10RealisticStartup();
    } else if (type === 'launch') {
      playV10RealisticStartup();
    }
  }

  // Sound Toggle Button
  const soundToggleBtn = document.getElementById('sound-toggle');
  const soundStatusText = document.getElementById('sound-status-text');

  soundToggleBtn?.addEventListener('click', () => {
    isSoundMuted = !isSoundMuted;
    if (isSoundMuted) {
      soundToggleBtn.classList.add('muted');
      if (soundStatusText) soundStatusText.textContent = "AUDIO OFF";
    } else {
      soundToggleBtn.classList.remove('muted');
      if (soundStatusText) soundStatusText.textContent = "AUDIO ON";
      playV10RealisticStartup();
    }
  });


  /* -------------------------------------------------------------------------- */
  /* 4. Preloader Simulation & Hero Background Video Controller                  */
  /* -------------------------------------------------------------------------- */
  const preloader = document.getElementById('preloader');
  const loaderPercent = document.getElementById('loader-percent');
  const loaderFill = document.getElementById('loader-fill');
  const startBtn = document.getElementById('start-btn');
  const heroVideo = document.querySelector('.hero-video-bg');
  const heroBgVisual = document.querySelector('.hero-bg-visual');

  // Video Autoplay, Continuous Loop & Fallback Setup
  if (heroVideo) {
    heroVideo.muted = true;
    heroVideo.playsInline = true;

    const playVideo = () => {
      const promise = heroVideo.play();
      if (promise !== undefined) {
        promise.then(() => {
          heroVideo.classList.add('playing');
        }).catch(err => {
          console.warn('Hero video autoplay notice:', err);
          const enablePlayOnUserAction = () => {
            heroVideo.play().then(() => heroVideo.classList.add('playing')).catch(() => {});
            window.removeEventListener('click', enablePlayOnUserAction);
            window.removeEventListener('touchstart', enablePlayOnUserAction);
          };
          window.addEventListener('click', enablePlayOnUserAction);
          window.addEventListener('touchstart', enablePlayOnUserAction);
        });
      }
    };

    playVideo();

    heroVideo.addEventListener('error', () => {
      console.warn('Hero video load failure, displaying fallback hero image.');
      heroBgVisual?.classList.add('video-failed');
    });

    // Enforce video never pauses while page is active
    heroVideo.addEventListener('pause', () => {
      if (!document.hidden && heroVideo.readyState >= 2) {
        heroVideo.play().catch(() => {});
      }
    });
  }

  // Hero Video Scroll Parallax & Scale Effect
  if (heroVideo && typeof gsap !== 'undefined') {
    gsap.to(heroVideo, {
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      },
      yPercent: 15,
      scale: 1.15,
      ease: 'none'
    });
  }

  let currentPercent = 0;
  const loadInterval = setInterval(() => {
    currentPercent += Math.floor(Math.random() * 15) + 6;
    if (currentPercent >= 100) {
      currentPercent = 100;
      clearInterval(loadInterval);

      if (loaderPercent) loaderPercent.textContent = "100";
      if (loaderFill) loaderFill.style.width = "100%";

      startBtn?.classList.add('visible');
    } else {
      if (loaderPercent) loaderPercent.textContent = currentPercent.toString();
      if (loaderFill) loaderFill.style.width = currentPercent + "%";
    }
  }, 80);

  startBtn?.addEventListener('click', () => {
    playV10RealisticStartup();

    preloader?.classList.add('loaded');
    document.body.classList.add('preloader-finished');

    if (heroVideo) {
      heroVideo.play().catch(() => {});
      heroVideo.classList.add('loaded');
    }

    // Hero GSAP Reveal Timeline
    const heroTl = gsap.timeline({ delay: 0.2 });
    heroTl.from('.hero-audi-rings', { opacity: 0, scale: 0.8, duration: 0.6 })
          .from('.hero-tag', { opacity: 0, y: 25, duration: 0.7 }, '-=0.3')
          .from('.hero-title', { opacity: 0, y: 40, duration: 0.9, ease: 'power3.out' }, '-=0.4')
          .from('.hero-subtitle', { opacity: 0, y: 25, duration: 0.7 }, '-=0.5')
          .from('.hero-actions', { opacity: 0, y: 20, duration: 0.5 }, '-=0.4')
          .from('.hero-badge-floating', { opacity: 0, x: 40, duration: 0.7 }, '-=0.5');
  });


  /* -------------------------------------------------------------------------- */
  /* 5. 5.2L V10 ENGINE AUTOMATIC DISASSEMBLY & REASSEMBLY SCROLLTRIGGER       */
  /* -------------------------------------------------------------------------- */
  const engineDisassemblySection = document.getElementById('engine-disassembly-section');
  const engineStateLabel = document.getElementById('engine-state-label');

  if (engineDisassemblySection && engineStageBox) {
    ScrollTrigger.create({
      trigger: engineDisassemblySection,
      start: 'top 60%',
      end: 'bottom 20%',
      onEnter: () => {
        engineStageBox.classList.add('exploded');
        if (engineStateLabel) engineStateLabel.textContent = "STATE: EXPLODED / DISASSEMBLED";
        playV10SoundEffect('rev');
      },
      onLeave: () => {
        engineStageBox.classList.remove('exploded');
        if (engineStateLabel) engineStateLabel.textContent = "STATE: REASSEMBLED";
      },
      onEnterBack: () => {
        engineStageBox.classList.add('exploded');
        if (engineStateLabel) engineStateLabel.textContent = "STATE: EXPLODED / DISASSEMBLED";
      },
      onLeaveBack: () => {
        engineStageBox.classList.remove('exploded');
        if (engineStateLabel) engineStateLabel.textContent = "STATE: ASSEMBLED";
      }
    });
  }


  /* -------------------------------------------------------------------------- */
  /* 6. Optimized Background Canvas Particle Animation                           */
  /* -------------------------------------------------------------------------- */
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }, { passive: true });

    const particles = Array.from({ length: 30 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.8 + 0.5,
      alpha: Math.random() * 0.4 + 0.1,
      speedY: Math.random() * 0.3 + 0.1,
      speedX: (Math.random() - 0.5) * 0.15
    }));

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.y -= p.speedY;
        p.x += p.speedX;

        if (p.y < 0) p.y = height;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(227, 6, 19, ${p.alpha})`;
        ctx.fill();
      });

      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }


  /* -------------------------------------------------------------------------- */
  /* 7. Section 1: Overview Count-Up Counters                                  */
  /* -------------------------------------------------------------------------- */
  const statNumbers = document.querySelectorAll('.stat-num');
  
  statNumbers.forEach(stat => {
    const target = parseFloat(stat.getAttribute('data-target') || '0');
    const isDecimal = target % 1 !== 0;

    ScrollTrigger.create({
      trigger: stat,
      start: 'top 85%',
      onEnter: () => {
        gsap.to(stat, {
          innerText: target,
          duration: 1.8,
          ease: 'power2.out',
          snap: { innerText: isDecimal ? 0.1 : 1 },
          onUpdate: function () {
            if (isDecimal) {
              stat.innerText = parseFloat(stat.innerText).toFixed(1);
            }
          }
        });
      }
    });
  });


  /* -------------------------------------------------------------------------- */
  /* 8. 360 Degree Rotator Logic                                               */
  /* -------------------------------------------------------------------------- */
  const rotatorBox = document.getElementById('rotator-box');
  const rotatorImg = document.getElementById('rotator-img');
  const rotatorAngleText = document.getElementById('rotator-angle-text');
  const btnPrev = document.getElementById('rotator-prev');
  const btnNext = document.getElementById('rotator-next');

  const viewImages = [
    'assets/images/audi-r8-hero.jpg',
    'assets/images/audi-r8-side.jpg',
    'assets/images/audi-r8-back.jpg',
    'assets/images/audi-r8-front.jpg'
  ];

  let currentAngleIndex = 0;

  function updateRotatorView() {
    if (rotatorImg) {
      rotatorImg.style.opacity = '0.5';
      setTimeout(() => {
        rotatorImg.src = viewImages[currentAngleIndex];
        rotatorImg.style.opacity = '1';
      }, 120);
    }
    if (rotatorAngleText) {
      rotatorAngleText.textContent = `ANGLE: ${currentAngleIndex * 90}°`;
    }
  }

  btnNext?.addEventListener('click', () => {
    currentAngleIndex = (currentAngleIndex + 1) % viewImages.length;
    updateRotatorView();
  });

  btnPrev?.addEventListener('click', () => {
    currentAngleIndex = (currentAngleIndex - 1 + viewImages.length) % viewImages.length;
    updateRotatorView();
  });

  let isDragging = false;
  let startX = 0;

  rotatorBox?.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  rotatorBox?.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const diffX = e.clientX - startX;
    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        currentAngleIndex = (currentAngleIndex - 1 + viewImages.length) % viewImages.length;
      } else {
        currentAngleIndex = (currentAngleIndex + 1) % viewImages.length;
      }
      updateRotatorView();
      startX = e.clientX;
    }
  });


  /* -------------------------------------------------------------------------- */
  /* 9. Performance Telemetry Tabs                                             */
  /* -------------------------------------------------------------------------- */
  const tabBtns = document.querySelectorAll('.tab-btn');
  const barPower = document.getElementById('bar-power');
  const barDownforce = document.getElementById('bar-downforce');
  const barShift = document.getElementById('bar-shift');
  const valPower = document.getElementById('val-power');
  const valDownforce = document.getElementById('val-downforce');
  const valShift = document.getElementById('val-shift');

  const modeData = {
    dynamic: { power: '620 HP', powerWidth: '95%', downforce: '140 KG', downWidth: '88%', shift: '120 MS', shiftWidth: '98%' },
    track: { power: '620 HP', powerWidth: '100%', downforce: '180 KG', downWidth: '100%', shift: '90 MS', shiftWidth: '100%' },
    comfort: { power: '450 HP', powerWidth: '70%', downforce: '80 KG', downWidth: '50%', shift: '250 MS', shiftWidth: '60%' }
  };

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const mode = btn.getAttribute('data-mode') || 'dynamic';
      const data = modeData[mode];

      if (valPower) valPower.textContent = data.power;
      if (valDownforce) valDownforce.textContent = data.downforce;
      if (valShift) valShift.textContent = data.shift;

      if (barPower) barPower.style.width = data.powerWidth;
      if (barDownforce) barDownforce.style.width = data.downWidth;
      if (barShift) barShift.style.width = data.shiftWidth;

      playV10SoundEffect('rev');
    });
  });


  /* -------------------------------------------------------------------------- */
  /* 10. Interior Ambient Color Selector                                        */
  /* -------------------------------------------------------------------------- */
  const colorDots = document.querySelectorAll('.color-dot');
  const interiorImg = document.getElementById('interior-img');

  colorDots.forEach(dot => {
    dot.addEventListener('click', () => {
      colorDots.forEach(d => d.classList.remove('active'));
      dot.classList.add('active');

      const glowColor = dot.getAttribute('data-color') || 'rgba(227, 6, 19, 0.4)';
      if (interiorImg) {
        interiorImg.style.filter = `drop-shadow(0 0 35px ${glowColor})`;
      }
    });
  });


  /* -------------------------------------------------------------------------- */
  /* 11. Gallery Filter & Lightbox                                             */
  /* -------------------------------------------------------------------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const cat = item.getAttribute('data-category');
        if (filter === 'all' || filter === cat) {
          gsap.to(item, { opacity: 1, scale: 1, duration: 0.35, display: 'block' });
        } else {
          gsap.to(item, { opacity: 0, scale: 0.8, duration: 0.35, display: 'none' });
        }
      });
    });
  });

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img && lightboxImg && lightboxModal) {
        lightboxImg.src = img.src;
        lightboxModal.classList.add('active');
      }
    });
  });

  lightboxClose?.addEventListener('click', () => lightboxModal?.classList.remove('active'));
  lightboxModal?.addEventListener('click', (e) => {
    if (e.target === lightboxModal) lightboxModal.classList.remove('active');
  });


  /* -------------------------------------------------------------------------- */
  /* 12. Soundboard Triggers                                                    */
  /* -------------------------------------------------------------------------- */
  document.getElementById('sound-btn-idle')?.addEventListener('click', () => playV10RealisticStartup());
  document.getElementById('sound-btn-rev')?.addEventListener('click', () => playV10SoundEffect('rev'));
  document.getElementById('sound-btn-launch')?.addEventListener('click', () => playV10RealisticStartup());


  /* -------------------------------------------------------------------------- */
  /* 13. Interactive Configurator                                               */
  /* -------------------------------------------------------------------------- */
  const paintSwatches = document.querySelectorAll('.color-swatch');
  const wheelSelect = document.getElementById('config-wheel-select');
  const carbonCheck = document.getElementById('config-carbon-check');
  const configPreview = document.getElementById('config-img-preview');
  const totalPriceDisplay = document.getElementById('total-price-display');

  let basePrice = 249900;
  let paintPrice = 0;
  let wheelPrice = 0;
  let carbonPrice = 0;

  function updateConfiguratorPrice() {
    const total = basePrice + paintPrice + wheelPrice + carbonPrice;
    if (totalPriceDisplay) {
      totalPriceDisplay.textContent = `$${total.toLocaleString()}`;
    }
  }

  paintSwatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      paintSwatches.forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');

      const imgSrc = swatch.getAttribute('data-img');
      paintPrice = parseInt(swatch.getAttribute('data-price') || '0');

      if (configPreview && imgSrc) {
        configPreview.style.opacity = '0.5';
        setTimeout(() => {
          configPreview.src = imgSrc;
          configPreview.style.opacity = '1';
        }, 120);
      }
      updateConfiguratorPrice();
    });
  });

  wheelSelect?.addEventListener('change', (e) => {
    wheelPrice = parseInt(e.target.value || '0');
    updateConfiguratorPrice();
  });

  carbonCheck?.addEventListener('change', (e) => {
    carbonPrice = e.target.checked ? 8500 : 0;
    updateConfiguratorPrice();
  });


  /* -------------------------------------------------------------------------- */
  /* 14. Finance EMI Calculator                                                 */
  /* -------------------------------------------------------------------------- */
  const dpSlider = document.getElementById('dp-slider');
  const dpValDisplay = document.getElementById('dp-val');
  const monthlyEmiVal = document.getElementById('monthly-emi-val');

  function calculateEMI() {
    if (!dpSlider) return;
    const dp = parseInt(dpSlider.value);
    if (dpValDisplay) dpValDisplay.textContent = `$${dp.toLocaleString()}`;

    const loanAmount = 249900 - dp;
    const interestRate = 0.05 / 12;
    const tenureMonths = 60;

    const emi = Math.round(
      (loanAmount * interestRate * Math.pow(1 + interestRate, tenureMonths)) /
      (Math.pow(1 + interestRate, tenureMonths) - 1)
    );

    if (monthlyEmiVal) {
      monthlyEmiVal.textContent = `$${emi.toLocaleString()} / mo`;
    }
  }

  dpSlider?.addEventListener('input', calculateEMI);

  /* Contact Form */
  document.getElementById('vip-contact-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    playV10SoundEffect('rev');
    alert('Thank you! Your VIP Audi Sport test drive request has been submitted.');
  });

});
