
// year
const year = document.getElementById('year');
year.textContent = new Date().getFullYear();

const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const answer = document.getElementById('answer');

// gentle wiggle on No when hovered
noBtn.addEventListener('mouseenter', () => {
  noBtn.animate([
    { transform: 'translateY(0)' },
    { transform: 'translateY(-3px)' },
    { transform: 'translateY(0)' }
  ], { duration: 220, iterations: 1 });
});

// confetti on yes
yesBtn.addEventListener('click', () => {
  answer.classList.remove('hidden');
  burstConfetti();
});

// simple confetti
function burstConfetti(){
  const colors = ['#ff6ea3','#ffd166','#8ecbff','#caffbf','#bdb2ff'];
  const pieces = 120;
  for(let i=0;i<pieces;i++){
    const el = document.createElement('div');
    el.className = 'confetti';
    el.style.left = (Math.random()*100)+'vw';
    el.style.background = colors[i%colors.length];
    document.body.appendChild(el);
    const sway = (Math.random()*2-1) * 60;
    const rot = Math.random()*360;
    const start = performance.now();
    const dur = 2600 + Math.random()*1400;
    const step = (t)=>{
      const p = (t-start)/dur; if(p>=1){ el.remove(); return; }
      const y = p*100; const x = parseFloat(el.style.left) + Math.sin(p*8)*sway/10;
      el.style.top = `calc(${y}vh - 6px)`; el.style.left = x + 'vw';
      el.style.transform = `rotate(${rot + p*720}deg)`;
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
}

// floating sparkles background
const sparkWrap = document.getElementById('sparkles');
function makeSpark(){
  const s = document.createElement('div'); s.className = 'spark';
  const x = Math.random()*100; const y = 100 + Math.random()*20;
  s.style.left = x + 'vw'; s.style.top = y + 'vh';
  sparkWrap.appendChild(s);
  const dur = 5000 + Math.random()*4000; const start = performance.now();
  const step = (t)=>{ const p = (t-start)/dur; if(p>=1){ s.remove(); return; } s.style.top = (y - p*120) + 'vh'; s.style.opacity = (1-p).toString(); requestAnimationFrame(step); };
  requestAnimationFrame(step);
}
setInterval(makeSpark, 600); for(let i=0;i<8;i++) setTimeout(makeSpark, i*150);
