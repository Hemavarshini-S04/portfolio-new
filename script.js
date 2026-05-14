/* ═══════════════════════════════════════════════════════════════
   HEMAVARSHINI PORTFOLIO — script.js
   Features:
   - Custom cursor
   - Typed text animation
   - Scroll reveal
   - Skill bar animation
   - Navbar scroll effect + active link
   - Dark/Light theme toggle
   - Mobile hamburger menu
   - Contact form simulation
   - Smooth scroll
═══════════════════════════════════════════════════════════════ */

// Wait for page to fully load
document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────────────────────
     1. CUSTOM CURSOR
  ────────────────────────────────────────────── */
  const cursor      = document.getElementById('cursor');
  const cursorTrail = document.getElementById('cursorTrail');

  // Track mouse and move cursor dots
  document.addEventListener('mousemove', (e) => {
    // Main dot follows instantly
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';

    // Trail follows with a slight CSS transition delay
    cursorTrail.style.left = e.clientX + 'px';
    cursorTrail.style.top  = e.clientY + 'px';
  });

  // Grow cursor when hovering clickable elements
  document.querySelectorAll('a, button, .project-card, .skill-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform      = 'translate(-50%, -50%) scale(2)';
      cursorTrail.style.transform = 'translate(-50%, -50%) scale(1.5)';
      cursorTrail.style.opacity   = '0.15';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform      = 'translate(-50%, -50%) scale(1)';
      cursorTrail.style.transform = 'translate(-50%, -50%) scale(1)';
      cursorTrail.style.opacity   = '0.4';
    });
  });


  /* ──────────────────────────────────────────────
     2. TYPED TEXT ANIMATION
     Cycles through role titles in the hero
  ────────────────────────────────────────────── */
  const roles = [
    'Java Backend Developer',
    'Spring Boot Enthusiast',
    'REST API Builder',
    'Problem Solver',
    'Fresher · Open to Work',
  ];

  const typedEl = document.getElementById('typedText');
  let roleIndex    = 0;  // which role we're on
  let charIndex    = 0;  // which character within the role
  let isDeleting   = false;

  function typeRole() {
    const current = roles[roleIndex];

    if (isDeleting) {
      // Remove one character
      charIndex--;
      typedEl.textContent = current.substring(0, charIndex);
    } else {
      // Add one character
      charIndex++;
      typedEl.textContent = current.substring(0, charIndex);
    }

    // How fast to type / delete
    let speed = isDeleting ? 50 : 90;

    if (!isDeleting && charIndex === current.length) {
      // Finished typing → pause, then start deleting
      speed = 1800;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      // Finished deleting → move to next role
      isDeleting = false;
      roleIndex  = (roleIndex + 1) % roles.length;
      speed      = 400;
    }

    setTimeout(typeRole, speed);
  }

  typeRole(); // kick off


  /* ──────────────────────────────────────────────
     3. NAVBAR — scroll effect + active link
  ────────────────────────────────────────────── */
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function handleScroll() {
    // Add .scrolled class when user scrolls past 40px
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Highlight the nav link matching the current visible section
    let current = '';
    sections.forEach(section => {
      // If we've scrolled past the section's top (minus some offset)
      if (window.scrollY >= section.offsetTop - 120) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // run once on load


  /* ──────────────────────────────────────────────
     4. DARK / LIGHT THEME TOGGLE
  ────────────────────────────────────────────── */
  const themeToggle = document.getElementById('themeToggle');
  const html        = document.documentElement;

  // Check if user has a saved preference
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);

  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('portfolio-theme', next); // remember preference
  });


  /* ──────────────────────────────────────────────
     5. MOBILE HAMBURGER MENU
  ────────────────────────────────────────────── */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });

  // Close menu when any nav link is clicked (on mobile)
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });


  /* ──────────────────────────────────────────────
     6. SCROLL REVEAL ANIMATION
     Uses IntersectionObserver to trigger fade-in
     when elements enter the viewport
  ────────────────────────────────────────────── */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Optional: stop observing after reveal (one-time animation)
          // revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,     // trigger when 10% of element is visible
      rootMargin: '0px 0px -40px 0px' // slightly before fully in view
    }
  );

  // Observe all elements with class .reveal
  document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
  });

  // Trigger hero section immediately (it's already in view)
  document.querySelectorAll('.hero .reveal').forEach(el => {
    setTimeout(() => el.classList.add('visible'), 100);
  });


  /* ──────────────────────────────────────────────
     7. SKILL BAR ANIMATION
     Fills the progress bars when skills section
     scrolls into view
  ────────────────────────────────────────────── */
  const barObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Find all bar-fill elements inside the skills section
          entry.target.querySelectorAll('.bar-fill').forEach(bar => {
            const targetWidth = bar.getAttribute('data-width');
            // Small delay so it animates after the card reveal
            setTimeout(() => {
              bar.style.width = targetWidth + '%';
            }, 300);
          });
          barObserver.unobserve(entry.target); // animate only once
        }
      });
    },
    { threshold: 0.2 }
  );

  const skillsSection = document.getElementById('skills');
  if (skillsSection) barObserver.observe(skillsSection);


  /* ──────────────────────────────────────────────
     8. CONTACT FORM — submit simulation
  ────────────────────────────────────────────── */
  const contactForm  = document.getElementById('contactForm');
  const formSuccess  = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault(); // prevent page reload

      // Get the submit button and show loading state
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="ph ph-circle-notch ph-spin"></i> Sending...';
      submitBtn.disabled  = true;

      // Simulate a network request (1.5 seconds)
      setTimeout(() => {
        // Show success message
        formSuccess.classList.add('show');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled  = false;

        // Reset form fields
        contactForm.reset();

        // Hide success message after 5 seconds
        setTimeout(() => {
          formSuccess.classList.remove('show');
        }, 5000);
      }, 1500);
    });
  }


  /* ──────────────────────────────────────────────
     9. RESUME DOWNLOAD BUTTON
     Shows an alert since there's no actual file.
     Replace the href with your actual resume URL.
  ────────────────────────────────────────────── */
  const resumeBtn = document.getElementById('resumeBtn');
  if (resumeBtn) {
    resumeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      // When you have a real resume, replace this with:
      // window.open('path/to/Hemavarshini_Resume.pdf', '_blank');
      alert('📄 Resume download coming soon!\n\nPlease connect on LinkedIn or email me directly.');
    });
  }


  /* ──────────────────────────────────────────────
     10. SMOOTH SCROLL for anchor links
     (backup for browsers that don't support CSS
     scroll-behavior: smooth)
  ────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navHeight = document.getElementById('navbar').offsetHeight;
        const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top: targetTop, behavior: 'smooth' });
      }
    });
  });


  /* ──────────────────────────────────────────────
     11. PROJECT CARDS — tilt effect on hover
  ────────────────────────────────────────────── */
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left; // cursor x within card
      const y      = e.clientY - rect.top;  // cursor y within card
      const midX   = rect.width  / 2;
      const midY   = rect.height / 2;

      // Tilt max ±6 degrees
      const rotateY =  ((x - midX) / midX) * 5;
      const rotateX = -((y - midY) / midY) * 5;

      card.style.transform = `translateY(-6px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      card.style.transition = 'transform 0.1s ease';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform  = '';
      card.style.transition = 'transform 0.4s ease';
    });
  });


  /* ──────────────────────────────────────────────
     12. CONSOLE MESSAGE (Easter egg for devs)
  ────────────────────────────────────────────── */
  console.log('%c👋 Hi, fellow developer!', 'font-size:18px; font-weight:bold; color:#f5a623;');
  console.log('%cThis portfolio was built by Hemavarshini', 'font-size:13px; color:#7a7a8c;');
  console.log('%cStack: HTML + CSS + Vanilla JS | No frameworks used', 'font-size:12px; color:#44445a;');

}); // end DOMContentLoaded
