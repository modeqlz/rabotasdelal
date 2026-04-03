/* ==========================================================
   #HUSTLE HUB — Script v2
   ========================================================== */

/* --- Lenis smooth scroll --- */
(function(){
  if(typeof Lenis !== 'undefined'){
    const lenis = new Lenis({
      duration:1.0,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel:true,
    });
    function raf(time){
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }
})();


/* --- Theme toggle (green ↔ orange) --- */
(function(){
  const btn = document.getElementById('themeToggle');
  if(!btn) return;
  const root = document.documentElement;
  const saved = localStorage.getItem('accent');
  if(saved === 'orange') root.setAttribute('data-accent', 'orange');

  btn.addEventListener('click', ()=>{
    const isOrange = root.getAttribute('data-accent') === 'orange';
    if(isOrange){
      root.removeAttribute('data-accent');
      localStorage.setItem('accent', 'green');
    } else {
      root.setAttribute('data-accent', 'orange');
      localStorage.setItem('accent', 'orange');
    }
  });
})();

/* --- Custom cursor --- */
(function(){
  const cursor = document.getElementById('cursor');
  if(!cursor || 'ontouchstart' in window || window.matchMedia('(pointer:coarse)').matches) return;

  let mx = -100, my = -100;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.opacity = '1';
  });

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
  });

  const interactives = document.querySelectorAll('a, button, .card, .accordion__trigger');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('active'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
  });

  // Direct positioning — no lerp, no lag
  function tick(){
    cursor.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;
    requestAnimationFrame(tick);
  }
  // Reset initial transform approach
  cursor.style.transform = 'translate(-100px,-100px)';
  cursor.style.left = '0';
  cursor.style.top = '0';
  requestAnimationFrame(tick);
})();




/* --- Scroll reveal --- */
(function(){
  const els = document.querySelectorAll('[data-reveal]');
  if(!els.length) return;

  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting) return;
      const parent = entry.target.parentElement;
      const siblings = [...parent.querySelectorAll('[data-reveal]')];
      const idx = siblings.indexOf(entry.target);
      setTimeout(()=> entry.target.classList.add('visible'), idx * 80);
      io.unobserve(entry.target);
    });
  },{threshold:.1, rootMargin:'0px 0px -40px 0px'});

  els.forEach(el => io.observe(el));
})();

/* --- Accordion --- */
(function(){
  const items = document.querySelectorAll('.accordion__item');
  items.forEach(item=>{
    const btn = item.querySelector('.accordion__trigger');
    btn.addEventListener('click',()=>{
      const isOpen = item.classList.contains('open');
      items.forEach(i=>{
        i.classList.remove('open');
        i.querySelector('.accordion__trigger').setAttribute('aria-expanded','false');
      });
      if(!isOpen){
        item.classList.add('open');
        btn.setAttribute('aria-expanded','true');
      }
    });
  });
})();
