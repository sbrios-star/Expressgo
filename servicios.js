/* servicios.js - Sub-navigation and Scroll Spy logic for ExpressGO Services page */

document.addEventListener('DOMContentLoaded', () => {
  const serviceSections = document.querySelectorAll('.service-detail-section');
  const indexLinks = document.querySelectorAll('.index-bar-link');
  const indexBar = document.getElementById('services-index-bar');
  
  if (serviceSections.length === 0 || indexLinks.length === 0) return;

  // Offset calculations for header & index bar heights
  const getHeaderOffset = () => {
    const header = document.getElementById('header');
    const headerHeight = header ? header.offsetHeight : 72;
    const indexBarHeight = indexBar ? indexBar.offsetHeight : 58;
    return headerHeight + indexBarHeight;
  };

  /* 1. Smooth Scroll with custom offset on link click */
  indexLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      const targetHash = link.getAttribute('href');
      const targetSection = document.querySelector(targetHash);
      
      if (targetSection) {
        const offset = getHeaderOffset();
        const elementPosition = targetSection.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - offset + 5; // tiny buffer

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Update active class immediately
        indexLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        // Update URL hash without jumping
        history.pushState(null, null, targetHash);
      }
    });
  });

  /* 2. Scroll Spy: highlight menu link corresponding to the current section */
  const scrollSpy = () => {
    const scrollPosition = window.scrollY;
    const offset = getHeaderOffset() + 20; // adding threshold buffer

    serviceSections.forEach(section => {
      const sectionTop = section.offsetTop - offset;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        indexLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', scrollSpy);
  scrollSpy(); // run once on load
});
