const PALETTES = [
  ['#5b5fef','#ff6b4a'],['#0ea5a3','#5b5fef'],['#ff6b4a','#ffb020'],
  ['#7c3aed','#ec4899'],['#0891b2','#22c55e'],['#f43f5e','#f59e0b'],
  ['#2563eb','#06b6d4'],['#a855f7','#3b82f6']
];

let VIDEOS = [
  { title:'រឿង គុជរបស់ពៀនហឺ',      duration:'1.55',  colors: PALETTES[0], banner:'peanher.png', src:'peanher.mp4' },
  { title:'Home coffee setup',       duration:'4:03',  colors: PALETTES[1], banner:'', src:'' },
  { title:'Synthesizer jam session', duration:'12:47', colors: PALETTES[2], banner:'', src:'' },

].map((v,i)=>({ id:'v'+i, pal:v.colors, title:v.title, duration:v.duration, views:v.views, ago:v.ago, banner:v.banner||'', src:v.src||'' }));

const grid = document.getElementById('grid');
function cardHTML(v){
  const bg = v.banner
    ? `background-image:url('${v.banner}');background-size:cover;background-position:center;`
    : `background:linear-gradient(135deg,${v.pal[0]},${v.pal[1]});`;
  return `<div class="card" data-id="${v.id}">
    <div class="thumb" style="${bg}">
      <div class="play"><svg viewBox="0 0 24 24" fill="#14161f"><path d="M8 5v14l11-7z"/></svg></div>
      <span class="dur">${v.duration}</span>
    </div>
    <div class="meta">
      <div class="info">
        <p class="title">${v.title}</p>
        <p class="sub">${v.views} · ${v.ago}</p>
      </div>
    </div>
  </div>`;
}
function renderGrid(){
  grid.innerHTML = VIDEOS.map(cardHTML).join('');
}
renderGrid();

const status = document.getElementById('status');
status.textContent = `${VIDEOS.length} videos`;

// refresh button — new "model", reshuffled feed
const refreshBtn = document.getElementById('refreshBtn');
refreshBtn.addEventListener('click', ()=>{
  refreshBtn.classList.add('spin');
  status.textContent = 'Refreshing feed…';
  setTimeout(()=>{
    for(let i=VIDEOS.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [VIDEOS[i],VIDEOS[j]] = [VIDEOS[j],VIDEOS[i]];
    }
    renderGrid();
    refreshBtn.classList.remove('spin');
    status.textContent = `${VIDEOS.length} videos · updated just now`;
    window.scrollTo({top:0,behavior:'smooth'});
  }, 550);
});

// navigation
const homeView = document.getElementById('homeView');
const watchView = document.getElementById('watchView');
const playerBox = document.getElementById('playerBox');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const realVideo = document.getElementById('realVideo');
const controls = document.getElementById('controls');
const seek = document.getElementById('seek');
const seekFill = document.getElementById('seekFill');
const seekKnob = document.getElementById('seekKnob');
const timeLabel = document.getElementById('timeLabel');
const volWrap = document.getElementById('volWrap');
const volSlider = document.getElementById('volSlider');

let currentVideo = null;
let playing = true;
let rafId = null;
let lastFrameT = null;
let elapsed = 0;      // seconds, used for the fake/canvas placeholder mode
let totalDur = 60;    // seconds, parsed from the "duration" field
let hideTimer = null;

function parseDuration(str){
  const parts = String(str).split(':').map(Number);
  if(parts.length===2) return parts[0]*60+parts[1];
  if(parts.length===3) return parts[0]*3600+parts[1]*60+parts[2];
  return 60;
}
function fmtTime(s){
  s = Math.max(0, Math.floor(s));
  const m = Math.floor(s/60), sec = s%60;
  const h = Math.floor(m/60);
  if(h>0) return `${h}:${String(m%60).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
  return `${m}:${String(sec).padStart(2,'0')}`;
}
function isReal(){ return !!(currentVideo && currentVideo.src); }
function getCurrent(){ return isReal() ? realVideo.currentTime : elapsed; }
function getTotal(){ return isReal() ? (realVideo.duration || totalDur) : totalDur; }

function updateSeekUI(){
  const total = getTotal() || 1;
  const pct = Math.min(100, (getCurrent()/total)*100);
  seekFill.style.width = pct+'%';
  seekKnob.style.left = pct+'%';
  timeLabel.textContent = `${fmtTime(getCurrent())} / ${fmtTime(total)}`;
}

function sizeCanvas(){ canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
function drawFrame(t){
  const w = canvas.width, h = canvas.height;
  const [c1,c2] = currentVideo.pal;
  const g = ctx.createLinearGradient(0,0,w,h);
  g.addColorStop(0,c1); g.addColorStop(1,c2);
  ctx.fillStyle = g; ctx.fillRect(0,0,w,h);
  ctx.globalAlpha = .18;
  for(let i=0;i<4;i++){
    ctx.beginPath();
    const cx = w*(0.2+0.6*((Math.sin(t/1500+i)+1)/2));
    const cy = h*(0.2+0.6*((Math.cos(t/1700+i*1.3)+1)/2));
    ctx.arc(cx,cy, h*0.28, 0, Math.PI*2);
    ctx.fillStyle = '#fff';
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}
function loop(t){
  if(lastFrameT===null) lastFrameT=t;
  const dt = (t-lastFrameT)/1000;
  lastFrameT = t;
  drawFrame(t);
  elapsed = Math.min(totalDur, elapsed+dt);
  updateSeekUI();
  if(elapsed>=totalDur){
    playing=false; setPlayIcons(); showControls();
    return; // fully stop — no more frames scheduled
  }
  rafId = requestAnimationFrame(loop);
}

function setPlayIcons(){
  const playSvg = '<svg viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z"/></svg>';
  const pauseSvg = '<svg viewBox="0 0 24 24" fill="#fff"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>';
  document.getElementById('ctrlPlayIcon').outerHTML = playing
    ? pauseSvg.replace('<svg','<svg id="ctrlPlayIcon"')
    : playSvg.replace('<svg','<svg id="ctrlPlayIcon"');
  const c = document.getElementById('playCircle');
  c.style.opacity = playing ? '0' : '1';
  c.innerHTML = playing
    ? '<svg viewBox="0 0 24 24" fill="#14161f"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>'
    : '<svg viewBox="0 0 24 24" fill="#14161f"><path d="M8 5v14l11-7z"/></svg>';
}

function togglePlay(){
  playing = !playing;
  if(isReal()){
    if(playing) realVideo.play().catch(()=>{}); else realVideo.pause();
  } else {
    if(playing){
      lastFrameT = null;                 // avoid a big time-jump on resume
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(loop);
    } else {
      cancelAnimationFrame(rafId);        // fully stop, freezes the frame in place
    }
  }
  setPlayIcons();
  showControls();
}

function showControls(){
  controls.classList.remove('hide');
  clearTimeout(hideTimer);
  if(playing) hideTimer = setTimeout(()=>controls.classList.add('hide'), 2600);
}

function openVideo(id){
  currentVideo = VIDEOS.find(v=>v.id===id);
  if(!currentVideo) return;
  document.getElementById('wTitle').textContent = currentVideo.title;
  document.getElementById('wSub').textContent = `${currentVideo.views} · ${currentVideo.ago}`;
  document.getElementById('wDesc').textContent = `A short look at "${currentVideo.title.toLowerCase()}". Thanks for watching.`;
  homeView.style.display='none';
  watchView.style.display='block';
  elapsed = 0; lastFrameT = null;
  totalDur = parseDuration(currentVideo.duration);
  playing = true;
  setPlayIcons();
  showControls();
  window.scrollTo(0,0);
      cancelAnimationFrame(rafId);
  if(currentVideo.src){
    canvas.style.display='none';
    realVideo.style.display='block';
    realVideo.src = currentVideo.src;
    realVideo.currentTime = 0;
    realVideo.volume = volSlider.value;
    realVideo.play().catch(()=>{});
    updateSeekUI();
  } else {
    realVideo.pause();
    realVideo.removeAttribute('src');
    realVideo.style.display='none';
    canvas.style.display='block';
    requestAnimationFrame(()=>{ sizeCanvas(); rafId = requestAnimationFrame(loop); });
  }
}
function closeVideo(){
  cancelAnimationFrame(rafId);
  realVideo.pause();
  watchView.style.display='none';
  homeView.style.display='block';
}
grid.addEventListener('click', e=>{
  const card = e.target.closest('.card');
  if(card) openVideo(card.dataset.id);
});
document.getElementById('backBtn').addEventListener('click', closeVideo);

// center tap / big play-pause button
document.getElementById('playToggle').addEventListener('click', togglePlay);
document.getElementById('ctrlPlay').addEventListener('click', togglePlay);

// keep controls visible while paused, auto-fade while playing, tap-to-toggle
playerBox.addEventListener('click', e=>{
  if(e.target.closest('.controls')) return;
  if(controls.classList.contains('hide')) showControls();
});
realVideo.addEventListener('timeupdate', ()=>{ if(isReal()) updateSeekUI(); });
realVideo.addEventListener('loadedmetadata', updateSeekUI);
realVideo.addEventListener('ended', ()=>{ playing=false; setPlayIcons(); showControls(); });

// seek bar — click and drag
function seekToClientX(clientX){
  const rect = seek.getBoundingClientRect();
  const frac = Math.min(1, Math.max(0, (clientX-rect.left)/rect.width));
  const total = getTotal();
  if(isReal()) realVideo.currentTime = frac*total;
  else elapsed = frac*total;
  updateSeekUI();
}
let dragging = false;
seek.addEventListener('pointerdown', e=>{ dragging=true; seek.setPointerCapture(e.pointerId); seekToClientX(e.clientX); showControls(); });
seek.addEventListener('pointermove', e=>{ if(dragging) seekToClientX(e.clientX); });
seek.addEventListener('pointerup', e=>{ dragging=false; });
seek.addEventListener('pointercancel', ()=>{ dragging=false; });

// volume
document.getElementById('muteBtn').addEventListener('click', ()=>{
  volWrap.classList.toggle('open');
});
volSlider.addEventListener('input', ()=>{
  realVideo.volume = volSlider.value;
  realVideo.muted = Number(volSlider.value)===0;
  const icon = document.getElementById('volIcon');
  icon.style.opacity = Number(volSlider.value)===0 ? '.5' : '1';
});

// fullscreen
document.getElementById('fullscreenBtn').addEventListener('click', ()=>{
  if(document.fullscreenElement){ document.exitFullscreen(); }
  else if(playerBox.requestFullscreen){ playerBox.requestFullscreen(); }
});

window.addEventListener('resize', ()=>{ if(watchView.style.display==='block' && !isReal()) sizeCanvas(); });

