
// ===== Utility =====
const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
const rnd = (a,b) => Math.floor(a + Math.random()*(b-a+1));

// ===== Hearts background =====
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
    h.style.top = y + 'vh';
    h.style.left = x + 'vw';
    h.style.opacity = (1 - p*0.9).toString();
    requestAnimationFrame(animate);
  };
  heartsContainer.appendChild(h);
  requestAnimationFrame(animate);
};
setInterval(makeHeart, 420);
for (let i=0;i<18;i++) setTimeout(makeHeart, i*100);

// ===== Music control =====
const bgm = document.getElementById('bgm');
const musicToggle = document.getElementById('musicToggle');
function updateMusicIcon(){ musicToggle.textContent = bgm.paused ? '🔇' : '🔊'; }
musicToggle.addEventListener('click', async ()=>{
  if (bgm.paused){ bgm.muted=false; await bgm.play().catch(()=>{}); } else { bgm.pause(); }
  updateMusicIcon();
});
document.addEventListener('click', async ()=>{ if(bgm.muted){ bgm.muted=false; await bgm.play().catch(()=>{}); updateMusicIcon(); }}, {once:true});
updateMusicIcon();

// ===== Year =====
$('#year').textContent = new Date().getFullYear();

// ===== No button evasion & banter =====
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const answer = document.getElementById('answer');
const banter = document.getElementById('banter');
const unmuteHint = document.getElementById('unmuteHint');

const lines = [
  "Woah there, allergies to romance? 😜",
  "Think carefully… unlimited snacks may be included. 🍟",
  "The 'No' button is in witness protection. 🕵️‍♂️",
  "Plot twist: 'No' actually means 'Try again'.",
  "Fun fact: Saying yes boosts happiness by 117%."
];
let banterIdx = 0;

let evade = false;
noBtn.addEventListener('mouseenter', () => { evade = true; cycleBanter(); growYes(); });
noBtn.addEventListener('mouseleave', () => { evade = false; });
function cycleBanter(){ banter.textContent = lines[(banterIdx++) % lines.length]; toast(banter.textContent); }
function growYes(){
  const cur = parseFloat(getComputedStyle(yesBtn).getPropertyValue('--ys')) || 1;
  const next = Math.min(1.6, cur + 0.08);
  yesBtn.style.setProperty('--ys', next);
}

document.addEventListener('mousemove', (e) => {
  if (!evade) return;
  const rect = noBtn.getBoundingClientRect();
  const distX = e.clientX - (rect.left + rect.width/2);
  const distY = e.clientY - (rect.top + rect.height/2);
  const dist = Math.hypot(distX, distY);
  const threshold = 140;
  if (dist < threshold) {
    const angle = Math.atan2(distY, distX);
    const moveX = -Math.cos(angle) * 140;
    const moveY = -Math.sin(angle) * 140;
    let nx = rect.left + moveX;
    let ny = rect.top + moveY;
    nx = Math.min(window.innerWidth - rect.width - 8, Math.max(8, nx));
    ny = Math.min(window.innerHeight - rect.height - 8, Math.max(8, ny));
    noBtn.style.position = 'fixed';
    noBtn.style.left = nx + 'px';
    noBtn.style.top = ny + 'px';
  }
});

// ===== Puzzle (drag letters to spell B O N T L E) =====
const target = ['B','O','N','T','L','E'];
const tilesWrap = document.getElementById('tiles');
const slotsWrap = document.getElementById('slots');
const statusEl = document.getElementById('puzzleStatus');

function shuffle(arr){ return arr.map(v=>[Math.random(),v]).sort((a,b)=>a[0]-b[0]).map(x=>x[1]); }

function setupPuzzle(){
  // Create 6 target slots
  slotsWrap.innerHTML = '';
  for(let i=0;i<6;i++){
    const slot = document.createElement('div');
    slot.className = 'slot';
    slot.dataset.index = i;
    slot.setAttribute('role','listitem');
    slot.addEventListener('dragover', e=> e.preventDefault());
    slot.addEventListener('drop', onDrop);
    slotsWrap.appendChild(slot);
  }
  // Create tiles from shuffled letters
  tilesWrap.innerHTML = '';
  const letters = shuffle([...target]);
  for(const ch of letters){
    const t = document.createElement('div');
    t.className = 'tile'; t.textContent = ch; t.draggable = true; t.dataset.letter = ch;
    t.setAttribute('role','listitem');
    t.addEventListener('dragstart', onDragStart);
    tilesWrap.appendChild(t);
  }
}

let dragged = null;
function onDragStart(e){ dragged = e.target; }
function onDrop(e){
  e.preventDefault();
  const slot = e.currentTarget;
  if (slot.firstChild){ // already filled -> swap back to tiles
    tilesWrap.appendChild(slot.firstChild);
  }
  slot.appendChild(dragged);
  dragged = null;
  checkSolved();
}

function checkSolved(){
  const placed = $$('.slot').map(s=> s.firstChild ? s.firstChild.dataset.letter : '_');
  if (placed.join('') === target.join('')){
    statusEl.textContent = 'Unlocked! You spelled BONTLE perfectly! 💚';
    statusEl.style.color = getComputedStyle(document.documentElement).getPropertyValue('--good');
    unlockYes();
    confetti();
  } else {
    statusEl.textContent = 'Arrange the letters to unlock…';
    statusEl.style.color = '';
  }
}

function unlockYes(){
  yesBtn.disabled = false; yesBtn.classList.remove('locked');
  yesBtn.style.setProperty('--ys', 1.25);
}

setupPuzzle();

// ===== After YES =====
const surpriseBtn = document.getElementById('surpriseBtn');
const dateIdeaBtn = document.getElementById('dateIdeaBtn');
const idea = document.getElementById('idea');

const ideas = [
  'Sunset picnic + cheesy playlist. 🌅🧺',
  'Dessert crawl: doughnuts → gelato → churros. 🍩🍨',
  'Board games + hot chocolate night. ♟️☕',
  'Photo scavenger hunt around town. 📸',
  'DIY taco night + mocktails. 🌮🍹',
  'Stargazing + blanket + bad constellation names. ✨'
];

yesBtn.addEventListener('click', () => {
  answer.classList.remove('hidden');
  confetti();
  noBtn.style.opacity = '.15';
  unmuteHint.textContent = 'Tap 🔊 to toggle music';
});

function openSurprise(){
  const tpl = document.getElementById('surpriseTemplate');
  const node = tpl.content.cloneNode(true);
  const backdrop = node.querySelector('.modal-backdrop');
  const closeBtn = node.querySelector('.close');
  closeBtn.addEventListener('click', ()=> backdrop.remove());
  backdrop.addEventListener('click', (e)=>{ if(e.target===backdrop) backdrop.remove(); });
  document.body.appendChild(node);
}

if (surpriseBtn) surpriseBtn.addEventListener('click', openSurprise);
if (dateIdeaBtn) dateIdeaBtn.addEventListener('click', ()=>{
  idea.textContent = ideas[Math.floor(Math.random()*ideas.length)];
});

// ===== Toast helper =====
function toast(msg){
  const t = document.createElement('div');
  t.className = 'toast'; t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(()=>{ t.style.opacity='0'; t.style.transition='opacity .4s'; }, 1400);
  setTimeout(()=> t.remove(), 1900);
}

// ===== Confetti =====
function confetti(){
  const colors = ['#ff5d8f','#ffd166','#8ef6ff','#caffbf','#bdb2ff'];
  const pieces = 140;
  for (let i=0;i<pieces;i++){
    const el = document.createElement('div');
    el.style.position='fixed';
    el.style.top='-6px';
    el.style.left = (Math.random()*100)+'vw';
    el.style.width = '8px'; el.style.height = '12px';
    el.style.background = colors[i%colors.length];
    el.style.transform = 'rotate('+(Math.random()*360)+'deg)';
    el.style.borderRadius = '2px';
    el.style.zIndex = 4;
    document.body.appendChild(el);
    const sway = (Math.random()*2-1) * 60;
    const start = performance.now();
    const duration = 3000+Math.random()*2000;
    const anim = (t)=>{
      const p = (t-start)/ duration;
      if(p>=1){ el.remove(); return; }
      const y = p*100; // vh
      const x = parseFloat(el.style.left) + Math.sin(p*8)*sway/10;
      el.style.top = `calc(${y}vh - 6px)`;
      el.style.left = x + 'vw';
      requestAnimationFrame(anim);
    };
    requestAnimationFrame(anim);
  }
}
