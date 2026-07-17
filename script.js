/* script.js - Logic and interactivity for ExpressGO Landing Page & Services */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  /* 1. Header Scroll Effect */
  const header = document.getElementById('header');
  const handleScroll = () => {
    if (!header) return;
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
  
  if (hamburger && mobileDrawer && drawerOverlay) {
    const drawerLinks = mobileDrawer.querySelectorAll('.nav-link, .btn');

    const toggleDrawer = () => {
      mobileDrawer.classList.toggle('open');
      drawerOverlay.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', mobileDrawer.classList.contains('open') ? 'true' : 'false');
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
  }

  /* 3. FAQ Accordion (Limited to 5 items) */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question-btn');
    const answer = item.querySelector('.faq-answer');
    
    if (btn && answer) {
      btn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close other items
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherAnswer = otherItem.querySelector('.faq-answer');
            if (otherAnswer) otherAnswer.style.maxHeight = null;
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
    }
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
      const targetEl = document.getElementById(`${targetTab}-panel`);
      if (targetEl) targetEl.classList.add('active');
    });
  });

  /* 5. Contact Form Submissions */
  const contactForms = document.querySelectorAll('.contact-form');
  contactForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const formFields = form.querySelector('.form-layout-grid');
      const submitBtn = form.querySelector('.btn-submit');
      const successMsg = form.querySelector('.form-success-message');
      
      if (formFields && submitBtn && successMsg) {
        formFields.style.display = 'none';
        submitBtn.style.display = 'none';
        successMsg.style.display = 'block';
      }
    });
  });

  const resetFormBtns = document.querySelectorAll('.btn-reset-form');
  resetFormBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const form = btn.closest('form');
      form.reset();
      
      const formFields = form.querySelector('.form-layout-grid');
      const submitBtn = form.querySelector('.btn-submit');
      const successMsg = form.querySelector('.form-success-message');
      
      if (formFields && submitBtn && successMsg) {
        formFields.style.display = 'grid';
        submitBtn.style.display = 'inline-flex';
        successMsg.style.display = 'none';
      }
    });
  });

  /* 6. Dynamic City Routes Filtering & Search */
  const routeOrigins = document.querySelectorAll('.origin-group');
  const routeSearchInput = document.getElementById('search-destiny');
  const quickFilterBtns = document.querySelectorAll('.quick-filter-btn');
  const filterOriginSelect = document.getElementById('filter-origin-select');

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

  quickFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      quickFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filterTag = btn.getAttribute('data-filter');
      
      routeOrigins.forEach(group => {
        let hasVisibleCards = false;
        const cards = group.querySelectorAll('.route-card');
        
        cards.forEach(card => {
          const badge = card.querySelector('.route-badge');
          const isFrequent = card.getAttribute('data-destination') === 'centro de guayaquil' || card.getAttribute('data-destination') === 'centro histórico' || card.getAttribute('data-destination') === 'playa murciélago' || card.getAttribute('data-destination') === 'urdesa' || card.getAttribute('data-destination') === 'cumbayá';
          
          if (filterTag === 'all') {
            card.style.display = 'flex';
            hasVisibleCards = true;
          } else if (filterTag === 'frequent' && isFrequent) {
            card.style.display = 'flex';
            hasVisibleCards = true;
          } else if (filterTag === 'today' && badge && badge.textContent.includes('demostrativa')) {
            card.style.display = 'flex';
            hasVisibleCards = true;
          } else if (filterTag === 'tomorrow' && badge && badge.textContent.includes('demostrativa')) {
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
  const heroSearchForm = document.getElementById('hero-search-form');
  if (heroSearchForm) {
    heroSearchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const originVal = document.getElementById('hero-origin').value;
      const destVal = document.getElementById('hero-destination').value;
      
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
      
      const routesSection = document.getElementById('rutas');
      if (routesSection) {
        routesSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  /* 8. Route Selection Hook */
  const selectRouteBtns = document.querySelectorAll('.btn-select-route');
  selectRouteBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const origin = btn.getAttribute('data-origin');
      const dest = btn.getAttribute('data-destination');
      
      const routeTab = document.querySelector('.form-tab-btn[data-tab="buscar-ruta"]');
      if (routeTab) {
        routeTab.click();
      }
      
      const regOriginInput = document.getElementById('reg-origin');
      const regDestInput = document.getElementById('reg-destination');
      
      if (regOriginInput) regOriginInput.value = origin;
      if (regDestInput) regDestInput.value = dest;
      
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
      const elementVisible = 100;
      
      if (elementTop < windowHeight - elementVisible) {
        element.classList.add('active');
      }
    });
  };
  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll(); // Trigger once on load

  /* 10. Floating Support Widget panel toggles */
  const supportBtn = document.getElementById('support-floating-button');
  const supportPanel = document.getElementById('support-panel');
  const supportClose = document.getElementById('support-panel-close');
  const supportOptionsList = document.getElementById('support-options-list');
  const supportFormContainer = document.getElementById('support-form-container');
  const supportBackBtn = document.getElementById('support-back-btn');
  
  const optionButtons = document.querySelectorAll('.support-option-btn');
  const supportCategoryTitle = document.getElementById('support-category-title');
  const supportCategoryHidden = document.getElementById('support-category-hidden');
  
  const supportInternalForm = document.getElementById('support-internal-form');
  const supportSuccessMessage = document.getElementById('support-success-message');
  const supportResetBtn = document.getElementById('support-reset-btn');

  if (supportPanel && supportClose) {
    // Open/Close Panel
    if (supportBtn) {
      supportBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = supportPanel.classList.contains('open');
        if (isOpen) {
          supportPanel.classList.remove('open');
          supportPanel.setAttribute('aria-hidden', 'true');
          supportBtn.setAttribute('aria-expanded', 'false');
        } else {
          supportPanel.classList.add('open');
          supportPanel.setAttribute('aria-hidden', 'false');
          supportBtn.setAttribute('aria-expanded', 'true');
        }
      });
    }

    supportClose.addEventListener('click', () => {
      supportPanel.classList.remove('open');
      supportPanel.setAttribute('aria-hidden', 'true');
      if (supportBtn) supportBtn.setAttribute('aria-expanded', 'false');
    });

    // Close panel on clicking outside
    document.addEventListener('click', (e) => {
      const isClickInsidePanel = supportPanel.contains(e.target);
      const isClickOnBtn = supportBtn && supportBtn.contains(e.target);
      if (!isClickInsidePanel && !isClickOnBtn && supportPanel.classList.contains('open')) {
        supportPanel.classList.remove('open');
        supportPanel.setAttribute('aria-hidden', 'true');
        if (supportBtn) supportBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // Close panel with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && supportPanel.classList.contains('open')) {
        supportPanel.classList.remove('open');
        supportPanel.setAttribute('aria-hidden', 'true');
        if (supportBtn) supportBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // Option Click - show Form
    optionButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const category = btn.getAttribute('data-category');
        const spanEl = btn.querySelector('span');
        const categoryLabel = spanEl ? spanEl.textContent : 'Consulta';
        
        if (supportCategoryTitle) supportCategoryTitle.textContent = categoryLabel;
        if (supportCategoryHidden) supportCategoryHidden.value = category;
        
        if (supportOptionsList) supportOptionsList.style.display = 'none';
        if (supportFormContainer) supportFormContainer.classList.add('active');
      });
    });

    // Back Button Click - return to options
    if (supportBackBtn) {
      supportBackBtn.addEventListener('click', () => {
        if (supportOptionsList) supportOptionsList.style.display = 'flex';
        if (supportFormContainer) supportFormContainer.classList.remove('active');
        if (supportInternalForm) {
          supportInternalForm.reset();
          supportInternalForm.style.display = 'block';
        }
        if (supportSuccessMessage) {
          supportSuccessMessage.style.display = 'none';
        }
      });
    }

    // Submit support form
    if (supportInternalForm) {
      supportInternalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        supportInternalForm.style.display = 'none';
        if (supportSuccessMessage) supportSuccessMessage.style.display = 'block';
      });
    }

    // Reset support form
    if (supportResetBtn) {
      supportResetBtn.addEventListener('click', () => {
        if (supportInternalForm) {
          supportInternalForm.reset();
          supportInternalForm.style.display = 'block';
        }
        if (supportSuccessMessage) supportSuccessMessage.style.display = 'none';
        if (supportOptionsList) supportOptionsList.style.display = 'flex';
        if (supportFormContainer) supportFormContainer.classList.remove('active');
      });
    }
  }

  /* 11. Contact Page Commercial Form & URL Params Parser */
  const contactCommercialForm = document.getElementById('contact-commercial-form');
  const contactFormMessage = document.getElementById('contact-form-message');
  
  if (contactCommercialForm && contactFormMessage) {
    contactCommercialForm.addEventListener('submit', (e) => {
      e.preventDefault();
      contactFormMessage.style.display = 'block';
    });
  }

  // URL Params Parser for contacto.html
  const urlParams = new URLSearchParams(window.location.search);
  const tipoParam = urlParams.get('tipo');
  const motivoParam = urlParams.get('motivo');
  
  const selectUserType = document.getElementById('contact-user-type');
  const selectReason = document.getElementById('contact-reason');
  
  if (selectUserType && tipoParam) {
    const valueToSelect = tipoParam.charAt(0).toUpperCase() + tipoParam.slice(1).toLowerCase();
    const optionExists = Array.from(selectUserType.options).some(opt => opt.value === valueToSelect);
    if (optionExists) {
      selectUserType.value = valueToSelect;
    }
  }
  
  if (selectReason && motivoParam) {
    const normalizedMotivo = motivoParam.toLowerCase();
    if (normalizedMotivo === 'comunidad') {
      selectReason.value = 'GoPoints y comunidad';
    } else if (normalizedMotivo === 'conductor') {
      selectReason.value = 'Registro de conductor';
    } else {
      const matchedOpt = Array.from(selectReason.options).find(opt => opt.value.toLowerCase().includes(normalizedMotivo));
      if (matchedOpt) {
        selectReason.value = matchedOpt.value;
      }
    }
  }

  /* 12. Hash scroll on page load */
  if (window.location.hash) {
    setTimeout(() => {
      const hash = window.location.hash;
      const target = document.querySelector(hash);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }, 300);
  }
});
