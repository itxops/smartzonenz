// SmartZone NZ — Interactive Engine & Status Tracker
document.addEventListener('DOMContentLoaded', () => {
  // 1. FAQ Accordion: Allow only one item open at a time
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        faqItems.forEach(other => {
          if (other !== item) other.removeAttribute('open');
        });
      }
    });
  });

  // 2. Mobile Navigation Drawer
  const mobileToggle = document.getElementById('mobileNavToggle');
  const navLinks = document.getElementById('navLinks');
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
      });
    });

    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !mobileToggle.contains(e.target)) {
        navLinks.classList.remove('mobile-open');
      }
    });
  }

  // 3. Live Store Open / Closed Status (Pacific/Auckland timezone)
  const statusPills = document.querySelectorAll('.status-pill');
  if (statusPills.length > 0) {
    function updateStoreStatus() {
      try {
        const now = new Date();
        const nzDate = new Date(now.toLocaleString('en-US', { timeZone: 'Pacific/Auckland' }));
        const day = nzDate.getDay(); // 0 = Sunday, 6 = Saturday
        const hour = nzDate.getHours();
        const minute = nzDate.getMinutes();
        const timeDecimal = hour + minute / 60;

        let isOpen = false;
        let statusText = 'Open Today';

        // Hours: Mon-Fri 9:00 - 17:30, Sat 9:30 - 16:30, Sun 10:00 - 15:00
        if (day >= 1 && day <= 5) {
          isOpen = timeDecimal >= 9.0 && timeDecimal < 17.5;
          statusText = isOpen ? 'Open Today · Closes 5:30pm' : (timeDecimal < 9.0 ? 'Opens 9am Today' : 'Closed · Opens 9am Mon–Fri');
        } else if (day === 6) {
          isOpen = timeDecimal >= 9.5 && timeDecimal < 16.5;
          statusText = isOpen ? 'Open Today · Closes 4:30pm' : (timeDecimal < 9.5 ? 'Opens 9:30am Today' : 'Closed · Opens 10am Sun');
        } else {
          isOpen = timeDecimal >= 10.0 && timeDecimal < 15.0;
          statusText = isOpen ? 'Open Today · Closes 3pm' : (timeDecimal < 10.0 ? 'Opens 10am Today' : 'Closed · Opens 9am Mon');
        }

        statusPills.forEach(pill => {
          const textSpan = pill.querySelector('span:not(.pulse-dot)');
          const dot = pill.querySelector('.pulse-dot');
          if (textSpan) textSpan.textContent = isOpen ? 'Open Today' : 'Closed Now';
          if (dot) {
            dot.style.background = isOpen ? '#10b981' : '#f59e0b';
            dot.style.boxShadow = isOpen ? '' : 'none';
          }
          pill.setAttribute('title', statusText);
        });
      } catch (err) {
        // Fallback default
      }
    }
    updateStoreStatus();
    setInterval(updateStoreStatus, 60000);
  }

  // 4. Dynamic Year
  const yearEls = document.querySelectorAll('[data-year]');
  const currentYear = new Date().getFullYear();
  yearEls.forEach(el => { el.textContent = currentYear; });
});
