/**
 * Deepanshi Gupta - Redesigned Psychoanalytic Space
 * Navigation, routing and interactive elements logic.
 * Author: Antigravity
 */

document.addEventListener('DOMContentLoaded', () => {
  // Navigation & Page routing
  const sections = document.querySelectorAll('.section');
  const navLinks = document.querySelectorAll('.nav-links a');
  const mobileMenuToggle = document.getElementById('menuToggle');
  const navLinksList = document.querySelector('.nav-links');

  // Page switching function
  function switchPage(targetId) {
    // If targetId is empty or just '#', default to home
    const id = (targetId && targetId !== '#') ? targetId.replace('#', '') : 'home';
    
    let targetSection = document.getElementById(id);
    if (!targetSection) {
      // Fallback to home if section not found
      targetSection = document.getElementById('home');
    }

    // Deactivate all sections and nav links
    sections.forEach(sec => sec.classList.remove('active'));
    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${id}` || (id === 'home' && href === '#')) {
        link.classList.add('active');
      }
    });

    // Activate the target section
    targetSection.classList.add('active');
    
    // Scroll window to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Close mobile menu if open
    closeMobileMenu();
  }

  // Handle hash routing
  function handleRoute() {
    const hash = window.location.hash;
    switchPage(hash);
  }

  // Listen for hash changes (handles browser back/forward and deep linking)
  window.addEventListener('hashchange', handleRoute);

  // Initialize page on load based on hash
  handleRoute();

  // Mobile Menu Toggle
  if (mobileMenuToggle && navLinksList) {
    mobileMenuToggle.addEventListener('click', () => {
      const isOpen = navLinksList.classList.toggle('open');
      mobileMenuToggle.classList.toggle('open', isOpen);
      mobileMenuToggle.setAttribute('aria-expanded', isOpen);
    });
  }

  function closeMobileMenu() {
    if (navLinksList && navLinksList.classList.contains('open')) {
      navLinksList.classList.remove('open');
      mobileMenuToggle.classList.remove('open');
      mobileMenuToggle.setAttribute('aria-expanded', 'false');
    }
  }

  // Form submission handler
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const firstName = document.getElementById('firstName').value.trim();
      const lastName = document.getElementById('lastName').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();
      const submitBtn = contactForm.querySelector('.submit-button');

      if (!firstName || !lastName || !phone || !email || !message) {
        showStatus('Please complete all fields.', true);
        return;
      }

      // Disable button during submit transition
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      // Prepare form data for Google Forms
      const formData = new FormData();
      formData.append('entry.517540454', firstName);
      formData.append('entry.1857266835', lastName);
      formData.append('entry.876569236', phone);
      formData.append('entry.560804901', email);
      formData.append('entry.30623709', message);

      const urlEncodedData = new URLSearchParams(formData).toString();

      // Submit to Google Forms via no-cors fetch
      fetch('https://docs.google.com/forms/d/e/1FAIpQLSeXauGLys_1NqdTzeIyYXle6TtwDIpoYPXcADkwaV5IHovmEA/formResponse', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: urlEncodedData
      })
      .then(() => {
        // Reset form
        contactForm.reset();
        
        // Reset button
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send';
        
        // Show success status
        showStatus('Your message has been sent successfully.', false);
      })
      .catch((error) => {
        console.error('Submission error:', error);
        
        // Reset button
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send';
        
        // Show error status
        showStatus('There was a problem sending your message. Please try again.', true);
      });
    });
  }

  function showStatus(text, isError) {
    if (formStatus) {
      formStatus.textContent = text;
      formStatus.style.color = isError ? '#A33B2E' : 'var(--color-accent)';
      formStatus.classList.add('visible');

      // Hide after 5 seconds
      setTimeout(() => {
        formStatus.classList.remove('visible');
      }, 5000);
    }
  }
});
