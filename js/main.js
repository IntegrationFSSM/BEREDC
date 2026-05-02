/**
 * BEREDC - Main JavaScript
 * Bureau des Études, Recherche, Évaluation et Développement des Compétences
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all modules
  initThemeToggle();
  initMobileMenu();
  initScrollAnimations();
  initHeaderScroll();
  initContactForm();
  initFormationsFilter();
});

/**
 * Theme Toggle - Dark/Light Mode
 * Saves preference to localStorage, detects system preference
 */
function initThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = themeToggle?.querySelector('.theme-icon');
  const html = document.documentElement;
  
  // Check for saved theme or system preference
  const savedTheme = localStorage.getItem('beredc-theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  let currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
  html.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);
  
  // Toggle handler
  themeToggle?.addEventListener('click', () => {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', currentTheme);
    localStorage.setItem('beredc-theme', currentTheme);
    updateThemeIcon(currentTheme);
  });
  
  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('beredc-theme')) {
      currentTheme = e.matches ? 'dark' : 'light';
      html.setAttribute('data-theme', currentTheme);
      updateThemeIcon(currentTheme);
    }
  });
}

function updateThemeIcon(theme) {
  const icon = document.querySelector('.theme-icon');
  if (!icon) return;
  
  // Simple sun/moon SVG
  if (theme === 'dark') {
    icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
    icon.setAttribute('aria-label', 'Passer en mode clair');
  } else {
    icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
    icon.setAttribute('aria-label', 'Passer en mode sombre');
  }
}

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const nav = document.getElementById('main-nav');
  
  if (!menuBtn || !nav) return;
  
  // Create backdrop if not exists
  let backdrop = document.querySelector('.nav-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'nav-backdrop';
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.appendChild(backdrop);
  }
  
  function openMenu() {
    menuBtn.classList.add('active');
    nav.classList.add('active');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
    menuBtn.setAttribute('aria-expanded', 'true');
  }
  
  function closeMenu() {
    menuBtn.classList.remove('active');
    nav.classList.remove('active');
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
    menuBtn.setAttribute('aria-expanded', 'false');
  }
  
  // Toggle menu on button click
  menuBtn.addEventListener('click', () => {
    if (nav.classList.contains('active')) {
      closeMenu();
    } else {
      openMenu();
    }
  });
  
  // Close menu when clicking backdrop
  backdrop.addEventListener('click', closeMenu);
  
  // Close menu when clicking a link
  const navLinks = nav.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
  
  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('active')) {
      closeMenu();
    }
  });
}

/**
 * Scroll Animations using IntersectionObserver
 */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  
  if (animatedElements.length === 0) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  animatedElements.forEach(el => observer.observe(el));
}

/**
 * Header Scroll Effect - Add shadow on scroll
 */
function initHeaderScroll() {
  const header = document.querySelector('.header');
  
  if (!header) return;
  
  let ticking = false;
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (window.scrollY > 50) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  });
}

/**
 * Contact Form Validation and Handling
 */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  
  form.addEventListener('submit', handleFormSubmit);
  
  // Real-time validation
  const inputs = form.querySelectorAll('.form-input, .form-select, .form-textarea');
  inputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => clearError(input));
  });
}

function validateField(field) {
  const value = field.value.trim();
  const fieldName = field.name;
  let error = '';
  
  // Required check
  if (field.hasAttribute('required') && !value) {
    error = 'Ce champ est obligatoire';
  }
  
  // Email validation
  if (fieldName === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      error = 'Veuillez entrer une adresse email valide';
    }
  }
  
  // Phone validation (Moroccan format)
  if (fieldName === 'telephone' && value) {
    const phoneRegex = /^(\+212|0)[5-7][0-9]{8}$/;
    const cleanPhone = value.replace(/\s/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      error = 'Veuillez entrer un numéro valide (ex: 0612345678 ou +212612345678)';
    }
  }
  
  // Display or clear error
  if (error) {
    showError(field, error);
    return false;
  } else {
    clearError(field);
    return true;
  }
}

function showError(field, message) {
  field.classList.add('error');
  
  // Remove existing error
  const existingError = field.parentElement.querySelector('.form-error');
  if (existingError) existingError.remove();
  
  // Create error element
  const errorEl = document.createElement('span');
  errorEl.className = 'form-error';
  errorEl.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> ${message}`;
  
  field.parentElement.appendChild(errorEl);
}

function clearError(field) {
  field.classList.remove('error');
  const errorEl = field.parentElement.querySelector('.form-error');
  if (errorEl) errorEl.remove();
}

function handleFormSubmit(e) {
  e.preventDefault();
  
  const form = e.target;
  const inputs = form.querySelectorAll('.form-input, .form-select, .form-textarea');
  let isValid = true;
  
  // Validate all fields
  inputs.forEach(input => {
    if (!validateField(input)) {
      isValid = false;
    }
  });
  
  if (isValid) {
    // Show success message
    showFormSuccess(form);
    
    // Reset form after delay
    setTimeout(() => {
      form.reset();
      const successMsg = form.querySelector('.form-success');
      if (successMsg) successMsg.remove();
    }, 5000);
  }
}

function showFormSuccess(form) {
  // Remove existing success message
  const existingSuccess = form.querySelector('.form-success');
  if (existingSuccess) existingSuccess.remove();
  
  const successEl = document.createElement('div');
  successEl.className = 'form-success';
  successEl.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
    <span>Votre message a été envoyé avec succès. Notre équipe vous contactera dans les plus brefs délais.</span>
  `;
  
  form.insertBefore(successEl, form.firstChild);
}

/**
 * Formations Filter
 */
function initFormationsFilter() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const formationCards = document.querySelectorAll('.formation-card');
  
  if (filterButtons.length === 0) return;
  
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filter = btn.dataset.filter;
      
      // Filter cards
      formationCards.forEach(card => {
        const category = card.dataset.category;
        
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
          card.style.animation = 'fadeIn 0.3s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/**
 * Smooth scroll for anchor links
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      e.preventDefault();
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

/**
 * Lazy Loading for Images
 */
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        img.classList.remove('lazy');
        img.classList.add('loaded');
        imageObserver.unobserve(img);
      }
    });
  }, {
    rootMargin: '50px 0px'
  });
  
  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}
