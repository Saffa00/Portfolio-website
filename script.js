// Small UI helpers for the portfolio
document.addEventListener('DOMContentLoaded',()=>{
  // set current year
  const y = document.getElementById('year');
  if(y) y.textContent = new Date().getFullYear();

  // Theme toggle: persist preference in localStorage
  const themeToggle = document.getElementById('theme-toggle');
  const preferred = localStorage.getItem('theme');
  const applyTheme = (theme) => {
    if(theme === 'light'){
      document.body.classList.add('light');
      if(themeToggle) themeToggle.textContent = '🌞';
      localStorage.setItem('theme','White');
    } else {
      document.body.classList.remove('light');
      if(themeToggle) themeToggle.textContent = '🌙';
      localStorage.setItem('theme','Black');
    }
  }
  if(preferred) applyTheme(preferred);
  else {
    // default: system preference
    const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    applyTheme(prefersLight ? 'light' : 'dark');
  }
  if(themeToggle){
    themeToggle.addEventListener('click', ()=>{
      const isLight = document.body.classList.contains('light');
      applyTheme(isLight ? 'dark' : 'light');
    });
  }

  // Mobile nav toggle
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('primary-navigation');
  if(navToggle && nav){
    const MOBILE_BREAK = 760;

    // Toggle handler (keeps aria attributes in sync)
    navToggle.addEventListener('click', ()=>{
      const isHidden = nav.getAttribute('aria-hidden') === 'true';
      // when hidden -> show (aria-hidden=false), set expanded true
      nav.setAttribute('aria-hidden', String(!isHidden));
      navToggle.setAttribute('aria-expanded', String(isHidden));
    });

    // Ensure there's a sensible initial state for mobile vs desktop
    const setNavStateForWidth = (width)=>{
      if(width <= MOBILE_BREAK){
        // On small screens start hidden unless explicitly opened
        if(!nav.hasAttribute('aria-hidden')) nav.setAttribute('aria-hidden','true');
        if(!navToggle.hasAttribute('aria-expanded')) navToggle.setAttribute('aria-expanded','false');
      } else {
        // On larger screens remove the aria-hidden attribute so CSS shows nav normally
        nav.removeAttribute('aria-hidden');
        navToggle.setAttribute('aria-expanded','false');
      }
    }

    // Initialize and keep in sync when resizing (debounced)
    setNavStateForWidth(window.innerWidth);
    let resizeTimer = null;
    window.addEventListener('resize', ()=>{
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(()=> setNavStateForWidth(window.innerWidth), 120);
    });
  }

  // Smooth scrolling for internal links
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', e=>{
      const href = a.getAttribute('href');
      if(href.length>1){
        const target = document.querySelector(href);
        if(target){
          e.preventDefault();
          target.scrollIntoView({behavior:'smooth',block:'start'});
          // close nav on mobile after click
          if(nav && window.innerWidth <= 760){
            nav.setAttribute('aria-hidden','true');
            navToggle.setAttribute('aria-expanded','false');
          }
        }
      }
    });
  });

  // simple contact form handler - prevents actual submit and shows an alert
  const form = document.getElementById('contact-form');
  if(form){
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const name = form.name.value || 'Friend';
      // Here you'd connect to an API or use Formspree / Netlify forms.
      alert(`Thanks ${name}! Your message was received (demo).`);
      form.reset();
    });
  }

  // Reveal on scroll using IntersectionObserver
  const reveals = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window && reveals.length){
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add('revealed');
          io.unobserve(entry.target);
        }
      });
    },{threshold:0.12});
    reveals.forEach(r=>io.observe(r));
  } else {
    // fallback: reveal all
    reveals.forEach(r=>r.classList.add('revealed'));
  }
});
