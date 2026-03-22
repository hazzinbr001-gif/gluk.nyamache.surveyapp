/* ═══════════════════════════════════════════════════════════════════
   Community Health Survey — Official Report System
   Great Lakes University of Kisumu · Nyamache Sub County Hospital
   © 2026 HazzinBR
   ═══════════════════════════════════════════════════════════════════ */

'use strict';

// ─────────────────────────────────────────────────────────────────
//  STUDENT DETAILS — fetch from Supabase by full name
//  Returns { full_name, reg_number, email }
// ─────────────────────────────────────────────────────────────────
async function _getStudentDetails(fullName){
  const name = (fullName||'').trim().toLowerCase();

  // Helper: check if two names match (exact or one starts with the other)
  function matches(a,b){
    if(!a||!b) return false;
    a=a.trim().toLowerCase(); b=b.trim().toLowerCase();
    return a===b || a.startsWith(b+' ') || b.startsWith(a+' ') || a.split(' ')[0]===b || b.split(' ')[0]===a;
  }

  // 1. Check _admStudents cache
  if(typeof _admStudents!=='undefined' && Array.isArray(_admStudents)){
    // Try exact match first
    let hit = _admStudents.find(s=>s.full_name && s.full_name.trim().toLowerCase()===name);
    // Fall back to partial match
    if(!hit) hit = _admStudents.find(s=>matches(s.full_name, fullName));
    if(hit) return hit;
  }

  // 2. Check session
  try{
    const sess = JSON.parse(localStorage.getItem('chsa_auth')||'null');
    if(sess && sess.full_name && matches(sess.full_name, fullName))
      return sess;
  }catch(e){}

  // 3. Live fetch — try full name first, then first-name-only
  try{
    // Try exact full name match
    let url = SUPABASE_URL+'/rest/v1/chsa_students?full_name=eq.'
      +encodeURIComponent((fullName||'').trim())+'&select=reg_number,full_name,email&limit=1';
    let res = await fetch(url,{headers:{apikey:SUPABASE_KEY,'Authorization':'Bearer '+SUPABASE_KEY}});
    if(res.ok){
      const d = await res.json();
      if(d && d.length) return d[0];
    }
    // Try ilike (case-insensitive, partial)
    const firstName = (fullName||'').trim().split(' ')[0];
    url = SUPABASE_URL+'/rest/v1/chsa_students?full_name=ilike.'
      +encodeURIComponent(firstName+'*')+'&select=reg_number,full_name,email&limit=5';
    res = await fetch(url,{headers:{apikey:SUPABASE_KEY,'Authorization':'Bearer '+SUPABASE_KEY}});
    if(res.ok){
      const d = await res.json();
      if(d && d.length){
        // Pick the one that best matches
        const best = d.find(s=>matches(s.full_name,fullName)) || d[0];
        return best;
      }
    }
  }catch(e){}

  return {full_name: fullName||'Unknown', reg_number:'—', email:'—'};
}




// ─────────────────────────────────────────────────────────────────
//  SHARED CSS
//  Letter 8.5×11in fixed-height pages.
//  All print via browser's native Print → Save as PDF.
//  No double-scroll. No gaps. Fits 15-20 cases cleanly.
// ─────────────────────────────────────────────────────────────────
const RPT_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html,body{
  font-family:'Plus Jakarta Sans','Arial',sans-serif;
  font-size:9pt;
  color:#111;
  background:#ccc;
  -webkit-print-color-adjust:exact;
  print-color-adjust:exact;
}

/* ═══════════════════════════════════════
   EACH .pg = ONE LETTER PAGE (8.5 × 11in)
   overflow:hidden keeps it fixed.
   flex-column lets header/content/footer
   divide the vertical space cleanly.
   ═══════════════════════════════════════ */
.pg{
  width:8.5in;
  height:11in;
  display:flex;
  flex-direction:column;
  background:#fff;
  margin:0 auto 0.15in;
  box-shadow:0 2px 10px rgba(0,0,0,.14);
  overflow:hidden;
  position:relative;
}

/* ── TOP STRIPE on every page ── */
.pg-stripe{
  height:4px;
  background:linear-gradient(90deg,#1a5c35,#1a4060);
  flex-shrink:0;
  -webkit-print-color-adjust:exact;print-color-adjust:exact;
}

/* ── RUNNING HEADER ── */
.pg-hdr{
  flex-shrink:0;
  padding:6pt 0.7in 5pt;
  display:flex;align-items:center;justify-content:space-between;
  border-bottom:1.5px solid #1a5c35;
  -webkit-print-color-adjust:exact;print-color-adjust:exact;
}
.pg-hdr-l{display:flex;align-items:center;gap:5pt;}
.pg-hdr-icon{
  width:13pt;height:13pt;background:#1a5c35;border-radius:2pt;
  display:flex;align-items:center;justify-content:center;flex-shrink:0;
  -webkit-print-color-adjust:exact;print-color-adjust:exact;
}
.pg-hdr-icon svg{width:8pt;height:8pt;}
.pg-hdr-org{font-weight:700;color:#1a5c35;font-size:6pt;text-transform:uppercase;letter-spacing:.3px;}
.pg-hdr-doc{font-size:5.5pt;color:#666;margin-top:1px;}
.pg-hdr-r{font-size:5.5pt;color:#888;text-align:right;line-height:1.8;}

/* ── CONTENT ── */
.pg-body{
  flex:1;
  padding:8pt 0.7in 0;
  overflow:hidden;
  /* Two-column layout helper */
}
.pg-body.cols2{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:10pt;
}
.pg-body.cols2-3{
  display:grid;
  grid-template-columns:1.4fr 1fr;
  gap:10pt;
}

/* ── RUNNING FOOTER ── */
.pg-ftr{
  flex-shrink:0;
  padding:4pt 0.7in 6pt;
  display:flex;align-items:center;justify-content:space-between;
  border-top:1px solid #cce0d4;
  -webkit-print-color-adjust:exact;print-color-adjust:exact;
}
.pg-ftr-c{flex:1;text-align:center;font-size:5.5pt;color:#bbb;}
.pg-ftr-r{font-size:6pt;font-weight:700;color:#555;min-width:46pt;text-align:right;}
.pg-ftr-l{font-size:5.5pt;color:#aaa;}

/* ══════════════════════════════════════
   COVER PAGE — full bleed, no stripe
   ══════════════════════════════════════ */
.cover{
  width:8.5in;height:11in;
  display:flex;flex-direction:column;
  background:#fff;
  margin:0 auto 0.15in;
  box-shadow:0 2px 10px rgba(0,0,0,.14);
  overflow:hidden;
}
.cov-band{height:0.26in;background:linear-gradient(135deg,#0a3d1f,#1a5c35,#1a4060);flex-shrink:0;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
.cov-body{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0.3in 0.9in 0.2in;text-align:center;}
.cov-emb{width:52pt;height:52pt;border-radius:50%;background:linear-gradient(145deg,#1a5c35,#1a4060);display:flex;align-items:center;justify-content:center;margin:0 auto 9pt;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
.cov-emb svg{width:27pt;height:27pt;}
.cov-min{font-size:6.5pt;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#6b8a74;margin-bottom:2pt;}
.cov-uni{font-size:11pt;font-weight:800;color:#1a5c35;margin-bottom:8pt;}
.cov-rule{width:32pt;height:2pt;background:linear-gradient(90deg,#1a5c35,#1a4060);margin:0 auto 8pt;border-radius:2pt;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
.cov-rtype{font-size:6.5pt;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:#888;margin-bottom:6pt;}
.cov-title{font-size:17pt;font-weight:800;color:#0f1f18;line-height:1.2;margin-bottom:4pt;}
.cov-sub{font-size:9.5pt;color:#3a5a4a;margin-bottom:14pt;line-height:1.4;}
.cov-box{background:#f4f8f5;border:1px solid #cce0d4;border-radius:4pt;padding:8pt 13pt;width:100%;max-width:3.3in;text-align:left;margin-bottom:10pt;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
.cov-row{display:flex;justify-content:space-between;align-items:flex-start;padding:2.5pt 0;border-bottom:1px solid #e0ede5;font-size:7pt;}
.cov-row:last-child{border-bottom:none;}
.cov-k{color:#6b8a74;font-weight:700;flex-shrink:0;margin-right:5pt;}
.cov-v{color:#1a2b22;font-weight:600;text-align:right;word-break:break-word;max-width:58%;}
.cov-note{font-size:6pt;color:#999;max-width:3.4in;line-height:1.5;margin-bottom:8pt;}
/* Interviewer ID card */
.cov-id{background:linear-gradient(135deg,#1a5c35,#1a4060);border-radius:8pt;padding:10pt 14pt;width:100%;max-width:3.3in;text-align:center;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
.cov-id-name{color:#fff;font-size:13pt;font-weight:800;letter-spacing:-.02em;}
.cov-id-reg{color:rgba(255,255,255,.75);font-size:7.5pt;font-weight:600;margin-top:2pt;letter-spacing:.5px;}
.cov-id-email{color:rgba(255,255,255,.55);font-size:6.5pt;margin-top:1pt;}
.cov-id-badge{display:inline-block;background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.3);border-radius:99pt;padding:2pt 8pt;font-size:6pt;color:rgba(255,255,255,.8);margin-top:5pt;font-weight:700;letter-spacing:1px;text-transform:uppercase;}
.cov-bot{height:0.42in;background:#f4f8f5;border-top:2px solid #1a5c35;display:flex;align-items:center;justify-content:space-between;padding:0 0.7in;font-size:5.5pt;color:#6b8a74;flex-shrink:0;-webkit-print-color-adjust:exact;print-color-adjust:exact;}

/* ══════════════════════════════════════
   CONTENT ELEMENTS
   ══════════════════════════════════════ */
h2.sec{
  font-size:7.5pt;font-weight:800;text-transform:uppercase;letter-spacing:.6px;
  color:#fff;background:linear-gradient(135deg,#1a5c35,#1a4060);
  padding:3.5pt 8pt;margin:7pt 0 5pt;border-radius:2pt;
  -webkit-print-color-adjust:exact;print-color-adjust:exact;
}
h2.sec:first-child{margin-top:0;}
h3.sub{
  font-size:7.5pt;font-weight:700;color:#1a5c35;
  border-left:2.5pt solid #1a5c35;padding-left:5pt;
  margin:5pt 0 3pt;
  -webkit-print-color-adjust:exact;print-color-adjust:exact;
}
p.bt{font-size:7.5pt;line-height:1.6;color:#1a2b22;margin-bottom:4pt;}
p.note{font-size:6.5pt;color:#6b8a74;font-style:italic;margin-bottom:3pt;}
.divider{height:1px;background:#e8f0e8;margin:5pt 0;-webkit-print-color-adjust:exact;print-color-adjust:exact;}

/* Table */
table.dt{width:100%;border-collapse:collapse;font-size:6.5pt;margin-bottom:5pt;}
table.dt thead{display:table-header-group;}
table.dt thead th{
  background:#1a5c35;color:#fff;
  padding:3pt 4.5pt;text-align:left;font-weight:700;font-size:6pt;
  -webkit-print-color-adjust:exact;print-color-adjust:exact;
}
table.dt thead th.c{text-align:center;}
table.dt tbody td{padding:2.5pt 4.5pt;border-bottom:1px solid #e0ede0;font-size:6.5pt;vertical-align:top;}
table.dt tbody tr:nth-child(even) td{background:#f6fbf6;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
table.dt tbody td.lbl{font-weight:600;color:#1a5c35;white-space:nowrap;}
table.dt tbody td.c{text-align:center;}
table.dt tfoot td{
  font-weight:800;background:#e8f5ed;padding:3pt 4.5pt;
  border-top:1.5px solid #1a5c35;font-size:6.5pt;
  -webkit-print-color-adjust:exact;print-color-adjust:exact;
}

/* Bars */
.ir{display:flex;align-items:center;gap:5pt;margin-bottom:3pt;}
.il{font-size:6.5pt;font-weight:600;width:90pt;flex-shrink:0;}
.it{flex:1;height:6pt;background:#e8f0e8;border-radius:99pt;overflow:hidden;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
.if{height:100%;border-radius:99pt;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
.ip{font-size:6pt;font-weight:700;min-width:44pt;text-align:right;}

/* Stat boxes */
.sr{display:flex;gap:3pt;margin-bottom:5pt;}
.sb{
  flex:1;background:#f4f8f5;border:1px solid #cce0d4;
  border-radius:3pt;padding:4pt 3pt;text-align:center;
  border-top:2pt solid #1a5c35;
  -webkit-print-color-adjust:exact;print-color-adjust:exact;
}
.sb.red{border-top-color:#c0392b;background:#fdf4f4;}
.sb.amb{border-top-color:#e67e22;background:#fefbf4;}
.sb.blu{border-top-color:#1a4060;background:#f4f6fb;}
.sn{font-size:11pt;font-weight:800;line-height:1;color:#1a5c35;}
.sb.red .sn{color:#c0392b;}.sb.amb .sn{color:#e67e22;}.sb.blu .sn{color:#1a4060;}
.sl{font-size:5pt;font-weight:700;text-transform:uppercase;letter-spacing:.2px;color:#888;margin-top:1.5pt;}

/* Flag boxes */
.fc,.fw,.fg{padding:3.5pt 7pt;margin-bottom:3pt;font-size:7pt;border-radius:0 2pt 2pt 0;}
.fc{background:#fdf4f4;border-left:2.5pt solid #c0392b;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
.fw{background:#fefbf4;border-left:2.5pt solid #e67e22;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
.fg{background:#f4fbf4;border-left:2.5pt solid #1a5c35;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
.ft{font-weight:700;margin-bottom:1pt;}
.fc .ft{color:#c0392b;}.fw .ft{color:#e67e22;}.fg .ft{color:#1a5c35;}
.fb{color:#333;line-height:1.45;font-size:6.5pt;}

/* Signatures */
.sigs{display:flex;gap:10pt;margin-top:8pt;padding-top:6pt;border-top:1px solid #cce0d4;}
.sig{flex:1;}
.sig-l{border-bottom:1px solid #333;height:16pt;margin-bottom:2pt;}
.sig-n{font-size:6.5pt;font-weight:700;color:#1a2b22;}
.sig-s{font-size:5.5pt;color:#888;margin-top:1pt;}

/* ══════════════════════════════════════
   PRINT
   Browser handles pagination.
   Each .pg / .cover = one sheet.
   ══════════════════════════════════════ */
@media print{
  *{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;}
  html,body{background:#fff!important;margin:0!important;padding:0!important;}
  .cover,.pg{
    box-shadow:none!important;
    margin:0!important;
    page-break-after:always!important;
  }
  .cover:last-child,.pg:last-child{page-break-after:auto!important;}
}
@page{size:letter portrait;margin:0;}
`;


// ─────────────────────────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────────────────────────
function _pct(a,b){return b>0?Math.round(a/b*100):0;}
function _cnt(arr,f,v){return arr.filter(r=>r[f]===v).length;}
function _avg(arr,f){const v=arr.map(r=>parseInt(r[f])||0).filter(x=>x>0);return v.length?Math.round(v.reduce((a,b)=>a+b)/v.length):0;}
function _ills(arr){
  const c={};
  arr.forEach(r=>(r.illnesses||'').split(',').forEach(x=>{const k=x.trim();if(k&&k!=='None')c[k]=(c[k]||0)+1;}));
  return Object.entries(c).sort((a,b)=>b[1]-a[1]);
}
function _flags(r){
  const f=[];
  if(r.latrine==='No')       f.push('No pit latrine — open defecation risk');
  if(r.water_treated==='No') f.push('Untreated drinking water');
  if(r.hiv_heard==='No')     f.push('No HIV/AIDS awareness');
  try{
    const raw=typeof r.raw_json==='string'?JSON.parse(r.raw_json||'{}'):(r.raw_json||{});
    if(raw.i_circ==='Female'||raw.i_circ==='Both') f.push('FGM reported — requires referral');
    if(raw.b_smoke_in==='Yes') f.push('Indoor smoking — passive smoke risk');
  }catch(e){}
  return f;
}
const S=(p,t)=>p>=t
  ?'<span style="color:#1a5c35;font-weight:700">&#10003;</span>'
  :'<span style="color:#c0392b;font-weight:700">&#10007;</span>';

// Page header
function _hdr(docName, type, date){
  return '<div class="pg-stripe"></div>'
    +'<div class="pg-hdr">'
    +'<div class="pg-hdr-l">'
    +'<div class="pg-hdr-icon"><svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" rx="6" fill="#1a5c35"/><path d="M24 10L24 38M10 24L38 24" stroke="#fff" stroke-width="6" stroke-linecap="round"/></svg></div>'
    +'<div><div class="pg-hdr-org">Great Lakes University of Kisumu &middot; Nyamache Sub County Hospital</div>'
    +'<div class="pg-hdr-doc">'+docName+'</div></div>'
    +'</div>'
    +'<div class="pg-hdr-r">'+type+'<br>'+date+'</div>'
    +'</div>';
}
// Page footer
function _ftr(num, total, note){
  return '<div class="pg-ftr">'
    +'<div class="pg-ftr-l">'+(note||'Community Health Survey &middot; Great Lakes University &middot; Nyamache Sub County Hospital')+'</div>'
    +'<div class="pg-ftr-c">Confidential &mdash; For Official Use Only</div>'
    +'<div class="pg-ftr-r">Page '+num+' of '+total+'</div>'
    +'</div>';
}
// Assemble one page
function _pg(header, footer, bodyClass, content){
  return '<div class="pg">'
    +header
    +'<div class="pg-body'+(bodyClass?' '+bodyClass:'')+'">'
    +content
    +'</div>'
    +footer
    +'</div>';
}
// Indicator bar
function _bar(label, val, max, col){
  const p=_pct(val,max);
  const c=col||(p>=70?'#1a5c35':p>=50?'#e67e22':'#c0392b');
  return '<div class="ir">'
    +'<div class="il">'+label+'</div>'
    +'<div class="it"><div class="if" style="width:'+p+'%;background:'+c+'"></div></div>'
    +'<div class="ip" style="color:'+(p>=70?'#1a5c35':p>=50?'#e67e22':'#c0392b')+'">'+val+'/'+max+' ('+p+'%)</div>'
    +'</div>';
}
// Stat box
function _sb(n,l,cls){
  return '<div class="sb'+(cls?' '+cls:'')+'">'
    +'<div class="sn">'+n+'</div>'
    +'<div class="sl">'+l+'</div>'
    +'</div>';
}
// Flag box
function _fl(lvl, title, body){
  const cls=lvl==='critical'?'fc':lvl==='warning'?'fw':'fg';
  const ico=lvl==='good'?'&#10003;':'&#9888;';
  return '<div class="'+cls+'"><div class="ft">'+ico+' '+title+'</div><div class="fb">'+body+'</div></div>';
}
// Cover page
function _cover(title, subtitle, metaRows, reportType, idCard){
  const now=new Date().toLocaleDateString('en-KE',{year:'numeric',month:'long',day:'numeric'});
  return '<div class="cover">'
    +'<div class="cov-band"></div>'
    +'<div class="cov-body">'
    +'<div class="cov-emb"><svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path d="M24 10L24 38M10 24L38 24" stroke="#fff" stroke-width="5" stroke-linecap="round"/><circle cx="24" cy="24" r="14" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="2"/></svg></div>'
    +'<div class="cov-min">Republic of Kenya &nbsp;&middot;&nbsp; Ministry of Health</div>'
    +'<div class="cov-uni">Great Lakes University of Kisumu</div>'
    +'<div class="cov-rule"></div>'
    +'<div class="cov-rtype">'+reportType+'</div>'
    +'<div class="cov-title">'+title+'</div>'
    +'<div class="cov-sub">'+subtitle+'</div>'
    +(idCard||'')
    +'<div class="cov-box" style="margin-top:10pt">'
    +metaRows.map(([k,v])=>'<div class="cov-row"><span class="cov-k">'+k+'</span><span class="cov-v">'+(v||'&mdash;')+'</span></div>').join('')
    +'<div class="cov-row"><span class="cov-k">Date Generated</span><span class="cov-v">'+now+'</span></div>'
    +'</div>'
    +'<p class="cov-note">Produced in fulfilment of community health situation analysis practical requirements, Great Lakes University of Kisumu, in collaboration with Nyamache Sub County Hospital, Kisii County, Kenya.</p>'
    +'</div>'
    +'<div class="cov-bot">'
    +'<div style="display:flex;align-items:center;gap:5px"><svg width="14" height="14" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" rx="7" fill="#1a5c35"/><path d="M24 10L24 38M10 24L38 24" stroke="#fff" stroke-width="6" stroke-linecap="round"/></svg><strong style="color:#1a5c35;font-size:6pt">Community Health Survey v2.0</strong></div>'
    +'<div>Built by HazzinBR &middot; Nyamache Sub County Hospital, Kisii County, Kenya</div>'
    +'<div>Confidential &mdash; For Official Use Only</div>'
    +'</div>'
    +'</div>';
}
// Document wrapper
function _doc(title, pages){
  return '<!DOCTYPE html><html lang="en"><head>'
    +'<meta charset="UTF-8">'
    +'<meta name="viewport" content="width=device-width,initial-scale=1">'
    +'<title>'+title+'</title>'
    +'<style>'+RPT_CSS+'</style>'
    +'</head><body>'
    +pages
    +'</body></html>';
}
// Signatures
function _sigs(people){
  return '<div class="sigs">'
    +people.map(([name,label])=>'<div class="sig"><div class="sig-l"></div><div class="sig-n">'+name+'</div><div class="sig-s">'+label+'</div></div>').join('')
    +'</div>';
}


// ─────────────────────────────────────────────────────────────────
//  REPORT 1 — INDIVIDUAL INTERVIEWER
//  Pages: Cover · Body (flows to as many pages as needed)
//  The body is ONE continuous .pg with overflow:hidden per page.
//  For 15-20 cases the Results page has a compact case table.
//  Extra cases flow naturally — browser handles extra pages.
// ─────────────────────────────────────────────────────────────────
function buildInterviewerReport(interviewer, records, student){
  student = student||{full_name:interviewer, reg_number:'—', email:'—'};
  const n = records.length;
  if(!n) return _doc('No_Records','<p style="padding:1in">No records found for '+interviewer+'.</p>');

  const now     = new Date().toLocaleDateString('en-KE',{year:'numeric',month:'long',day:'numeric'});
  const dates   = records.map(r=>r.interview_date||'').filter(Boolean).sort();
  const period  = dates.length>1?dates[0]+' to '+dates[dates.length-1]:dates[0]||now;
  const locs    = [...new Set(records.map(r=>r.location||'').filter(Boolean))];
  const locStr  = locs.join(', ')||'Nyamache Sub County';
  const fullName= student.full_name||interviewer;
  const regNo   = student.reg_number||'—';
  const email   = student.email||'—';

  // Metrics
  const lat  = _cnt(records,'latrine','Yes');
  const wat  = _cnt(records,'water_treated','Yes');
  const hiv  = _cnt(records,'hiv_heard','Yes');
  const tst  = _cnt(records,'hiv_tested','Yes');
  const dHH  = _cnt(records,'deaths_5yr','Yes');
  const dTot = records.reduce((s,r)=>s+(parseInt(r.deaths_count)||0),0);
  const perm = _cnt(records,'house_type','Permanent');
  const semi = _cnt(records,'house_type','Semi-permanent');
  const tmp  = _cnt(records,'house_type','Temporary');
  const fem  = _cnt(records,'respondent_gender','Female');
  const mal  = _cnt(records,'respondent_gender','Male');
  const aAge = _avg(records,'respondent_age');
  const ills = _ills(records);
  const allF = [];
  records.forEach(r=>_flags(r).forEach(f=>allF.push({r,f})));

  // Recommendations
  const recomList = [];
  if(_pct(lat,n)<80)  recomList.push({l:'critical',t:'Sanitation: Latrine Programme',b:'Coverage '+_pct(lat,n)+'% below 80% national target. The '+(n-lat)+' household'+(n-lat!==1?'s':'')+' without latrines require immediate CLTS follow-up. Escalate to Sub-County Sanitation Officer within 30 days.'});
  if(_pct(wat,n)<80)  recomList.push({l:'critical',t:'Safe Water Intervention',b:'Only '+_pct(wat,n)+'% treat drinking water. Distribute WaterGuard chlorine solution; conduct community demonstrations on safe water storage and handling.'});
  if(_pct(hiv,n)<90)  recomList.push({l:'critical',t:'HIV/AIDS Health Education',b:'Awareness at '+_pct(hiv,n)+'% falls below the UNAIDS 90% target. Deploy Community Health Workers for door-to-door education. Establish mobile VCT outreach in '+locStr+'.'});
  if(_pct(tst,n)<50)  recomList.push({l:'warning',t:'HIV Testing Uptake',b:'Only '+_pct(tst,n)+'% have been tested for HIV. Integrate routine testing into all community health visits and facility-based services.'});
  if(ills.length&&ills[0][1]>n*0.2) recomList.push({l:'warning',t:ills[0][0]+' Prevention',b:ills[0][0]+' affects '+ills[0][1]+' households ('+_pct(ills[0][1],n)+'%). Targeted prevention, early diagnosis and treatment access recommended.'});
  if(dHH>0)           recomList.push({l:'warning',t:'Mortality Follow-Up',b:dHH+' household'+(dHH!==1?'s':'')+' reported '+dTot+' death'+(dTot!==1?'s':'')+' in 5 years. Conduct verbal autopsy to determine cause-specific mortality.'});
  if(!recomList.length) recomList.push({l:'good',t:'Maintain Surveillance',b:'All key indicators are within acceptable ranges. Continue routine community health surveillance and household follow-up visits every 6 months.'});
  if(allF.filter(x=>x.f.includes('FGM')).length) recomList.push({l:'critical',t:'FGM Case Referral',b:'FGM reported in '+allF.filter(x=>x.f.includes('FGM')).length+' household'+(allF.filter(x=>x.f.includes('FGM')).length!==1?'s':'')+'. Refer immediately to GBV response team and Sub-County Anti-FGM Coordinator.'});

  const H = (pg,tot)=>_hdr(fullName+' — Field Report','Interviewer Report · Pg '+pg+'/'+tot, period);
  const F = (pg,tot)=>_ftr(pg,tot,regNo+' · '+fullName+' · GLU Kisumu');

  // ── ESTIMATE TOTAL PAGES ──
  // Page 1: cover
  // Page 2: summary + intro + methods
  // Page 3: results (WASH, HIV, disease, demography)
  // Page 4+: case table (20 rows ≈ 1 page), then discussion/conclusion/recs/sigs
  const casePages = Math.ceil(n/18); // ~18 cases per table page
  const TOTAL = 3 + casePages + 1;   // cover + summary + results + cases + disc/recs

  // ── PAGE 1: COVER ──
  const p1 = _cover(
    'Community Health Situation Analysis',
    'Interviewer Field Report',
    [
      ['Survey Area',    locStr],
      ['Survey Period',  period],
      ['Households',     n+' interviewed'],
      ['Supervised by',  'Nyamache Sub County Hospital, Kisii County'],
    ],
    'OFFICIAL FIELD REPORT',
    // Interviewer ID card — prominent, centre of cover
    '<div class="cov-id">'
    +'<div class="cov-id-name">'+fullName+'</div>'
    +'<div class="cov-id-reg">Reg / Admission No: '+regNo+'</div>'
    +(email!=='—'?'<div class="cov-id-email">'+email+'</div>':'')
    +'<div class="cov-id-badge">Great Lakes University of Kisumu</div>'
    +'</div>'
  );

  // ── PAGE 2: Executive Summary + Intro + Methods ──
  const p2 = _pg(H(2,TOTAL), F(2,TOTAL), 'cols2',
    // LEFT COLUMN
    '<div>'
    +'<h2 class="sec">Executive Summary</h2>'
    +'<p class="bt">This report presents findings from <strong>'+n+' household interview'+(n!==1?'s':'')+
      '</strong> conducted by <strong>'+fullName+'</strong> in <strong>'+locStr+
      '</strong> during <strong>'+period+'</strong>. Part of the Community Health Situation Analysis programme at Great Lakes University of Kisumu, Nyamache Sub County Hospital.</p>'
    +'<p class="bt">Key indicators: latrine coverage <strong>'+_pct(lat,n)+'%</strong> · water treatment <strong>'+_pct(wat,n)+'%</strong> · HIV awareness <strong>'+_pct(hiv,n)+'%</strong>. '
      +(ills.length?'Most prevalent illness: <strong>'+ills[0][0]+'</strong> ('+ills[0][1]+' cases, '+_pct(ills[0][1],n)+'%). ':'')
      +(dHH>0?dTot+' death'+(dTot!==1?'s':'')+' reported. ':'')
      +'<strong>'+allF.length+' red flag'+(allF.length!==1?'s':'')+' identified.</strong></p>'
    +'<div class="sr">'
      +_sb(n,'Households','blu')
      +_sb(_pct(lat,n)+'%','Latrine',_pct(lat,n)<60?'red':_pct(lat,n)<80?'amb':'')
      +_sb(_pct(wat,n)+'%','Water',_pct(wat,n)<60?'red':_pct(wat,n)<80?'amb':'')
      +_sb(_pct(hiv,n)+'%','HIV Aware',_pct(hiv,n)<70?'red':_pct(hiv,n)<90?'amb':'')
      +_sb(allF.length,'Red Flags',allF.length?'red':'')
      +_sb(dTot,'Deaths 5yr',dTot?'amb':'')
    +'</div>'
    +'<h2 class="sec">1. Introduction</h2>'
    +'<p class="bt"><strong>'+fullName+'</strong> (Admission No: <strong>'+regNo+'</strong>'+(email!=='—'?' · '+email:'')+') conducted this assessment as a student health worker at Great Lakes University of Kisumu, under faculty supervision in collaboration with Nyamache Sub County Hospital health management team.</p>'
    +'<p class="bt">Survey area: <strong>'+locStr+'</strong>, covering <strong>'+n+' household'+(n!==1?'s':'')+
      '</strong> during <strong>'+period+'</strong>. Objectives: (i) document prevailing health conditions and disease burden; (ii) identify social and environmental health determinants; (iii) assess essential health service coverage; (iv) generate evidence-based recommendations.</p>'
    +'</div>'
    // RIGHT COLUMN
    +'<div>'
    +'<h2 class="sec">2. Methods</h2>'
    +'<p class="bt">Descriptive cross-sectional household survey using a structured 12-section questionnaire covering: Consent, Demography, Housing, Medical History, Maternal &amp; Child Health, Nutrition, HIV/AIDS, Sanitation, Environment &amp; Water, Cultural Practices, Health Problems, and Pests &amp; Vectors.</p>'
    +'<p class="bt">Data captured digitally using the Community Health Survey PWA and synchronised to a secure cloud database. Verbal informed consent obtained from each respondent prior to interview. Respondents were informed of the purpose, their right to withdraw, and confidentiality of their responses.</p>'
    +'<h2 class="sec">Socio-Demographic Profile</h2>'
    +'<div class="sr">'+_sb(n,'Households','blu')+_sb(fem,'Female','blu')+_sb(mal,'Male','blu')+_sb(aAge,'Avg Age','blu')+_sb(perm,'Permanent','')+_sb(locs.length,'Locations','blu')+'</div>'
    +'<table class="dt"><thead><tr><th>Housing</th><th class="c">Count</th><th class="c">%</th></tr></thead>'
    +'<tbody>'
    +'<tr><td class="lbl">Permanent</td><td class="c">'+perm+'</td><td class="c">'+_pct(perm,n)+'%</td></tr>'
    +'<tr><td class="lbl">Semi-permanent</td><td class="c">'+semi+'</td><td class="c">'+_pct(semi,n)+'%</td></tr>'
    +'<tr><td class="lbl">Temporary</td><td class="c">'+tmp+'</td><td class="c">'+_pct(tmp,n)+'%</td></tr>'
    +'</tbody></table>'
    +'</div>'
  );

  // ── PAGE 3: Results — WASH + HIV + Disease ──
  const p3 = _pg(H(3,TOTAL), F(3,TOTAL), 'cols2',
    // LEFT: WASH + HIV
    '<div>'
    +'<h2 class="sec">3. Results — WASH Indicators</h2>'
    +_bar('Pit Latrine Coverage', lat, n)
    +_bar('Water Treatment', wat, n)
    +'<table class="dt" style="margin-top:4pt">'
    +'<thead><tr><th>WASH Indicator</th><th class="c">Yes</th><th class="c">No</th><th class="c">%</th><th class="c">Target</th><th class="c">Met</th></tr></thead>'
    +'<tbody>'
    +'<tr><td class="lbl">Pit latrine</td><td class="c">'+lat+'</td><td class="c">'+(n-lat)+'</td><td class="c">'+_pct(lat,n)+'%</td><td class="c">&ge;80%</td><td class="c">'+S(_pct(lat,n),80)+'</td></tr>'
    +'<tr><td class="lbl">Water treatment</td><td class="c">'+wat+'</td><td class="c">'+(n-wat)+'</td><td class="c">'+_pct(wat,n)+'%</td><td class="c">&ge;80%</td><td class="c">'+S(_pct(wat,n),80)+'</td></tr>'
    +'</tbody></table>'
    +'<h2 class="sec">HIV/AIDS Indicators</h2>'
    +_bar('HIV/AIDS Awareness', hiv, n)
    +_bar('Ever Tested for HIV', tst, n)
    +'<table class="dt" style="margin-top:4pt">'
    +'<thead><tr><th>HIV Indicator</th><th class="c">Yes</th><th class="c">No</th><th class="c">%</th><th class="c">Target</th><th class="c">Met</th></tr></thead>'
    +'<tbody>'
    +'<tr><td class="lbl">HIV awareness</td><td class="c">'+hiv+'</td><td class="c">'+(n-hiv)+'</td><td class="c">'+_pct(hiv,n)+'%</td><td class="c">&ge;90%</td><td class="c">'+S(_pct(hiv,n),90)+'</td></tr>'
    +'<tr><td class="lbl">Ever tested</td><td class="c">'+tst+'</td><td class="c">'+(n-tst)+'</td><td class="c">'+_pct(tst,n)+'%</td><td class="c">&ge;95%</td><td class="c">'+S(_pct(tst,n),95)+'</td></tr>'
    +'</tbody></table>'
    +'</div>'
    // RIGHT: Disease + Flags
    +'<div>'
    +'<h2 class="sec">Disease Burden</h2>'
    +(ills.length
      ?'<table class="dt"><thead><tr><th>Illness / Condition</th><th class="c">Cases</th><th class="c">% HHs</th><th class="c">Rank</th></tr></thead>'
        +'<tbody>'+ills.map(([k,v],i)=>'<tr><td class="lbl">'+k+'</td><td class="c">'+v+'</td><td class="c">'+_pct(v,n)+'%</td><td class="c">#'+(i+1)+'</td></tr>').join('')+'</tbody></table>'
      :'<p class="note">No illness data recorded across all surveyed households.</p>')
    +(dHH>0?_fl('warning','Mortality Reported',dHH+' household'+(dHH!==1?'s':'')+' reported '+dTot+' death'+(dTot!==1?'s':'')+' in past 5 years. Verbal autopsy investigation recommended.'):'')
    +'<h2 class="sec">Red Flags Identified</h2>'
    +(allF.length
      ?allF.slice(0,10).map(({r,f})=>'<div class="fc"><div class="ft">&#9888; '+f+'</div>'
          +'<div class="fb">'+(r.location||'?')+' &middot; '+(r.interview_date||'?')+'</div></div>').join('')
        +(allF.length>10?'<p class="note">+' +(allF.length-10)+' more flags — see full case table.</p>':'')
      :_fl('good','No Critical Red Flags','No critical issues identified across all surveyed households.'))
    +'</div>'
  );

  // ── CASE TABLE PAGES: one page per ~18 records ──
  const casePageArr = [];
  const chunkSize = 18;
  for(let ci=0; ci<records.length; ci+=chunkSize){
    const chunk = records.slice(ci, ci+chunkSize);
    const pgNum = 4 + Math.floor(ci/chunkSize);
    const rows = chunk.map((rec,i)=>{
      const f=_flags(rec);
      return '<tr>'
        +'<td class="c lbl">'+(ci+i+1)+'</td>'
        +'<td>'+(rec.interview_date||'—')+'</td>'
        +'<td>'+(rec.location||'—')+'</td>'
        +'<td class="c">'+(rec.respondent_age||'?')+'/'+(rec.respondent_gender||'?').charAt(0)+'</td>'
        +'<td>'+(rec.house_type||'—')+'</td>'
        +'<td class="c" style="color:'+(rec.latrine==='Yes'?'#1a5c35':'#c0392b')+';font-weight:700">'+(rec.latrine==='Yes'?'Y':'N')+'</td>'
        +'<td class="c" style="color:'+(rec.water_treated==='Yes'?'#1a5c35':'#c0392b')+';font-weight:700">'+(rec.water_treated==='Yes'?'Y':'N')+'</td>'
        +'<td class="c" style="color:'+(rec.hiv_heard==='Yes'?'#1a5c35':'#c0392b')+';font-weight:700">'+(rec.hiv_heard==='Yes'?'Y':'N')+'</td>'
        +'<td style="font-size:6pt">'+(rec.illnesses||'None')+'</td>'
        +'<td class="c" style="color:'+(f.length?'#c0392b':'#1a5c35')+';font-weight:700">'+(f.length||'&#10003;')+'</td>'
        +'</tr>';
    }).join('');
    const isFirst = ci===0;
    casePageArr.push(_pg(H(pgNum,TOTAL), F(pgNum,TOTAL), '',
      (isFirst?'<h2 class="sec">4. All Interviews — Case Summary Table</h2><p class="note">Y=Yes, N=No for Latrine / Water Treated / HIV Aware. Flags = number of critical issues per household. Cases '+(ci+1)+'–'+(Math.min(ci+chunkSize,n))+' of '+n+'.</p>':'<p class="note" style="margin-top:0">Cases '+(ci+1)+'–'+(Math.min(ci+chunkSize,n))+' of '+n+' (continued)</p>')
      +'<table class="dt"><thead><tr>'
      +'<th class="c">#</th><th>Date</th><th>Location</th><th class="c">Age/Sex</th>'
      +'<th>House Type</th><th class="c">Lat</th><th class="c">Water</th><th class="c">HIV</th>'
      +'<th>Illnesses Reported</th><th class="c">Flags</th>'
      +'</tr></thead><tbody>'+rows+'</tbody></table>'
    ));
  }

  // ── LAST PAGE: Discussion + Conclusion + Recommendations + Signatures ──
  const lastPg = TOTAL;
  const pLast = _pg(H(lastPg,TOTAL), F(lastPg,TOTAL), 'cols2',
    '<div>'
    +'<h2 class="sec">5. Discussion</h2>'
    +'<p class="bt">'+(_pct(lat,n)<80
      ?'Latrine coverage of '+_pct(lat,n)+'% falls '+(80-_pct(lat,n))+'pts below the 80% national target. Open defecation in '+(n-lat)+' household'+(n-lat!==1?'s':'')+' creates direct risk of faecal-oral disease transmission, particularly for children under five.'
      :'Latrine coverage of '+_pct(lat,n)+'% meets the national target — a commendable achievement. Efforts should be maintained to sustain and improve this coverage.')+'</p>'
    +'<p class="bt">'+(_pct(wat,n)<80
      ?'Water treatment at '+_pct(wat,n)+'% is below the recommended threshold. Distribution of point-of-use treatment products (WaterGuard) and hygiene promotion are urgently required.'
      :'Water treatment at '+_pct(wat,n)+'% is satisfactory, indicating community uptake of safe water practices.')+'</p>'
    +'<p class="bt">'+(_pct(hiv,n)<90
      ?'HIV awareness at '+_pct(hiv,n)+'% falls below the UNAIDS 90% target. The '+(n-hiv)+' respondent'+(n-hiv!==1?'s':'')+' unaware of HIV/AIDS are a vulnerable population requiring immediate outreach.'
      :'HIV awareness at '+_pct(hiv,n)+'% meets the benchmark. Focus should shift to ensuring 95% testing coverage.')+'</p>'
    +(ills.length?'<p class="bt">'+ills[0][0]+' is the most prevalent illness ('+ills[0][1]+' cases, '+_pct(ills[0][1],n)+'%), consistent with environmental and behavioural risk factors identified in this survey.</p>':'')
    +'<h2 class="sec">6. Conclusion</h2>'
    +'<p class="bt">This assessment by <strong>'+fullName+'</strong> ('+regNo+') provides systematic evidence on '+n+' household'+(n!==1?'s':'')+' in '+locStr+'. '
      +(_pct(lat,n)<60||_pct(wat,n)<60?'Significant health coverage gaps require urgent intervention.':'Key indicators are within acceptable ranges with targeted areas for improvement.')
      +(allF.length?' '+allF.length+' red flag'+(allF.length!==1?'s':'')+' identified, each requiring documented follow-up.':'')+'</p>'
    +'<p class="bt">Submitted to the course coordinator and Nyamache Sub County Hospital health management team for review, action planning, and integration into the sub-county health planning cycle.</p>'
    +'</div>'
    +'<div>'
    +'<h2 class="sec">7. Recommendations</h2>'
    +recomList.map(r=>_fl(r.l,r.t,r.b)).join('')
    +'</div>'
  );

  // Declaration + signatures — appended to last page's content
  // Rebuild last page with declaration below the two columns
  const pLastFull = '<div class="pg">'
    +H(lastPg,TOTAL)
    +'<div class="pg-body cols2">'
    +'<div>'
    +'<h2 class="sec">5. Discussion</h2>'
    +'<p class="bt">'+(_pct(lat,n)<80
      ?'Latrine coverage of '+_pct(lat,n)+'% falls '+(80-_pct(lat,n))+'pts below the 80% national target. Open defecation in '+(n-lat)+' household'+(n-lat!==1?'s':'')+' creates direct faecal-oral disease transmission risk.'
      :'Latrine coverage of '+_pct(lat,n)+'% meets the national target — commendable. Sustain through continued community engagement.')+'</p>'
    +'<p class="bt">'+(_pct(wat,n)<80
      ?'Water treatment at '+_pct(wat,n)+'% requires urgent WaterGuard distribution and hygiene promotion.'
      :'Water treatment at '+_pct(wat,n)+'% is satisfactory.')+'</p>'
    +'<p class="bt">'+(_pct(hiv,n)<90
      ?'HIV awareness at '+_pct(hiv,n)+'% below UNAIDS 90% target. '+(n-hiv)+' respondent'+(n-hiv!==1?'s':'')+' unaware — immediate outreach required.'
      :'HIV awareness at '+_pct(hiv,n)+'% meets the benchmark.')+'</p>'
    +(ills.length?'<p class="bt">'+ills[0][0]+' is most prevalent ('+ills[0][1]+' cases, '+_pct(ills[0][1],n)+'%).</p>':'')
    +'<h2 class="sec">6. Conclusion</h2>'
    +'<p class="bt">Systematic evidence on '+n+' household'+(n!==1?'s':'')+' in '+locStr+'. '
      +(_pct(lat,n)<60||_pct(wat,n)<60?'Significant gaps require urgent intervention.':'Acceptable indicators with targeted areas for improvement.')
      +(allF.length?' '+allF.length+' red flag'+(allF.length!==1?'s':'')+' requiring documented follow-up.':'')
      +' Submitted to the course coordinator and Nyamache Sub County Hospital for review and action planning.</p>'
    +'</div>'
    +'<div><h2 class="sec">7. Recommendations</h2>'
    +recomList.map(rc=>_fl(rc.l,rc.t,rc.b)).join('')
    +'</div>'
    +'</div>'
    +'<div style="padding:0 0.7in">'
    +'<h2 class="sec">Declaration &amp; Signatures</h2>'
    +'<p class="bt">I, <strong>'+fullName+'</strong> (Admission No: '+regNo+'), declare that data in this report was collected personally, accurately, and in accordance with the ethical guidelines of Great Lakes University of Kisumu. All respondents provided verbal informed consent.</p>'
    +_sigs([
      [fullName, regNo+(email!=='—'?' · '+email:'')+' · Student, GLU Kisumu'],
      ['Course Supervisor','Faculty · Community Health · GLU Kisumu'],
      ['Sub-County Health Officer','Nyamache Sub County Hospital, Kisii County'],
    ])
    +'<p class="note" style="margin-top:6pt;text-align:center">Generated '+now+' · Community Health Survey System v2.0 · Great Lakes University of Kisumu · © 2026 HazzinBR</p>'
    +'</div>'
    +F(lastPg,TOTAL)
    +'</div>';

  return _doc('Report_'+fullName.replace(/\s+/g,'_'), p1+p2+p3+casePageArr.join('')+pLastFull);
}


// ─────────────────────────────────────────────────────────────────
//  REPORT 2 — CLASS GROUP REPORT
//  15 interviewers × 20 cases = 300 rows
//  Approach: summary pages first, then a per-interviewer section
//  with a compact one-line-per-case table for each interviewer.
// ─────────────────────────────────────────────────────────────────
function buildGroupReport(records, students){
  students = students||{};
  const n  = records.length;
  if(!n) return _doc('Group_Report','<p style="padding:1in">No records loaded.</p>');

  const now    = new Date().toLocaleDateString('en-KE',{year:'numeric',month:'long',day:'numeric'});
  const ivs    = [...new Set(records.map(r=>r.interviewer||'Unknown'))].sort();
  const dates  = records.map(r=>r.interview_date||'').filter(Boolean).sort();
  const period = dates.length>1?dates[0]+' to '+dates[dates.length-1]:dates[0]||now;
  const locs   = [...new Set(records.map(r=>r.location||'').filter(Boolean))];
  const locStr = locs.join(', ')||'Nyamache Sub County';

  const lat  = _cnt(records,'latrine','Yes');
  const wat  = _cnt(records,'water_treated','Yes');
  const hiv  = _cnt(records,'hiv_heard','Yes');
  const tst  = _cnt(records,'hiv_tested','Yes');
  const dHH  = _cnt(records,'deaths_5yr','Yes');
  const dTot = records.reduce((s,r)=>s+(parseInt(r.deaths_count)||0),0);
  const perm = _cnt(records,'house_type','Permanent');
  const fem  = _cnt(records,'respondent_gender','Female');
  const mal  = _cnt(records,'respondent_gender','Male');
  const ills = _ills(records);
  const allF = records.reduce((a,r)=>a+_flags(r).length,0);

  const H=(pg,tot)=>_hdr('Class Group Report — All Interviewers','Group Report · Pg '+pg+'/'+tot,period);
  const F=(pg,tot)=>_ftr(pg,tot,ivs.length+' Interviewers · '+n+' Total Records');

  // Per-interviewer summary rows (one row per interviewer for comparison table)
  const ivSummaryRows = ivs.map(iv=>{
    const recs=records.filter(r=>r.interviewer===iv);
    const m=recs.length;
    const st=students[iv]||{};
    const lp=_pct(_cnt(recs,'latrine','Yes'),m);
    const wp=_pct(_cnt(recs,'water_treated','Yes'),m);
    const hp=_pct(_cnt(recs,'hiv_heard','Yes'),m);
    const tp=_pct(_cnt(recs,'hiv_tested','Yes'),m);
    const fl=recs.reduce((a,r)=>a+_flags(r).length,0);
    const top=(()=>{const t=_ills(recs);return t[0]?t[0][0]:'—';})();
    return '<tr>'
      +'<td class="lbl">'+iv+'<br><span style="font-size:5.5pt;color:#888;font-weight:400">'+(st.reg_number||'—')+'</span></td>'
      +'<td class="c">'+m+'</td>'
      +'<td class="c" style="color:'+(lp>=80?'#1a5c35':'#c0392b')+';font-weight:700">'+lp+'%</td>'
      +'<td class="c" style="color:'+(wp>=80?'#1a5c35':'#c0392b')+';font-weight:700">'+wp+'%</td>'
      +'<td class="c" style="color:'+(hp>=90?'#1a5c35':'#c0392b')+';font-weight:700">'+hp+'%</td>'
      +'<td class="c" style="color:'+(tp>=50?'#1a5c35':'#e67e22')+';font-weight:700">'+tp+'%</td>'
      +'<td class="c" style="color:'+(fl>0?'#c0392b':'#1a5c35')+';font-weight:700">'+fl+'</td>'
      +'<td style="font-size:6pt">'+top+'</td>'
      +'</tr>';
  }).join('');

  const grecs=[];
  if(_pct(lat,n)<80)  grecs.push({l:'critical',t:'Priority 1: Latrine Programme',b:'Class-wide latrine coverage '+_pct(lat,n)+'% below 80% national target. '+(n-lat)+' households require immediate CLTS follow-up. Formally notify Sub-County Sanitation Officer.'});
  if(_pct(wat,n)<80)  grecs.push({l:'critical',t:'Priority 2: Safe Water Campaign',b:'Water treatment at '+_pct(wat,n)+'% is below threshold. Mass WaterGuard distribution and community hygiene demonstrations required immediately.'});
  if(_pct(hiv,n)<90)  grecs.push({l:'critical',t:'Priority 3: HIV/AIDS Outreach',b:'Awareness at '+_pct(hiv,n)+'% falls below UNAIDS 90% benchmark. Structured community health education with mobile VCT services is urgently required.'});
  if(ills.length&&ills[0][1]>n*0.15) grecs.push({l:'warning',t:'Disease: '+ills[0][0],b:ills[0][0]+' is most prevalent class-wide ('+ills[0][1]+' cases, '+_pct(ills[0][1],n)+'%). Targeted prevention, early treatment and community education recommended.'});
  if(dHH>n*0.1) grecs.push({l:'warning',t:'Mortality Investigation',b:dHH+' households ('+_pct(dHH,n)+'%) reported '+dTot+' deaths in 5 years. A verbal autopsy programme should be initiated.'});
  grecs.push({l:'good',t:'Scheduled Follow-Up',b:'All red-flag households to receive a follow-up visit within 30 days. Full repeat survey in 6 months to measure progress on key indicators.'});

  // Estimate total pages: cover + 3 summary pages + per-IV detail pages
  // Each IV gets ~20 cases = ~1 page, but we pack 2 IVs per page if <12 cases each
  let ivDetailPages = 0;
  ivs.forEach(iv=>{
    const m = records.filter(r=>r.interviewer===iv).length;
    ivDetailPages += Math.ceil(m/22); // ~22 compact rows per page
  });
  const TOTAL = 1 + 3 + ivDetailPages; // cover + 3 summary + detail

  // ── PAGE 1: Cover ──
  const p1 = _cover(
    'Community Health Situation Analysis',
    'Class Aggregated Group Report',
    [
      ['Institution',    'Great Lakes University of Kisumu'],
      ['Supervised at',  'Nyamache Sub County Hospital, Kisii County'],
      ['Survey Area',    locStr],
      ['Survey Period',  period],
      ['Total Households', n+''],
      ['No. Interviewers', ivs.length+''],
    ],
    'OFFICIAL CLASS GROUP REPORT',
    // Interviewers list card
    '<div class="cov-id" style="margin-bottom:8pt">'
    +'<div style="color:rgba(255,255,255,.6);font-size:5.5pt;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:5pt">Student Interviewers</div>'
    +ivs.map(iv=>{
      const st=students[iv]||{};
      return '<div style="display:flex;justify-content:space-between;align-items:center;padding:2.5pt 0;border-bottom:1px solid rgba(255,255,255,.12)">'
        +'<div style="color:#fff;font-size:7pt;font-weight:700">'+iv+'</div>'
        +'<div style="color:rgba(255,255,255,.6);font-size:6pt">'+(st.reg_number||'—')+'</div>'
        +'</div>';
    }).join('')
    +'<div class="cov-id-badge" style="margin-top:6pt">'+ivs.length+' Interviewers &middot; '+n+' Household Records</div>'
    +'</div>'
  );

  // ── PAGE 2: Summary + Methods + Overall Indicators ──
  const p2 = _pg(H(2,TOTAL), F(2,TOTAL), 'cols2',
    '<div>'
    +'<h2 class="sec">Executive Summary</h2>'
    +'<p class="bt">Aggregated findings from <strong>'+n+' household interviews</strong> conducted by <strong>'+ivs.length+' student interviewer'+(ivs.length!==1?'s':'')+
      '</strong> ('+ivs.join(', ')+') across <strong>'+locStr+'</strong> during <strong>'+period+'</strong>. Part of the Community Health Situation Analysis programme at Great Lakes University of Kisumu, Nyamache Sub County Hospital.</p>'
    +'<p class="bt">Class-level indicators: latrine <strong>'+_pct(lat,n)+'%</strong> · water treatment <strong>'+_pct(wat,n)+'%</strong> · HIV awareness <strong>'+_pct(hiv,n)+'%</strong>'
      +(ills.length?' · Leading illness: <strong>'+ills[0][0]+'</strong>':'')
      +'. <strong>'+allF+' red flag'+(allF!==1?'s':'')+' identified</strong> across all interviews.</p>'
    +'<div class="sr">'
      +_sb(n,'Total HHs','blu')
      +_sb(ivs.length,'Interviewers','blu')
      +_sb(_pct(lat,n)+'%','Latrine',_pct(lat,n)<60?'red':_pct(lat,n)<80?'amb':'')
      +_sb(_pct(wat,n)+'%','Water',_pct(wat,n)<60?'red':_pct(wat,n)<80?'amb':'')
      +_sb(_pct(hiv,n)+'%','HIV Aware',_pct(hiv,n)<70?'red':_pct(hiv,n)<90?'amb':'')
      +_sb(allF,'Red Flags',allF>0?'red':'')
    +'</div>'
    +'<h2 class="sec">1. Introduction &amp; Methods</h2>'
    +'<p class="bt">This group report presents aggregated findings of the community health situation analysis practical exercise conducted by students of Great Lakes University of Kisumu in partnership with Nyamache Sub County Hospital, Kisii County. Aligned with Kenya Health Policy 2014–2030 and SDG Goal 3: Good Health and Well-Being.</p>'
    +'<p class="bt">Descriptive cross-sectional study using a structured 12-section questionnaire administered face-to-face to consenting adult household representatives. Data captured via the Community Health Survey PWA and synchronised to a secure cloud database.</p>'
    +'</div>'
    +'<div>'
    +'<h2 class="sec">2. Key Indicators</h2>'
    +_bar('Pit Latrine Coverage', lat, n)
    +_bar('Water Treatment', wat, n)
    +_bar('HIV Awareness', hiv, n)
    +_bar('HIV Testing', tst, n)
    +'<table class="dt" style="margin-top:4pt">'
    +'<thead><tr><th>Indicator</th><th class="c">Yes</th><th class="c">No</th><th class="c">%</th><th class="c">Target</th><th class="c">Met</th></tr></thead>'
    +'<tbody>'
    +'<tr><td class="lbl">Pit latrine</td><td class="c">'+lat+'</td><td class="c">'+(n-lat)+'</td><td class="c">'+_pct(lat,n)+'%</td><td class="c">&ge;80%</td><td class="c">'+S(_pct(lat,n),80)+'</td></tr>'
    +'<tr><td class="lbl">Water treatment</td><td class="c">'+wat+'</td><td class="c">'+(n-wat)+'</td><td class="c">'+_pct(wat,n)+'%</td><td class="c">&ge;80%</td><td class="c">'+S(_pct(wat,n),80)+'</td></tr>'
    +'<tr><td class="lbl">HIV awareness</td><td class="c">'+hiv+'</td><td class="c">'+(n-hiv)+'</td><td class="c">'+_pct(hiv,n)+'%</td><td class="c">&ge;90%</td><td class="c">'+S(_pct(hiv,n),90)+'</td></tr>'
    +'<tr><td class="lbl">HIV testing</td><td class="c">'+tst+'</td><td class="c">'+(n-tst)+'</td><td class="c">'+_pct(tst,n)+'%</td><td class="c">&ge;95%</td><td class="c">'+S(_pct(tst,n),95)+'</td></tr>'
    +'<tr><td class="lbl">Permanent housing</td><td class="c">'+perm+'</td><td class="c">'+(n-perm)+'</td><td class="c">'+_pct(perm,n)+'%</td><td class="c">&ge;50%</td><td class="c">'+S(_pct(perm,n),50)+'</td></tr>'
    +'</tbody></table>'
    +(ills.length?'<h2 class="sec">Disease Burden</h2>'
      +'<table class="dt"><thead><tr><th>Illness</th><th class="c">Cases</th><th class="c">% HHs</th></tr></thead>'
      +'<tbody>'+ills.slice(0,6).map(([k,v])=>'<tr><td class="lbl">'+k+'</td><td class="c">'+v+'</td><td class="c">'+_pct(v,n)+'%</td></tr>').join('')+'</tbody></table>':'')
    +(dHH>0?_fl('warning','Mortality: '+dTot+' deaths',dHH+' HHs ('+_pct(dHH,n)+'%) reported '+dTot+' deaths in 5 years. Verbal autopsy investigation recommended.'):'')
    +'</div>'
  );

  // ── PAGE 3: Per-Interviewer Comparison + Discussion + Conclusion ──
  const p3 = _pg(H(3,TOTAL), F(3,TOTAL), '',
    '<h2 class="sec">3. Per-Interviewer Comparison</h2>'
    +'<p class="note">Green = at/above target. Red = below target. Latrine &amp; Water: &ge;80%. HIV Aware: &ge;90%.</p>'
    +'<table class="dt">'
    +'<thead><tr><th>Interviewer &amp; Reg No.</th><th class="c">HHs</th><th class="c">Latrine%</th><th class="c">Water%</th><th class="c">HIV Aware%</th><th class="c">Tested%</th><th class="c">Flags</th><th>Top Illness</th></tr></thead>'
    +'<tbody>'+ivSummaryRows+'</tbody>'
    +'<tfoot><tr>'
    +'<td class="lbl">CLASS TOTAL / AVERAGE</td>'
    +'<td class="c">'+n+'</td>'
    +'<td class="c" style="color:'+(_pct(lat,n)>=80?'#1a5c35':'#c0392b')+';font-weight:700">'+_pct(lat,n)+'%</td>'
    +'<td class="c" style="color:'+(_pct(wat,n)>=80?'#1a5c35':'#c0392b')+';font-weight:700">'+_pct(wat,n)+'%</td>'
    +'<td class="c" style="color:'+(_pct(hiv,n)>=90?'#1a5c35':'#c0392b')+';font-weight:700">'+_pct(hiv,n)+'%</td>'
    +'<td class="c" style="color:'+(_pct(tst,n)>=50?'#1a5c35':'#e67e22')+';font-weight:700">'+_pct(tst,n)+'%</td>'
    +'<td class="c" style="color:'+(allF>0?'#c0392b':'#1a5c35')+';font-weight:700">'+allF+'</td>'
    +'<td class="lbl">'+(ills[0]?ills[0][0]:'—')+'</td>'
    +'</tr></tfoot></table>'
    +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:10pt;margin-top:4pt">'
    +'<div>'
    +'<h2 class="sec">4. Discussion</h2>'
    +'<p class="bt">'+(_pct(lat,n)<80
      ?'Class-wide latrine coverage of '+_pct(lat,n)+'% is '+(80-_pct(lat,n))+'pts below the 80% national target — the most critical gap identified. Open defecation in '+(n-lat)+' households creates faecal-oral disease risk.'
      :'Latrine coverage of '+_pct(lat,n)+'% meets the national target — a positive class-wide achievement.')+'</p>'
    +'<p class="bt">'+(_pct(wat,n)<80
      ?'Water treatment at '+_pct(wat,n)+'% is below threshold — high waterborne disease risk across unprotected households. Priority intervention required.'
      :'Water treatment at '+_pct(wat,n)+'% is satisfactory.')+'</p>'
    +'<p class="bt">Inter-interviewer variation reflects genuine community-level heterogeneity. Areas with lower indicator scores should receive priority intervention.</p>'
    +'<h2 class="sec">5. Conclusion</h2>'
    +'<p class="bt">This class-wide assessment provides systematic evidence on household health in Nyamache Sub County. Findings confirm preventable health risks amenable to targeted interventions. Submitted to the course coordinator, Nyamache Sub County Hospital and Kisii County Department of Health for review and action planning.</p>'
    +'</div>'
    +'<div>'
    +'<h2 class="sec">6. Recommendations</h2>'
    +grecs.map(rc=>_fl(rc.l,rc.t,rc.b)).join('')
    +'</div>'
    +'</div>'
  );

  // ── PAGE 4+: Per-Interviewer Detail Sections ──
  // Each interviewer gets their own section with case table
  let pgNum = 4;
  const detailPages = [];

  ivs.forEach(iv=>{
    const recs = records.filter(r=>r.interviewer===iv);
    const m    = recs.length;
    const st   = students[iv]||{};
    const chunks = [];
    const chunkSz = 22; // compact rows
    for(let ci=0; ci<recs.length; ci+=chunkSz){
      chunks.push(recs.slice(ci,ci+chunkSz));
    }

    chunks.forEach((chunk,ci)=>{
      const isFirst = ci===0;
      const ivLat  = _cnt(recs,'latrine','Yes');
      const ivWat  = _cnt(recs,'water_treated','Yes');
      const ivHiv  = _cnt(recs,'hiv_heard','Yes');
      const ivFlags= recs.reduce((a,r)=>a+_flags(r).length,0);
      const ivIll  = _ills(recs);

      const rows = chunk.map((rec,i)=>{
        const f=_flags(rec);
        return '<tr>'
          +'<td class="c lbl">'+(ci*chunkSz+i+1)+'</td>'
          +'<td>'+(rec.interview_date||'—')+'</td>'
          +'<td>'+(rec.location||'—')+'</td>'
          +'<td class="c">'+(rec.respondent_age||'?')+'/'+(rec.respondent_gender||'?').charAt(0)+'</td>'
          +'<td>'+(rec.house_type||'—')+'</td>'
          +'<td class="c" style="color:'+(rec.latrine==='Yes'?'#1a5c35':'#c0392b')+';font-weight:700">'+(rec.latrine==='Yes'?'Y':'N')+'</td>'
          +'<td class="c" style="color:'+(rec.water_treated==='Yes'?'#1a5c35':'#c0392b')+';font-weight:700">'+(rec.water_treated==='Yes'?'Y':'N')+'</td>'
          +'<td class="c" style="color:'+(rec.hiv_heard==='Yes'?'#1a5c35':'#c0392b')+';font-weight:700">'+(rec.hiv_heard==='Yes'?'Y':'N')+'</td>'
          +'<td style="font-size:5.5pt">'+(rec.illnesses||'None')+'</td>'
          +'<td class="c" style="color:'+(f.length?'#c0392b':'#1a5c35')+';font-weight:700">'+(f.length||'&#10003;')+'</td>'
          +'</tr>';
      }).join('');

      detailPages.push(_pg(H(pgNum,TOTAL),F(pgNum,TOTAL),'',
        (isFirst
          ? '<div style="display:flex;justify-content:space-between;align-items:center;padding:0 0 4pt;border-bottom:2px solid #1a5c35;margin-bottom:5pt">'
            +'<div><div style="font-size:8.5pt;font-weight:800;color:#0f1f18">'+iv+'</div>'
            +'<div style="font-size:6pt;color:#1a5c35;font-weight:700">'+(st.reg_number||'—')+(st.email&&st.email!=='—'?' &middot; '+st.email:'')+'</div></div>'
            +'<div style="display:flex;gap:3pt">'
            +_sb(m,'HHs','blu')
            +_sb(_pct(ivLat,m)+'%','Latrine',_pct(ivLat,m)<80?'red':'')
            +_sb(_pct(ivWat,m)+'%','Water',_pct(ivWat,m)<80?'red':'')
            +_sb(_pct(ivHiv,m)+'%','HIV',_pct(ivHiv,m)<90?'red':'')
            +_sb(ivFlags,'Flags',ivFlags?'red':'')
            +'</div></div>'
            +(ivIll.length?'<p class="note" style="margin-bottom:4pt">Top illness: '+ivIll[0][0]+' ('+ivIll[0][1]+' cases). Cases 1–'+Math.min(chunkSz,m)+' of '+m+'</p>':'<p class="note" style="margin-bottom:4pt">Cases 1–'+Math.min(chunkSz,m)+' of '+m+'</p>')
          : '<p class="note" style="margin-bottom:4pt">'+iv+' ('+( st.reg_number||'—')+') — Cases '+(ci*chunkSz+1)+'–'+Math.min((ci+1)*chunkSz,m)+' of '+m+' (continued)</p>')
        +'<table class="dt"><thead><tr>'
        +'<th class="c">#</th><th>Date</th><th>Location</th><th class="c">Age/Sex</th>'
        +'<th>House</th><th class="c">Lat</th><th class="c">Water</th><th class="c">HIV</th>'
        +'<th>Illnesses</th><th class="c">Flags</th>'
        +'</tr></thead><tbody>'+rows+'</tbody></table>'
      ));
      pgNum++;
    });
  });

  // Final page: signatures
  const pSig = _pg(H(pgNum,TOTAL),F(pgNum,TOTAL),'',
    '<h2 class="sec">Submission &amp; Approval</h2>'
    +'<p class="bt">This report is submitted on behalf of the <strong>Community Health Practical Group</strong>, Great Lakes University of Kisumu. Data was collected by '+ivs.join(', ')+' under faculty supervision and Nyamache Sub County Hospital.</p>'
    +'<table class="dt" style="margin-bottom:8pt">'
    +'<thead><tr><th>Interviewer</th><th>Reg / Admission No.</th><th>Email</th><th>HHs</th></tr></thead>'
    +'<tbody>'+ivs.map(iv=>{
      const st=students[iv]||{};
      return '<tr><td class="lbl">'+iv+'</td><td class="c">'+(st.reg_number||'—')+'</td><td>'+(st.email&&st.email!=='—'?st.email:'—')+'</td><td class="c">'+records.filter(r=>r.interviewer===iv).length+'</td></tr>';
    }).join('')+'</tbody></table>'
    +_sigs([
      ['Group Leader / Coordinator','Community Health Practical Group · GLU Kisumu'],
      ['Course Coordinator','Faculty · Community Health · GLU Kisumu'],
      ['Sub-County Health Officer','Nyamache Sub County Hospital, Kisii County'],
    ])
    +'<p class="note" style="margin-top:8pt;text-align:center">Generated '+now+' · Community Health Survey System v2.0 · Great Lakes University of Kisumu · © 2026 HazzinBR</p>'
  );

  return _doc('Group_Report_'+now.replace(/\s+/g,'_'), p1+p2+p3+detailPages.join('')+pSig);
}


// ─────────────────────────────────────────────────────────────────
//  ADMIN ENTRY POINTS
// ─────────────────────────────────────────────────────────────────
async function openInterviewerReport(interviewer){
  if(typeof _admRecs==='undefined'||!_admRecs.length){showToast('No records — tap Refresh',true);return;}
  const recs=_admRecs.filter(r=>r.interviewer===interviewer);
  if(!recs.length){showToast('No records for '+interviewer,true);return;}
  showToast('Building report…');
  const student=await _getStudentDetails(interviewer);
  const html=buildInterviewerReport(interviewer,recs,student);
  _openReportFrame(html,'📑 '+interviewer+' — Report');
}

function openAllInterviewerReports(){
  if(typeof _admRecs==='undefined'||!_admRecs.length){showToast('No records — tap Refresh',true);return;}
  const ivNames=[...new Set(_admRecs.map(r=>r.interviewer||'Unknown'))].filter(Boolean).sort();
  if(ivNames.length===1){openInterviewerReport(ivNames[0]);return;}

  var ex=document.getElementById('rpt-menu');if(ex)ex.remove();
  var menu=document.createElement('div');
  menu.id='rpt-menu';
  menu.style.cssText='position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,.6);display:flex;align-items:flex-end;justify-content:center;';
  var btns='';
  ivNames.forEach(function(iv){
    var cnt=_admRecs.filter(function(r){return r.interviewer===iv;}).length;
    btns+='<button class="rpt-iv-btn" data-iv="'+encodeURIComponent(iv)+'" style="width:100%;padding:11px 14px;background:#f4f8f5;border:1.5px solid #cce0d4;border-radius:10px;font-family:inherit;font-size:.86rem;font-weight:700;color:#1a5c35;cursor:pointer;text-align:left;display:flex;justify-content:space-between;align-items:center">📑 '+iv+'<span style="font-size:.68rem;font-weight:400;color:#6b8a74">'+cnt+' record'+(cnt!==1?'s':'')+'</span></button>';
  });
  menu.innerHTML='<div style="background:#fff;width:100%;max-width:480px;border-radius:20px 20px 0 0;padding:20px 16px calc(20px + env(safe-area-inset-bottom))">'
    +'<div style="font-weight:800;font-size:1rem;color:#1a5c35;margin-bottom:3px">📑 Select Report</div>'
    +'<div style="font-size:.72rem;color:#6b8a74;margin-bottom:13px">Individual interviewer or full class group report</div>'
    +'<div style="display:flex;flex-direction:column;gap:7px">'+btns
    +'<button id="rpt-grp" style="width:100%;padding:11px 14px;background:linear-gradient(135deg,#1a5c35,#1a4060);border:none;border-radius:10px;font-family:inherit;font-size:.86rem;font-weight:700;color:#fff;cursor:pointer;display:flex;justify-content:space-between;align-items:center">👥 Class Group Report<span style="font-size:.68rem;opacity:.7">'+_admRecs.length+' records</span></button>'
    +'<button id="rpt-cancel" style="width:100%;padding:10px;background:#f0f0f0;border:none;border-radius:10px;font-family:inherit;font-size:.82rem;cursor:pointer;color:#888">Cancel</button>'
    +'</div></div>';
  document.body.appendChild(menu);
  menu.querySelectorAll('.rpt-iv-btn').forEach(function(btn){
    btn.addEventListener('click',function(){
      menu.remove();
      openInterviewerReport(decodeURIComponent(btn.getAttribute('data-iv')));
    });
  });
  document.getElementById('rpt-grp').addEventListener('click',function(){menu.remove();openGroupReport();});
  document.getElementById('rpt-cancel').addEventListener('click',function(){menu.remove();});
  menu.addEventListener('click',function(e){if(e.target===menu)menu.remove();});
}

async function openGroupReport(){
  if(typeof _admRecs==='undefined'||!_admRecs.length){showToast('No records — tap Refresh',true);return;}
  showToast('Building group report… this may take a moment');
  const ivNames=[...new Set(_admRecs.map(r=>r.interviewer||'Unknown'))].sort();
  const students={};
  for(const iv of ivNames){ students[iv]=await _getStudentDetails(iv); }
  const html=buildGroupReport(_admRecs,students);
  _openReportFrame(html,'👥 Class Group Report');
}

function _openReportFrame(html, title){
  const ov=document.getElementById('report-overlay');
  const fr=document.getElementById('report-frame');
  const ti=document.getElementById('report-title');
  if(!ov||!fr){showToast('Report viewer error',true);return;}
  const doc=fr.contentDocument||fr.contentWindow.document;
  doc.open();doc.write(html);doc.close();
  if(ti)ti.textContent=title;
  // Use showScreen to properly override any inline display:none
  if(typeof showScreen==='function'){
    showScreen('report');
  } else {
    ov.style.display='block';
    ov.classList.add('open');
  }
}

// ─────────────────────────────────────────────────────────────────
//  PRINT — opens report in new tab, browser prints natively as PDF
//  This is the ONLY print/download trigger. No download inside report.
// ─────────────────────────────────────────────────────────────────
function printReport(){
  const fr=document.getElementById('report-frame');
  if(!fr){showToast('No report open',true);return;}
  const ti=document.getElementById('report-title');
  const name=(ti?ti.textContent:'Health-Report').replace(/[^a-zA-Z0-9\s\-]/g,'').trim().replace(/\s+/g,'_')||'Health-Report';
  try{
    const innerDoc=fr.contentDocument||fr.contentWindow.document;
    // Extract the full HTML — CSS is embedded inside already
    const fullHTML='<!DOCTYPE html>'+innerDoc.documentElement.outerHTML;
    // Open in a new tab as a blob — same origin, no cross-frame issues
    const blob=new Blob([fullHTML],{type:'text/html;charset=utf-8'});
    const url=URL.createObjectURL(blob);
    const win=window.open(url,'_blank');
    if(win){
      showToast('Report opened — use browser Print to save as PDF');
      setTimeout(()=>URL.revokeObjectURL(url),120000);
    } else {
      // Popup blocked — trigger download instead
      const a=document.createElement('a');
      a.href=url;
      a.download=name+'_'+new Date().toISOString().split('T')[0]+'.html';
      document.body.appendChild(a);a.click();document.body.removeChild(a);
      setTimeout(()=>URL.revokeObjectURL(url),5000);
      showToast('Downloaded — open file then Print → Save as PDF');
    }
  }catch(e){showToast('Error: '+e.message,true);}
}

function closeReportOverlay(){
  const ov=document.getElementById('report-overlay');
  if(ov){ ov.classList.remove('open'); ov.style.display='none'; }
}
function startNewSurveyFromReport(){ closeReportOverlay(); newRec(); showToast('✓ New survey started'); }
function goHomeFromReport(){ closeReportOverlay(); }

// ─────────────────────────────────────────────────────────────────
//  SURVEY FINISH MODAL REPORTS
// ─────────────────────────────────────────────────────────────────
function openBriefReport(){  closeFinish(); _openReportFrame(buildBriefReport(cRec()), '📋 Brief Report'); }
function openFullReport(){   closeFinish(); _openReportFrame(buildFullReport(),        '📄 Full Report'); }
function openIMRaDReport(){  closeFinish(); _openReportFrame(buildIMRaDReport(cRec()), '📑 IMRaD Report'); }
function exportJSON(){
  closeFinish();
  const rec=cRec();
  const blob=new Blob([JSON.stringify(rec,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;
  a.download='survey_'+(rec.interviewer_name||'record').replace(/\s/g,'_')+'_'+(rec.interview_date||new Date().toISOString().split('T')[0])+'.json';
  document.body.appendChild(a);a.click();document.body.removeChild(a);URL.revokeObjectURL(url);
  showToast('✓ JSON exported');
}


// ── BRIEF / FULL / IMRAD builders ──

function buildBriefReport(r){
  const {flags,concerns}=extractFlags(r);
  const totPeople=(parseInt(r.a_tot_m)||0)+(parseInt(r.a_tot_f)||0);
  const water=[].concat(r.h_wsrc||[]).join(', ')||'None recorded';
  const illness=[].concat(r.c_ill||[]).join(', ')||'None reported';
  const deaths=r.c_deaths==='Yes'?`Yes (${r.c_deaths_n||'?'} deaths in 5 years)`:'None reported';
  const latrine=r.g_latrine==='Yes'?`Yes (${r.g_lat_u||'—'})`:r.g_latrine==='No'?'NO LATRINE':'—';
  const now=new Date().toLocaleDateString('en-KE',{year:'numeric',month:'long',day:'numeric'});
  const flagHTML=flags.length?flags.map(f=>rptFlag('🚨 '+f,'red')).join(''):rptFlag('✅ No critical red flags identified','ok');
  const concernHTML=concerns.length?concerns.map(c=>rptFlag('⚠️ '+c,'amber')).join(''):rptFlag('✅ No significant concerns','ok');

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Brief Health Report</title><meta name="viewport" content="width=device-width,initial-scale=1"><style>${RPT_BASE_CSS}
.body{padding:20px 30px 40px;} .grid2{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
.summary-box{background:linear-gradient(135deg,#f9f7f4,#e8f5ed);border:1px solid #cce0d4;border-radius:12px;padding:14px 16px;margin-bottom:16px;}
.summary-text{font-size:0.85rem;line-height:1.7;color:#1a2b22;} .summary-text b{color:#1e5c38;} .red{color:#c0392b;font-weight:700;}
</style></head><body><div class="page">
${rptHeader('📋','Community Health Brief Report','Great Lakes University · Nyamache Sub County Hospital · '+now)}
${rptMeta([['Interviewer',r.interviewer_name||getUserName()],['Date',r.interview_date||now],['Location',r.interview_location||r.interview_location_custom],['Respondent',(r.a_age||'?')+' yrs, '+(r.a_gender||'?')+', '+(r.a_marital||'?')]])}
<div class="body">
  ${rptSec('📝 Narrative Summary')}
  <div class="summary-box"><div class="summary-text">
    This interview was conducted with a <b>${r.a_age||'?'}-year-old ${r.a_gender||'person'}</b>
    ${r.a_marital?`(${r.a_marital})`:''}${r.a_pos?`, the <b>${r.a_pos}</b> of the household`:''}
    in <b>${r.interview_location||r.interview_location_custom||'the community'}</b>.
    The household has <b>${totPeople} member${totPeople!==1?'s':''}</b> (${r.a_tot_m||0} male, ${r.a_tot_f||0} female).
    They live in a <b>${r.b_type||'?'} house</b> with <b>${r.b_roof||'?'} roofing</b> and <b>${r.b_floor||'?'} floor</b>.
    Primary water source is <b>${water}</b> ${r.h_treat==='Yes'?'(treated before drinking)':r.h_treat==='No'?'<span class="red">(NOT treated — risk)</span>':''}.
    ${r.g_latrine==='Yes'?'The household has a pit latrine.':'<span class="red">There is NO pit latrine.</span>'}
    ${r.f_heard==='No'?'<span class="red">Respondent has never heard of HIV/AIDS.</span>':r.f_tested==='Yes'?'Respondent has been tested for HIV.':'Respondent has NOT been tested for HIV.'}
    ${[].concat(r.c_ill||[]).length>0?`Illnesses reported in past 6 months: <b>${illness}</b>.`:'No illnesses reported in past 6 months.'}
  </div></div>
  ${rptSec('📊 Key Household Data')}
  <div class="grid2">
    ${rptStat('House Type',r.b_type)}${rptStat('Household Size',totPeople+' people')}
    ${rptStat('Bedrooms',r.b_rooms)}${rptStat('Per Bedroom',r.b_proom+' people')}
    ${rptStat('Water Source',water)}${rptStat('Water Treated',r.h_treat)}
    ${rptStat('Pit Latrine',latrine)}${rptStat('Main Fuel',r.b_fuel)}
    ${rptStat('Deaths (5 yrs)',deaths)}${rptStat('HIV Tested',r.f_tested)}
    ${rptStat('Education',r.a_edu)}${rptStat('Occupation',r.a_occ)}
  </div>
  ${rptSec('🚨 Red Flags — Requires Immediate Attention')}${flagHTML}
  ${rptSec('⚠️ Concerns — Follow Up Recommended')}${concernHTML}
  ${rptSec('🏥 Illnesses Reported')}
  ${rptFlag([].concat(r.c_ill||[]).length>0?'⚕️ '+illness:'No illnesses recorded',[].concat(r.c_ill||[]).length>0?'amber':'ok')}
  ${r.c_consult?rptFlag('Consultation sought: '+r.c_consult+(r.c_where?' — at '+r.c_where:''),r.c_consult==='Yes'?'ok':'amber'):''}
  ${['rats','cockroaches','mosquitoes','jiggers','bedbugs'].some(p=>r['k_'+p]==='Present')?rptSec('🐛 Pests Observed')+''+['Rats','Cockroaches','Mosquitoes','Jiggers','Bedbugs','Houseflies','Ticks','Fleas','Tsetse_flies'].filter(p=>r['k_'+p.toLowerCase()]==='Present').map(p=>rptFlag('🐛 '+p.replace('_',' ')+' — present','amber')).join(''):''}
  ${r.k_notes?rptSec('📝 Interviewer Notes')+'<div class="summary-box"><div class="summary-text">'+r.k_notes+'</div></div>':''}
</div>
${rptSig()}${rptPrintBtn()}</div></body></html>`;
}

function buildFullReport(){
  const cards=document.querySelectorAll('.sec-card');
  cards.forEach(c=>c.style.display='block');
  const now=new Date().toLocaleDateString('en-KE',{year:'numeric',month:'long',day:'numeric'});
  const r=cRec();
  const name=r.interviewer_name||getUserName()||'—';
  const loc=r.interview_location||r.interview_location_custom||'—';
  let sectionsHTML='';
  document.querySelectorAll('.sec-card').forEach((card,i)=>{
    const hdr=card.querySelector('.sec-hdr');
    const body=card.querySelector('.sec-body');
    if(!hdr||!body)return;
    const title=hdr.querySelector('.sec-title')?.textContent||'Section '+(i+1);
    const badge=hdr.querySelector('.sec-badge')?.textContent||'';
    const color=hdr.style.background||'linear-gradient(135deg,#1e5c38,#27764a)';
    let rows='';
    body.querySelectorAll('.form-group').forEach(grp=>{
      const lbl=grp.querySelector('.ql')?.textContent?.replace('*','').trim();
      if(!lbl)return;
      const checked=[...grp.querySelectorAll('input:checked,select')].map(el=>{if(el.type==='radio'||el.type==='checkbox')return el.checked?el.value:'';return el.value;}).filter(Boolean).join(', ');
      const text=[...grp.querySelectorAll('input[type=text],input[type=number],input[type=date],textarea')].map(el=>el.value).filter(Boolean).join(' ');
      const val=checked||text;
      if(!val)return;
      rows+=`<tr><td style="padding:7px 12px;color:#666;width:45%;font-size:0.76rem;vertical-align:top;border-bottom:1px solid #f0f0f0">${lbl}</td><td style="padding:7px 12px;font-weight:600;color:#1a2b22;font-size:0.82rem;border-bottom:1px solid #f0f0f0">${val}</td></tr>`;
    });
    if(!rows)return;
    sectionsHTML+=`<div style="margin-bottom:18px;border-radius:10px;overflow:hidden;border:1px solid #e0e0e0"><div style="${color};color:#fff;padding:9px 14px;font-size:0.82rem;font-weight:700;-webkit-print-color-adjust:exact;print-color-adjust:exact"><span style="background:rgba(255,255,255,.2);padding:2px 8px;border-radius:99px;font-size:0.65rem;margin-right:6px;letter-spacing:.5px">${badge}</span>${title}</div><table style="width:100%;border-collapse:collapse"><tbody>${rows}</tbody></table></div>`;
  });
  cards.forEach((c,i)=>c.style.display=i===cur?'block':'none');
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Full Health Survey Report</title><meta name="viewport" content="width=device-width,initial-scale=1"><style>${RPT_BASE_CSS}.body{padding:16px 28px 40px;}</style></head><body><div class="page">
${rptHeader('📄','Full Community Health Survey Report','Great Lakes University · Nyamache Sub County Hospital · '+now,'#1a4f6e','#1e5c38')}
${rptMeta([['Interviewer',name],['Date',r.interview_date||now],['Location',loc],['Respondent',(r.a_age||'?')+' yrs · '+(r.a_gender||'?')+' · '+(r.a_marital||'?')]])}
<div class="body">${sectionsHTML}</div>
${rptSig()}${rptPrintBtn()}</div></body></html>`;
}

function buildIMRaDReport(r){
  const {flags,concerns}=extractFlags(r);
  const now=new Date().toLocaleDateString('en-KE',{year:'numeric',month:'long',day:'numeric'});
  const totPeople=(parseInt(r.a_tot_m)||0)+(parseInt(r.a_tot_f)||0);
  const water=[].concat(r.h_wsrc||[]).join(', ')||'not specified';
  const illnesses=[].concat(r.c_ill||[]);
  const name=r.interviewer_name||getUserName()||'Unknown Interviewer';
  const loc=r.interview_location||r.interview_location_custom||'Nyamache';

  // ── Dynamic discussion: pick most critical finding ──
  let keyFinding='';
  if(flags.includes('No pit latrine — open defecation risk'))
    keyFinding='The absence of a pit latrine is the most critical finding in this household, directly increasing the risk of diarrhoeal disease transmission.';
  else if(r.f_heard==='No')
    keyFinding='The respondent\'s complete lack of awareness of HIV/AIDS highlights a significant health education gap that requires immediate follow-up.';
  else if(r.h_treat==='No')
    keyFinding='The household\'s failure to treat drinking water is the primary concern, presenting an ongoing risk of waterborne disease.';
  else if(illnesses.length>0)
    keyFinding=`Reported illness (${illnesses.join(', ')}) in the past 6 months signals active disease burden in this household requiring clinical follow-up.`;
  else if(flags.length>0)
    keyFinding=flags[0]+' — this was the primary red flag identified during the interview.';
  else
    keyFinding='No critical red flags were identified. This household demonstrates relatively good health indicators for the community setting.';

  // ── Mortality ──
  const deathsText=r.c_deaths==='Yes'?`${r.c_deaths_n||'an unspecified number of'} death(s) in the past 5 years`:'no deaths in the past 5 years';

  // ── Section scores (0–5 scale) ──
  const scores={
    housing: (r.b_type==='Permanent'?2:r.b_type==='Semi-permanent'?1:0)+(r.b_floor==='Cemented'?1:0)+(r.b_light==='Electricity'?1:0)+(r.b_win!=='None'?1:0),
    water:   (r.h_treat==='Yes'?2:0)+([].concat(r.h_wsrc||[]).some(s=>s.includes('Piped')||s.includes('Borehole'))?2:0)+(r.h_wc==='Yes'?1:0),
    sanit:   (r.g_latrine==='Yes'?3:0)+(r.g_lat_u==='Family'?1:0)+(r.g_lat_n>1?1:0),
    hiv:     (r.f_heard==='Yes'?2:0)+(r.f_tested==='Yes'?2:0)+(r.f_protect==='Yes'?1:0),
    nutr:    (r.e_meals>=3?2:r.e_meals>=2?1:0)+(r.e_skip==='No'?2:0)+(r.e_enough==='Yes'?1:0),
  };
  const scoreBar=(val,max=5,col='#1e5c38')=>{
    const pct=Math.round((Math.min(val,max)/max)*100);
    const col2=pct<40?'#c0392b':pct<70?'#f39c12':col;
    return `<div style="display:flex;align-items:center;gap:8px"><div style="flex:1;height:8px;background:#f0f0f0;border-radius:99px;overflow:hidden"><div style="width:${pct}%;height:100%;background:${col2};border-radius:99px"></div></div><span style="font-size:0.7rem;font-weight:700;color:${col2};min-width:28px">${val}/${max}</span></div>`;
  };

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>IMRaD Health Report — ${name}</title><meta name="viewport" content="width=device-width,initial-scale=1">
<style>${RPT_BASE_CSS}
.body{padding:24px 34px 50px;}
h1{font-family:'Merriweather',Georgia,serif;font-size:1.2rem;font-weight:700;color:#0f1f18;line-height:1.35;margin-bottom:8px;}
h2{font-family:'Plus Jakarta Sans',sans-serif;font-size:0.72rem;font-weight:800;text-transform:uppercase;letter-spacing:1.2px;color:#6b8a74;border-bottom:2px solid #e8f5ed;padding-bottom:5px;margin:24px 0 12px;}
h3{font-size:0.85rem;font-weight:700;color:#1a5c35;margin:14px 0 6px;}
p{font-size:0.84rem;line-height:1.75;color:#1a2b22;margin-bottom:10px;}
.abstract-box{background:linear-gradient(135deg,#e8f5ed,#edf4fb);border:1.5px solid #cce0d4;border-radius:12px;padding:16px 20px;margin-bottom:4px;}
.abstract-box p{font-style:italic;font-size:0.82rem;}
.kw{display:inline-block;background:#e8f5ed;color:#1a5c35;border:1px solid #cce0d4;border-radius:99px;padding:2px 10px;font-size:0.68rem;font-weight:600;margin:2px;}
.score-row{display:grid;grid-template-columns:130px 1fr;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid #f5f5f5;}
.score-row:last-child{border-bottom:none;}
.score-lbl{font-size:0.76rem;font-weight:600;color:#1a2b22;}
.data-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:4px;}
.flag-item{padding:8px 12px;border-radius:8px;font-size:0.8rem;margin-bottom:5px;line-height:1.4;}
.flag-red{background:#fdecea;color:#c0392b;border-left:3px solid #c0392b;}
.flag-amber{background:#fff8e1;color:#e65100;border-left:3px solid #f39c12;}
.flag-ok{background:#e8f5ed;color:#1e5c38;border-left:3px solid #4CAF72;}
</style></head><body><div class="page">
${rptHeader('📑','Community Health Situation Analysis — Individual Report','Great Lakes University of Kisumu · Nyamache Sub County Hospital · '+now)}
${rptMeta([['Interviewer',name],['Date',r.interview_date||now],['Location',loc],['Respondent',(r.a_age||'?')+' yrs, '+(r.a_gender||'?')],['Record ID',r._id||'—']])}
<div class="body">

  <!-- TITLE -->
  <h1>Health Situation Analysis: A Household Survey Report from ${loc}, Nyamache Sub County</h1>
  <p style="font-size:.75rem;color:#6b8a74">Submitted by: <strong>${name}</strong> &nbsp;·&nbsp; Great Lakes University of Kisumu &nbsp;·&nbsp; Date: ${r.interview_date||now}</p>
  <div style="margin-bottom:6px">${['Community Health','Nyamache','Sanitation','HIV/AIDS','Housing','Kenya'].map(k=>`<span class="kw">${k}</span>`).join('')}</div>

  <!-- ABSTRACT -->
  <h2>Abstract</h2>
  <div class="abstract-box">
    <p>This report presents findings from a household health situation analysis conducted at <strong>${loc}</strong> under the Great Lakes University community health programme. The interview was carried out with a <strong>${r.a_age||'?'}-year-old ${r.a_gender||'respondent'}</strong>, ${r.a_marital||''}${r.a_pos?', serving as the '+r.a_pos+' of the household':''}. The household comprises <strong>${totPeople} member${totPeople!==1?'s':''}</strong>. Key findings include ${r.g_latrine==='No'?'<strong>absence of a pit latrine</strong>, ':''}${r.h_treat==='No'?'<strong>untreated drinking water</strong>, ':''}${r.f_heard==='No'?'<strong>no awareness of HIV/AIDS</strong>, ':''}${illnesses.length>0?'reported illnesses including <strong>'+illnesses.slice(0,2).join(' and ')+'</strong>, ':''}<strong>${flags.length} red flag${flags.length!==1?'s':''}</strong> and <strong>${concerns.length} concern${concerns.length!==1?'s':''}</strong> were identified. ${keyFinding}</p>
  </div>

  <!-- INTRODUCTION -->
  <h2>1. Introduction</h2>
  <p>This household visit was conducted as part of the Great Lakes University community health situation analysis programme at Nyamache Sub County Hospital, Kisii County. The programme aims to assess the prevailing health conditions, identify risk factors, and generate actionable recommendations for improving community health outcomes in line with Kenya's Health Policy 2014–2030 and the Sustainable Development Goals (SDGs), particularly SDG 3 (Good Health and Well-Being).</p>
  <p>Consent was obtained from the respondent prior to commencing the interview. ${r.consent_given==='Yes'?'The respondent willingly agreed to participate and was informed of their right to withdraw.':'The interview status requires verification.'} The respondent is the <strong>${r.a_pos||'household member'}</strong>, aged <strong>${r.a_age||'?'} years</strong>, ${r.a_gender||''}, ${r.a_marital||''}, with an education level of <strong>${r.a_edu||'not specified'}</strong> and occupation of <strong>${r.a_occ||'not specified'}</strong>.</p>

  <!-- METHODS -->
  <h2>2. Methods</h2>
  <p>A structured household questionnaire was administered face-to-face by the interviewer on <strong>${r.interview_date||now}</strong> at <strong>${loc}</strong>. The tool covers 12 thematic sections: Consent, Demography, Housing, Medical History, Maternal &amp; Child Health, Nutrition, HIV/AIDS, Sanitation, Environment &amp; Water, Cultural Practices, Community Health Problems, and Pests &amp; Vectors. Data was recorded digitally on the Community Health Survey Progressive Web Application (PWA) and synchronised to a secure cloud database. The household was selected through purposive community sampling coordinated by the local sub-county health office.</p>

  <!-- RESULTS -->
  <h2>3. Results</h2>

  <h3>3.1 Household Composition &amp; Demographics</h3>
  <div class="data-grid">
    ${rptStat('Total Members',totPeople+' ('+r.a_tot_m+' M / '+r.a_tot_f+' F)')}
    ${rptStat('House Type',r.b_type)}
    ${rptStat('Roofing',r.b_roof)}
    ${rptStat('Floor Type',r.b_floor)}
    ${rptStat('Bedrooms',r.b_rooms)}
    ${rptStat('Persons/Bedroom',r.b_proom)}
    ${rptStat('Lighting',r.b_light)}
    ${rptStat('Cooking Fuel',r.b_fuel)}
  </div>

  <h3>3.2 Health Indicator Scores</h3>
  <div style="background:#f9f7f4;border-radius:10px;padding:14px 16px;margin-bottom:8px">
    <div class="score-row"><span class="score-lbl">🏠 Housing Quality</span>${scoreBar(scores.housing,5)}</div>
    <div class="score-row"><span class="score-lbl">💧 Water Safety</span>${scoreBar(scores.water,5)}</div>
    <div class="score-row"><span class="score-lbl">🚽 Sanitation</span>${scoreBar(scores.sanit,5)}</div>
    <div class="score-row"><span class="score-lbl">🔴 HIV Awareness</span>${scoreBar(scores.hiv,5)}</div>
    <div class="score-row"><span class="score-lbl">🍽 Nutrition</span>${scoreBar(scores.nutr,5)}</div>
  </div>

  <h3>3.3 Water &amp; Sanitation</h3>
  <div class="data-grid">
    ${rptStat('Water Source',water)}
    ${rptStat('Water Treated',r.h_treat)}
    ${rptStat('Treatment Method',[].concat(r.h_tm||[]).join(', ')||'—')}
    ${rptStat('Pit Latrine',r.g_latrine)}
    ${rptStat('Latrine Ownership',r.g_lat_u||'—')}
    ${rptStat('No. of Latrines',r.g_lat_n||'—')}
  </div>

  <h3>3.4 Illness &amp; Mortality</h3>
  <p>Illnesses reported in the past 6 months: <strong>${illnesses.length>0?illnesses.join(', '):'None reported'}</strong>. Medical consultation was ${r.c_consult==='Yes'?'sought':'NOT sought'}${r.c_where?' at '+r.c_where:''}. The household reported ${deathsText}${r.c_deaths==='Yes'&&r.c_dage?', age group affected: '+r.c_dage:''}${r.c_deaths==='Yes'&&r.c_dcause?', probable cause: '+[].concat(r.c_dcause||[]).join(', '):''}.</p>

  <h3>3.5 HIV/AIDS &amp; Reproductive Health</h3>
  <div class="data-grid">
    ${rptStat('Heard of HIV/AIDS',r.f_heard)}
    ${rptStat('Ever Tested',r.f_tested)}
    ${rptStat('Knows Transmission',r.f_know_t||'—')}
    ${rptStat('Uses Protection',r.f_protect||'—')}
  </div>
  ${r.d_preg?`<p>Maternal health: Pregnancy status recorded as <strong>${r.d_preg}</strong>. ANC visits: <strong>${r.d_anc||'—'}</strong>. Delivery location: <strong>${r.d_del||'—'}</strong>.</p>`:''}

  <h3>3.6 Nutrition Status</h3>
  <div class="data-grid">
    ${rptStat('Meals per Day',r.e_meals||'—')}
    ${rptStat('Skips Meals',r.e_skip||'—')}
    ${rptStat('Food Enough',r.e_enough||'—')}
    ${rptStat('Has Garden',r.e_garden||'—')}
  </div>

  <h3>3.7 Red Flags &amp; Concerns Identified</h3>
  ${flags.length?flags.map(f=>`<div class="flag-item flag-red">🚨 ${f}</div>`).join(''):`<div class="flag-item flag-ok">✅ No critical red flags identified</div>`}
  ${concerns.length?concerns.map(c=>`<div class="flag-item flag-amber">⚠️ ${c}</div>`).join(''):''}

  <!-- DISCUSSION -->
  <h2>4. Discussion</h2>
  <p>${keyFinding}</p>
  <p>The household's overall health situation reflects patterns common to rural sub-Saharan Africa: ${r.b_type==='Temporary'?'substandard housing increases exposure to environmental hazards and vector-borne diseases; ':''}${r.h_treat==='No'?'lack of water treatment is a well-documented driver of diarrhoeal diseases, which remain a leading cause of mortality in children under five in Kenya; ':''}${r.g_latrine==='No'?'open defecation contributes to faecal-oral disease transmission cycles, particularly affecting children; ':''}${illnesses.includes('Malaria')?'malaria remains the leading cause of morbidity in Kisii County and requires targeted vector control; ':''}the data aligns with the Kenya Demographic Health Survey (KDHS) findings for rural Kisii County.</p>
  ${flags.length===0&&concerns.length===0?'<p>This household demonstrates positive health practices. The absence of red flags suggests that targeted health education efforts in this community may be yielding results. However, continued surveillance and routine household visits remain essential.</p>':''}
  ${r.i_circ==='Female'||r.i_circ==='Both'?'<p>Female Genital Mutilation (FGM) was reported. This is a human rights violation associated with serious health complications including haemorrhage, infection, obstetric fistula, and psychological trauma. The case must be handled with sensitivity and referred to the appropriate gender-based violence response team.</p>':''}

  <!-- RECOMMENDATIONS -->
  <h2>5. Recommendations</h2>
  ${r.g_latrine==='No'?'<p><strong>🚽 Sanitation:</strong> This household must be prioritised for latrine construction assistance under the Community-Led Total Sanitation (CLTS) programme. Follow-up within 30 days is recommended.</p>':''}
  ${r.h_treat==='No'?'<p><strong>💧 Water Safety:</strong> Provide household with WaterGuard chlorine solution and a safe storage container. Demonstrate proper water treatment and conduct a follow-up visit to verify uptake.</p>':''}
  ${r.f_heard==='No'?'<p><strong>🔴 HIV/AIDS Education:</strong> This respondent has never heard of HIV/AIDS. Referral to the nearest VCT centre and enrolment in a community health education programme is strongly recommended.</p>':''}
  ${r.f_tested!=='Yes'?'<p><strong>🩺 HIV Testing:</strong> Encourage and facilitate HIV testing at Nyamache Sub County Hospital. Testing is free and confidential.</p>':''}
  ${illnesses.includes('Malaria')?'<p><strong>🦟 Malaria:</strong> Promote consistent use of insecticide-treated bed nets (ITNs). Inspect home for stagnant water sources. Ensure household has access to malaria rapid diagnostic tests (RDTs) at the nearest health facility.</p>':''}
  ${r.e_enough==='No'||r.e_skip==='Yes'?'<p><strong>🍽 Nutrition:</strong> Household is experiencing food insecurity. Refer to the County Nutrition Programme and explore eligibility for the Hunger Safety Net Programme (HSNP).</p>':''}
  ${r.b_type==='Temporary'?'<p><strong>🏠 Housing:</strong> Temporary housing poses ongoing health risks. Link household with county low-cost housing programmes and provide information on locally available durable materials.</p>':''}
  <p><strong>📅 Follow-Up:</strong> A revisit is recommended within <strong>${flags.length>0?'2 weeks':'6 months'}</strong> to assess progress on identified health issues and reinforce health education messages.</p>

</div>
${rptSig()}${rptPrintBtn()}</div></body></html>`;
}
