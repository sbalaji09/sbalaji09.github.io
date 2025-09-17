// Enhanced smooth scrolling with JavaScript for better control
function smoothScrollTo(elementId) {
    event.preventDefault();
    const element = document.getElementById(elementId);
    const headerHeight = 80; // Height of fixed header
    const elementPosition = element.offsetTop - headerHeight;
    
    window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
    });
    
    // Update URL hash without jumping
    history.pushState(null, null, '#' + elementId);
}

// Remove 'active' class from all links and add to the clicked one
document.querySelectorAll('.hero-nav ul li a').forEach(link => {
  link.addEventListener('click', (event) => {
    // Remove active class from all
    document.querySelectorAll('.hero-nav ul li a').forEach(el => el.classList.remove('active'));
    // Add active class to clicked
    event.target.classList.add('active');
  });
});

// On page load set active class based on current hash in URL
window.addEventListener('load', () => {
  const hash = window.location.hash;
  if(hash) {
    const activeLink = document.querySelector(`.hero-nav ul li a[href="${hash}"]`);
    if (activeLink) {
      document.querySelectorAll('.hero-nav ul li a').forEach(el => el.classList.remove('active'));
      activeLink.classList.add('active');
    }
  }
});

function smoothScrollTo(target, duration = 1200) {
  const targetElement = document.getElementById(target);
  const targetPosition = targetElement.offsetTop - 100;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  let startTime = null;

  function ease(t, b, c, d) {
      t /= d/2;
      if (t < 1) return c/2*t*t + b;
      t--;
      return -c/2 * (t*(t-2) - 1) + b;
  }

  function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = ease(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
  }

  requestAnimationFrame(animation);
}

// Navigation handling
document.addEventListener('DOMContentLoaded', function() {
  const navLinks = document.querySelectorAll('.hero-nav a');
  
  navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
          e.preventDefault();
          const targetId = this.getAttribute('data-section');
          
          // Remove active class from all links
          navLinks.forEach(l => l.classList.remove('active'));
          // Add active class to clicked link
          this.classList.add('active');
          
          // Smooth scroll to target
          smoothScrollTo(targetId);
          
          // Update URL without jumping
          history.pushState(null, null, '#' + targetId);
      });
  });

  // Handle direct hash links
  if (window.location.hash) {
      const targetId = window.location.hash.substring(1);
      setTimeout(() => {
          smoothScrollTo(targetId);
          const activeLink = document.querySelector(`[data-section="${targetId}"]`);
          if (activeLink) {
              navLinks.forEach(l => l.classList.remove('active'));
              activeLink.classList.add('active');
          }
      }, 100);
  } else {
      // Set About as active by default
      document.querySelector('[data-section="about"]').classList.add('active');
  }

  // Intersection Observer for active navigation states
  const sections = document.querySelectorAll('section');
  const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              const activeLink = document.querySelector(`[data-section="${entry.target.id}"]`);
              if (activeLink) {
                  navLinks.forEach(l => l.classList.remove('active'));
                  activeLink.classList.add('active');
              }
          }
      });
  }, {
      threshold: 0.5,
      rootMargin: '-100px 0px -100px 0px'
  });

  sections.forEach(section => {
      observer.observe(section);
  });
});

// Parallax effect for scroll indicator
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const indicator = document.querySelector('.scroll-indicator');
  if (indicator) {
      const opacity = Math.max(0, 1 - scrolled / 300);
      indicator.style.opacity = opacity;
  }
});

// Hero section animation control
window.addEventListener('load', () => {
  const siddharthElement = document.getElementById('siddharth-name');
  const hiElement = document.querySelector('.delay-1'); // "Hi" element
  const nameElement = document.querySelector('.delay-2'); // "my name is" element
  const paragraphElement = document.querySelector('.right p'); // paragraph element
  
  if (siddharthElement && hiElement && nameElement && paragraphElement) {
    // Start with "Hi" animation
    hiElement.classList.remove('hero-section-hidden');
    
    // After "Hi" completes, start "my name is"
    hiElement.addEventListener('animationend', (event) => {
      if (event.animationName === 'fadeInUp') {
        nameElement.classList.remove('hero-section-hidden');
      }
    });
    
    // After "my name is" completes, start "Siddharth" and paragraph with enhanced animations
    nameElement.addEventListener('animationend', (event) => {
      if (event.animationName === 'fadeInUp') {
        // Enhanced Siddharth name animation
        siddharthElement.classList.remove('hero-section-hidden');
        siddharthElement.classList.remove('fade-in');
        siddharthElement.classList.add('name-glow');
        
        // Enhanced paragraph animation with slight delay for better effect
        setTimeout(() => {
          paragraphElement.classList.remove('hero-section-hidden');
          paragraphElement.classList.add('paragraph-reveal');
        }, 200);
      }
    });
  }
});
