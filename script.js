
// ===== Helpers =====
const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

// ===== Background hearts =====
const heartsContainer = document.getElementById('hearts');
const makeHeart = () => {
  const h = document.createElement('div');
  h.className = 'heart';
  const size = 12 + Math.random()*16;
  h.style.width = h.style.height = size + 'px';
  h.style.left = Math.random()*100 + 'vw';
  h.style.top = '100vh';
  const dur = 6 + Math.random()*6;
  const drift = (Math.random()*2-1) * 40;
  const start = performance.now();
  const animate = (t) => {
    const p = (t - start) / (dur*1000);
    if (p >= 1) { heartsContainer.removeChild(h); return; }
    const y = 100 - p*110;
    const x = parseFloat(h.style.left) + Math.sin(p*6.28)*drift/10;
    h.style.top = y + 'vh'; h.style.left = x + 'vw'; h.style.opacity = (1 - p*0.9).toString();
    requestAnimationFrame(animate);
  };
  heartsContainer.appendChild(h);
  requestAnimationFrame(animate);
};
setInterval(makeHeart, 420); for (let i=0;i<18;i++) setTimeout(makeHeart, i*100);

// ===== Year =====
$('#year').textContent = new Date().getFullYear();

// ===== Buttons & banter =====
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const answer = document.getElementById('answer');
const banter = document.getElementById('banter');

const lines = [
  "Woah there, allergies to romance? 😜",
  "Think carefully… unlimited snacks may be included. 🍟",
  "The 'No' button is in witness protection. 🕵️‍♂️",
  "Plot twist: 'No' actually means 'Try again'.",
  "Fun fact: Saying yes boosts happiness by 117%."
];
let banterIdx = 0;

// Make YES feel extra inviting
function growYes(){
  const cur = parseFloat(getComputedStyle(yesBtn).getPropertyValue('--ys')) || 1;
  const next = Math.min(1.8, cur + 0.08);
  yesBtn.style.setProperty('--ys', next);
}

// Evasive NO: moves when hovered OR when click is attempted
let evade = false;
noBtn.addEventListener('mouseenter', () => { evade = true; cycleBanter(); growYes(); });
noBtn.addEventListener('mouseleave', () => { evade = false; });
noBtn.addEventListener('mousedown', (e) => { // tries to click -> we dash away first
  e.preventDefault();
  cycleBanter();
  dashAway();
  growYes();
});

document.addEventListener('mousemove', (e) => {
  if (!evade) return;
  const rect = noBtn.getBoundingClientRect();
  const distX = e.clientX - (rect.left + rect.width/2);
  const distY = e.clientY - (rect.top + rect.height/2);
  const dist = Math.hypot(distX, distY);
  const threshold = 140;
  if (dist < threshold) dashAway();
});

function cycleBanter(){ banter.textContent = lines[(banterIdx++) % lines.length]; toast(banter.textContent); }
function dashAway(){
  const rect = noBtn.getBoundingClientRect();
  const nx = Math.min(window.innerWidth - rect.width - 12, Math.max(12, rect.left + (Math.random()*2-1)*220));
  const ny = Math.min(window.innerHeight - rect.height - 12, Math.max(12, rect.top + (Math.random()*2-1)*180));
  noBtn.style.position = 'fixed';
  noBtn.style.left = nx + 'px';
  noBtn.style.top = ny + 'px';
}

// ===== After YES =====
const surpriseBtn = document.getElementById('surpriseBtn');
const dateIdeaBtn = document.getElementById('dateIdeaBtn');
const idea = document.getElementById('idea');
const letterBtn = document.getElementById('letterBtn');
const letterText = document.getElementById('letterText');
const loveLetter = document.getElementById('loveLetter');
const typeReplay = document.getElementById('typeReplay');

const ideas = [
  'Sunset picnic + cheesy playlist. 🌅🧺',
  'Dessert crawl: doughnuts → gelato → churros. 🍩🍨',
  'Board games + hot chocolate night. ♟️☕',
  'Photo scavenger hunt around town. 📸',
  'DIY taco night + mocktails. 🌮🍹',
  'Stargazing + blanket + bad constellation names. ✨'
];

const letterContent = `Dear Bontle,\n\nI like your laugh, your kind heart, and how you brighten rooms without even trying.\nI’m excited for our adventures — the tiny ones and the big ones — and for all the jokes we haven’t invented yet.\n\nThanks for being you.\n\nYours,\nEvidence 💙`;

let typing = null;
function typewriter(text, el, speed=26){
  el.textContent = ''; let i = 0; if (typing) clearInterval(typing);
  typing = setInterval(()=>{ el.textContent += text[i++] || ''; if (i>text.length){ clearInterval(typing); typing=null; } }, speed);
}

yesBtn.addEventListener('click', () => {
  answer.classList.remove('hidden');
  launchCelebration();
  // Calm the NO now
  noBtn.style.opacity = '.15';
});
if (surpriseBtn) surpriseBtn.addEventListener('click', openSurprise);
if (dateIdeaBtn) dateIdeaBtn.addEventListener('click', ()=>{ idea.textContent = ideas[Math.floor(Math.random()*ideas.length)]; });
if (letterBtn) letterBtn.addEventListener('click', ()=>{ loveLetter.classList.remove('hidden'); typewriter(letterContent, letterText); });
if (typeReplay) typeReplay.addEventListener('click', ()=> typewriter(letterContent, letterText));

function openSurprise(){ const tpl = document.getElementById('surpriseTemplate'); const node = tpl.content.cloneNode(true); const backdrop = node.querySelector('.modal-backdrop'); const closeBtn = node.querySelector('.close'); closeBtn.addEventListener('click', ()=> backdrop.remove()); backdrop.addEventListener('click', (e)=>{ if(e.target===backdrop) backdrop.remove(); }); document.body.appendChild(node); }

// ===== Toast helper =====
function toast(msg){ const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg; document.body.appendChild(t); setTimeout(()=>{ t.style.opacity='0'; t.style.transition='opacity .4s'; }, 1400); setTimeout(()=> t.remove(), 1900); }

// ===== Fireworks + Balloons celebration =====
const fwCanvas = document.getElementById('fireworksCanvas');
const fwCtx = fwCanvas.getContext('2d');
const balloonsLayer = document.getElementById('balloonsLayer');
function resizeCanvas(){ fwCanvas.width = window.innerWidth; fwCanvas.height = window.innerHeight; }
window.addEventListener('resize', resizeCanvas); resizeCanvas();

function launchCelebration(){
  // Confetti style fireworks + balloons
  launchFireworks(1400);
  launchBalloons(18);
}

// Simple fireworks particles
function launchFireworks(ms=1200){
  const bursts = 8; const start = performance.now(); const particles = [];
  for(let b=0;b<bursts;b++){
    const cx = Math.random()*fwCanvas.width; const cy = Math.random()*fwCanvas.height*0.5 + 40;
    const color = `hsl(${Math.floor(Math.random()*360)}, 90%, 60%)`;
    for(let i=0;i<40;i++){
      const ang = Math.random()*Math.PI*2; const sp = Math.random()*3+1.5;
      particles.push({x:cx,y:cy,vx:Math.cos(ang)*sp, vy:Math.sin(ang)*sp, life:1, color});
    }
  }
  function step(t){
    const p = (t-start)/ms; fwCtx.clearRect(0,0,fwCanvas.width, fwCanvas.height);
    particles.forEach(pt=>{ pt.x += pt.vx; pt.y += pt.vy; pt.vy += 0.02; pt.life -= 0.008; });
    particles.forEach(pt=>{ fwCtx.globalAlpha = Math.max(0, pt.life); fwCtx.fillStyle = pt.color; fwCtx.fillRect(pt.x, pt.y, 2, 2); });
    if (p<1){ requestAnimationFrame(step); } else { fwCtx.clearRect(0,0,fwCanvas.width, fwCanvas.height); }
  }
  requestAnimationFrame(step);
}

function launchBalloons(count=18){
  for(let i=0;i<count;i++){
    const b = document.createElement('div'); b.className = 'balloon'; b.textContent = '🎈';
    b.style.left = Math.random()*100 + 'vw'; b.style.bottom = '-80px';
    const scale = 0.8 + Math.random()*0.8; b.style.transform = `scale(${scale})`;
    balloonsLayer.appendChild(b);
    const dur = 6000 + Math.random()*4000; const sway = (Math.random()*2-1)*60; const start = performance.now();
    const anim = (t)=>{ const p = (t-start)/dur; if(p>=1){ b.remove(); return; } const y = p*(window.innerHeight+160)-80; const x = parseFloat(b.style.left); b.style.bottom = y + 'px'; b.style.left = `calc(${x} - ${Math.sin(p*6)*sway}px)`; requestAnimationFrame(anim); };
    requestAnimationFrame(anim);
  }
}
