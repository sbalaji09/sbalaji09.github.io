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
