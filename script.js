/**
 * TrustSetu X TrustNet — Frontend behavior
 * Theme Management, Smooth scroll, navbar, modals, form validation, scroll-to-top, fade-in
 */

// ==========================================
// 1. THEME INITIALIZATION (Run immediately to prevent flashing)
// Priority: 1. LocalStorage -> 2. OS Preference -> 3. Default Light
// ==========================================
(function initTheme() {
  let currentTheme = localStorage.getItem('theme');
  
  if (!currentTheme) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    currentTheme = prefersDark ? 'dark' : 'light';
  }

  document.documentElement.setAttribute('data-theme', currentTheme);
})();

// ==========================================
// 2. MAIN APPLICATION LOGIC
// ==========================================
(function () {
  'use strict';

  const NAV_SCROLL_THRESHOLD = 40;
  const SCROLL_TOP_THRESHOLD = 400;
  const FADE_IN_ROOT_MARGIN = '0px 0px -60px 0px';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  // DOM Elements
  const navbar = $('#navbar');
  const navToggle = $('#nav-toggle');
  const navLinks = $('#nav-links');
  const scrollTopBtn = $('#scroll-top');
  const modalOverlay = $('#modal-overlay');
  const modal = $('#modal');
  const modalTitle = $('#modal-title');
  const modalDesc = $('#modal-desc');
  const modalPlaceholder = $('#modal-placeholder');
  const modalClose = $('#modal-close');
  const contactForm = $('#contact-form');
  const formSuccess = $('#form-success');

  const toolData = {
    'image-verification': {
      title: 'Image Verification Tool',
      desc: 'Upload or link images to verify authenticity and integrity. The tool checks consistency and supports common formats. Connect your backend to process live verification.'
    },
    'trust-score': {
      title: 'Trust Score Calculator',
      desc: 'Compute a structured trust score from your inputs (e.g. verification results, history, source). Criteria and weights can be configured for your use case.'
    },
    'risk-analysis': {
      title: 'Risk Analysis Module',
      desc: 'Assess and categorize risk using configurable criteria. Inputs are evaluated against your rules and thresholds, with documented logic and outputs.'
    },
    'report-generator': {
      title: 'Report Generator',
      desc: 'Generate structured reports from verification and analysis results. Output format and sections can be tailored for your workflows and compliance needs.'
    }
  };

  // --- Theme Toggle Logic ---
  function initThemeToggle() {
    const themeToggleBtn = $('#theme-toggle');
    const sunIcon = $('.icon-sun');
    const moonIcon = $('.icon-moon');

    if (!themeToggleBtn || !sunIcon || !moonIcon) return;

    function updateIcons(theme) {
      if (theme === 'dark') {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
      } else {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
      }
    }

    // Set initial icon state based on the IIFE executed at the top of the file
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    updateIcons(currentTheme);

    // Toggle button click event
    themeToggleBtn.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateIcons(newTheme);
    });

    // Listen for OS theme changes in real-time
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      // Only auto-switch if the user hasn't manually overridden it
      if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        updateIcons(newTheme);
      }
    });
  }

  // --- Smooth Scroll ---
  function initSmoothScroll() {
    $$('a[href^="#"]').forEach((a) => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const target = $(id);
      if (!target) return;
      a.addEventListener('click', (e) => {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (navLinks.classList.contains('open')) {
          navToggle.setAttribute('aria-expanded', 'false');
          navLinks.classList.remove('open');
        }
      });
    });
  }

  // --- Navbar Scroll Effect ---
  function initNavbarScroll() {
    function updateNavbar() {
      if (window.scrollY > NAV_SCROLL_THRESHOLD) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
    window.addEventListener('scroll', updateNavbar, { passive: true });
    updateNavbar();
  }

  // --- Mobile Menu ---
  function initMobileMenu() {
    if (!navToggle || !navLinks) return;
    navToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open);
      navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    $$('.nav-links a').forEach((a) => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --- Scroll to Top Button ---
  function initScrollToTop() {
    function updateScrollTopVisibility() {
      if (window.scrollY > SCROLL_TOP_THRESHOLD) {
        scrollTopBtn.removeAttribute('hidden');
      } else {
        scrollTopBtn.setAttribute('hidden', '');
      }
    }
    window.addEventListener('scroll', updateScrollTopVisibility, { passive: true });
    updateScrollTopVisibility();
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- Fade-in Animations ---
  function initFadeIn() {
    const elements = $$('.fade-in');
    if (!elements.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { rootMargin: FADE_IN_ROOT_MARGIN, threshold: 0.05 }
    );
    elements.forEach((el) => observer.observe(el));
  }

  // --- Modals & Tools ---
  function openModal(toolId) {
    const data = toolData[toolId];
    if (!data) return;
    modalTitle.textContent = data.title;
    modalDesc.textContent = data.desc;

    if (toolId === 'image-verification') {
      modalPlaceholder.innerHTML =
        '<div class="modal-import">' +
        '  <input type="file" id="modal-image-input" accept="image/*" multiple hidden>' +
        '  <button type="button" class="btn btn-primary modal-import-btn" id="modal-import-btn">Share image</button>' +
        '  <p class="modal-import-hint">PNG, JPG, WebP. Max <strong>10 MB</strong> per image.</p>' +
        '  <p class="modal-import-error" id="modal-import-error" role="alert" aria-live="assertive"></p>' +
        '  <ul class="modal-file-list" id="modal-file-list" aria-live="polite"></ul>' +
        '  <button type="button" class="btn btn-primary modal-process-btn" id="modal-process-btn" disabled>Send for processing</button>' +
        '</div>';
      initImageImport();
    } else {
      modalPlaceholder.innerHTML = '<p>Placeholder interface — connect to your backend or demo flow here.</p>';
    }

    modalOverlay.classList.add('open');
    modalOverlay.setAttribute('aria-hidden', 'false');
    modal.setAttribute('aria-labelledby', 'modal-title');
    document.body.style.overflow = 'hidden';
    modalClose.focus();
  }

  const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

  function initImageImport() {
    const input = $('#modal-image-input');
    const importBtn = $('#modal-import-btn');
    const fileList = $('#modal-file-list');
    const processBtn = $('#modal-process-btn');
    const errorEl = $('#modal-import-error');
    if (!input || !importBtn || !fileList || !processBtn) return;

    let selectedFiles = [];

    importBtn.addEventListener('click', () => input.click());

    input.addEventListener('change', () => {
      const rawFiles = input.files ? [...input.files] : [];
      if (errorEl) errorEl.textContent = '';
      selectedFiles = [];
      fileList.innerHTML = '';

      const tooLarge = rawFiles.filter((f) => f.size > MAX_IMAGE_SIZE_BYTES);
      if (tooLarge.length > 0) {
        if (errorEl) {
          errorEl.textContent = tooLarge.length === 1
            ? '"' + tooLarge[0].name + '" exceeds 10 MB. Please choose a smaller image.'
            : tooLarge.length + ' image(s) exceed 10 MB. Please choose smaller images.';
        }
        rawFiles.forEach((file) => {
          if (file.size <= MAX_IMAGE_SIZE_BYTES) selectedFiles.push(file);
        });
      } else {
        selectedFiles = rawFiles;
      }

      if (selectedFiles.length === 0) {
        processBtn.disabled = true;
        return;
      }

      selectedFiles.forEach((file) => {
        const li = document.createElement('li');
        li.textContent = file.name + ' (' + formatFileSize(file.size) + ')';
        fileList.appendChild(li);
      });
      processBtn.disabled = false;
    });

    processBtn.addEventListener('click', () => {
      if (selectedFiles.length === 0) return;
      processBtn.disabled = true;
      processBtn.textContent = 'Sending…';
      setTimeout(() => {
        processBtn.textContent = 'Send for processing';
        processBtn.disabled = false;
        fileList.innerHTML = '';
        input.value = '';
        selectedFiles = [];
      }, 1500);
    });
  }

  function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  function closeModal() {
    modalOverlay.classList.remove('open');
    modalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function initModals() {
    $$('.tool-card').forEach((btn) => {
      btn.addEventListener('click', () => {
        const toolId = btn.getAttribute('data-tool');
        if (toolId) openModal(toolId);
      });
    });
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay.classList.contains('open')) closeModal();
    });
  }

  // --- Contact Form ---
  function validateForm() {
    const name = $('#contact-name');
    const email = $('#contact-email');
    const message = $('#contact-message');
    const errName = $('#error-name');
    const errEmail = $('#error-email');
    const errMessage = $('#error-message');

    errName.textContent = '';
    errEmail.textContent = '';
    errMessage.textContent = '';

    let valid = true;
    const trim = (v) => (v && typeof v === 'string' ? v.trim() : '');

    if (!trim(name.value)) {
      errName.textContent = 'Please enter your name.';
      valid = false;
    }
    if (!trim(email.value)) {
      errEmail.textContent = 'Please enter your email.';
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      errEmail.textContent = 'Please enter a valid email address.';
      valid = false;
    }
    if (!trim(message.value)) {
      errMessage.textContent = 'Please enter a message.';
      valid = false;
    }

    return valid;
  }

  function initContactForm() {
    if (!contactForm) return;
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      formSuccess.hidden = true;
      if (!validateForm()) return;
      formSuccess.hidden = false;
      contactForm.reset();
      $('#error-name').textContent = '';
      $('#error-email').textContent = '';
      $('#error-message').textContent = '';
    });
  }

  // --- Initialize All Subsystems ---
  function init() {
    initThemeToggle();
    initSmoothScroll();
    initNavbarScroll();
    initMobileMenu();
    initScrollToTop();
    initFadeIn();
    initModals();
    initContactForm();
  }

  // Run initialization when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();