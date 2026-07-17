/* app.js - Logic and interactivity for ExpressGO Landing Page */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  /* 1. Header Scroll Effect */
  const header = document.getElementById('header');
  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled', 'header-glass');
    } else {
      header.classList.remove('scrolled', 'header-glass');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Run once in case page loaded scrolled

  /* 2. Mobile Drawer Toggle */
  const hamburger = document.getElementById('hamburger');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerOverlay = document.getElementById('drawer-overlay');
  const drawerLinks = mobileDrawer.querySelectorAll('.nav-link, .btn');

  const toggleDrawer = () => {
    mobileDrawer.classList.toggle('open');
    drawerOverlay.classList.toggle('active');
    document.body.style.overflow = mobileDrawer.classList.contains('open') ? 'hidden' : '';
  };

  hamburger.addEventListener('click', toggleDrawer);
  drawerOverlay.addEventListener('click', toggleDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileDrawer.classList.contains('open')) {
        toggleDrawer();
      }
    });
  });

  /* 3. FAQ Accordion */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question-btn');
    const answer = item.querySelector('.faq-answer');
    
    btn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.faq-answer').style.maxHeight = null;
          otherItem.querySelector('.faq-question-btn').setAttribute('aria-expanded', 'false');
        }
      });
      
      // Toggle current item
      if (isActive) {
        item.classList.remove('active');
        answer.style.maxHeight = null;
        btn.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* 4. Form Tab Switcher (Registro/Buscar) */
  const tabButtons = document.querySelectorAll('.form-tab-btn');
  const formPanels = document.querySelectorAll('.form-panel');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      
      tabButtons.forEach(b => b.classList.remove('active'));
      formPanels.forEach(p => p.classList.remove('active'));
      
      btn.classList.add('active');
      document.getElementById(`${targetTab}-panel`).classList.add('active');
    });
  });

  /* 5. Contact Form Submissions */
  const contactForms = document.querySelectorAll('.contact-form');
  contactForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Hide current form container fields
      const formFields = form.querySelector('.form-layout-grid');
      const submitBtn = form.querySelector('.btn-submit');
      const successMsg = form.querySelector('.form-success-message');
      
      if (formFields && submitBtn && successMsg) {
        formFields.style.display = 'none';
        submitBtn.style.display = 'none';
        
        // Populate custom details in success message if needed
        successMsg.style.display = 'block';
      }
    });
  });

  // Re-start form reset handler
  const resetFormBtns = document.querySelectorAll('.btn-reset-form');
  resetFormBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const form = btn.closest('form');
      form.reset();
      
      const formFields = form.querySelector('.form-layout-grid');
      const submitBtn = form.querySelector('.btn-submit');
      const successMsg = form.querySelector('.form-success-message');
      
      formFields.style.display = 'grid';
      submitBtn.style.display = 'inline-flex';
      successMsg.style.display = 'none';
    });
  });

  /* 6. Origin Route Filtering & Search */
  const routeOrigins = document.querySelectorAll('.origin-group');
  const routeSearchInput = document.getElementById('search-destiny');
  const quickFilterBtns = document.querySelectorAll('.quick-filter-btn');
  const filterOriginSelect = document.getElementById('filter-origin-select');

  // Search logic
  const filterRoutes = () => {
    const query = routeSearchInput ? routeSearchInput.value.toLowerCase().trim() : '';
    const selectedOrigin = filterOriginSelect ? filterOriginSelect.value : 'all';
    
    routeOrigins.forEach(group => {
      const groupOrigin = group.getAttribute('data-origin').toLowerCase();
      let hasVisibleCards = false;
      const cards = group.querySelectorAll('.route-card');
      
      cards.forEach(card => {
        const dest = card.getAttribute('data-destination').toLowerCase();
        
        const matchesQuery = dest.includes(query);
        const matchesOrigin = selectedOrigin === 'all' || selectedOrigin === groupOrigin;
        
        if (matchesQuery && matchesOrigin) {
          card.style.display = 'flex';
          hasVisibleCards = true;
        } else {
          card.style.display = 'none';
        }
      });
      
      // Hide the whole origin group if no card is visible
      if (hasVisibleCards) {
        group.style.display = 'block';
      } else {
        group.style.display = 'none';
      }
    });
  };

  if (routeSearchInput) {
    routeSearchInput.addEventListener('input', filterRoutes);
  }
  if (filterOriginSelect) {
    filterOriginSelect.addEventListener('change', filterRoutes);
  }

  // Quick filters for dates/types
  quickFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      quickFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Mock filter action - filters routes based on custom tag
      const filterTag = btn.getAttribute('data-filter');
      
      routeOrigins.forEach(group => {
        let hasVisibleCards = false;
        const cards = group.querySelectorAll('.route-card');
        
        cards.forEach(card => {
          const badge = card.querySelector('.route-badge');
          const isFrequent = card.getAttribute('data-frequent') === 'true';
          
          if (filterTag === 'all') {
            card.style.display = 'flex';
            hasVisibleCards = true;
          } else if (filterTag === 'frequent' && isFrequent) {
            card.style.display = 'flex';
            hasVisibleCards = true;
          } else if (filterTag === 'today' && badge && (badge.textContent.includes('salida') || badge.textContent.includes('disponible'))) {
            card.style.display = 'flex';
            hasVisibleCards = true;
          } else if (filterTag === 'tomorrow' && badge && badge.textContent.includes('disponible')) {
            card.style.display = 'flex';
            hasVisibleCards = true;
          } else {
            card.style.display = 'none';
          }
        });
        
        group.style.display = hasVisibleCards ? 'block' : 'none';
      });
    });
  });

  /* 7. Hero Search Button Interaction */
  const heroSearchBtn = document.getElementById('hero-search-btn');
  if (heroSearchBtn) {
    heroSearchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Get origin and destination values from Hero inputs
      const originVal = document.getElementById('hero-origin').value;
      const destVal = document.getElementById('hero-destination').value;
      
      // Auto fill main route search panel
      if (filterOriginSelect && originVal) {
        const optionToSelect = Array.from(filterOriginSelect.options).find(opt => opt.text.toLowerCase().includes(originVal.toLowerCase()));
        if (optionToSelect) {
          filterOriginSelect.value = optionToSelect.value;
        }
      }
      
      if (routeSearchInput && destVal) {
        routeSearchInput.value = destVal;
      }
      
      filterRoutes();
      
      // Scroll smoothly to routes section
      const routesSection = document.getElementById('rutas');
      if (routesSection) {
        routesSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  /* 8. Card actions "Ver Ruta" / "Conocer más" links */
  const selectRouteBtns = document.querySelectorAll('.btn-select-route');
  selectRouteBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const origin = btn.getAttribute('data-origin');
      const dest = btn.getAttribute('data-destination');
      
      // Switch form tab to "Buscar Ruta"
      const routeTab = document.querySelector('.form-tab-btn[data-tab="buscar-ruta"]');
      if (routeTab) {
        routeTab.click();
      }
      
      // Fill the registration search route fields
      const regOriginInput = document.getElementById('reg-origin');
      const regDestInput = document.getElementById('reg-destination');
      
      if (regOriginInput) regOriginInput.value = origin;
      if (regDestInput) regDestInput.value = dest;
      
      // Scroll to registration form
      const regSection = document.getElementById('registro');
      if (regSection) {
        regSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* 9. Scroll Reveal Animations */
  const reveals = document.querySelectorAll('.reveal');
  const revealOnScroll = () => {
    reveals.forEach(element => {
      const windowHeight = window.innerHeight;
      const elementTop = element.getBoundingClientRect().top;
      const elementVisible = 120;
      
      if (elementTop < windowHeight - elementVisible) {
        element.classList.add('active');
      }
    });
  };
  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll(); // Trigger once on load

  /* 10. Stat Counter Animation */
  const counterElements = document.querySelectorAll('.animate-counter');
  
  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-value'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    let current = 0;
    const duration = 1200; // ms
    const stepTime = Math.max(Math.floor(duration / target), 15);
    
    const timer = setInterval(() => {
      current += Math.ceil(target / 40); // increment steps
      if (current >= target) {
        el.textContent = target + suffix;
        clearInterval(timer);
      } else {
        el.textContent = current + suffix;
      }
    }, stepTime);
  };

  const obsOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: '0px'
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        if (!el.classList.contains('animated')) {
          el.classList.add('animated');
          animateCounter(el);
        }
        observer.unobserve(el);
      }
    });
  }, obsOptions);

  counterElements.forEach(el => {
    observer.observe(el);
  });
});
