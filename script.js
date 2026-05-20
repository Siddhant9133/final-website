/* ═══════════════════════════════════════
   CLOUD VIEW 75 — script.js
   Sector 75, Mohali
═══════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. NAVBAR ── */
  const navbar     = document.getElementById('navbar');
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  // Navbar scroll effect (only adds 'scrolled' class for height adjustment)
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  // Hamburger Menu
  hamburger.addEventListener('click', () => {
    const open = !mobileMenu.classList.contains('hidden');
    mobileMenu.classList.toggle('hidden', open);
    hamburger.classList.toggle('open', !open);
  });

  // Close mobile menu when clicking a link
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      hamburger.classList.remove('open');
    });
  });

  // Smooth Scroll for Anchor Links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (!t) return;
      e.preventDefault();
      window.scrollTo({ 
        // CHANGE 1: Removed 100px offset — navbar is no longer fixed/sticky
        top: t.getBoundingClientRect().top + window.scrollY - 0, 
        behavior: 'smooth' 
      });
    });
  });


  /* ── 2. SCROLL REVEAL ── */
  const ro = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { 
        e.target.classList.add('visible'); 
        ro.unobserve(e.target); 
      }
    });
  }, { threshold: 0, rootMargin: '0px 0px 0px 0px' });

  document.querySelectorAll('.reveal-up').forEach(el => ro.observe(el));


  /* ── 3. COUNTERS ── */
  let counted = false;
  const countUp = el => {
    const target = +el.dataset.target, 
          dur = 2000, 
          step = target / (dur / 16);
    let cur = 0;
    const tick = () => {
      cur = Math.min(cur + step, target);
      el.textContent = Math.floor(cur);
      if (cur < target) requestAnimationFrame(tick); 
      else el.textContent = target;
    };
    requestAnimationFrame(tick);
  };

  const so = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !counted) {
      counted = true;
      document.querySelectorAll('.counter').forEach(countUp);
    }
  }, { threshold: 0.3 });

  const ss = document.querySelector('.stats-section');
  if (ss) so.observe(ss);


  /* ── 4. HERO PARALLAX ── */
  const hero = document.getElementById('hero');
  if (hero) {
    window.addEventListener('scroll', () => {
      hero.querySelectorAll('.blob').forEach((b, i) => {
        b.style.transform = `translateY(${window.scrollY * [0.15, 0.08, 0.12][i]}px)`;
      });
    }, { passive: true });
  }


  /* ── 5. ACTIVE NAV LINK ── */
  const navLinks = document.querySelectorAll('.nav-link');
  const ao = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(l => {
          l.classList.remove('text-brand-dark', 'font-bold');
          if (l.getAttribute('href') === `#${e.target.id}`) {
            l.classList.add('text-brand-dark', 'font-bold');
          }
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  document.querySelectorAll('section[id]').forEach(s => ao.observe(s));


  /* ── 6. LIGHTBOX MODAL ── */
  const lightboxModal    = document.getElementById('lightboxModal');
  const lightboxImg      = document.getElementById('lightboxImg');
  const lightboxClose    = document.getElementById('lightboxClose');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');
  const lightboxPrev     = document.getElementById('lightboxPrev');
  const lightboxNext     = document.getElementById('lightboxNext');
  const lightboxCounter  = document.getElementById('lightboxCounter');
  const lbFilmTrack      = document.getElementById('lbFilmTrack');

  let lbImages = [];
  let lbIndex  = 0;

  // Gather every lightbox image on the whole page
  function buildLightboxImages() {
    lbImages = [];
    document.querySelectorAll('.lightbox-trigger').forEach(el => {
      const src = el.dataset.imgSrc || el.src || '';
      if (src && !lbImages.includes(src)) lbImages.push(src);
    });
  }
  buildLightboxImages();

  // Build filmstrip thumbnails
  function buildFilm() {
    lbFilmTrack.innerHTML = '';
    lbImages.forEach((src, i) => {
      const btn = document.createElement('button');
      btn.className = 'lb-frame' + (i === lbIndex ? ' active' : '');
      btn.style.backgroundImage = `url('${src}')`;
      btn.setAttribute('aria-label', `Image ${i + 1}`);
      btn.addEventListener('click', e => { e.stopPropagation(); jumpTo(i); });
      lbFilmTrack.appendChild(btn);
    });
  }

  function syncFilm() {
    Array.from(lbFilmTrack.children).forEach((f, i) =>
      f.classList.toggle('active', i === lbIndex)
    );
    const active = lbFilmTrack.children[lbIndex];
    if (active) active.scrollIntoView({ inline: 'center', behavior: 'smooth', block: 'nearest' });
  }

  function updateCounter() {
    if (lbImages.length > 1) {
      lightboxCounter.textContent = `${lbIndex + 1} / ${lbImages.length}`;
      lightboxCounter.style.display = '';
    } else {
      lightboxCounter.style.display = 'none';
    }
    lightboxPrev.style.display = lbImages.length > 1 ? '' : 'none';
    lightboxNext.style.display = lbImages.length > 1 ? '' : 'none';
  }

  function setLightboxImage(src, animate) {
    if (animate) {
      lightboxImg.classList.add('switching');
      setTimeout(() => {
        lightboxImg.src = src;
        lightboxImg.classList.remove('switching');
      }, 200);
    } else {
      lightboxImg.src = src;
    }
  }

  function jumpTo(idx) {
    lbIndex = (idx + lbImages.length) % lbImages.length;
    setLightboxImage(lbImages[lbIndex], true);
    updateCounter();
    syncFilm();
  }

  function openLightbox(src) {
    if (!src) return;
    buildLightboxImages();
    const idx = lbImages.indexOf(src);
    lbIndex = idx >= 0 ? idx : 0;
    if (lbImages.length === 0) lbImages = [src];
    setLightboxImage(lbImages[lbIndex], false);
    updateCounter();
    buildFilm();
    lightboxModal.classList.add('open');
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => syncFilm());
  }

  function closeLightbox() {
    lightboxModal.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { lightboxImg.src = ''; lbFilmTrack.innerHTML = ''; }, 350);
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxBackdrop.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', e => { e.stopPropagation(); jumpTo(lbIndex - 1); });
  lightboxNext.addEventListener('click', e => { e.stopPropagation(); jumpTo(lbIndex + 1); });

  document.addEventListener('keydown', e => {
    if (!lightboxModal.classList.contains('open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  jumpTo(lbIndex - 1);
    if (e.key === 'ArrowRight') jumpTo(lbIndex + 1);
  });

  /* ── LIGHTBOX REAL-TIME DRAG SWIPE ──
     Images slide inside the card using a flex track (overflow:hidden).
     Neighbour image is inserted beside current inside the same card.
     Release > 28% card width = commit. Less = snap back.
  */
  (function initLightboxSwipe() {
    const lbTrack = document.getElementById('lbTrack');
    if (!lbTrack) return;

    let startX = 0, startY = 0, curX = 0;
    let dragging = false, isHoriz = null;
    let neighImg  = null;
    let goingPrev = false;

    function resetTrack() {
      lbTrack.style.transition = 'none';
      lbTrack.style.transform  = 'translateX(0)';
      if (neighImg) { neighImg.remove(); neighImg = null; }
    }

    lightboxModal.addEventListener('touchstart', function(e) {
      if (!lightboxModal.classList.contains('open')) return;
      if (lbImages.length < 2) return;
      if (e.target.closest('#lbFilm') || e.target.closest('.lightbox-nav') || e.target.closest('.lightbox-close')) return;
      startX = curX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      dragging = true; isHoriz = null;
      resetTrack();
    }, { passive: true });

    lightboxModal.addEventListener('touchmove', function(e) {
      if (!dragging) return;
      const dx = e.touches[0].clientX - startX;
      const dy = e.touches[0].clientY - startY;
      if (isHoriz === null && (Math.abs(dx) > 5 || Math.abs(dy) > 5))
        isHoriz = Math.abs(dx) > Math.abs(dy);
      if (!isHoriz) return;
      curX = e.touches[0].clientX;

      if (!neighImg) {
        goingPrev = dx > 0;
        const nIdx = goingPrev
          ? (lbIndex - 1 + lbImages.length) % lbImages.length
          : (lbIndex + 1) % lbImages.length;
        neighImg = new Image();
        neighImg.src = lbImages[nIdx];
        neighImg.className = 'lightbox-img';
        neighImg.alt = 'Preview';
        if (goingPrev) {
          lbTrack.insertBefore(neighImg, lightboxImg);
          lbTrack.style.transition = 'none';
          lbTrack.style.transform  = 'translateX(-100%)';
        } else {
          lbTrack.appendChild(neighImg);
          lbTrack.style.transition = 'none';
          lbTrack.style.transform  = 'translateX(0%)';
        }
      }

      const cardW = lbTrack.parentElement.offsetWidth || window.innerWidth * 0.82;
      const pct   = (dx / cardW) * 100;
      if (goingPrev) {
        lbTrack.style.transform = 'translateX(calc(-100% + ' + pct + '%))';
      } else {
        lbTrack.style.transform = 'translateX(' + pct + '%)';
      }
    }, { passive: true });

    lightboxModal.addEventListener('touchend', function() {
      if (!dragging) return;
      dragging = false;
      if (!isHoriz || !neighImg) { resetTrack(); return; }

      const dx        = curX - startX;
      const cardW     = lbTrack.parentElement.offsetWidth || window.innerWidth * 0.82;
      const threshold = cardW * 0.28;
      const t         = 'transform 0.32s cubic-bezier(0.4,0,0.2,1)';

      if (Math.abs(dx) > threshold) {
        lbTrack.style.transition = t;
        lbTrack.style.transform  = goingPrev ? 'translateX(-100%)' : 'translateX(-100%)';
        if (!goingPrev) lbTrack.style.transform = 'translateX(0%)';
        // Slide fully to neighbour
        lbTrack.style.transform = goingPrev ? 'translateX(0%)' : 'translateX(-100%)';
        setTimeout(function() {
          lbIndex = goingPrev
            ? (lbIndex - 1 + lbImages.length) % lbImages.length
            : (lbIndex + 1) % lbImages.length;
          lightboxImg.src = lbImages[lbIndex];
          updateCounter();
          syncFilm();
          resetTrack();
        }, 330);
      } else {
        lbTrack.style.transition = t;
        lbTrack.style.transform  = goingPrev ? 'translateX(-100%)' : 'translateX(0%)';
        setTimeout(resetTrack, 330);
      }
    }, { passive: true });
  })();
  /* ── END LIGHTBOX SWIPE ── */

  // Delegate click on all .lightbox-trigger elements
  document.addEventListener('click', e => {
    const trigger = e.target.closest('.lightbox-trigger');
    if (!trigger) return;
    // Don't fire if user clicked a carousel button
    if (e.target.closest('.hero-carousel-btn') || e.target.closest('.about-carousel-btn')) return;
    const src = trigger.dataset.imgSrc || trigger.src || '';
    if (src) openLightbox(src);
  });


  /* ── 7. HERO CAROUSEL ── */
  (function initHeroCarousel() {
    const slides     = document.querySelectorAll('#heroCarousel .hero-carousel-slide');
    const dotsWrap   = document.getElementById('heroCarouselDots');
    const prevBtn    = document.getElementById('heroPrev');
    const nextBtn    = document.getElementById('heroNext');
    if (!slides.length) return;

    let current = 0;
    let timer   = null;
    const INTERVAL = 3500;

    // Build dots
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', e => { e.stopPropagation(); goTo(i); resetTimer(); });
      dotsWrap.appendChild(dot);
    });

    function goTo(idx) {
      slides[current].classList.remove('active');
      dotsWrap.children[current].classList.remove('active');
      current = (idx + slides.length) % slides.length;
      slides[current].classList.add('active');
      dotsWrap.children[current].classList.add('active');
    }

    function resetTimer() {
      clearInterval(timer);
      timer = setInterval(() => goTo(current + 1), INTERVAL);
    }

    prevBtn.addEventListener('click', e => { e.stopPropagation(); goTo(current - 1); resetTimer(); });
    nextBtn.addEventListener('click', e => { e.stopPropagation(); goTo(current + 1); resetTimer(); });

    resetTimer();

    /* ── FIX 2: HERO CAROUSEL TOUCH SWIPE (mobile) ──
       Attaches touch gesture support to the hero card.
       Fires existing prev/next buttons so all carousel
       logic (dots, timer, auto-advance) keeps working.
       Desktop is unaffected — touch events only fire on
       touch-capable devices.
    ── */
    (function initHeroCarouselSwipe() {
      var card = document.getElementById('heroCarouselCard');
      if (!card) return;

      var startX    = 0;
      var startY    = 0;
      var isSwiping = false;
      var axisLocked = null; // 'h' | 'v' | null

      var SWIPE_MIN   = 40;   // px  — minimum horizontal travel to commit
      var ANGLE_RATIO = 0.7;  // must be more horizontal than vertical

      card.addEventListener('touchstart', function(e) {
        var t = e.touches[0];
        startX     = t.clientX;
        startY     = t.clientY;
        isSwiping  = true;
        axisLocked = null;
      }, { passive: true });

      // Passive listener just to detect axis early
      card.addEventListener('touchmove', function(e) {
        if (!isSwiping) return;
        var dx = e.touches[0].clientX - startX;
        var dy = e.touches[0].clientY - startY;
        if (axisLocked === null && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
          axisLocked = Math.abs(dx) > Math.abs(dy) * ANGLE_RATIO ? 'h' : 'v';
        }
      }, { passive: true });

      // Non-passive listener solely to block page scroll on horizontal swipe
      card.addEventListener('touchmove', function(e) {
        if (isSwiping && axisLocked === 'h') {
          e.preventDefault();
        }
      }, { passive: false });

      card.addEventListener('touchend', function(e) {
        if (!isSwiping) return;
        isSwiping = false;
        if (axisLocked !== 'h') return;

        var dx = e.changedTouches[0].clientX - startX;
        var dy = e.changedTouches[0].clientY - startY;

        if (Math.abs(dx) < SWIPE_MIN) return;
        if (Math.abs(dy) > Math.abs(dx)) return;

        if (dx < 0) {
          nextBtn.click(); // swipe left → next
        } else {
          prevBtn.click(); // swipe right → prev
        }
      }, { passive: true });

      card.addEventListener('touchcancel', function() {
        isSwiping  = false;
        axisLocked = null;
      }, { passive: true });
    })();
    /* ── END HERO SWIPE ── */

  })();


  /* ── 8. ABOUT CAROUSEL ── */
  (function initAboutCarousel() {
    const slides   = document.querySelectorAll('#aboutCarousel .about-carousel-slide');
    const dotsWrap = document.getElementById('aboutCarouselDots');
    const prevBtn  = document.getElementById('aboutPrev');
    const nextBtn  = document.getElementById('aboutNext');
    if (!slides.length) return;

    let current = 0;
    let timer   = null;
    const INTERVAL = 4000;

    // Build dots
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', e => { e.stopPropagation(); goTo(i); resetTimer(); });
      dotsWrap.appendChild(dot);
    });

    function goTo(idx) {
      slides[current].classList.remove('active');
      dotsWrap.children[current].classList.remove('active');
      current = (idx + slides.length) % slides.length;
      slides[current].classList.add('active');
      dotsWrap.children[current].classList.add('active');
    }

    function resetTimer() {
      clearInterval(timer);
      timer = setInterval(() => goTo(current + 1), INTERVAL);
    }

    prevBtn.addEventListener('click', e => { e.stopPropagation(); goTo(current - 1); resetTimer(); });
    nextBtn.addEventListener('click', e => { e.stopPropagation(); goTo(current + 1); resetTimer(); });

    resetTimer();

    /* ── ABOUT CAROUSEL TOUCH SWIPE (mobile) ── */
    (function initAboutCarouselSwipe() {
      var carousel = document.getElementById('aboutCarousel');
      if (!carousel) return;

      var startX    = 0;
      var startY    = 0;
      var isSwiping = false;
      var axisLocked = null; // 'h' | 'v' | null

      var SWIPE_MIN   = 40;  // px minimum horizontal travel
      var ANGLE_RATIO = 0.7; // must be more horizontal than vertical

      carousel.addEventListener('touchstart', function(e) {
        var t = e.touches[0];
        startX     = t.clientX;
        startY     = t.clientY;
        isSwiping  = true;
        axisLocked = null;
      }, { passive: true });

      // Detect axis direction
      carousel.addEventListener('touchmove', function(e) {
        if (!isSwiping) return;
        var dx = e.touches[0].clientX - startX;
        var dy = e.touches[0].clientY - startY;
        if (axisLocked === null && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
          axisLocked = Math.abs(dx) > Math.abs(dy) * ANGLE_RATIO ? 'h' : 'v';
        }
      }, { passive: true });

      // Block page scroll only when swiping horizontally
      carousel.addEventListener('touchmove', function(e) {
        if (isSwiping && axisLocked === 'h') {
          e.preventDefault();
        }
      }, { passive: false });

      carousel.addEventListener('touchend', function(e) {
        if (!isSwiping) return;
        isSwiping = false;
        if (axisLocked !== 'h') return;

        var dx = e.changedTouches[0].clientX - startX;
        var dy = e.changedTouches[0].clientY - startY;

        if (Math.abs(dx) < SWIPE_MIN) return;
        if (Math.abs(dy) > Math.abs(dx)) return;

        if (dx < 0) {
          nextBtn.click(); // swipe left → next
        } else {
          prevBtn.click(); // swipe right → prev
        }
      }, { passive: true });

      carousel.addEventListener('touchcancel', function() {
        isSwiping  = false;
        axisLocked = null;
      }, { passive: true });
    })();
    /* ── END ABOUT CAROUSEL SWIPE ── */

  })();

});