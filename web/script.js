// ===== Navbar scroll effect =====
window.addEventListener('scroll', function() {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
  } else {
    navbar.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.06)';
  }
});

// ===== Smooth scroll for anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const navbarHeight = document.querySelector('.navbar').offsetHeight;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      
      // Close mobile menu if open
      const navbarCollapse = document.querySelector('.navbar-collapse');
      if (navbarCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
        if (bsCollapse) {
          bsCollapse.hide();
        }
      }
    }
  });
});

// ===== Waitlist form submission =====
document.getElementById('waitlist-form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const emailInput = this.querySelector('input[type="email"]');
  const email = emailInput.value;
  const button = this.querySelector('button');
  const originalText = button.innerHTML;
  
  // Simple validation
  if (!email || !email.includes('@')) {
    alert('Please enter a valid email address.');
    return;
  }
  
  // Show loading state
  button.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Joining...';
  button.disabled = true;
  
  // Simulate form submission (replace with actual API call)
  setTimeout(function() {
    button.innerHTML = '<i class="bi bi-check-circle me-2"></i>You\'re on the list!';
    button.classList.remove('btn-light');
    button.classList.add('btn-success');
    emailInput.value = '';
    
    // Reset after 3 seconds
    setTimeout(function() {
      button.innerHTML = originalText;
      button.classList.remove('btn-success');
      button.classList.add('btn-light');
      button.disabled = false;
    }, 3000);
  }, 1500);
});

// ===== Intersection Observer for animations =====
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const observer = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.problem-card, .step-card, .audience-card, .features-section .row').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// ===== Active nav link on scroll =====
window.addEventListener('scroll', function() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  let current = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
});
