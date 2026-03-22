
// ── ADMISSION NUMBER VALIDATION ──
// Valid formats:
//   B11/GLUK/S53K/2022  →  /^B\d+\/[A-Z]+\/[A-Z0-9]+\/\d{4}$/
//   B11/SO6/K/2021      →  /^B\d+\/[A-Z0-9]+\/[A-Z0-9]+\/\d{4}$/
// Both collapse to: starts with B + digits, then 3 slash-separated segments, ends with 4-digit year
const ADMIN_BYPASS_CODE = 'ADMIN72';
const ADMISSION_REGEX   = /^B\d+\/[A-Z0-9]+\/[A-Z0-9]+\/\d{4}$/;

function isValidAdmission(reg){
  if(!reg) return false;
  return ADMISSION_REGEX.test(reg.trim().toUpperCase());
}
function isAdminBypass(reg){
  return reg.trim() === ADMIN_BYPASS_CODE;
}


// ══════════════════════════════════════════════════════
//  SCREEN ROUTER — only one screen visible at a time
// ══════════════════════════════════════════════════════
var SCREENS = {
  welcome: '#welcome-screen',
  loader:  '#loader-screen',
  home:    '#home-page',
  survey:  '#secsWrap',        // main survey content
  admin:   '#admin-overlay',
  gate:    '#admin-gate',
  report:  '#report-overlay',
  lock:    '#admin-survey-lock',
};

function showScreen(name){
  // Hide everything first
  Object.keys(SCREENS).forEach(function(k){
    var el = document.querySelector(SCREENS[k]);
    if(!el) return;
    el.style.display = 'none';
    el.style.opacity = '1';
  });
  // Show the requested screen
  var target = document.querySelector(SCREENS[name]);
  if(!target) return;
  var displayType = 'block';
  if(name==='home')   displayType='flex';
  if(name==='loader') displayType='flex';
  target.style.display = displayType;
  // Survey needs topbar and botnav too
  if(name==='survey'){
    var topbar=document.querySelector('.topbar');
    var botnav=document.querySelector('.bot-nav');
    if(topbar){topbar.style.display='flex';topbar.style.visibility='';}
    if(botnav){botnav.style.display='flex';botnav.style.visibility='';}
    target.style.display='block';
  }
  // Admin/gate/lock hide the survey topbar/botnav
  if(name==='admin'||name==='gate'||name==='lock'||name==='home'){
    var topbar=document.querySelector('.topbar');
    var botnav=document.querySelector('.bot-nav');
    if(topbar) topbar.style.display='none';
    if(botnav) botnav.style.display='none';
  }
}

function _currentScreen(){
  var found = null;
  Object.keys(SCREENS).forEach(function(k){
    var el = document.querySelector(SCREENS[k]);
    if(el && el.style.display!=='none' && el.style.display!=='') found=k;
  });
  return found;
}


/* Community Health Survey — Auth + Home Page © 2026 HazzinBR */
//  WELCOME SCREEN LOGIC
// ══════════════════════════════════════════════════════
// ══════════════════════════════════════════════════════
//  USER PROFILE — persistent name
// ══════════════════════════════════════════════════════
function getUserName(){ return localStorage.getItem('chsa_user_name')||''; }

function forgetUser(){
  showChangeNameOverlay();
}

function showChangeNameOverlay(){
  const old = document.getElementById('change-name-overlay');
  if(old) old.remove();
  const overlay = document.createElement('div');
  overlay.id = 'change-name-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:500;background:rgba(0,0,0,.55);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;padding:20px;';
  const currentName = getUserName() || '';
  const session = authGetSession();
  const isAuthSession = !!(session && session.reg_number);
  overlay.innerHTML = isAuthSession ? `
    <div style="background:#fff;border-radius:20px;padding:28px 22px;max-width:340px;width:100%;box-shadow:0 12px 50px rgba(0,0,0,.25);text-align:center;">
      <div style="font-size:36px;margin-bottom:10px">&#128100;</div>
      <div style="font-weight:800;font-size:1rem;color:var(--text);margin-bottom:6px">Change Interviewer</div>
      <div style="font-size:0.8rem;color:var(--muted);line-height:1.5;margin-bottom:20px">
        You are signed in as <strong>${session.full_name||currentName}</strong>.<br>
        To switch accounts, sign out and sign in with a different ID.
      </div>
      <button onclick="authSignOut()" style="width:100%;padding:13px;background:linear-gradient(135deg,var(--red),#c0392b);color:#fff;border:none;border-radius:12px;font-family:inherit;font-size:0.9rem;font-weight:700;cursor:pointer;margin-bottom:10px;">
        &#128682; Sign Out &amp; Switch Account
      </button>
      <button onclick="document.getElementById('change-name-overlay').remove()" style="width:100%;padding:11px;background:var(--cream);color:var(--muted);border:1.5px solid var(--border);border-radius:12px;font-family:inherit;font-size:0.88rem;font-weight:600;cursor:pointer;">
        Cancel
      </button>
    </div>
  ` : `
    <div style="background:#fff;border-radius:20px;padding:28px 22px;max-width:340px;width:100%;box-shadow:0 12px 50px rgba(0,0,0,.25);">
      <div style="font-size:36px;text-align:center;margin-bottom:10px">&#9999;</div>
      <div style="font-weight:800;font-size:1rem;color:var(--text);margin-bottom:4px;text-align:center">Change Your Name</div>
      <div style="font-size:0.78rem;color:var(--muted);margin-bottom:18px;text-align:center">Updates your interviewer name on all new records.</div>
      <input id="change-name-input" type="text" value="${currentName}"
        style="width:100%;padding:13px 15px;border:1.5px solid var(--border);border-radius:12px;font-family:inherit;font-size:0.95rem;color:var(--text);outline:none;margin-bottom:14px;"
        onfocus="this.style.borderColor='var(--green-light)'"
        onblur="this.style.borderColor='var(--border)'"
        onkeydown="if(event.key==='Enter')saveChangedName()">
      <button onclick="saveChangedName()" style="width:100%;padding:13px;background:linear-gradient(135deg,var(--green),#1a4060);color:#fff;border:none;border-radius:12px;font-family:inherit;font-size:0.92rem;font-weight:700;cursor:pointer;margin-bottom:10px;">
        &#10003; Save Name
      </button>
      <button onclick="document.getElementById('change-name-overlay').remove()" style="width:100%;padding:11px;background:var(--cream);color:var(--muted);border:1.5px solid var(--border);border-radius:12px;font-family:inherit;font-size:0.88rem;font-weight:600;cursor:pointer;">
        Cancel
      </button>
    </div>
  `;
  document.body.appendChild(overlay);
  setTimeout(()=>{ const inp=document.getElementById('change-name-input'); if(inp){inp.focus();inp.select();} }, 80);
}

function saveChangedName(){
  const inp = document.getElementById('change-name-input');
  if(!inp) return;
  const raw = inp.value.trim();
  if(!raw){ inp.style.borderColor='var(--red)'; return; }
  const niceName = raw.charAt(0).toUpperCase() + raw.slice(1);
  localStorage.setItem('chsa_user_name', niceName);
  fillInterviewerFields(niceName);
  if(recId && recs[recId]){ recs[recId].interviewer_name = niceName; ss(); }
  document.getElementById('change-name-overlay').remove();
  showToast('Name updated to ' + niceName);
}

function authSignOut(){
  if(!confirm('Sign out and return to the login screen?\n\nLocal records are kept safely.')) return;
  authClearSession();
  localStorage.removeItem('chsa_user_name');
  localStorage.removeItem('chsa_is_admin_bypass');
  const ov = document.getElementById('change-name-overlay');
  if(ov) ov.remove();
  location.reload();
}

function saveUserName(){
  const inp = document.getElementById('wc-name-input');
  if(!inp || !inp.value.trim()){
    inp && (inp.style.borderColor='rgba(255,100,100,.7)');
    return;
  }
  const name = inp.value.trim();
  // Capitalise first letter
  const niceName = name.charAt(0).toUpperCase() + name.slice(1);
  localStorage.setItem('chsa_user_name', niceName);
  // Fill hidden fields on consent form
  fillInterviewerFields(niceName);
  showToast('Welcome, ' + niceName + '! 👋');
  const setup = document.getElementById('wc-name-setup');
  if(setup) setup.style.display='none';
  applyWelcome();
  const btn = document.getElementById('wc-enter');
  if(btn) btn.style.display='flex';
  setTimeout(enterApp, 1100);
}

function fillInterviewerFields(name){
  // Fill the hidden fields on the consent page
  const hn = document.getElementById('h_interviewer_name');
  if(hn) hn.value = name;
  // Also fill the card display
  const card = document.getElementById('consent_interviewer_card');
  if(card) card.textContent = name;
  const disp = document.getElementById('consent_name_display');
  if(disp) disp.textContent = name;
}

function applyWelcome(){
  const h = new Date().getHours();
  let g = h < 12 ? 'Good Morning' : h < 17 ? 'Good Afternoon' : 'Good Evening';
  const name = getUserName();
  const greetEl = document.getElementById('wc-greeting');
  const titleEl = document.getElementById('wc-name-title');
  const subEl   = document.getElementById('wc-subtitle');

  if(name){
    if(greetEl) greetEl.textContent = g + ', ' + name + ' 👋';
    if(titleEl) titleEl.innerHTML = 'Welcome back!';
    if(subEl)   subEl.innerHTML = 'Great Lakes University · Nyamache<br><span style="opacity:.7;font-size:0.75rem">Community Health Situation Analysis</span>';
    setTimeout(()=> fillInterviewerFields(name), 400);
  } else {
    if(greetEl) greetEl.textContent = g;
    if(titleEl) titleEl.innerHTML = 'Community Health<br>Survey';
    if(subEl)   subEl.innerHTML = 'Great Lakes University · Nyamache Sub County<br>Situation Analysis Tool';
  }
}

// ══════════════════════════════════════════════════════
//  AUTHENTICATION SYSTEM
// ══════════════════════════════════════════════════════
const AUTH_KEY       = 'chsa_auth';
const STUDENTS_TABLE = 'chsa_students';
const TEACHER_EMAIL  = 'hazzinbr001@gmail.com';
// EmailJS config — free tier, 200 emails/month
const EMAILJS_SERVICE  = 'service_748pr28';
const EMAILJS_TEMPLATE = 'template_vebhc8t';
const EMAILJS_PUBLIC   = 'uuUQcmG7gRRyZTqty';
// Google OAuth Client ID — replace with yours from console.cloud.google.com
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';

function authGetSession(){ try{ return JSON.parse(localStorage.getItem(AUTH_KEY)||'null'); }catch{return null;} }
function authSaveSession(s){ localStorage.setItem(AUTH_KEY, JSON.stringify(s)); }
function authClearSession(){ localStorage.removeItem(AUTH_KEY); }

// ═══════════════════════════════════════════════════════
//  ENTRANCE SEQUENCE — clean, smooth, mobile-first
//  Phase 1: Lamp room (swing → any touch/scroll lights it)
//  Phase 2: Login card fades in over lit lamp
//  Phase 3: After login → loader (ECG + detailed progress)
//  Phase 4: 100% → ECG stops → Begin button + 5s auto
// ═══════════════════════════════════════════════════════

let _lampOn    = false;
let _autoTimer = null;

// ── BOOT: wire ALL touch+scroll+click on lamp room ─────
document.addEventListener('DOMContentLoaded', ()=>{
  const btn  = document.getElementById('pull-btn');
  const room = document.getElementById('lamp-room');
  const ws   = document.getElementById('welcome-screen');

  if(!btn || !room) return;

  // ── Unified trigger: any meaningful interaction lights the lamp ──
  function trigger(e){
    if(_lampOn) return;
    // Prevent the touch from also firing click
    if(e.cancelable) e.preventDefault();
    lampPull();
  }

  // Touch: single finger touchend (no move = tap)
  let _touchMoved = false;
  btn.addEventListener('touchstart', ()=>{ _touchMoved=false; }, {passive:true});
  btn.addEventListener('touchmove',  ()=>{ _touchMoved=true;  }, {passive:true});
  btn.addEventListener('touchend', (e)=>{
    if(!_touchMoved){ trigger(e); }
  }, {passive:false});

  // Click fallback (desktop + accessibility)
  btn.addEventListener('click', trigger);
  btn.addEventListener('keydown', e=>{ if(e.key==='Enter'||e.key===' ') trigger(e); });

  // Scroll down on the lamp room also triggers (mobile swipe down)
  let _touchStartY = 0;
  room.addEventListener('touchstart', e=>{ _touchStartY = e.touches[0].clientY; }, {passive:true});
  room.addEventListener('touchend', e=>{
    if(_lampOn) return;
    const dy = e.changedTouches[0].clientY - _touchStartY;
    if(dy > 30){ lampPull(); } // swipe down 30px → light lamp
  }, {passive:true});

  // Also wire the whole welcome screen for any swipe
  if(ws){
    let _wsTY=0;
    ws.addEventListener('touchstart', e=>{ _wsTY=e.touches[0].clientY; }, {passive:true});
    ws.addEventListener('touchend', e=>{
      if(_lampOn) return;
      const dy = e.changedTouches[0].clientY - _wsTY;
      if(dy > 40){ lampPull(); }
    }, {passive:true});
  }
});

// ── PHASE 1: LAMP ──────────────────────────────────────
function lampPull(){
  if(_lampOn) return;
  _lampOn = true;

  // Animate shade inner glow to green
  const gs = document.getElementById('glow-stop');
  if(gs){
    gs.setAttribute('stop-color','rgba(29,185,84,0.55)');
    if(gs.nextElementSibling) gs.nextElementSibling.setAttribute('stop-color','rgba(29,185,84,0)');
  }

  // Light up room
  const gl = document.getElementById('lamp-glow');
  const fl = document.getElementById('floor-glow');
  if(gl) gl.style.opacity = '1';
  if(fl) fl.style.opacity = '1';

  // Dust particles float in light
  spawnDust();

  // Update pull-text
  const pt = document.getElementById('pull-text');
  if(pt){ pt.innerHTML='Light is on <span id="pull-hint">Sign in to begin</span>'; }

  // Dim lamp room slightly so login card reads clearly
  const room = document.getElementById('lamp-room');
  setTimeout(()=>{ if(room) room.style.opacity='0.35'; }, 900);

  // Reveal auth overlay — slow fade, feels like emerging from dark
  setTimeout(()=>{
    const auth = document.getElementById('lamp-auth');
    if(auth) auth.classList.add('open');
    // Focus input after transition completes
    setTimeout(()=>{
      const inp = document.getElementById('auth-reg-login');
      if(inp) inp.focus();
    }, 1800);
  }, 800);
}

function spawnDust(){
  const cont = document.getElementById('dust-container');
  if(!cont) return;
  for(let i=0;i<18;i++){
    const p = document.createElement('div');
    p.className = 'room-particle';
    const sz = 1.5 + Math.random()*3;
    p.style.cssText =
      'width:'+sz+'px;height:'+sz+'px;'+
      'left:'+(15+Math.random()*70)+'%;'+
      'bottom:'+(5+Math.random()*50)+'%;'+
      'animation-duration:'+(6+Math.random()*8)+'s;'+
      'animation-delay:'+(-Math.random()*5)+'s;'+
      'opacity:'+(0.15+Math.random()*0.5)+';';
    cont.appendChild(p);
  }
}

// ── PHASE 2: AUTH ──────────────────────────────────────
async function authInit(){

  // ══════════════════════════════════════════════════════
  //  ADMIN BYPASS — check first, before ANYTHING else
  //  Admin has reg_number='ADMIN' which doesn't exist in
  //  Supabase, so we must skip the fetch entirely.
  // ══════════════════════════════════════════════════════
  if(localStorage.getItem('chsa_is_admin_bypass')==='1'){
    // Hide everything immediately
    var ws = document.getElementById('welcome-screen');
    var ls = document.getElementById('loader-screen');
    if(ws) ws.style.display='none';
    if(ls) ls.style.display='none';
    var topbar = document.querySelector('.topbar');
    var botnav = document.querySelector('.bot-nav');
    var secs   = document.getElementById('secsWrap');
    if(topbar) topbar.style.visibility='hidden';
    if(botnav) botnav.style.visibility='hidden';
    if(secs)   secs.style.visibility='hidden';
    // Go straight to admin dashboard — no home page, no greeting
    if(typeof openAdminDash==='function'){
      openAdminDash();
    } else {
      // openAdminDash not yet loaded — wait briefly for scripts
      setTimeout(function(){ openAdminDash(); }, 400);
    }
    return;
  }

  const session = authGetSession();

  // ── Silently upgrade existing users who only have first name stored ──
  if(session && session.full_name){
    const stored = localStorage.getItem('chsa_user_name')||'';
    const full   = session.full_name.trim();
    if(full.includes(' ') && !stored.includes(' ')){
      localStorage.setItem('chsa_user_name', full);
      const hn = document.getElementById('h_interviewer_name');
      if(hn) hn.value = full;
    }
    if(!stored) localStorage.setItem('chsa_user_name', full);
  }

  if(session && session.full_name){
    if(navigator.onLine){
      try{
        const res = await fetch(
          `${SUPABASE_URL}/rest/v1/${STUDENTS_TABLE}?reg_number=eq.${encodeURIComponent(session.reg_number)}&select=status,full_name`,
          {headers:{apikey:SUPABASE_KEY,Authorization:'Bearer '+SUPABASE_KEY}}
        );
        const data = await res.json();
        if(data[0]?.status==='removed'){ authClearSession(); return; }
      }catch(e){ /* trust local session on error */ }
    }
    // Returning student — show greeting then enter
    const first = session.full_name.split(' ')[0];
    localStorage.setItem('chsa_user_name', session.full_name);
    fillInterviewerFields(session.full_name);
    showReturningGreeting(first);
  }
  // New user: wait for lamp interaction → login
}


function authShowAuthCard(){
  if(!_lampOn) lampPull();
  else {
    const auth = document.getElementById('lamp-auth');
    if(auth && !auth.classList.contains('open')) auth.classList.add('open');
  }
  authShowTab('login');
}

function authEnterApp(){
  const s = authGetSession();
  const fullN = s?.full_name || getUserName();
  const first = fullN ? fullN.split(' ')[0] : fullN;
  if(fullN){ localStorage.setItem('chsa_user_name', fullN); fillInterviewerFields(fullN); }

  // Fade auth card out
  const auth = document.getElementById('lamp-auth');
  if(auth){
    auth.style.transition = 'opacity .45s ease';
    auth.style.opacity = '0';
    setTimeout(()=>{ auth.style.pointerEvents='none'; }, 470);
  }

  // Admin bypass — skip loader, open dashboard directly
  if(localStorage.getItem('chsa_is_admin_bypass')==='1'){
    setTimeout(function(){ openAdminDash(); }, 600);
    return;
  }

  setTimeout(showLoader, 500);
}

// ── PHASE 3: LOADER ────────────────────────────────────
function showLoader(){
  const ls   = document.getElementById('loader-screen');
  const room = document.getElementById('lamp-room');
  const auth = document.getElementById('lamp-auth');

  // Fade out lamp room + auth
  if(room){ room.style.transition='opacity .65s ease'; room.style.opacity='0'; }
  if(auth){ auth.style.transition='opacity .45s ease'; auth.style.opacity='0';
    setTimeout(()=>auth.style.pointerEvents='none', 470); }

  // Fade loader in after background clears
  setTimeout(()=>{ if(ls) ls.classList.add('open'); }, 520);

  // Start progress after loader is fully visible
  setTimeout(runProgress, 900);
}

// ── PHASE 4: PROGRESS BAR ──────────────────────────────
// Detailed step messages tied to exact percentage milestones
const PROGRESS_STEPS = [
  { at:  0, msg: 'Initialising system...' },
  { at: 10, msg: 'Loading questionnaire modules...' },
  { at: 22, msg: 'Compiling Section A — Demography...' },
  { at: 34, msg: 'Compiling Section B — Housing...' },
  { at: 44, msg: 'Compiling Section C — Medical History...' },
  { at: 54, msg: 'Compiling Section D — Maternal & Child...' },
  { at: 63, msg: 'Compiling Section E — Nutrition...' },
  { at: 72, msg: 'Compiling Section F — HIV/AIDS...' },
  { at: 80, msg: 'Compiling Sections G–K — Environment...' },
  { at: 88, msg: 'Checking integrity rules...' },
  { at: 93, msg: 'Verifying offline database...' },
  { at: 97, msg: 'Adjusting progress...' },
  { at: 99, msg: 'Finalising...' },
];

function runProgress(){
  const bar = document.getElementById('ls-bar');
  const txt = document.getElementById('ls-percent');
  const lbl = document.getElementById('ls-loading');
  const btn = document.getElementById('ls-begin');
  const ecg = document.getElementById('ls-ecg-path');
  const cd  = document.getElementById('ls-countdown');

  // Each step: [targetPct, message, delayBeforeNext ms]
  // Steps 0–87 run fast (bar fills quickly, messages flash)
  // Steps 88–99 each hold for ~600ms so they are readable
  const STEPS = [
    [0,  'Initialising system…',                    0],
    [10, 'Loading questionnaire modules…',           600],
    [22, 'Compiling Section A — Demography…',        600],
    [34, 'Compiling Section B — Housing…',           600],
    [44, 'Compiling Section C — Medical History…',   600],
    [54, 'Compiling Section D — Maternal & Child…',  600],
    [63, 'Compiling Section E — Nutrition…',         600],
    [72, 'Compiling Section F — HIV/AIDS…',          600],
    [80, 'Compiling Sections G–K — Environment…',   700],
    [88, 'Checking integrity rules…',                700],
    [93, 'Verifying offline database…',              700],
    [97, 'Adjusting progress…',                      600],
    [99, 'Finalising…',                              500],
    [100,'Complete ✓ — Survey ready',                0],
  ];

  let currentPct = 0;
  let stepIdx = 0;

  if(lbl) lbl.textContent = STEPS[0][1];

  function animateTo(targetPct, afterDelay, done){
    // Smoothly tick from currentPct to targetPct
    const tickMs = targetPct <= 80 ? 28 : 22; // faster at end visually
    const iv = setInterval(()=>{
      currentPct++;
      if(txt) txt.textContent = currentPct + '%';
      if(bar) bar.style.width = currentPct + '%';
      if(currentPct >= targetPct){
        clearInterval(iv);
        setTimeout(done, afterDelay);
      }
    }, tickMs);
  }

  function runStep(i){
    if(i >= STEPS.length) return;
    const [targetPct, msg, holdMs] = STEPS[i];
    if(lbl) lbl.textContent = msg;

    if(targetPct === 100){
      // Final: stop ECG, show button, start countdown
      if(ecg){ ecg.classList.remove('running'); ecg.classList.add('stopped'); }
      if(lbl){ lbl.style.color='#1DB954'; }
      if(btn){ btn.style.display='block'; }
      let secs = 5;
      if(cd){ cd.style.display='block'; cd.textContent='Opening in '+secs+'s…'; }
      _autoTimer = setInterval(()=>{
        secs--;
        if(cd) cd.textContent = secs > 0 ? 'Opening in '+secs+'s…' : 'Opening…';
        if(secs <= 0){ clearInterval(_autoTimer); _autoTimer=null; loaderBegin(); }
      }, 1000);
      return;
    }

    animateTo(targetPct, holdMs, ()=> runStep(i+1));
  }

  // Kick off
  runStep(1); // step 0 already shown as initial message
}

function loaderBegin(){
  if(_autoTimer){ clearInterval(_autoTimer); _autoTimer=null; }
  const ls = document.getElementById('loader-screen');
  if(ls){
    ls.classList.add('out');
    setTimeout(()=>{ showHomePage(); }, 560);
  }
}

function enterApp(){
  const ws = document.getElementById('welcome-screen');
  if(ws){ ws.classList.add('hiding'); setTimeout(()=>{ ws.style.display='none'; }, 680); }
}

// ── COMPATIBILITY STUBS ────────────────────────────────
function showSplash(cb){ if(cb) cb(); }
function showWelcomeInterstitial(n,r,cb){ loaderBegin(); }
function wciEnterSurvey(){ loaderBegin(); }
function showHeartScreen(){ loaderBegin(); }
function hsEnterSurvey(){ loaderBegin(); }


// ── RETURNING USER GREETING (5s, styled like screenshot) ──
function showReturningGreeting(name){
  const ws = document.getElementById('welcome-screen');
  const h  = new Date().getHours();
  const tod = h<12?'Good Morning':h<17?'Good Afternoon':'Good Evening';

  // Inject keyframes once
  if(!document.getElementById('ret-greet-style')){
    const st = document.createElement('style');
    st.id = 'ret-greet-style';
    st.textContent = `
      @keyframes rgLogoIn {
        from{opacity:0;transform:scale(.5) translateY(-20px);}
        to  {opacity:1;transform:scale(1)  translateY(0);}
      }
      @keyframes rgRise {
        from{opacity:0;transform:translateY(18px);}
        to  {opacity:1;transform:translateY(0);}
      }
      @keyframes rgOrb {
        0%,100%{transform:translate(0,0) scale(1);}
        50%    {transform:translate(18px,-24px) scale(1.1);}
      }
      @keyframes rgOut {
        from{opacity:1;transform:translateY(0);}
        to  {opacity:0;transform:translateY(-28px);}
      }
    `;
    document.head.appendChild(st);
  }

  const ov = document.createElement('div');
  ov.id = 'return-greet';
  ov.style.cssText = [
    'position:absolute;inset:0;z-index:50',
    'background:linear-gradient(160deg,#071510 0%,#0a1a0e 50%,#060e0a 100%)',
    'display:flex;flex-direction:column',
    'align-items:center;justify-content:space-between',
    'padding:0;overflow:hidden',
    'opacity:0;transition:opacity .55s ease',
  ].join(';');

  ov.innerHTML = `
    <!-- bg mesh -->
    <div style="position:absolute;inset:0;pointer-events:none;
      background-image:linear-gradient(rgba(29,185,84,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(29,185,84,.035) 1px,transparent 1px);
      background-size:40px 40px;"></div>
    <!-- glow orbs -->
    <div style="position:absolute;width:320px;height:320px;border-radius:50%;
      background:rgba(26,92,53,.45);filter:blur(70px);
      top:-80px;right:-80px;pointer-events:none;
      animation:rgOrb 9s ease-in-out infinite alternate;"></div>
    <div style="position:absolute;width:240px;height:240px;border-radius:50%;
      background:rgba(26,64,96,.4);filter:blur(60px);
      bottom:-60px;left:-60px;pointer-events:none;
      animation:rgOrb 12s ease-in-out infinite alternate;animation-delay:-4s;"></div>

    <!-- content -->
    <div style="position:relative;z-index:2;display:flex;flex-direction:column;
      align-items:center;flex:1;justify-content:center;padding:0 28px;width:100%;max-width:380px;margin:0 auto;">

      <!-- logo badge -->
      <div style="width:90px;height:90px;border-radius:26px;
        background:linear-gradient(145deg,rgba(26,92,53,.6),rgba(26,64,96,.5));
        border:1px solid rgba(255,255,255,.13);
        display:flex;align-items:center;justify-content:center;font-size:44px;
        box-shadow:0 0 0 1px rgba(29,185,84,.18),0 10px 40px rgba(0,0,0,.45),0 0 60px rgba(26,92,53,.25);
        margin-bottom:20px;
        opacity:0;animation:rgLogoIn .65s cubic-bezier(.34,1.56,.64,1) .15s both;">🏥</div>

      <!-- eyebrow -->
      <div style="color:rgba(29,185,84,.82);font-size:.65rem;font-weight:800;
        letter-spacing:3.5px;text-transform:uppercase;text-align:center;
        margin-bottom:16px;
        opacity:0;animation:rgRise .5s ease .5s both;">
        Great Lakes University · Nyamache Sub County Hospital
      </div>

      <!-- glass card -->
      <div style="width:100%;background:rgba(255,255,255,.055);
        border:1px solid rgba(255,255,255,.1);border-radius:22px;
        padding:28px 24px 24px;text-align:center;
        backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);
        box-shadow:0 8px 40px rgba(0,0,0,.28),inset 0 1px 0 rgba(255,255,255,.07);">

        <!-- time of day greeting — LARGE -->
        <div style="color:rgba(255,255,255,.75);font-size:1.5rem;font-weight:700;
          letter-spacing:-.02em;margin-bottom:4px;
          opacity:0;animation:rgRise .55s ease .7s both;">${tod}</div>

        <!-- name — BIG -->
        <div style="color:#fff;font-size:2.8rem;font-weight:800;
          letter-spacing:-.04em;line-height:1.05;
          text-shadow:0 3px 24px rgba(0,0,0,.7);
          opacity:0;animation:rgRise .6s ease .88s both;">${name}!</div>

        <!-- divider -->
        <div style="width:44px;height:2px;margin:14px auto;border-radius:99px;
          background:linear-gradient(90deg,transparent,rgba(29,185,84,.7),transparent);
          opacity:0;animation:rgRise .45s ease 1.05s both;"></div>

        <!-- welcome back -->
        <div style="color:rgba(255,255,255,.5);font-size:.82rem;line-height:1.55;
          opacity:0;animation:rgRise .5s ease 1.2s both;">
          Welcome back<br>
          <span style="color:rgba(29,185,84,.8);font-size:.72rem;font-weight:600;
            letter-spacing:1.5px;text-transform:uppercase;">
            Community Health Survey
          </span>
        </div>
      </div>

    </div>

    <!-- footer -->
    <div style="position:relative;z-index:2;width:100%;
      padding:10px 20px calc(10px + env(safe-area-inset-bottom));
      text-align:center;
      background:rgba(0,0,0,.35);
      border-top:1px solid rgba(255,255,255,.05);
      opacity:0;animation:rgRise .45s ease 1.5s both;">
      <div style="color:rgba(255,255,255,.25);font-size:.62rem;letter-spacing:.3px;margin-bottom:3px;">
        Built by <strong style="color:rgba(255,255,255,.5);">HazzinBR</strong>
        &nbsp;·&nbsp; <span style="opacity:.55">Community Health Survey v2.0</span>
      </div>
      <div style="color:rgba(255,255,255,.13);font-size:.58rem;font-style:italic;">
        Free · Offline-first · Great Lakes University · Nyamache Sub County Hospital
      </div>
    </div>
  `;

  if(ws) ws.appendChild(ov);

  // Fade in
  requestAnimationFrame(()=> requestAnimationFrame(()=>{ ov.style.opacity='1'; }));

  // Hold for 5 seconds, then sweep out and enter survey
  setTimeout(()=>{
    ov.style.animation = 'rgOut .55s ease forwards';
    // Final safety net — if somehow admin gets here, go to home not survey
    if(localStorage.getItem('chsa_is_admin_bypass')==='1'){
      openAdminDash();
    } else {
      setTimeout(enterApp, 560);
    }
  }, 5000);
}



let _authCurrentTab = 'login';

function authShowTab(tab){
  _authCurrentTab = tab;
  const track  = document.getElementById('auth-track');
  const tLogin = document.getElementById('auth-tab-login');
  const tReg   = document.getElementById('auth-tab-register');

  if(tab === 'login'){
    if(track) track.style.transform = 'translateX(0)';
    if(tLogin){ tLogin.style.background='rgba(61,184,106,.15)'; tLogin.style.color='#3db86a'; tLogin.style.borderTopColor='#3db86a'; }
    if(tReg)  { tReg.style.background='transparent'; tReg.style.color='rgba(255,255,255,.3)'; tReg.style.borderTopColor='transparent'; }
  } else {
    // Slide left by 50% of the track width (showing the register state)
    if(track) track.style.transform = 'translateX(-50%)';
    if(tReg)  { tReg.style.background='rgba(61,184,106,.15)'; tReg.style.color='#3db86a'; tReg.style.borderTopColor='#3db86a'; }
    if(tLogin){ tLogin.style.background='transparent'; tLogin.style.color='rgba(255,255,255,.3)'; tLogin.style.borderTopColor='transparent'; }
  }
}

function authShowPanel(name){
  const cardWrap = document.getElementById('auth-card-wrap');
  const pending  = document.getElementById('auth-panel-pending');
  const rejected = document.getElementById('auth-panel-rejected');
  const tabs     = document.getElementById('auth-tabs');

  if(pending)  pending.style.display  = 'none';
  if(rejected) rejected.style.display = 'none';

  if(name==='login' || name==='register'){
    if(cardWrap) cardWrap.style.display = '';
    _authCurrentTab = null;
    authShowTab(name);
  } else {
    if(cardWrap) cardWrap.style.display = 'none';
    const panel = (name==='pending') ? pending : rejected;
    if(panel) panel.style.display = '';
  }
}



function authMsg(panel, msg, color='rgba(255,200,100,.9)'){
  const el = document.getElementById('auth-'+panel+'-msg');
  if(el){ el.textContent=msg; el.style.color=color; }
}

async function authLogin(){
  const rawReg = document.getElementById('auth-reg-login').value.trim();
  if(!rawReg){ authMsg('login','⚠ Enter your admission number'); return; }
  const reg = rawReg.toUpperCase();

  // ── Admin bypass ──
  if(isAdminBypass(reg)){
    authSaveSession({reg_number:'ADMIN', full_name:'Administrator', status:'admin'});
    localStorage.setItem('chsa_user_name','Administrator');
    localStorage.setItem('chsa_is_admin_bypass','1');
    authEnterApp();
    return;
  }

  // ── Format validation ──
  if(!isValidAdmission(reg)){
    authMsg('login','⚠ Invalid admission number format');
    return;
  }

  if(!navigator.onLine){ authMsg('login','📵 No internet — register first when online.','rgba(255,200,100,.9)'); return; }
  authMsg('login','Signing in…','rgba(255,255,255,.5)');
  try{
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/${STUDENTS_TABLE}?reg_number=eq.${encodeURIComponent(reg)}&select=reg_number,full_name,status`,
      {headers:{apikey:SUPABASE_KEY,Authorization:'Bearer '+SUPABASE_KEY}}
    );
    const data = await res.json();
    if(!data.length){ authMsg('login','❌ ID not found — please register first.'); return; }
    const user = data[0];
    if(user.status==='removed'){ authMsg('login','⚠ Your access has been removed. Contact the coordinator.','rgba(255,150,100,.9)'); return; }
    // All statuses except removed — enter immediately
    authSaveSession({...user, status:'active'});
    localStorage.setItem('chsa_user_name', user.full_name); // store full name for records
    authEnterApp();
  }catch(e){ authMsg('login','⚠ Connection error — try again'); }
}

// ── Email notification to teacher via EmailJS ──
async function authNotifyTeacher(studentName, regNumber, email){
  try{
    // EmailJS REST API — works without backend
    await fetch('https://api.emailjs.com/api/v1.0/email/send',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
        service_id:  EMAILJS_SERVICE,
        template_id: EMAILJS_TEMPLATE,
        user_id:     EMAILJS_PUBLIC,
        template_params:{
          to_email:    TEACHER_EMAIL,
          student_name: studentName,
          reg_number:  regNumber,
          student_email: email||'not provided',
          time:        new Date().toLocaleString('en-KE'),
          approve_link:`They have already been granted access and can use the app immediately. Open Admin → 👥 Students tab to remove them if needed.`
        }
      })
    });
  }catch(e){ /* silently fail — registration still works */ }
}

// ── Google Sign-In handler ──
function authGoogleSignIn(){
  if(typeof google === 'undefined'){
    authMsg('login','⚠ Google Sign-In not available. Use your ID below.','rgba(255,200,100,.9)');
    return;
  }
  google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: (response) => handleGoogleCredential(response, 'login'),
    context: 'signin',
    ux_mode: 'popup',
  });
  google.accounts.id.prompt();
}

function authGoogleRegister(){
  if(typeof google === 'undefined'){
    authMsg('register','⚠ Google Sign-In not available. Use the form below.','rgba(255,200,100,.9)');
    return;
  }
  google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: (response) => handleGoogleCredential(response, 'register'),
    context: 'signup',
    ux_mode: 'popup',
  });
  google.accounts.id.prompt();
}

async function handleGoogleCredential(response, mode){
  try{
    const payload = JSON.parse(atob(response.credential.split('.')[1]));
    const googleName  = payload.name  || '';
    const googleEmail = payload.email || '';
    const regNumber   = 'G-' + googleEmail.split('@')[0].toUpperCase();
    authMsg('login','Signing in…','rgba(255,255,255,.5)');
    await authSubmitRegistration(regNumber, googleName, googleEmail, true);
  }catch(e){
    authMsg('login','⚠ Google sign-in error','rgba(255,100,100,.9)');
  }
}

async function authSubmitRegistration(reg, name, email, isGoogle=false){
  const panel = isGoogle ? 'login' : 'register';
  // Check if already registered
  const checkUrl = email
    ? `${SUPABASE_URL}/rest/v1/${STUDENTS_TABLE}?or=(reg_number.eq.${encodeURIComponent(reg)},email.eq.${encodeURIComponent(email)})&select=status,full_name,reg_number`
    : `${SUPABASE_URL}/rest/v1/${STUDENTS_TABLE}?reg_number=eq.${encodeURIComponent(reg)}&select=status,full_name`;
  const check = await fetch(checkUrl,{headers:{apikey:SUPABASE_KEY,Authorization:'Bearer '+SUPABASE_KEY}});
  const existing = await check.json();

  if(existing.length){
    const s = existing[0];
    if(s.status==='removed'){
      authMsg(panel,'⚠ Your access was removed. Contact the coordinator.','rgba(255,150,100,.9)');
      return;
    }
    // Already registered — sign in immediately
    authSaveSession({reg_number:s.reg_number, full_name:s.full_name, status:'active', email});
    localStorage.setItem('chsa_user_name', s.full_name); // store full name for records
    authEnterApp();
    return;
  }

  // New — register and enter immediately, notify coordinator in background
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${STUDENTS_TABLE}`,{
    method:'POST',
    headers:{'Content-Type':'application/json','apikey':SUPABASE_KEY,'Authorization':'Bearer '+SUPABASE_KEY,'Prefer':'return=minimal'},
    body:JSON.stringify({reg_number:reg, full_name:name, email:email||null, status:'active', requested_at:new Date().toISOString()})
  });

  if(res.ok||res.status===201||res.status===204){
    authSaveSession({reg_number:reg, full_name:name, status:'active', email});
    localStorage.setItem('chsa_user_name', name.split(' ')[0]);
    authNotifyTeacher(name, reg, email); // silent background email
    authEnterApp();
  } else {
    const err = await res.text();
    authMsg(panel,'⚠ '+err.slice(0,80));
  }
}

async function authRegister(){
  const rawReg = document.getElementById('auth-reg-num').value.trim();
  const reg    = rawReg.toUpperCase();
  const name   = document.getElementById('auth-full-name').value.trim();
  const email  = document.getElementById('auth-email').value.trim().toLowerCase();
  if(!rawReg||!name){ authMsg('register','⚠ Fill in your admission number and full name'); return; }

  // ── Format validation ──
  if(!isValidAdmission(rawReg)){
    authMsg('register','⚠ Invalid admission number format');
    return;
  }

  // ── Name must be at least two words ──
  if(name.trim().split(/\s+/).length < 2){
    authMsg('register','⚠ Enter your full name (first and last name)');
    return;
  }

  if(!navigator.onLine){ authMsg('register','📵 No internet connection'); return; }
  authMsg('register','Registering…','rgba(255,255,255,.5)');
  try{ await authSubmitRegistration(reg, name, email, false); }
  catch(e){ authMsg('register','⚠ Connection error — try again'); }
}

async function authCheckStatus(){
  // Kept for compatibility — no longer blocks
  const session = authGetSession();
  if(session && session.full_name) authEnterApp();
}

function authClearAndRetry(){
  authClearSession();
  authShowPanel('login');
  document.getElementById('auth-tabs').style.display='';
}



function showDonateModal(){
  document.getElementById('donateModal').style.display='flex';
}

// ── Spawn rising particles ──
function spawnParticles(){
  const container = document.getElementById('wc-particles');
  if(!container) return;
  for(let i=0;i<18;i++){
    const p = document.createElement('div');
    p.className = 'wc-particle';
    p.style.left = Math.random()*100+'%';
    p.style.width = p.style.height = (1+Math.random()*2.5)+'px';
    p.style.animationDuration = (6+Math.random()*10)+'s';
    p.style.animationDelay    = (Math.random()*8)+'s';
    p.style.opacity = 0.2+Math.random()*0.5;
    container.appendChild(p);
  }
}

// ── Location toggle (Nyamache vs Other) ──
document.addEventListener('change', e=>{
  if(e.target.name === 'interview_location'){
    const otherInput = document.getElementById('loc_other_input');
    if(!otherInput) return;
    if(e.target.value === '__other__'){
      otherInput.style.display = 'block';
      otherInput.focus();
    } else {
      otherInput.style.display = 'none';
    }
  }
});

// ── Run welcome & auth ──
spawnParticles();
authInit();


// Service worker loaded from ./sw.js

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js', {scope: './'}).then(reg => {
    console.log('✓ SW registered:', reg.scope);
  }).catch(err => console.warn('SW failed:', err));
}

// ══════════════════════════════════════════════════════
//  PWA INSTALL LOGIC
// ══════════════════════════════════════════════════════
let deferredPrompt = null;
const isIOS = /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase());
const isAndroid = /android/.test(navigator.userAgent.toLowerCase());
const isStandalone = window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;

// Chrome's native install prompt (only works on HTTPS)
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
  // Show the top banner
  const banner = document.getElementById('pwa-banner');
  if (banner) banner.style.display = 'flex';
  console.log('Install prompt ready');
});

function doInstall() {
  const banner = document.getElementById('pwa-banner');
  if (banner) banner.style.display = 'none';
  if (deferredPrompt) {
    // Native Chrome install
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(c => {
      showToast(c.outcome === 'accepted' ? '✓ App installed!' : 'Installation cancelled');
      deferredPrompt = null;
    });
  } else {
    // Fallback: show guide
    showInstallGuide();
  }
}

window.addEventListener('appinstalled', () => {
  showToast('✓ Health Survey app installed!');
  const banner = document.getElementById('pwa-banner');
  if (banner) banner.style.display = 'none';
});

function showInstallGuide() {
  if (isStandalone) {
    showToast('✓ Already installed as an app!');
    return;
  }
  const modal = document.getElementById('installModal');
  const android = document.getElementById('installStepsAndroid');
  const ios = document.getElementById('installStepsIOS');
  const desktop = document.getElementById('installStepsChromebook');
  const note = document.getElementById('installNote');

  // Show relevant steps
  if(android){ android.style.display = isAndroid ? 'block' : 'none'; }
  if(ios){ ios.style.display = isIOS ? 'block' : 'none'; }
  if(desktop){ desktop.style.display = (!isAndroid && !isIOS) ? 'block' : 'none'; }

  // Show all if we can't detect
  if(!isAndroid && !isIOS){
    if(android) android.style.display = 'block';
    if(ios) ios.style.display = 'block';
    if(desktop) desktop.style.display = 'block';
  }

  // Note about HTTPS requirement
  const isHTTPS = location.protocol === 'https:' || location.hostname === 'localhost';
  if(note){
    if(deferredPrompt){
      note.innerHTML = '✅ <strong>Ready to install!</strong> Tap the Install button in the banner at the top, or use the steps above.';
      note.style.background = '#e8f5ed';
    } else if(isHTTPS){
      note.innerHTML = '✅ Page loaded over HTTPS. Use the browser menu steps above to install.';
      note.style.background = '#e8f5ed';
    } else {
      note.innerHTML = '⚠ <strong>For full install support:</strong> Host this file on a web server or share via WhatsApp/Google Drive, then open in Chrome and use "Add to Home Screen".';
      note.style.background = '#fff8e1';
    }
  }

  if(modal) modal.style.display = 'flex';
}

// Sync is auto — no manual config needed

// ── Sync modal helpers ──
function openSyncModal(){
  const stored = JSON.parse(localStorage.getItem('chsa4')||'{}');
  const all = Object.entries(stored).filter(([id,r])=> typeof r==='object' && r!==null && !id.startsWith('_'));
  const confirmed = all.filter(([,r])=>r._synced===true);
  const pending   = all.filter(([,r])=>!r._synced);
  document.getElementById('syncModalStatus').textContent =
    navigator.onLine ? '🟢 Online — ready to sync' : '🔴 Offline — connect to sync';
  document.getElementById('syncModalInfo').innerHTML =
    `<strong>${all.length}</strong> total record(s) on this device<br>` +
    `<span style="color:#1e5c38;font-weight:600">✓ ${confirmed.length} confirmed uploaded to admin</span><br>` +
    `<span style="color:${pending.length>0?'#d35400':'#1e5c38'};font-weight:600">`+
    `${pending.length>0?'⚠ '+pending.length+' NOT yet uploaded — tap Sync below':'✓ All uploaded'}</span>`;
  document.getElementById('syncModal').style.display='flex';
}
function closeSyncModal(){
  document.getElementById('syncModal').style.display='none';
}

// Auto-show iOS hint after 4 seconds if not installed
if (isIOS && !isStandalone) {
  setTimeout(() => {
    const note = document.getElementById('installNote');
    if(note) note.innerHTML = '💡 Open in Safari → tap Share ⬆ → Add to Home Screen';
  }, 100);
}

// ══════════════════════════════════════════════════════
//  HOME PAGE
// ══════════════════════════════════════════════════════
function showHomePage(){
  showScreen('home');
  // Populate greeting
  var fullN=getUserName()||'Interviewer';
  var name=fullN.split(' ')[0];
  var h=new Date().getHours();
  var g=h<12?'Good Morning':h<17?'Good Afternoon':'Good Evening';
  var ne=document.getElementById('hp-name');
  var ge=document.getElementById('hp-greeting');
  if(ne)ne.textContent=fullN;
  if(ge)ge.textContent=g;
  _hpStats();
  // Admin: hide survey-only buttons, show admin note
  var isAdmin=localStorage.getItem('chsa_is_admin_bypass')==='1';
  var hp=document.getElementById('home-page');
  if(hp){
    hp.querySelectorAll('[data-role="survey-only"]').forEach(function(b){
      b.style.display=isAdmin?'none':'';
    });
  }
  var adminNote=document.getElementById('hp-admin-note');
  if(adminNote) adminNote.style.display=isAdmin?'block':'none';
}
function _hpStats(){
  try{
    var recs=JSON.parse(localStorage.getItem('chsa4')||'{}');
    var keys=Object.keys(recs).filter(function(k){return !k.startsWith('_');});
    var today=new Date().toISOString().split('T')[0];
    var t=keys.filter(function(k){return recs[k].interview_date===today;}).length;
    var s=keys.filter(function(k){return recs[k]._synced;}).length;
    var te=document.getElementById('hp-stat-total');
    var td=document.getElementById('hp-stat-today');
    var sy=document.getElementById('hp-stat-synced');
    if(te)te.textContent=keys.length;
    if(td)td.textContent=t;
    if(sy)sy.textContent=s;
  }catch(e){}
}
function goBackHome(){
  _hpStats();
  showHomePage();
}
function _showAdminSurveyLock(show){
  var lock = document.getElementById('admin-survey-lock');
  if(lock){ if(show) lock.classList.add('active'); else lock.classList.remove('active'); }
}

function homeGoSurvey(){
  // Admin bypass — can VIEW the survey dimmed but not submit
  if(localStorage.getItem('chsa_is_admin_bypass')==='1'){
    showToast('Admin view only — survey is locked', true);
    // Admin — show lock screen instead
    showScreen('lock');
    return;
  }
  if(typeof _autoTimer!=='undefined'&&_autoTimer){clearInterval(_autoTimer);_autoTimer=null;}
  showScreen('survey');
}
function homeGoAdmin(){
  // Students (non-admin-bypass) cannot access admin dashboard
  var isAdminBypass = localStorage.getItem('chsa_is_admin_bypass')==='1';
  var alreadyVerified = sessionStorage.getItem('adm_ok')==='1';
  if(!isAdminBypass && !alreadyVerified){
    showToast('Admin access restricted to authorised personnel', true);
    return;
  }
  // Cancel any pending loader timer
  if(typeof _autoTimer !== 'undefined' && _autoTimer){
    clearInterval(_autoTimer); _autoTimer = null;
  }
  var ls = document.getElementById('loader-screen');
  if(ls){ ls.classList.remove('open','out'); }
  if(isAdminBypass){
    if(typeof openAdminDash==='function') openAdminDash();
  } else {
    if(typeof openAdminGate==='function') openAdminGate();
  }
}
