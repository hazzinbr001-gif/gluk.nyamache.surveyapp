/* ═══════════════════════════════════════════════════════════════════
   Community Health Survey — Official Report System
   Great Lakes University of Kisumu · Nyamache Sub County Hospital
   Letter Size (8.5×11in) · Headers · Footers · Page Numbers
   © 2026 HazzinBR
   ═══════════════════════════════════════════════════════════════════ */

// ─────────────────────────────────────────────────────────────────
//  STUDENT DETAILS LOOKUP
// ─────────────────────────────────────────────────────────────────
async function _getStudentDetails(fullName){
  if(typeof _admStudents!=='undefined'&&Array.isArray(_admStudents)){
    const s=_admStudents.find(st=>st.full_name&&
      st.full_name.toLowerCase()===fullName.toLowerCase());
    if(s)return s;
  }
  try{
    const sess=JSON.parse(localStorage.getItem('chsa_auth')||'null');
    if(sess&&sess.full_name&&sess.full_name.toLowerCase()===fullName.toLowerCase())return sess;
  }catch(e){}
  try{
    const res=await fetch(
      SUPABASE_URL+'/rest/v1/chsa_students?full_name=eq.'+encodeURIComponent(fullName)+'&select=reg_number,full_name,email',
      {headers:{apikey:SUPABASE_KEY,'Authorization':'Bearer '+SUPABASE_KEY}}
    );
    if(res.ok){const d=await res.json();if(d&&d.length)return d[0];}
  }catch(e){}
  return {full_name:fullName,reg_number:'—',email:'—'};
}

// ─────────────────────────────────────────────────────────────────
//  SHARED CSS  (Letter 8.5×11in, headers, footers, page numbers)
// ─────────────────────────────────────────────────────────────────
const RPT_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{font-size:10pt;}
body{font-family:'Plus Jakarta Sans','Arial',sans-serif;color:#111;background:#f2f2f2;}

/* ── EACH DIV = ONE PHYSICAL PAGE ── */
.rpt-page{
  width:8.5in;
  min-height:11in;
  padding:0.65in 0.8in 0.8in 0.8in;
  background:#fff;
  position:relative;
  margin:0 auto 0.2in;
  box-shadow:0 2px 8px rgba(0,0,0,.12);
  page-break-after:always;
}
.rpt-page:last-of-type{page-break-after:auto;}

/* ── PAGE HEADER (printed top of every content page) ── */
.ph{
  position:absolute;top:0.22in;left:0.8in;right:0.8in;
  display:flex;align-items:center;justify-content:space-between;
  border-bottom:1.5px solid #1a5c35;padding-bottom:4px;
  -webkit-print-color-adjust:exact;print-color-adjust:exact;
}
.ph-l{display:flex;align-items:center;gap:5px;}
.ph-icon{width:14px;height:14px;background:#1a5c35;border-radius:2px;
  display:flex;align-items:center;justify-content:center;flex-shrink:0;
  -webkit-print-color-adjust:exact;print-color-adjust:exact;}
.ph-icon svg{width:9px;height:9px;}
.ph-org{font-weight:700;color:#1a5c35;font-size:6.5pt;text-transform:uppercase;letter-spacing:.3px;}
.ph-doc{font-size:6pt;color:#888;margin-top:1px;}
.ph-r{font-size:6pt;color:#888;text-align:right;line-height:1.7;}

/* ── PAGE FOOTER (bottom of every content page) ── */
.pf{
  position:absolute;bottom:0.24in;left:0.8in;right:0.8in;
  display:flex;align-items:center;justify-content:space-between;
  border-top:1px solid #cce0d4;padding-top:4px;
  -webkit-print-color-adjust:exact;print-color-adjust:exact;
}
.pf-l{font-size:6pt;color:#aaa;}
.pf-c{flex:1;font-size:6pt;color:#bbb;text-align:center;}
.pf-r{font-size:6.5pt;font-weight:700;color:#555;min-width:50px;text-align:right;}

/* Content sits between header and footer */
.pc{margin-top:0.42in;margin-bottom:0.45in;}

/* ── COVER PAGE ── */
.cover{
  width:8.5in;min-height:11in;
  display:flex;flex-direction:column;
  background:#fff;page-break-after:always;
  margin:0 auto 0.2in;
  box-shadow:0 2px 8px rgba(0,0,0,.12);
}
.cov-top{height:0.3in;background:linear-gradient(135deg,#0a3d1f,#1a5c35,#1a4060);flex-shrink:0;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
.cov-body{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0.4in 1in 0.3in;text-align:center;}
.cov-emb{width:60pt;height:60pt;border-radius:50%;background:linear-gradient(145deg,#1a5c35,#1a4060);display:flex;align-items:center;justify-content:center;margin:0 auto 10pt;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
.cov-emb svg{width:30pt;height:30pt;}
.cov-min{font-size:7pt;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#6b8a74;margin-bottom:2pt;}
.cov-uni{font-size:11pt;font-weight:800;color:#1a5c35;margin-bottom:11pt;}
.cov-rule{width:36pt;height:2pt;background:linear-gradient(90deg,#1a5c35,#1a4060);margin:0 auto 11pt;border-radius:2pt;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
.cov-type{font-size:7pt;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:#888;margin-bottom:7pt;}
.cov-title{font-size:19pt;font-weight:800;color:#0f1f18;line-height:1.2;margin-bottom:5pt;}
.cov-sub{font-size:10pt;color:#3a5a4a;margin-bottom:18pt;line-height:1.5;}
.cov-meta{background:#f4f8f5;border:1px solid #cce0d4;border-radius:5pt;padding:9pt 15pt;width:100%;max-width:3.5in;text-align:left;margin-bottom:14pt;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
.cov-row{display:flex;justify-content:space-between;align-items:flex-start;padding:3pt 0;border-bottom:1px solid #e0ede5;font-size:7.5pt;}
.cov-row:last-child{border-bottom:none;}
.cov-k{color:#6b8a74;font-weight:700;flex-shrink:0;margin-right:6pt;}
.cov-v{color:#1a2b22;font-weight:600;text-align:right;word-break:break-word;max-width:60%;}
.cov-note{font-size:6.5pt;color:#999;max-width:3.8in;line-height:1.6;}
.cov-bot{height:0.48in;background:#f4f8f5;border-top:2px solid #1a5c35;display:flex;align-items:center;justify-content:space-between;padding:0 0.8in;font-size:6.5pt;color:#6b8a74;flex-shrink:0;-webkit-print-color-adjust:exact;print-color-adjust:exact;}

/* ── HEADINGS ── */
h2.sec{font-size:8pt;font-weight:800;text-transform:uppercase;letter-spacing:.7px;color:#fff;background:linear-gradient(135deg,#1a5c35,#1a4060);padding:4.5pt 8pt;margin:11pt 0 7pt;border-radius:2pt;page-break-after:avoid;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
h3.sub{font-size:8.5pt;font-weight:700;color:#1a5c35;border-left:3pt solid #1a5c35;padding-left:6pt;margin:9pt 0 5pt;page-break-after:avoid;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
p.bt{font-size:8pt;line-height:1.75;color:#1a2b22;margin-bottom:6pt;}
p.note{font-size:7pt;color:#6b8a74;font-style:italic;margin-bottom:4pt;}

/* ── TABLE ── */
table.dt{width:100%;border-collapse:collapse;font-size:7pt;margin-bottom:8pt;page-break-inside:auto;}
table.dt thead th{background:#1a5c35;color:#fff;padding:4pt 5pt;text-align:left;font-weight:700;font-size:6.5pt;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
table.dt thead th.c{text-align:center;}
table.dt tbody td{padding:3.5pt 5pt;border-bottom:1px solid #e0ede0;font-size:7pt;vertical-align:top;}
table.dt tbody tr:nth-child(even) td{background:#f6fbf6;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
table.dt tbody td.lbl{font-weight:600;color:#1a5c35;}
table.dt tbody td.c{text-align:center;}
table.dt tfoot td{font-weight:800;background:#e8f5ed;padding:4pt 5pt;border-top:1.5px solid #1a5c35;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
tr{page-break-inside:avoid;}

/* ── BARS ── */
.ir{display:flex;align-items:center;gap:6pt;margin-bottom:4pt;}
.il{font-size:7pt;font-weight:600;width:110pt;flex-shrink:0;}
.it{flex:1;height:7pt;background:#e8f0e8;border-radius:99pt;overflow:hidden;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
.if{height:100%;border-radius:99pt;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
.ip{font-size:6.5pt;font-weight:700;min-width:46pt;text-align:right;}

/* ── STAT BOXES ── */
.sr{display:flex;gap:4pt;margin-bottom:7pt;flex-wrap:wrap;}
.sb{flex:1;min-width:46pt;background:#f4f8f5;border:1px solid #cce0d4;border-radius:3pt;padding:5pt 3pt;text-align:center;border-top:2.5pt solid #1a5c35;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
.sb.red{border-top-color:#c0392b;background:#fdf4f4;}.sb.amb{border-top-color:#e67e22;background:#fefbf4;}.sb.blu{border-top-color:#1a4060;background:#f4f6fb;}
.sn{font-size:13pt;font-weight:800;line-height:1;color:#1a5c35;}
.sb.red .sn{color:#c0392b;}.sb.amb .sn{color:#e67e22;}.sb.blu .sn{color:#1a4060;}
.sl{font-size:5.5pt;font-weight:700;text-transform:uppercase;letter-spacing:.3px;color:#888;margin-top:1.5pt;}

/* ── FLAG BOXES ── */
.fc{background:#fdf4f4;border-left:3pt solid #c0392b;padding:4.5pt 7pt;margin-bottom:3.5pt;font-size:7pt;border-radius:0 2pt 2pt 0;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
.fw{background:#fefbf4;border-left:3pt solid #e67e22;padding:4.5pt 7pt;margin-bottom:3.5pt;font-size:7pt;border-radius:0 2pt 2pt 0;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
.fg{background:#f4fbf4;border-left:3pt solid #1a5c35;padding:4.5pt 7pt;margin-bottom:3.5pt;font-size:7pt;border-radius:0 2pt 2pt 0;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
.ft{font-weight:700;margin-bottom:1.5pt;font-size:7.5pt;}
.fc .ft{color:#c0392b;}.fw .ft{color:#e67e22;}.fg .ft{color:#1a5c35;}
.fb{color:#333;line-height:1.5;}

/* ── SIGNATURE ── */
.sigs{margin-top:14pt;border-top:1px solid #cce0d4;padding-top:9pt;display:flex;gap:12pt;flex-wrap:wrap;page-break-inside:avoid;}
.sig{flex:1;min-width:90pt;}
.sig-l{border-bottom:1px solid #333;height:18pt;margin-bottom:2pt;}
.sig-n{font-size:7pt;font-weight:700;color:#1a2b22;}
.sig-s{font-size:6pt;color:#888;margin-top:1pt;}

/* ── DOWNLOAD BUTTON ── */
.dl-fab{position:fixed;bottom:14px;right:14px;background:linear-gradient(135deg,#1a5c35,#1a4060);color:#fff;border:none;border-radius:9px;padding:10px 16px;font-family:inherit;font-size:9pt;font-weight:700;cursor:pointer;box-shadow:0 3px 12px rgba(0,0,0,.25);display:flex;align-items:center;gap:5px;z-index:1000;}

/* ── PRINT ── */
@media screen{
  .cover,.rpt-page{margin-bottom:0.25in;}
}
@media print{
  *{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;}
  html,body{background:#fff!important;margin:0!important;padding:0!important;}
  .cover,.rpt-page{box-shadow:none!important;margin:0!important;}
  .dl-fab{display:none!important;}
  .cover{page-break-after:always!important;}
  .rpt-page{page-break-after:always!important;}
  .rpt-page:last-of-type{page-break-after:auto!important;}
  h2.sec{page-break-after:avoid!important;}
  h3.sub{page-break-after:avoid!important;}
  tr{page-break-inside:avoid!important;}
  .sigs{page-break-inside:avoid!important;}
}
@page{size:letter portrait;margin:0;}
`;

// ─────────────────────────────────────────────────────────────────
//  SHARED HELPERS
// ─────────────────────────────────────────────────────────────────
function _pct(a,b){ return b>0?Math.round(a/b*100):0; }
function _cnt(arr,field,val){ return arr.filter(r=>r[field]===val).length; }
function _avg(arr,field){ const v=arr.map(r=>parseInt(r[field])||0).filter(x=>x>0); return v.length?Math.round(v.reduce((a,b)=>a+b,0)/v.length):0; }
function _ills(arr){
  const c={};
  arr.forEach(r=>(r.illnesses||'').split(',').forEach(x=>{const k=x.trim();if(k&&k!=='None')c[k]=(c[k]||0)+1;}));
  return Object.entries(c).sort((a,b)=>b[1]-a[1]);
}
function _redFlags(rec){
  const f=[];
  if(rec.latrine==='No')    f.push('No pit latrine — open defecation risk');
  if(rec.water_treated==='No') f.push('Drinking water not treated');
  if(rec.hiv_heard==='No')  f.push('No HIV/AIDS awareness');
  try{
    const raw=typeof rec.raw_json==='string'?JSON.parse(rec.raw_json||'{}'):(rec.raw_json||{});
    if(raw.i_circ==='Female'||raw.i_circ==='Both') f.push('FGM reported — requires immediate referral');
    if(raw.b_smoke_in==='Yes') f.push('Indoor smoking — passive smoke risk');
  }catch(e){}
  return f;
}

// Page header HTML
function _ph(docTitle, reportType, dateStr){
  return '<div class="ph">'
    +'<div class="ph-l">'
    +'<div class="ph-icon"><svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" rx="6" fill="#1a5c35"/><path d="M24 10L24 38M10 24L38 24" stroke="#fff" stroke-width="6" stroke-linecap="round"/></svg></div>'
    +'<div><div class="ph-org">Great Lakes University of Kisumu &middot; Nyamache Sub County Hospital</div>'
    +'<div class="ph-doc">'+docTitle+'</div></div>'
    +'</div>'
    +'<div class="ph-r">'+reportType+'<br>'+dateStr+'</div>'
    +'</div>';
}
// Page footer HTML
function _pf(num, total){
  return '<div class="pf">'
    +'<div class="pf-l">Community Health Survey &middot; Great Lakes University &middot; Nyamache Sub County Hospital</div>'
    +'<div class="pf-c">Confidential &mdash; For Official Use Only</div>'
    +'<div class="pf-r">Page '+num+' of '+total+'</div>'
    +'</div>';
}
// Wrap content in a page div
function _page(num, total, hdr, ftr, content){
  return '<div class="rpt-page">'+hdr+ftr+'<div class="pc">'+content+'</div></div>';
}
// Indicator bar
function _bar(label, val, max, col){
  const p=_pct(val,max);
  const c=col||(p>=70?'#1a5c35':p>=50?'#e67e22':'#c0392b');
  return '<div class="ir"><div class="il">'+label+'</div>'
    +'<div class="it"><div class="if" style="width:'+p+'%;background:'+c+'"></div></div>'
    +'<div class="ip" style="color:'+(p>=70?'#1a5c35':p>=50?'#e67e22':'#c0392b')+'">'+val+'/'+max+' ('+p+'%)</div></div>';
}
// Stat box
function _sb(n, label, cls){
  return '<div class="sb '+(cls||'')+'"><div class="sn">'+n+'</div><div class="sl">'+label+'</div></div>';
}
// Flag box
function _flag(level, title, body){
  const cls=level==='critical'?'fc':level==='warning'?'fw':'fg';
  return '<div class="'+cls+'"><div class="ft">'+(level==='critical'?'⚠ ':level==='warning'?'⚠ ':'✓ ')+title+'</div><div class="fb">'+body+'</div></div>';
}
// Cover page
function _cover(title, subtitle, metaRows, reportType){
  const now=new Date().toLocaleDateString('en-KE',{year:'numeric',month:'long',day:'numeric'});
  return '<div class="cover">'
    +'<div class="cov-top"></div>'
    +'<div class="cov-body">'
    +'<div class="cov-emb"><svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path d="M24 10L24 38M10 24L38 24" stroke="#fff" stroke-width="5" stroke-linecap="round"/><circle cx="24" cy="24" r="14" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="2"/></svg></div>'
    +'<div class="cov-min">Republic of Kenya &nbsp;&middot;&nbsp; Ministry of Health</div>'
    +'<div class="cov-uni">Great Lakes University of Kisumu</div>'
    +'<div class="cov-rule"></div>'
    +'<div class="cov-type">'+reportType+'</div>'
    +'<div class="cov-title">'+title+'</div>'
    +'<div class="cov-sub">'+subtitle+'</div>'
    +'<div class="cov-meta">'
    +metaRows.map(function(mr){
      return '<div class="cov-row"><span class="cov-k">'+mr[0]+'</span><span class="cov-v">'+(mr[1]||'—')+'</span></div>';
    }).join('')
    +'<div class="cov-row"><span class="cov-k">Date Generated</span><span class="cov-v">'+now+'</span></div>'
    +'</div>'
    +'<p class="cov-note">Produced in fulfilment of community health situation analysis practical requirements, Great Lakes University of Kisumu, in collaboration with Nyamache Sub County Hospital, Kisii County, Kenya.</p>'
    +'</div>'
    +'<div class="cov-bot">'
    +'<div style="display:flex;align-items:center;gap:5px"><svg width="16" height="16" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" rx="7" fill="#1a5c35"/><path d="M24 10L24 38M10 24L38 24" stroke="#fff" stroke-width="6" stroke-linecap="round"/></svg><strong style="color:#1a5c35">Community Health Survey v2.0</strong></div>'
    +'<div>Built by HazzinBR &middot; Nyamache Sub County Hospital</div>'
    +'<div>Confidential &mdash; For Official Use Only</div>'
    +'</div></div>';
}
// Signature section
function _sigs(people){
  return '<div class="sigs">'+people.map(function(p){
    return '<div class="sig"><div class="sig-l"></div><div class="sig-n">'+p[0]+'</div><div class="sig-s">'+p[1]+'</div></div>';
  }).join('')+'</div>';
}
// Full document wrapper
function _doc(title, bodyHTML){
  return '<!DOCTYPE html><html lang="en"><head>'
    +'<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
    +'<title>'+title+'</title>'
    +'<style>'+RPT_CSS+'</style>'
    +'</head><body>'
    +bodyHTML
    +'<button class="dl-fab" onclick="_dlThis()">⬇ Download File</button>'
    +'<script>function _dlThis(){'
    +'var h=\'<!DOCTYPE html>\'+document.documentElement.outerHTML;'
    +'var b=new Blob([h],{type:\'text/html;charset=utf-8\'});'
    +'var u=URL.createObjectURL(b);'
    +'var a=document.createElement(\'a\');'
    +'a.href=u;a.download=document.title.replace(/[^a-zA-Z0-9_\\-]/g,\'_\')+\'_\'+new Date().toISOString().split(\'T\')[0]+\'.html\';'
    +'document.body.appendChild(a);a.click();document.body.removeChild(a);URL.revokeObjectURL(u);'
    +'}<\/script>'
    +'</body></html>';
}


// ─────────────────────────────────────────────────────────────────
//  REPORT 1 — INDIVIDUAL INTERVIEWER OFFICIAL REPORT
// ─────────────────────────────────────────────────────────────────
function buildInterviewerReport(interviewer, records, student){
  student = student||{full_name:interviewer,reg_number:'—',email:'—'};
  const n   = records.length;
  if(!n) return _doc('No Records','<p>No records found for '+interviewer+'.</p>');

  const now      = new Date().toLocaleDateString('en-KE',{year:'numeric',month:'long',day:'numeric'});
  const dates    = records.map(r=>r.interview_date||'').filter(Boolean).sort();
  const period   = dates.length>1?dates[0]+' to '+dates[dates.length-1]:dates[0]||now;
  const locs     = [...new Set(records.map(r=>r.location||'').filter(Boolean))];
  const locStr   = locs.join(', ')||'Nyamache Sub County';
  const fullName = student.full_name||interviewer;
  const regNo    = student.reg_number||'—';
  const email    = student.email||'—';

  // Metrics
  const latrine  = _cnt(records,'latrine','Yes');
  const waterTx  = _cnt(records,'water_treated','Yes');
  const hivHeard = _cnt(records,'hiv_heard','Yes');
  const hivTest  = _cnt(records,'hiv_tested','Yes');
  const deathHH  = _cnt(records,'deaths_5yr','Yes');
  const totDead  = records.reduce((s,r)=>s+(parseInt(r.deaths_count)||0),0);
  const permanent= _cnt(records,'house_type','Permanent');
  const semi     = _cnt(records,'house_type','Semi-permanent');
  const temp     = _cnt(records,'house_type','Temporary');
  const female   = _cnt(records,'respondent_gender','Female');
  const male     = _cnt(records,'respondent_gender','Male');
  const avgAge   = _avg(records,'respondent_age');
  const topIll   = _ills(records);
  const allFlags = [];
  records.forEach(r=>_redFlags(r).forEach(f=>allFlags.push({r,f})));

  // Recommendations
  const recs=[];
  if(_pct(latrine,n)<80)  recs.push({lvl:'critical',t:'Sanitation: Latrine Programme',b:'Coverage at '+_pct(latrine,n)+'% is below the 80% national target. The '+(n-latrine)+' household'+(n-latrine!==1?'s':'')+' without latrines require immediate CLTS follow-up within 30 days.'});
  if(_pct(waterTx,n)<80)  recs.push({lvl:'critical',t:'Water Safety Intervention',b:'Only '+_pct(waterTx,n)+'% treat drinking water. Distribute WaterGuard and conduct community demonstrations on safe water handling.'});
  if(_pct(hivHeard,n)<90) recs.push({lvl:'critical',t:'HIV/AIDS Health Education',b:'Awareness at '+_pct(hivHeard,n)+'% is below the UNAIDS 90% target. Deploy CHWs for door-to-door education and establish mobile VCT outreach.'});
  if(_pct(hivTest,n)<50)  recs.push({lvl:'warning',t:'HIV Testing Uptake',b:'Only '+_pct(hivTest,n)+'% have been tested. Integrate HIV testing into all community health visits.'});
  if(topIll.length&&topIll[0][1]>n*0.2) recs.push({lvl:'warning',t:topIll[0][0]+' Prevention',b:topIll[0][0]+' affects '+topIll[0][1]+' households ('+_pct(topIll[0][1],n)+'%). Targeted prevention and treatment access needed.'});
  if(deathHH>0) recs.push({lvl:'warning',t:'Mortality Follow-Up',b:deathHH+' household'+(deathHH!==1?'s':'')+' reported '+totDead+' death'+(totDead!==1?'s':'')+' in 5 years. Verbal autopsy required to determine cause-specific mortality.'});
  if(!recs.length) recs.push({lvl:'good',t:'Maintain Surveillance',b:'All indicators are within acceptable ranges. Continue routine community health surveillance and household follow-up.'});

  const STATUS = (p,t)=>p>=t?'<span style="color:#1a5c35;font-weight:700">&#10003; Met</span>':'<span style="color:#c0392b;font-weight:700">&#10007; Below</span>';
  const hdr = _ph(fullName+' — Field Report','Interviewer Report',period);
  const TOTAL_PAGES = 5; // estimated

  // ── PAGE 1: Cover ──
  const p0 = _cover(
    'Community Health Situation Analysis',
    'Interviewer Field Report &mdash; '+fullName,
    [
      ['Full Name',         fullName],
      ['Admission / ID No.',regNo],
      ['Email',             email],
      ['Institution',       'Great Lakes University of Kisumu'],
      ['Survey Area',       locStr],
      ['Survey Period',     period],
      ['Total Households',  n+' household'+(n!==1?'s':'')],
      ['Supervised by',     'Nyamache Sub County Hospital, Kisii County'],
    ],
    'OFFICIAL FIELD REPORT'
  );

  // ── PAGE 2: Executive Summary + Introduction ──
  const p2 = _page(2,TOTAL_PAGES, hdr, _pf(2,TOTAL_PAGES),
    '<h2 class="sec">Executive Summary</h2>'
    +'<p class="bt">This report presents findings from <strong>'+n+' household interview'+(n!==1?'s':'')+
      '</strong> conducted by <strong>'+fullName+'</strong> (Reg: '+regNo+') in <strong>'+locStr+
      '</strong> during <strong>'+period+'</strong>, as part of the Community Health Situation Analysis programme at Great Lakes University of Kisumu in partnership with Nyamache Sub County Hospital, Kisii County.</p>'
    +'<p class="bt">Key findings: latrine coverage <strong>'+_pct(latrine,n)+'%</strong>, water treatment <strong>'+_pct(waterTx,n)+'%</strong>, HIV awareness <strong>'+_pct(hivHeard,n)+'%</strong>. '
      +(topIll.length?'Most prevalent illness: <strong>'+topIll[0][0]+'</strong> ('+topIll[0][1]+' cases, '+_pct(topIll[0][1],n)+'%). ':'')+
      (deathHH>0?totDead+' death'+(totDead!==1?'s':'')+' reported across '+deathHH+' household'+(deathHH!==1?'s':'')+'. ':'')+
      '<strong>'+allFlags.length+' red flag'+(allFlags.length!==1?'s':'')+
      '</strong> identified requiring follow-up.</p>'
    +'<div class="sr">'
      +_sb(n,'Households','blu')
      +_sb(_pct(latrine,n)+'%','Latrine',_pct(latrine,n)<60?'red':_pct(latrine,n)<80?'amb':'')
      +_sb(_pct(waterTx,n)+'%','Water Tx',_pct(waterTx,n)<60?'red':_pct(waterTx,n)<80?'amb':'')
      +_sb(_pct(hivHeard,n)+'%','HIV Aware',_pct(hivHeard,n)<70?'red':_pct(hivHeard,n)<90?'amb':'')
      +_sb(allFlags.length,'Red Flags',allFlags.length>0?'red':'')
      +_sb(totDead,'Deaths (5yr)',totDead>0?'amb':'')
    +'</div>'
    +'<h2 class="sec">1. Introduction</h2>'
    +'<p class="bt">This assessment was undertaken by <strong>'+fullName+'</strong> (Admission No: <strong>'+regNo+'</strong>'+(email!=='—'?', '+email:'')+') as a student health worker at Great Lakes University of Kisumu, under supervision of the clinical faculty and in collaboration with Nyamache Sub County Hospital health management team.</p>'
    +'<p class="bt">The survey was conducted in <strong>'+locStr+'</strong>, Nyamache Sub County, Kisii County, covering <strong>'+n+' household'+(n!==1?'s':'')+
      '</strong> during <strong>'+period+'</strong>. Objectives: (i) document prevailing health conditions and disease burden; (ii) identify social and environmental health determinants; (iii) assess coverage of essential health services; (iv) generate evidence-based recommendations for targeted interventions.</p>'
    +'<h2 class="sec">2. Methods</h2>'
    +'<p class="bt">A descriptive cross-sectional household survey was conducted using a structured 12-section questionnaire: Consent, Demography, Housing, Medical History, Maternal &amp; Child Health, Nutrition, HIV/AIDS, Sanitation, Environment &amp; Water, Cultural Practices, Health Problems, and Pests &amp; Vectors. Data was captured using the Community Health Survey PWA and synchronised to a secure cloud database. Verbal informed consent was obtained from each respondent.</p>'
  );

  // ── PAGE 3: Results ──
  const caseRows = records.map((rec,i)=>{
    const f=_redFlags(rec);
    return '<tr>'
      +'<td class="c lbl">'+(i+1)+'</td>'
      +'<td>'+( rec.interview_date||'—')+'</td>'
      +'<td>'+(rec.location||'—')+'</td>'
      +'<td class="c">'+(rec.respondent_age||'?')+' / '+(rec.respondent_gender||'?').charAt(0)+'</td>'
      +'<td>'+(rec.house_type||'—')+'</td>'
      +'<td class="c" style="color:'+(rec.latrine==='Yes'?'#1a5c35':'#c0392b')+';font-weight:700">'+(rec.latrine==='Yes'?'Yes':'No')+'</td>'
      +'<td class="c" style="color:'+(rec.water_treated==='Yes'?'#1a5c35':'#c0392b')+';font-weight:700">'+(rec.water_treated==='Yes'?'Yes':'No')+'</td>'
      +'<td class="c" style="color:'+(rec.hiv_heard==='Yes'?'#1a5c35':'#c0392b')+';font-weight:700">'+(rec.hiv_heard==='Yes'?'Yes':'No')+'</td>'
      +'<td style="font-size:6.5pt">'+(rec.illnesses||'None')+'</td>'
      +'<td class="c" style="color:'+(f.length?'#c0392b':'#1a5c35')+';font-weight:700">'+(f.length||'&#10003;')+'</td>'
      +'</tr>';
  }).join('');

  const p3 = _page(3,TOTAL_PAGES, hdr, _pf(3,TOTAL_PAGES),
    '<h2 class="sec">3. Results</h2>'
    +'<h3 class="sub">3.1 Socio-Demographic Profile</h3>'
    +'<div class="sr">'+_sb(n,'Households','blu')+_sb(female,'Female','blu')+_sb(male,'Male','blu')+_sb(avgAge,'Avg Age','blu')+_sb(permanent,'Permanent','')+_sb(locs.length,'Locations','blu')+'</div>'
    +'<h3 class="sub">3.2 WASH Indicators</h3>'
    +_bar('Pit Latrine Coverage',latrine,n)
    +_bar('Water Treatment',waterTx,n)
    +'<table class="dt" style="margin-top:6pt">'
    +'<thead><tr><th>Indicator</th><th class="c">Yes</th><th class="c">No</th><th class="c">Coverage</th><th class="c">Target</th><th class="c">Status</th></tr></thead>'
    +'<tbody>'
    +'<tr><td class="lbl">Pit latrine access</td><td class="c">'+latrine+'</td><td class="c">'+(n-latrine)+'</td><td class="c">'+_pct(latrine,n)+'%</td><td class="c">&ge;80%</td><td class="c">'+STATUS(_pct(latrine,n),80)+'</td></tr>'
    +'<tr><td class="lbl">Water treatment</td><td class="c">'+waterTx+'</td><td class="c">'+(n-waterTx)+'</td><td class="c">'+_pct(waterTx,n)+'%</td><td class="c">&ge;80%</td><td class="c">'+STATUS(_pct(waterTx,n),80)+'</td></tr>'
    +'</tbody></table>'
    +'<h3 class="sub">3.3 HIV/AIDS Indicators</h3>'
    +_bar('HIV/AIDS Awareness',hivHeard,n)
    +_bar('Ever Tested for HIV',hivTest,n)
    +'<table class="dt" style="margin-top:6pt">'
    +'<thead><tr><th>Indicator</th><th class="c">Yes</th><th class="c">No</th><th class="c">Coverage</th><th class="c">Target</th><th class="c">Status</th></tr></thead>'
    +'<tbody>'
    +'<tr><td class="lbl">Heard of HIV/AIDS</td><td class="c">'+hivHeard+'</td><td class="c">'+(n-hivHeard)+'</td><td class="c">'+_pct(hivHeard,n)+'%</td><td class="c">&ge;90%</td><td class="c">'+STATUS(_pct(hivHeard,n),90)+'</td></tr>'
    +'<tr><td class="lbl">Ever tested for HIV</td><td class="c">'+hivTest+'</td><td class="c">'+(n-hivTest)+'</td><td class="c">'+_pct(hivTest,n)+'%</td><td class="c">&ge;95%</td><td class="c">'+STATUS(_pct(hivTest,n),95)+'</td></tr>'
    +'</tbody></table>'
    +'<h3 class="sub">3.4 Disease Burden</h3>'
    +(topIll.length
      ?'<table class="dt"><thead><tr><th>Illness / Condition</th><th class="c">Cases</th><th class="c">% HHs</th><th class="c">Rank</th></tr></thead><tbody>'
        +topIll.map(([k,v],i)=>'<tr><td class="lbl">'+k+'</td><td class="c">'+v+'</td><td class="c">'+_pct(v,n)+'%</td><td class="c">#'+(i+1)+'</td></tr>').join('')
        +'</tbody></table>'
      :'<p class="note">No illness data recorded.</p>')
    +(deathHH>0?_flag('warning','Mortality Reported',deathHH+' household'+(deathHH!==1?'s':'')+' reported '+totDead+' death'+(totDead!==1?'s':'')+' in the past 5 years. Verbal autopsy investigation recommended.'):'')
    +'<h3 class="sub">3.5 All Interviews — Summary Table</h3>'
    +'<p class="note">Age/Sex: age in years / M=Male F=Female. Latrine, Water, HIV columns show Yes/No response. Flags = number of critical issues identified.</p>'
    +'<table class="dt"><thead><tr><th class="c">#</th><th>Date</th><th>Location</th><th class="c">Age/Sex</th><th>House</th><th class="c">Latrine</th><th class="c">Water</th><th class="c">HIV</th><th>Illnesses</th><th class="c">Flags</th></tr></thead>'
    +'<tbody>'+caseRows+'</tbody></table>'
  );

  // ── PAGE 4: Red Flags + Discussion + Conclusion ──
  const p4 = _page(4,TOTAL_PAGES, hdr, _pf(4,TOTAL_PAGES),
    '<h3 class="sub">3.6 Red Flags Identified</h3>'
    +(allFlags.length
      ? allFlags.map(({r,f})=>'<div class="fc"><div class="ft">&#9888; '+f+'</div><div class="fb">Location: '+(r.location||'?')+' &middot; Date: '+(r.interview_date||'?')+' &middot; Respondent: '+(r.respondent_age||'?')+' yrs, '+(r.respondent_gender||'?')+'</div></div>').join('')
      : _flag('good','No Critical Red Flags','No critical red flags were identified across all surveyed households.'))
    +'<h2 class="sec">4. Discussion</h2>'
    +'<p class="bt">'+(_pct(latrine,n)<80
      ?'Latrine coverage of '+_pct(latrine,n)+'% ('+latrine+'/'+n+') falls below the 80% national target. Open defecation in the remaining '+(n-latrine)+' household'+(n-latrine!==1?'s':'')+' creates direct faecal-oral disease transmission risk, particularly for children under five.'
      :'Latrine coverage of '+_pct(latrine,n)+'% meets the national target — a commendable achievement. Efforts should be maintained to sustain and improve this coverage.')+'</p>'
    +'<p class="bt">'+(_pct(waterTx,n)<80
      ?'Water treatment compliance of '+_pct(waterTx,n)+'% is below the recommended threshold. The distribution of point-of-use treatment products and hygiene promotion are urgently required.'
      :'Water treatment compliance of '+_pct(waterTx,n)+'% is satisfactory and indicates uptake of safe water practices.')+'</p>'
    +'<p class="bt">'+(_pct(hivHeard,n)<90
      ?'HIV/AIDS awareness at '+_pct(hivHeard,n)+'% falls short of the UNAIDS 90% target. The '+(n-hivHeard)+' respondent'+(n-hivHeard!==1?'s':'')+' unaware of HIV/AIDS represent a vulnerable population requiring immediate health education outreach.'
      :'HIV/AIDS awareness at '+_pct(hivHeard,n)+'% meets the benchmark.')+'</p>'
    +(topIll.length?'<p class="bt">'+topIll[0][0]+' is the most prevalent illness ('+topIll[0][1]+' cases, '+_pct(topIll[0][1],n)+'%), consistent with environmental and behavioural risk factors identified in this survey.</p>':'')
    +'<h2 class="sec">5. Conclusion</h2>'
    +'<p class="bt">This community health situation analysis by <strong>'+fullName+'</strong> has provided a systematic assessment of '+n+' household'+(n!==1?'s':'')+' in <strong>'+locStr+'</strong>, Nyamache Sub County. '
      +(_pct(latrine,n)<60||_pct(waterTx,n)<60||_pct(hivHeard,n)<70?'Significant gaps in basic health coverage require urgent intervention.':'Key indicators are within acceptable ranges with targeted areas for improvement.')
      +(allFlags.length?' '+allFlags.length+' red flag'+(allFlags.length!==1?'s':'')+' were identified each requiring documented follow-up action.':'')+'</p>'
    +'<p class="bt">This report is submitted to the course coordinator and sub-county health management team at Nyamache Sub County Hospital for review, action planning, and integration into the sub-county health planning cycle.</p>'
  );

  // ── PAGE 5: Recommendations + Signatures ──
  const p5 = _page(5,TOTAL_PAGES, hdr, _pf(5,TOTAL_PAGES),
    '<h2 class="sec">6. Recommendations</h2>'
    +recs.map(rc=>_flag(rc.lvl,rc.t,rc.b)).join('')
    +'<h2 class="sec">Declaration &amp; Signatures</h2>'
    +'<p class="bt">I, <strong>'+fullName+'</strong> (Admission No: '+regNo+'), hereby declare that the data presented in this report was collected personally, accurately, and in accordance with the ethical guidelines of Great Lakes University of Kisumu. All respondents provided verbal informed consent prior to participation.</p>'
    +_sigs([
      [fullName, regNo+(email!=='—'?' &middot; '+email:'')+' &middot; Student, Great Lakes University'],
      ['Course Supervisor','Faculty &middot; Community Health &middot; GLU Kisumu'],
      ['Sub-County Health Officer','Nyamache Sub County Hospital, Kisii County'],
    ])
    +'<p class="note" style="margin-top:12pt;text-align:center">Report generated '+now+' &middot; Community Health Survey System v2.0 &middot; Great Lakes University of Kisumu &middot; &copy; 2026 HazzinBR</p>'
  );

  return _doc('Report_'+fullName.replace(/\s+/g,'_'), p0+p2+p3+p4+p5);
}


// ─────────────────────────────────────────────────────────────────
//  REPORT 2 — CLASS GROUP REPORT
// ─────────────────────────────────────────────────────────────────
function buildGroupReport(records, students){
  students = students||{};
  const n   = records.length;
  if(!n) return _doc('Group_Report','<p>No records loaded.</p>');

  const now     = new Date().toLocaleDateString('en-KE',{year:'numeric',month:'long',day:'numeric'});
  const ivNames = [...new Set(records.map(r=>r.interviewer||'Unknown'))].sort();
  const dates   = records.map(r=>r.interview_date||'').filter(Boolean).sort();
  const period  = dates.length>1?dates[0]+' to '+dates[dates.length-1]:dates[0]||now;
  const locs    = [...new Set(records.map(r=>r.location||'').filter(Boolean))];

  const latrine  = _cnt(records,'latrine','Yes');
  const waterTx  = _cnt(records,'water_treated','Yes');
  const hivHeard = _cnt(records,'hiv_heard','Yes');
  const hivTest  = _cnt(records,'hiv_tested','Yes');
  const deathHH  = _cnt(records,'deaths_5yr','Yes');
  const totDead  = records.reduce((s,r)=>s+(parseInt(r.deaths_count)||0),0);
  const permanent= _cnt(records,'house_type','Permanent');
  const female   = _cnt(records,'respondent_gender','Female');
  const male     = _cnt(records,'respondent_gender','Male');
  const avgAge   = _avg(records,'respondent_age');
  const topIll   = _ills(records);
  const allFlags = records.reduce((a,r)=>a+_redFlags(r).length,0);

  const STATUS = (p,t)=>p>=t?'<span style="color:#1a5c35;font-weight:700">&#10003;</span>':'<span style="color:#c0392b;font-weight:700">&#10007;</span>';
  const hdr = _ph('Class Group Report — All Interviewers','Group Report',period);
  const TOTAL_PAGES = 4;

  // Per-interviewer comparison rows
  const ivRows = ivNames.map(iv=>{
    const recs = records.filter(r=>r.interviewer===iv);
    const m    = recs.length;
    const st   = students[iv]||{};
    const lp   = _pct(_cnt(recs,'latrine','Yes'),m);
    const wp   = _pct(_cnt(recs,'water_treated','Yes'),m);
    const hp   = _pct(_cnt(recs,'hiv_heard','Yes'),m);
    const tp   = _pct(_cnt(recs,'hiv_tested','Yes'),m);
    const fl   = recs.reduce((a,r)=>a+_redFlags(r).length,0);
    const top  = (()=>{const t=_ills(recs);return t[0]?t[0][0]:'—';})();
    return '<tr>'
      +'<td class="lbl">'+iv+'<br><span style="font-size:6pt;color:#888;font-weight:400">'+(st.reg_number||'—')+'</span></td>'
      +'<td class="c">'+m+'</td>'
      +'<td class="c" style="color:'+(lp>=80?'#1a5c35':'#c0392b')+';font-weight:700">'+lp+'%</td>'
      +'<td class="c" style="color:'+(wp>=80?'#1a5c35':'#c0392b')+';font-weight:700">'+wp+'%</td>'
      +'<td class="c" style="color:'+(hp>=90?'#1a5c35':'#c0392b')+';font-weight:700">'+hp+'%</td>'
      +'<td class="c" style="color:'+(tp>=50?'#1a5c35':'#e67e22')+';font-weight:700">'+tp+'%</td>'
      +'<td class="c" style="color:'+(fl>0?'#c0392b':'#1a5c35')+';font-weight:700">'+fl+'</td>'
      +'<td style="font-size:6.5pt">'+top+'</td>'
      +'</tr>';
  }).join('');

  const grecs=[];
  if(_pct(latrine,n)<80)  grecs.push({lvl:'critical',t:'Priority 1: Latrine Programme',b:'Class-wide coverage of '+_pct(latrine,n)+'% is below 80% target. '+(n-latrine)+' households require immediate CLTS follow-up. Formally notify sub-county sanitation officer.'});
  if(_pct(waterTx,n)<80)  grecs.push({lvl:'critical',t:'Priority 2: Safe Water Campaign',b:'Treatment compliance of '+_pct(waterTx,n)+'% across '+n+' households presents a significant waterborne disease risk. Mass distribute WaterGuard and conduct community demonstrations.'});
  if(_pct(hivHeard,n)<90) grecs.push({lvl:'critical',t:'Priority 3: HIV/AIDS Outreach',b:'Awareness at '+_pct(hivHeard,n)+'% falls below the 90% UNAIDS benchmark. Structured community health education with mobile VCT is urgently required.'});
  if(topIll.length&&topIll[0][1]>n*0.15) grecs.push({lvl:'warning',t:'Disease Burden: '+topIll[0][0],b:topIll[0][0]+' is the most prevalent illness class-wide ('+topIll[0][1]+' cases, '+_pct(topIll[0][1],n)+'%). Prevention, early treatment and community education recommended.'});
  if(deathHH>n*0.1) grecs.push({lvl:'warning',t:'Mortality Investigation',b:deathHH+' households ('+_pct(deathHH,n)+'%) reported '+totDead+' deaths in 5 years. A verbal autopsy programme should be initiated.'});
  grecs.push({lvl:'good',t:'Scheduled Follow-Up',b:'All red-flag households should receive a follow-up visit within 30 days. Repeat full survey in 6 months to measure progress on key indicators.'});

  // ── Cover ──
  const p0 = _cover(
    'Community Health Situation Analysis',
    'Class Aggregated Group Report &mdash; Nyamache Sub County',
    [
      ['Institution',      'Great Lakes University of Kisumu'],
      ['Supervised at',    'Nyamache Sub County Hospital'],
      ['Survey Area',      locs.join(', ')||'Nyamache Sub County'],
      ['Survey Period',    period],
      ['Total Households', n+''],
      ['No. Interviewers', ivNames.length+''],
      ['Interviewers',     ivNames.join(', ')],
    ],
    'OFFICIAL CLASS GROUP REPORT'
  );

  // ── Page 2: Intro + Methods + Overall indicators ──
  const p2 = _page(2,TOTAL_PAGES, hdr, _pf(2,TOTAL_PAGES),
    '<h2 class="sec">Executive Summary</h2>'
    +'<p class="bt">This report aggregates findings from <strong>'+n+' household interviews</strong> conducted by <strong>'+ivNames.length+' student interviewer'+(ivNames.length!==1?'s':'')+
      '</strong> ('+ivNames.join(', ')+') across <strong>'+(locs.join(', ')||'Nyamache Sub County')+
      '</strong> during <strong>'+period+'</strong>.</p>'
    +'<p class="bt">Class-level indicators: latrine coverage <strong>'+_pct(latrine,n)+'%</strong>, water treatment <strong>'+_pct(waterTx,n)+'%</strong>, HIV awareness <strong>'+_pct(hivHeard,n)+'%</strong>. '
      +(topIll.length?'Leading illness: <strong>'+topIll[0][0]+'</strong> ('+topIll[0][1]+' cases). ':'')+
      '<strong>'+allFlags+' red flag'+(allFlags!==1?'s':'')+
      '</strong> identified across all interviews.</p>'
    +'<div class="sr">'+_sb(n,'Total HHs','blu')+_sb(ivNames.length,'Interviewers','blu')+_sb(_pct(latrine,n)+'%','Latrine',_pct(latrine,n)<60?'red':_pct(latrine,n)<80?'amb':'')+_sb(_pct(waterTx,n)+'%','Water Tx',_pct(waterTx,n)<60?'red':_pct(waterTx,n)<80?'amb':'')+_sb(_pct(hivHeard,n)+'%','HIV Aware',_pct(hivHeard,n)<70?'red':_pct(hivHeard,n)<90?'amb':'')+_sb(allFlags,'Red Flags',allFlags>0?'red':'')+'</div>'
    +'<h2 class="sec">1. Introduction</h2>'
    +'<p class="bt">This group report presents aggregated findings of the community health situation analysis practical exercise conducted by students of Great Lakes University of Kisumu in partnership with Nyamache Sub County Hospital. The survey contributes to evidence for health service planning aligned with Kenya Health Policy 2014–2030 and SDG 3.</p>'
    +'<h2 class="sec">2. Methods</h2>'
    +'<p class="bt">A descriptive cross-sectional study using a structured 12-section questionnaire administered face-to-face to consenting adult household representatives. Data was collected digitally using the Community Health Survey PWA and synchronised to a secure cloud database. Analysis was conducted descriptively with comparisons against national and international benchmarks.</p>'
    +'<h2 class="sec">3. Results</h2>'
    +'<h3 class="sub">3.1 Overall Key Indicators</h3>'
    +'<div class="sr">'+_sb(n,'Households','blu')+_sb(female,'Female','blu')+_sb(male,'Male','blu')+_sb(avgAge+'yr','Avg Age','blu')+_sb(permanent,'Permanent','')+_sb((n-permanent),'Temporary','amb')+'</div>'
    +_bar('Pit Latrine Coverage',latrine,n)
    +_bar('Water Treatment',waterTx,n)
    +_bar('HIV/AIDS Awareness',hivHeard,n)
    +_bar('HIV Testing',hivTest,n)
    +'<table class="dt" style="margin-top:6pt">'
    +'<thead><tr><th>Indicator</th><th class="c">Yes</th><th class="c">No</th><th class="c">Coverage</th><th class="c">Target</th><th class="c">Status</th></tr></thead>'
    +'<tbody>'
    +'<tr><td class="lbl">Pit latrine</td><td class="c">'+latrine+'</td><td class="c">'+(n-latrine)+'</td><td class="c">'+_pct(latrine,n)+'%</td><td class="c">&ge;80%</td><td class="c">'+STATUS(_pct(latrine,n),80)+'</td></tr>'
    +'<tr><td class="lbl">Water treatment</td><td class="c">'+waterTx+'</td><td class="c">'+(n-waterTx)+'</td><td class="c">'+_pct(waterTx,n)+'%</td><td class="c">&ge;80%</td><td class="c">'+STATUS(_pct(waterTx,n),80)+'</td></tr>'
    +'<tr><td class="lbl">HIV awareness</td><td class="c">'+hivHeard+'</td><td class="c">'+(n-hivHeard)+'</td><td class="c">'+_pct(hivHeard,n)+'%</td><td class="c">&ge;90%</td><td class="c">'+STATUS(_pct(hivHeard,n),90)+'</td></tr>'
    +'<tr><td class="lbl">HIV testing</td><td class="c">'+hivTest+'</td><td class="c">'+(n-hivTest)+'</td><td class="c">'+_pct(hivTest,n)+'%</td><td class="c">&ge;95%</td><td class="c">'+STATUS(_pct(hivTest,n),95)+'</td></tr>'
    +'<tr><td class="lbl">Permanent housing</td><td class="c">'+permanent+'</td><td class="c">'+(n-permanent)+'</td><td class="c">'+_pct(permanent,n)+'%</td><td class="c">&ge;50%</td><td class="c">'+STATUS(_pct(permanent,n),50)+'</td></tr>'
    +'</tbody></table>'
    +'<h3 class="sub">3.2 Disease Burden</h3>'
    +(topIll.length?'<table class="dt"><thead><tr><th>Illness</th><th class="c">Cases</th><th class="c">% HHs</th><th class="c">Rank</th></tr></thead><tbody>'+topIll.map(([k,v],i)=>'<tr><td class="lbl">'+k+'</td><td class="c">'+v+'</td><td class="c">'+_pct(v,n)+'%</td><td class="c">#'+(i+1)+'</td></tr>').join('')+'</tbody></table>':'<p class="note">No illness data.</p>')
    +(deathHH>0?_flag('warning','Mortality: '+totDead+' deaths reported',deathHH+' households ('+_pct(deathHH,n)+'%) reported '+totDead+' deaths in 5 years. Verbal autopsy investigation recommended.'):'')
  );

  // ── Page 3: Per-interviewer comparison + Discussion ──
  const p3 = _page(3,TOTAL_PAGES, hdr, _pf(3,TOTAL_PAGES),
    '<h3 class="sub">3.3 Per-Interviewer Comparison</h3>'
    +'<p class="note">Green = at/above target. Red = below target. Latrine &amp; Water target: &ge;80%. HIV Aware: &ge;90%.</p>'
    +'<table class="dt">'
    +'<thead><tr><th>Interviewer</th><th class="c">HHs</th><th class="c">Latrine</th><th class="c">Water Tx</th><th class="c">HIV Aware</th><th class="c">HIV Test</th><th class="c">Flags</th><th>Top Illness</th></tr></thead>'
    +'<tbody>'+ivRows+'</tbody>'
    +'<tfoot><tr>'
    +'<td class="lbl">CLASS TOTAL</td>'
    +'<td class="c">'+n+'</td>'
    +'<td class="c" style="color:'+(_pct(latrine,n)>=80?'#1a5c35':'#c0392b')+'">'+_pct(latrine,n)+'%</td>'
    +'<td class="c" style="color:'+(_pct(waterTx,n)>=80?'#1a5c35':'#c0392b')+'">'+_pct(waterTx,n)+'%</td>'
    +'<td class="c" style="color:'+(_pct(hivHeard,n)>=90?'#1a5c35':'#c0392b')+'">'+_pct(hivHeard,n)+'%</td>'
    +'<td class="c" style="color:'+(_pct(hivTest,n)>=50?'#1a5c35':'#e67e22')+'">'+_pct(hivTest,n)+'%</td>'
    +'<td class="c" style="color:'+(allFlags>0?'#c0392b':'#1a5c35')+'">'+allFlags+'</td>'
    +'<td class="lbl">'+(topIll[0]?topIll[0][0]:'—')+'</td>'
    +'</tr></tfoot></table>'
    +'<h2 class="sec">4. Discussion</h2>'
    +'<p class="bt">Class-aggregated data from '+n+' households across '+locs.length+' location'+(locs.length!==1?'s':'')+' reveals '
      +(_pct(latrine,n)<80?'latrine coverage of '+_pct(latrine,n)+'% — '+(80-_pct(latrine,n))+' points below the 80% national target, representing the most critical gap.':'satisfactory latrine coverage above the national target.')+' '
      +(_pct(waterTx,n)<80?'Water treatment at '+_pct(waterTx,n)+'% is below the threshold — waterborne disease risk is high.':'Water treatment at '+_pct(waterTx,n)+'% is satisfactory.')+'</p>'
    +'<p class="bt">Inter-interviewer variation reflects genuine community-level heterogeneity across different geographic areas. Areas with lower indicators should be prioritised for targeted interventions.'+(topIll.length?' '+topIll[0][0]+' prevalence of '+_pct(topIll[0][1],n)+'% is consistent with epidemiological patterns in rural Kisii County.':'')+'</p>'
    +'<h2 class="sec">5. Conclusion</h2>'
    +'<p class="bt">The class-wide analysis has generated valuable data on the health status of households in Nyamache Sub County. Findings confirm the presence of preventable health risks amenable to targeted public health interventions. Individual interviewer reports provide granular household-level findings per survey area.</p>'
    +'<p class="bt">Findings are submitted to the course coordinator, Nyamache Sub County Hospital health management team, and the Kisii County Department of Health for review, action planning, and integration into the sub-county health planning cycle.</p>'
  );

  // ── Page 4: Recommendations + Signatures ──
  const p4 = _page(4,TOTAL_PAGES, hdr, _pf(4,TOTAL_PAGES),
    '<h2 class="sec">6. Recommendations</h2>'
    +grecs.map(rc=>_flag(rc.lvl,rc.t,rc.b)).join('')
    +'<h2 class="sec">Submission &amp; Approval</h2>'
    +'<p class="bt">This report is submitted on behalf of the Community Health Practical Group, Great Lakes University of Kisumu. Data was collected by '+ivNames.join(', ')+' under faculty supervision and Nyamache Sub County Hospital.</p>'
    +_sigs([
      ['Group Leader / Coordinator','Community Health Practical Group'],
      ['Course Coordinator','Community Health &middot; GLU Kisumu'],
      ['Sub-County Health Officer','Nyamache Sub County Hospital, Kisii County'],
    ])
    +'<p class="note" style="margin-top:12pt;text-align:center">Generated '+now+' &middot; Community Health Survey System v2.0 &middot; Great Lakes University of Kisumu &middot; &copy; 2026 HazzinBR</p>'
  );

  return _doc('Group_Report_'+now.replace(/\s+/g,'_'), p0+p2+p3+p4);
}


// ─────────────────────────────────────────────────────────────────
//  ADMIN ENTRY POINTS
// ─────────────────────────────────────────────────────────────────
async function openInterviewerReport(interviewer){
  if(typeof _admRecs==='undefined'||!_admRecs.length){showToast('No records loaded — tap Refresh',true);return;}
  const recs=_admRecs.filter(r=>r.interviewer===interviewer);
  if(!recs.length){showToast('No records for '+interviewer,true);return;}
  showToast('Building report...');
  const student=await _getStudentDetails(interviewer);
  const html=buildInterviewerReport(interviewer,recs,student);
  _openReportFrame(html,'📑 Report — '+interviewer);
}

function openAllInterviewerReports(){
  if(typeof _admRecs==='undefined'||!_admRecs.length){showToast('No records loaded — tap Refresh',true);return;}
  const ivNames=[...new Set(_admRecs.map(r=>r.interviewer||'Unknown'))].filter(Boolean).sort();
  if(ivNames.length===1){openInterviewerReport(ivNames[0]);return;}

  var ex=document.getElementById('rpt-menu');if(ex)ex.remove();
  var menu=document.createElement('div');
  menu.id='rpt-menu';
  menu.style.cssText='position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,.6);display:flex;align-items:flex-end;justify-content:center;';
  var btns='';
  ivNames.forEach(function(iv){
    var cnt=_admRecs.filter(function(r){return r.interviewer===iv;}).length;
    btns+='<button class="rpt-iv-btn" data-iv="'+encodeURIComponent(iv)+'" style="width:100%;padding:12px 16px;background:#f4f8f5;border:1.5px solid #cce0d4;border-radius:12px;font-family:inherit;font-size:.88rem;font-weight:700;color:#1a5c35;cursor:pointer;text-align:left;display:flex;justify-content:space-between;align-items:center">📑 '+iv+'<span style="font-size:.7rem;font-weight:400;color:#6b8a74">'+cnt+' record'+(cnt!==1?'s':'')+'</span></button>';
  });
  menu.innerHTML='<div style="background:#fff;width:100%;max-width:480px;border-radius:20px 20px 0 0;padding:20px 16px calc(20px + env(safe-area-inset-bottom))">'
    +'<div style="font-weight:800;font-size:1rem;color:#1a5c35;margin-bottom:4px">📑 Select Report</div>'
    +'<div style="font-size:.75rem;color:#6b8a74;margin-bottom:14px">Individual interviewer report or full class group report</div>'
    +'<div style="display:flex;flex-direction:column;gap:8px">'+btns
    +'<button id="rpt-grp" style="width:100%;padding:12px 16px;background:linear-gradient(135deg,#1a5c35,#1a4060);border:none;border-radius:12px;font-family:inherit;font-size:.88rem;font-weight:700;color:#fff;cursor:pointer;text-align:left;display:flex;justify-content:space-between;align-items:center">👥 Full Class Group Report<span style="font-size:.7rem;opacity:.7">'+_admRecs.length+' total records</span></button>'
    +'<button id="rpt-cancel" style="width:100%;padding:11px;background:#f0f0f0;border:none;border-radius:12px;font-family:inherit;font-size:.85rem;cursor:pointer;color:#888">Cancel</button>'
    +'</div></div>';
  document.body.appendChild(menu);
  menu.querySelectorAll('.rpt-iv-btn').forEach(function(btn){
    btn.addEventListener('click',function(){
      var iv=decodeURIComponent(btn.getAttribute('data-iv'));
      menu.remove();openInterviewerReport(iv);
    });
  });
  document.getElementById('rpt-grp').addEventListener('click',function(){menu.remove();openGroupReport();});
  document.getElementById('rpt-cancel').addEventListener('click',function(){menu.remove();});
  menu.addEventListener('click',function(e){if(e.target===menu)menu.remove();});
}

async function openGroupReport(){
  if(typeof _admRecs==='undefined'||!_admRecs.length){showToast('No records loaded — tap Refresh',true);return;}
  showToast('Building group report...');
  const ivNames=[...new Set(_admRecs.map(r=>r.interviewer||'Unknown'))].sort();
  const students={};
  for(const iv of ivNames){students[iv]=await _getStudentDetails(iv);}
  const html=buildGroupReport(_admRecs,students);
  _openReportFrame(html,'👥 Class Group Report');
}

function _openReportFrame(html, title){
  const ov=document.getElementById('report-overlay');
  const fr=document.getElementById('report-frame');
  const ti=document.getElementById('report-title');
  if(!ov||!fr){showToast('Report error',true);return;}
  const doc=fr.contentDocument||fr.contentWindow.document;
  doc.open();doc.write(html);doc.close();
  if(ti)ti.textContent=title;
  ov.classList.add('open');
}


// ─────────────────────────────────────────────────────────────────
//  DOWNLOAD — downloads the report as a self-contained HTML file
//  The file opens perfectly in any browser, prints as Letter PDF
// ─────────────────────────────────────────────────────────────────
function printReport(){
  const fr=document.getElementById('report-frame');
  if(!fr){showToast('No report open',true);return;}
  const ti=document.getElementById('report-title');
  const raw=(ti?ti.textContent:'Health-Report').replace(/[^a-zA-Z0-9\s\-]/g,'').trim().replace(/\s+/g,'_');
  const filename=(raw||'Health-Report')+'_'+new Date().toISOString().split('T')[0]+'.html';
  try{
    const innerDoc=fr.contentDocument||fr.contentWindow.document;
    const html='<!DOCTYPE html>'+innerDoc.documentElement.outerHTML;
    const blob=new Blob([html],{type:'text/html;charset=utf-8'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.href=url;a.download=filename;
    document.body.appendChild(a);a.click();
    document.body.removeChild(a);URL.revokeObjectURL(url);
    showToast('✓ File downloaded — open it to view or print as PDF');
  }catch(e){showToast('Error: '+e.message,true);}
}
function closeReportOverlay(){ document.getElementById('report-overlay')?.classList.remove('open'); }
function startNewSurveyFromReport(){ closeReportOverlay(); newRec(); showToast('✓ New survey started'); }
function goHomeFromReport(){ closeReportOverlay(); goSec(0,'back'); }


// ─────────────────────────────────────────────────────────────────
//  SURVEY FINISH MODAL REPORTS (brief / full / IMRaD)
// ─────────────────────────────────────────────────────────────────
function openBriefReport(){ closeFinish(); _openReportFrame(buildBriefReport(cRec()),'📋 Brief Report'); }
function openFullReport(){  closeFinish(); _openReportFrame(buildFullReport(),'📄 Full Report'); }
function openIMRaDReport(){ closeFinish(); _openReportFrame(buildIMRaDReport(cRec()),'📑 IMRaD Report'); }
function exportJSON(){
  closeFinish();
  const rec=cRec();
  const blob=new Blob([JSON.stringify(rec,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;a.download='survey_'+(rec.interviewer_name||'record').replace(/\s/g,'_')+'_'+(rec.interview_date||new Date().toISOString().split('T')[0])+'.json';
  a.click();URL.revokeObjectURL(url);
  showToast('✓ JSON saved');
}


// ── BRIEF / FULL / IMRAD builders (used by survey finish modal) ──

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
