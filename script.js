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

/* --- Theme: dark only --- */

/* --- Nav scroll --- */
(function(){
  const nav = document.getElementById('nav');
  let ticking = false;
  window.addEventListener('scroll',()=>{
    if(!ticking){
      requestAnimationFrame(()=>{
        nav.classList.toggle('scrolled', scrollY > 60);
        ticking = false;
      });
      ticking = true;
    }
  },{passive:true});
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

/* --- Ticker: JS-driven seamless infinite scroll --- */
(function(){
  const track = document.getElementById('tickerTrack');
  if(!track) return;

  // Clone content enough times to fill screen + overflow
  const originalHTML = track.innerHTML;
  // Add 3 more copies for guaranteed coverage
  track.innerHTML = originalHTML + originalHTML + originalHTML + originalHTML;

  let pos = 0;
  // Measure the width of one set
  const children = track.children;
  const itemsPerSet = originalHTML.split('ticker__item').length - 1 + 
                      originalHTML.split('ticker__sep').length - 1;
  
  // Calculate single set width after render
  let singleSetWidth = 0;
  requestAnimationFrame(() => {
    // Measure first set width: count original items
    const totalChildren = children.length;
    const oneSetCount = totalChildren / 4;
    let w = 0;
    for(let i = 0; i < oneSetCount; i++){
      w += children[i].offsetWidth;
    }
    // Add gaps (36px gap from CSS)
    w += (oneSetCount - 1) * 36;
    // Add one more gap for spacing between sets
    w += 36;
    singleSetWidth = w;

    // Start animation
    const speed = 0.5; // pixels per frame
    function animate(){
      pos -= speed;
      if(Math.abs(pos) >= singleSetWidth){
        pos += singleSetWidth;
      }
      track.style.transform = `translateX(${pos}px)`;
      requestAnimationFrame(animate);
    }
    animate();
  });
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
