/* ══════════════════════════════════════════════════════════════════
   Community Health Survey — Official Report System
   Great Lakes University of Kisumu · Nyamache Sub County Hospital
   Ministry of Health Kenya — Public Health Report Format
   © 2026 HazzinBR
   ══════════════════════════════════════════════════════════════════ */
/* ══════════════════════════════════════════════════════════════════
   Community Health Survey — Official Report System
   Great Lakes University of Kisumu · Nyamache Sub County Hospital
   Ministry of Health Kenya — Public Health Report Format
   © 2026 HazzinBR
   ══════════════════════════════════════════════════════════════════ */

// ─────────────────────────────────────────────────────────────────
//  SHARED REPORT UTILITIES
// ─────────────────────────────────────────────────────────────────

const RPT_LOGO_SVG = `<svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <rect width="48" height="48" rx="10" fill="#1a5c35"/>
  <path d="M24 10 L24 38 M10 24 L38 24" stroke="#fff" stroke-width="5" stroke-linecap="round"/>
  <circle cx="24" cy="24" r="14" fill="none" stroke="rgba(255,255,255,.3)" stroke-width="2"/>
</svg>`;

const RPT_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Times+New+Roman:ital,wght@0,400;0,700;1,400&family=Arial:wght@400;700&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');

*{box-sizing:border-box;margin:0;padding:0;}
html{font-size:12pt;}
body{
  font-family:'Arial','Helvetica',sans-serif;
  background:#e8e8e8;
  color:#1a1a1a;
  line-height:1.5;
}
.page{
  width:210mm;
  max-width:100%;
  margin:0 auto;
  background:#fff;
  box-shadow:0 0 30px rgba(0,0,0,.12);
}

/* ── COVER PAGE ── */
.cover{
  width:100%;
  min-height:277mm;
  display:flex;flex-direction:column;
  page-break-after:always;
  background:#fff;
}
.cover-band{
  background:linear-gradient(135deg,#0a3d1f 0%,#1a5c35 40%,#1a4060 100%);
  height:12px;width:100%;
}
.cover-body{
  flex:1;display:flex;flex-direction:column;
  align-items:center;justify-content:flex-start;
  padding:30px 40px 20px;
  text-align:center;
}
.cover-emblem{
  width:90px;height:90px;margin:0 auto 20px;
  background:linear-gradient(145deg,#1a5c35,#1a4060);
  border-radius:50%;
  display:flex;align-items:center;justify-content:center;
  box-shadow:0 4px 20px rgba(26,92,53,.4);
}
.cover-emblem svg{width:50px;height:50px;}
.cover-ministry{
  font-size:8pt;font-weight:700;letter-spacing:2px;
  text-transform:uppercase;color:#6b8a74;margin-bottom:4px;
}
.cover-university{
  font-size:11pt;font-weight:700;color:#1a5c35;
  margin-bottom:24px;letter-spacing:.5px;
}
.cover-divider{
  width:60px;height:3px;background:linear-gradient(90deg,#1a5c35,#1a4060);
  margin:0 auto 24px;border-radius:2px;
}
.cover-report-type{
  font-size:8pt;font-weight:700;letter-spacing:3px;
  text-transform:uppercase;color:#888;margin-bottom:8px;
}
.cover-title{
  font-family:'Arial',sans-serif;
  font-size:20pt;font-weight:700;
  color:#0f1f18;line-height:1.25;
  margin-bottom:10px;letter-spacing:-.3px;
}
.cover-subtitle{
  font-size:11pt;color:#3a5a4a;
  margin-bottom:32px;line-height:1.5;
}
.cover-meta-box{
  background:#f4f8f5;border:1px solid #cce0d4;
  border-radius:8px;padding:16px 24px;
  width:100%;max-width:400px;
  margin:0 auto 32px;
  text-align:left;
}
.cover-meta-row{
  display:flex;justify-content:space-between;
  padding:5px 0;border-bottom:1px solid #e0ede5;
  font-size:9pt;
}
.cover-meta-row:last-child{border-bottom:none;}
.cover-meta-label{color:#6b8a74;font-weight:700;}
.cover-meta-value{color:#1a2b22;font-weight:600;text-align:right;word-break:break-all;}
.cover-footer{
  background:#f4f8f5;border-top:2px solid #1a5c35;
  padding:10px 20px;display:flex;justify-content:space-between;
  align-items:center;font-size:7pt;color:#6b8a74;
  flex-shrink:0;margin-top:auto;
}
.cover-footer-logo{display:flex;align-items:center;gap:8px;}
.cover-footer-logo span{font-weight:700;color:#1a5c35;}

/* ── DOCUMENT BODY ── */
.doc{padding:12mm 15mm 20mm;}
.doc-header{
  display:flex;align-items:flex-start;justify-content:space-between;
  border-bottom:2px solid #1a5c35;padding-bottom:10px;margin-bottom:18px;
}
.doc-header-left{flex:1;}
.doc-header-right{
  text-align:right;font-size:8pt;color:#888;line-height:1.8;
}
.doc-org{font-size:8pt;font-weight:700;color:#1a5c35;letter-spacing:.5px;text-transform:uppercase;}
.doc-title{font-size:13pt;font-weight:700;color:#0f1f18;margin-top:3px;line-height:1.3;}
.doc-subtitle{font-size:9pt;color:#555;margin-top:2px;}

/* ── SECTION HEADINGS ── */
h2.sec{
  font-size:10pt;font-weight:700;text-transform:uppercase;
  letter-spacing:1px;color:#fff;
  background:linear-gradient(135deg,#1a5c35,#1a4060);
  padding:7px 14px;margin:20px 0 10px;
  border-radius:4px;
  -webkit-print-color-adjust:exact;print-color-adjust:exact;
}
h3.sub{
  font-size:10pt;font-weight:700;color:#1a5c35;
  border-left:3px solid #1a5c35;padding-left:9px;
  margin:14px 0 8px;
}
h4.sub2{
  font-size:9.5pt;font-weight:700;color:#1a2b22;
  margin:10px 0 6px;
}
p.body-text{font-size:9.5pt;line-height:1.7;color:#1a2b22;margin-bottom:8px;}
p.note{font-size:8.5pt;color:#6b8a74;font-style:italic;margin-bottom:6px;}

/* ── DATA TABLE ── */
table.data-tbl{
  width:100%;border-collapse:collapse;
  font-size:8.5pt;margin-bottom:12px;
}
table.data-tbl thead th{
  background:#1a5c35;color:#fff;
  padding:7px 9px;text-align:left;font-weight:700;
  font-size:8pt;letter-spacing:.3px;
  -webkit-print-color-adjust:exact;print-color-adjust:exact;
}
table.data-tbl thead th.center{text-align:center;}
table.data-tbl tbody td{
  padding:6px 9px;border-bottom:1px solid #e8f0e8;
  font-size:8.5pt;vertical-align:top;
}
table.data-tbl tbody tr:nth-child(even) td{background:#f8fbf8;}
table.data-tbl tbody td.label{font-weight:600;color:#1a5c35;white-space:nowrap;}
table.data-tbl tbody td.center{text-align:center;}
table.data-tbl tbody td.num{text-align:center;font-weight:700;}

/* ── INDICATOR BARS ── */
.ind-row{display:flex;align-items:center;gap:10px;margin-bottom:7px;}
.ind-label{font-size:8.5pt;font-weight:600;width:160px;flex-shrink:0;color:#1a2b22;}
.ind-track{flex:1;height:10px;background:#e8f0e8;border-radius:99px;overflow:hidden;}
.ind-fill{height:100%;border-radius:99px;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
.ind-pct{font-size:8pt;font-weight:700;min-width:45px;text-align:right;}

/* ── STAT BOXES ── */
.stat-row{display:flex;gap:8px;margin-bottom:10px;flex-wrap:wrap;}
.stat-box{
  flex:1;min-width:80px;
  background:#f4f8f5;border:1px solid #cce0d4;
  border-radius:6px;padding:10px 8px;text-align:center;
  border-top:3px solid #1a5c35;
  -webkit-print-color-adjust:exact;print-color-adjust:exact;
}
.stat-box.red{border-top-color:#c0392b;background:#fdf4f4;}
.stat-box.amber{border-top-color:#e67e22;background:#fefbf4;}
.stat-box.blue{border-top-color:#1a4060;background:#f4f6fb;}
.stat-n{font-size:18pt;font-weight:700;line-height:1;color:#1a5c35;}
.stat-box.red .stat-n{color:#c0392b;}
.stat-box.amber .stat-n{color:#e67e22;}
.stat-box.blue .stat-n{color:#1a4060;}
.stat-l{font-size:7pt;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#888;margin-top:3px;}

/* ── FLAG BOXES ── */
.flag-critical{
  background:#fdf4f4;border-left:4px solid #c0392b;
  border-radius:0 4px 4px 0;
  padding:8px 11px;margin-bottom:6px;font-size:8.5pt;
  -webkit-print-color-adjust:exact;print-color-adjust:exact;
}
.flag-warning{
  background:#fefbf4;border-left:4px solid #e67e22;
  border-radius:0 4px 4px 0;
  padding:8px 11px;margin-bottom:6px;font-size:8.5pt;
  -webkit-print-color-adjust:exact;print-color-adjust:exact;
}
.flag-ok{
  background:#f4fbf4;border-left:4px solid #1a5c35;
  border-radius:0 4px 4px 0;
  padding:8px 11px;margin-bottom:6px;font-size:8.5pt;
  -webkit-print-color-adjust:exact;print-color-adjust:exact;
}
.flag-title{font-weight:700;margin-bottom:2px;}
.flag-critical .flag-title{color:#c0392b;}
.flag-warning .flag-title{color:#e67e22;}
.flag-ok .flag-title{color:#1a5c35;}
.flag-body{color:#333;line-height:1.5;}

/* ── PAGE BREAK ── */
.page-break{page-break-before:always;}

/* ── SIGNATURE LINE ── */
.sig-section{
  margin-top:30px;border-top:1px solid #cce0d4;
  padding-top:16px;display:flex;gap:30px;flex-wrap:wrap;
}
.sig-box{flex:1;min-width:160px;}
.sig-line{border-bottom:1px solid #333;margin-bottom:4px;height:30px;}
.sig-label{font-size:7.5pt;color:#888;}
.sig-name{font-size:8pt;font-weight:700;color:#1a2b22;margin-top:2px;}

/* ── FOOTER ON EACH PAGE ── */
/* doc-footer removed — using cover-footer instead */


/* ── PRINT BUTTON ── */
.print-fab{
  position:fixed;bottom:24px;right:24px;
  background:linear-gradient(135deg,#1a5c35,#1a4060);
  color:#fff;border:none;border-radius:14px;
  padding:13px 22px;font-family:inherit;font-size:10pt;
  font-weight:700;cursor:pointer;
  box-shadow:0 4px 20px rgba(0,0,0,.25);
  display:flex;align-items:center;gap:8px;
  z-index:1000;
}
.print-fab:active{opacity:.85;}
/* Screen helper */
.page-break{page-break-before:always;}

/* Force all colours to print */
.cover-top-band,.cover-footer,h2.sec,.stat-box,.flag-critical,.flag-warning,.flag-ok,
table.data-tbl thead th,table.data-tbl tbody tr:nth-child(even) td{
  -webkit-print-color-adjust:exact;
  print-color-adjust:exact;
}

@media print{
  *{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;}
  html,body{background:#fff!important;margin:0!important;padding:0!important;}
  .page{box-shadow:none!important;width:100%!important;}
  .cover{page-break-after:always!important;}
  .page-break{page-break-before:always!important;}
  h2.sec{page-break-after:avoid!important;}
  h3.sub{page-break-after:avoid!important;}
  tr{page-break-inside:avoid!important;}
  .sig-section{page-break-inside:avoid!important;}
  .print-fab{display:none!important;}
}
@page{
  size:A4 portrait;
  margin:12mm 15mm 15mm 15mm;
}
`;

// ── Student details lookup (reg_number + email from Supabase) ──
async function _getStudentDetails(fullName){
  if(typeof _admStudents!=='undefined'&&Array.isArray(_admStudents)){
    const s=_admStudents.find(st=>st.full_name&&st.full_name.toLowerCase()===fullName.toLowerCase());
    if(s)return s;
  }
  try{
    const session=JSON.parse(localStorage.getItem('chsa_auth')||'null');
    if(session&&session.full_name&&session.full_name.toLowerCase()===fullName.toLowerCase())return session;
  }catch(e){}
  try{
    const res=await fetch(SUPABASE_URL+'/rest/v1/chsa_students?full_name=eq.'+encodeURIComponent(fullName)+'&select=reg_number,full_name,email',
      {headers:{apikey:SUPABASE_KEY,'Authorization':'Bearer '+SUPABASE_KEY}});
    if(res.ok){const d=await res.json();if(d&&d.length)return d[0];}
  }catch(e){}
  return {full_name:fullName,reg_number:'—',email:'—'};
}

// ─────────────────────────────────────────────────────────────────
//  HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────────
function _pct(a,b){ return b>0?Math.round(a/b*100):0; }
function _count(arr,field,val){ return arr.filter(r=>r[field]===val).length; }
function _avg(arr,field){ const v=arr.map(r=>parseInt(r[field])||0).filter(x=>x>0); return v.length?Math.round(v.reduce((a,b)=>a+b,0)/v.length):0; }
function _illCount(arr){
  const c={};
  arr.forEach(r=>{(r.illnesses||'').split(',').forEach(x=>{const k=x.trim();if(k&&k!=='None'&&k!=='')c[k]=(c[k]||0)+1;});});
  return Object.entries(c).sort((a,b)=>b[1]-a[1]);
}
function _flags(r){
  const f=[];
  if(r.latrine==='No') f.push('No pit latrine — open defecation risk');
  if(r.water_treated==='No') f.push('Drinking water not treated');
  if(r.hiv_heard==='No') f.push('No HIV/AIDS awareness');
  try{
    const raw=typeof r.raw_json==='string'?JSON.parse(r.raw_json||'{}'):(r.raw_json||{});
    if(raw.b_type==='Permanent'&&raw.b_roof==='Grass Thatched') f.push('Permanent house with grass-thatched roof — structural inconsistency');
    if(raw.b_cook==='Inside'&&(raw.b_fuel==='Firewood'||raw.b_fuel==='Charcoal')&&raw.b_ventil==='Poor') f.push('Indoor cooking with '+raw.b_fuel+' and poor ventilation — respiratory risk');
    if(raw.i_circ==='Female'||raw.i_circ==='Both') f.push('Female Genital Mutilation (FGM) reported — requires follow-up');
    if(raw.b_smoke==='Yes'&&raw.b_smoke_in==='Yes') f.push('Smoking inside household — passive smoking risk');
  }catch(e){}
  return f;
}
function _indBar(label, val, max, color='#1a5c35'){
  const pct=_pct(val,max);
  const c = pct>=70?'#1a5c35':pct>=50?'#e67e22':'#c0392b';
  return `<div class="ind-row">
    <div class="ind-label">${label}</div>
    <div class="ind-track"><div class="ind-fill" style="width:${pct}%;background:${c}"></div></div>
    <div class="ind-pct" style="color:${c}">${val}/${max} (${pct}%)</div>
  </div>`;
}
function _statBox(n,label,cls=''){
  return `<div class="stat-box ${cls}"><div class="stat-n">${n}</div><div class="stat-l">${label}</div></div>`;
}
function _rptHeader(title, subtitle, reportType){
  return `<div class="doc-header">
    <div class="doc-header-left">
      <div class="doc-org">Great Lakes University of Kisumu · Nyamache Sub County Hospital</div>
      <div class="doc-title">${title}</div>
      <div class="doc-subtitle">${subtitle}</div>
    </div>
    <div class="doc-header-right">
      ${reportType}<br>
      Community Health Situation Analysis<br>
      Kisii County, Kenya
    </div>
  </div>`;
}
function _coverPage(title, subtitle, metaRows, reportType){
  const now = new Date().toLocaleDateString('en-KE',{year:'numeric',month:'long',day:'numeric'});
  return `<div class="cover">
  <div class="cover-band"></div>
  <div class="cover-body">
    <div class="cover-emblem">
      <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 10 L24 38 M10 24 L38 24" stroke="#fff" stroke-width="5" stroke-linecap="round"/>
        <circle cx="24" cy="24" r="14" fill="none" stroke="rgba(255,255,255,.5)" stroke-width="2"/>
      </svg>
    </div>
    <div class="cover-ministry">Republic of Kenya · Ministry of Health</div>
    <div class="cover-university">Great Lakes University of Kisumu</div>
    <div class="cover-divider"></div>
    <div class="cover-report-type">${reportType}</div>
    <div class="cover-title">${title}</div>
    <div class="cover-subtitle">${subtitle}</div>
    <div class="cover-meta-box">
      ${metaRows.map(([k,v])=>`<div class="cover-meta-row"><span class="cover-meta-label">${k}</span><span class="cover-meta-value">${v}</span></div>`).join('')}
      <div class="cover-meta-row"><span class="cover-meta-label">Date Generated</span><span class="cover-meta-value">${now}</span></div>
    </div>
    <p style="font-size:8pt;color:#999;max-width:380px;line-height:1.6">This report is produced by the Community Health Survey System in fulfillment of the community health situation analysis practical requirements. Data collected through household interviews in Nyamache Sub County, Kisii County.</p>
  </div>
  <div class="cover-footer">
    <div class="cover-footer-logo">
      <svg width="28" height="28" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" rx="8" fill="#1a5c35"/><path d="M24 10L24 38M10 24L38 24" stroke="#fff" stroke-width="5" stroke-linecap="round"/></svg>
      <span>Community Health Survey System v2.0</span>
    </div>
    <div style="color:#999">Built by HazzinBR · Free to use · Nyamache Sub County Hospital</div>
    <div style="color:#999">Confidential — For Official Use Only</div>
  </div>
</div>`;
}


// ─────────────────────────────────────────────────────────────────
//  REPORT 1 — INDIVIDUAL INTERVIEWER OFFICIAL REPORT
//  Called from admin: openInterviewerReport(name)
//  One full A4 document per interviewer
//  Sections: Cover · Executive Summary · Introduction · Methods ·
//            Results (per case + aggregated) · Discussion · Conclusion ·
//            Recommendations · Signature
// ─────────────────────────────────────────────────────────────────
function buildInterviewerReport(interviewer, records, student){
  student=student||{full_name:interviewer,reg_number:"—",email:"—"};
  const n = records.length;
  if(!n) return '<html><body>No records for this interviewer.</body></html>';

  const now = new Date().toLocaleDateString('en-KE',{year:'numeric',month:'long',day:'numeric'});
  const dates = records.map(r=>r.interview_date||'').filter(Boolean).sort();
  const dateRange = dates.length>1 ? `${dates[0]} to ${dates[dates.length-1]}` : dates[0]||now;
  const locs = [...new Set(records.map(r=>r.location||'').filter(Boolean))];
  const locStr = locs.join(', ')||'Nyamache Sub County';

  // ── Aggregate metrics ──
  const latrine    = _count(records,'latrine','Yes');
  const waterTx    = _count(records,'water_treated','Yes');
  const hivHeard   = _count(records,'hiv_heard','Yes');
  const hivTested  = _count(records,'hiv_tested','Yes');
  const deathsHH   = _count(records,'deaths_5yr','Yes');
  const totalDeaths= records.reduce((s,r)=>s+(parseInt(r.deaths_count)||0),0);
  const permanent  = _count(records,'house_type','Permanent');
  const semi       = _count(records,'house_type','Semi-permanent');
  const temp       = _count(records,'house_type','Temporary');
  const female     = _count(records,'respondent_gender','Female');
  const male       = _count(records,'respondent_gender','Male');
  const avgAge     = _avg(records,'respondent_age');
  const topIll     = _illCount(records);
  const illMax     = topIll[0]?.[1]||1;

  // ── All flags across records ──
  const allFlags = [];
  records.forEach(r=>{ _flags(r).forEach(f=>allFlags.push({r,f})); });

  // ── Key finding for discussion ──
  const lowestIndicator =
    _pct(latrine,n)<_pct(waterTx,n) && _pct(latrine,n)<_pct(hivHeard,n) ? 'sanitation'
    : _pct(waterTx,n)<_pct(hivHeard,n) ? 'water treatment'
    : 'HIV/AIDS awareness';

  // ── Recommendations ──
  const recs = [];
  if(_pct(latrine,n)<80)  recs.push({lvl:'critical',icon:'🚽',t:'Sanitation Improvement',b:`Latrine coverage stands at ${_pct(latrine,n)}% — below the 80% national target. The ${n-latrine} household${n-latrine!==1?'s':''} without latrines must be prioritised for Community-Led Total Sanitation (CLTS) follow-up within 30 days. Escalate to the sub-county sanitation officer.`});
  if(_pct(waterTx,n)<80)  recs.push({lvl:'critical',icon:'💧',t:'Water Safety Intervention',b:`Only ${_pct(waterTx,n)}% of households treat their drinking water. Distribute WaterGuard chlorine solution and conduct community demonstrations on safe water handling. Target: 80% within 3 months.`});
  if(_pct(hivHeard,n)<90) recs.push({lvl:'critical',icon:'🔴',t:'HIV/AIDS Health Education',b:`HIV awareness at ${_pct(hivHeard,n)}% falls short of the UNAIDS 90% target. Deploy community health workers for door-to-door HIV education in ${locStr}. Establish mobile VCT outreach days.`});
  if(_pct(hivTested,n)<50) recs.push({lvl:'warning',icon:'🩺',t:'HIV Testing Uptake',b:`Only ${_pct(hivTested,n)}% of respondents have ever been tested for HIV. Integrate HIV testing into all community health visits and facility-based services.`});
  if(topIll.length&&topIll[0][1]>n*0.2) recs.push({lvl:'warning',icon:'🏥',t:`${topIll[0][0]} Prevention`,b:`${topIll[0][0]} is the most prevalent reported illness (${topIll[0][1]} cases, ${_pct(topIll[0][1],n)}%). ${topIll[0][0]==='Malaria'?'Promote insecticide-treated bed net (ITN) use, indoor residual spraying (IRS), and elimination of stagnant water breeding sites.':topIll[0][0].includes('Diarrh')?'Address through water treatment, handwashing promotion and latrine construction.':'Targeted health education, early diagnosis and treatment access.'}`});
  if(deathsHH>0) recs.push({lvl:'warning',icon:'📋',t:'Mortality Follow-Up',b:`${deathsHH} household${deathsHH!==1?'s':''} reported a total of ${totalDeaths} death${totalDeaths!==1?'s':''} in the past 5 years. Conduct verbal autopsy to determine cause-specific mortality. Refer findings to the sub-county health officer for epidemiological follow-up.`});
  if(allFlags.filter(x=>x.f.includes('FGM')).length) recs.push({lvl:'critical',icon:'⚠',t:'FGM Case Referral',b:`Female Genital Mutilation was reported in ${allFlags.filter(x=>x.f.includes('FGM')).length} household${allFlags.filter(x=>x.f.includes('FGM')).length!==1?'s':''}. Refer cases to the gender-based violence response team and the sub-county anti-FGM coordinator immediately.`});
  if(!recs.length) recs.push({lvl:'good',icon:'✅',t:'Maintain Current Standards',b:`All key health indicators are within acceptable ranges for this survey area. Continue routine community health surveillance, health education, and household follow-up visits every 6 months.`});

  // ── Per-case table rows ──
  const caseRows = records.map((r,i)=>{
    const f = _flags(r);
    const raw = (() => { try { return typeof r.raw_json==='string'?JSON.parse(r.raw_json||'{}'):(r.raw_json||{}); }catch(e){return {};} })();
    return `<tr>
      <td class="center label">${i+1}</td>
      <td>${r.interview_date||'—'}</td>
      <td>${r.location||'—'}</td>
      <td class="center">${r.respondent_age||'?'} · ${(r.respondent_gender||'?').charAt(0)}</td>
      <td>${r.house_type||'—'}</td>
      <td class="center" style="color:${r.latrine==='Yes'?'#1a5c35':'#c0392b'};font-weight:700">${r.latrine==='Yes'?'Yes':'No'}</td>
      <td class="center" style="color:${r.water_treated==='Yes'?'#1a5c35':'#c0392b'};font-weight:700">${r.water_treated==='Yes'?'Yes':'No'}</td>
      <td class="center" style="color:${r.hiv_heard==='Yes'?'#1a5c35':'#c0392b'};font-weight:700">${r.hiv_heard==='Yes'?'Yes':'No'}</td>
      <td style="font-size:7.5pt">${r.illnesses||'None'}</td>
      <td class="center" style="color:${f.length?'#c0392b':'#1a5c35'};font-weight:700">${f.length||'✓'}</td>
    </tr>`;
  }).join('');

  const flagLvl = (f) => f.includes('FGM')||f.includes('inconsistency')?'flag-critical':'flag-warning';

  return `<!DOCTYPE html><html lang="en"><head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Interviewer Report — ${interviewer}</title>
<style>${RPT_CSS}</style>
</head><body>
<div class="page">

${_coverPage(
  'Community Health Situation Analysis',
  `Interviewer Field Report — ${interviewer}`,
  [
    ['Full Name', student.full_name||interviewer],
    ['Admission / ID No.', student.reg_number||'—'],
    ['Email', student.email||'—'],
    ['Institution', 'Great Lakes University of Kisumu'],
    ['Survey Area', locStr],
    ['Survey Period', dateRange],
    ['Total Households', `${n} household${n!==1?'s':''}`],
    ['Supervised by', 'Nyamache Sub County Hospital'],
  ],
  'OFFICIAL FIELD REPORT'
)}

<div class="doc">
${_rptHeader(
  `Community Health Situation Analysis — ${interviewer}`,
  `Reg: ${student.reg_number||'—'} · ${student.email||'—'} · Nyamache Sub County · ${dateRange}`,
  'Interviewer Field Report'
)}

<!-- ═══ EXECUTIVE SUMMARY ═══ -->
<h2 class="sec">Executive Summary</h2>
<p class="body-text">This report presents findings from <strong>${n} household interview${n!==1?'s':''}</strong> conducted by <strong>${student.full_name||interviewer}</strong> (Reg: ${student.reg_number||"—"}) in <strong>${locStr}</strong> during the period <strong>${dateRange}</strong>, as part of the Community Health Situation Analysis programme at <strong>Great Lakes University of Kisumu</strong> in partnership with <strong>Nyamache Sub County Hospital</strong>, Kisii County.</p>
<p class="body-text">Key findings indicate that latrine coverage stands at <strong>${_pct(latrine,n)}%</strong> (${latrine}/${n} households), water treatment compliance at <strong>${_pct(waterTx,n)}%</strong>, and HIV/AIDS awareness at <strong>${_pct(hivHeard,n)}%</strong>. The most prevalent illness reported was <strong>${topIll[0]?topIll[0][0]:'none identified'}</strong>${topIll[0]?` affecting ${topIll[0][1]} households (${_pct(topIll[0][1],n)}%)`:''}.${deathsHH>0?` A total of <strong>${totalDeaths} death${totalDeaths!==1?'s':''}</strong> were reported across <strong>${deathsHH} household${deathsHH!==1?'s':''}</strong> in the past five years.`:''} A total of <strong>${allFlags.length} red flag${allFlags.length!==1?'s':''}</strong> were identified requiring follow-up. The primary concern identified is <strong>${lowestIndicator}</strong>, which represents the most significant health risk in the surveyed households.</p>
<div class="stat-row">
  ${_statBox(n,'Households','blue')}
  ${_statBox(_pct(latrine,n)+'%','Latrine Cover',_pct(latrine,n)<60?'red':_pct(latrine,n)<80?'amber':'')}
  ${_statBox(_pct(waterTx,n)+'%','Water Treated',_pct(waterTx,n)<60?'red':_pct(waterTx,n)<80?'amber':'')}
  ${_statBox(_pct(hivHeard,n)+'%','HIV Aware',_pct(hivHeard,n)<70?'red':_pct(hivHeard,n)<90?'amber':'')}
  ${_statBox(allFlags.length,'Red Flags',allFlags.length>0?'red':'')}
  ${_statBox(totalDeaths,'Deaths (5yr)',totalDeaths>0?'amber':'')}
</div>

<!-- ═══ 1. INTRODUCTION ═══ -->
<h2 class="sec">1. Introduction</h2>
<p class="body-text">Community health situation analysis is a systematic approach to assessing the health status, disease burden, and social determinants of health within a defined community. This assessment was undertaken by <strong>${student.full_name||interviewer}</strong> (Admission No: <strong>${student.reg_number||"—"}</strong>${student.email?", "+student.email:""}) as a student health worker at <strong>Great Lakes University of Kisumu</strong>, under the supervision of the clinical faculty and in collaboration with the <strong>Nyamache Sub County Hospital</strong> health management team.</p>
<p class="body-text">The survey was conducted in <strong>${locStr}</strong>, Nyamache Sub County, Kisii County, covering a total of <strong>${n} households</strong> during the period <strong>${dateRange}</strong>. The primary objectives of this assessment were to: (i) document the prevailing health conditions and disease burden in the surveyed households; (ii) identify key social and environmental determinants of health; (iii) assess coverage of essential health services including water, sanitation and HIV/AIDS; and (iv) generate evidence-based recommendations for targeted health interventions.</p>
<p class="body-text">This report is submitted in partial fulfilment of the community health practical requirements and is intended for review by the course coordinator, sub-county health officer, and relevant programme managers at Nyamache Sub County Hospital.</p>

<!-- ═══ 2. METHODS ═══ -->
<h2 class="sec">2. Methods</h2>
<h3 class="sub">2.1 Study Design</h3>
<p class="body-text">A descriptive cross-sectional household survey was conducted using a pre-designed, structured questionnaire covering twelve thematic sections: Consent, Demography, Housing, Medical History, Maternal and Child Health, Nutrition, HIV/AIDS, Sanitation, Environment and Water, Cultural Practices, Common Health Problems, and Pests and Vectors.</p>
<h3 class="sub">2.2 Study Population and Sampling</h3>
<p class="body-text">Households in <strong>${locStr}</strong> were sampled through purposive community sampling, coordinated by the local community health volunteer (CHV) network. The primary respondent in each household was required to be a consenting adult aged 18–85 years. A total of <strong>${n} household${n!==1?'s':''}</strong> were successfully interviewed.</p>
<h3 class="sub">2.3 Data Collection</h3>
<p class="body-text">Data was collected by <strong>${interviewer}</strong> using the Community Health Survey Progressive Web Application (PWA), which allows offline data capture with automatic cloud synchronisation. Each interview required verbal informed consent before proceeding. Interviews were conducted in the local language where necessary, with the aid of a structured questionnaire guide.</p>
<h3 class="sub">2.4 Data Analysis</h3>
<p class="body-text">Data was analysed descriptively. Frequencies and proportions were computed for categorical variables. Key public health indicators were compared against Kenya national targets and WHO benchmarks. Red flags — defined as findings requiring immediate follow-up — were identified using pre-specified criteria embedded in the survey system.</p>
<h3 class="sub">2.5 Ethical Considerations</h3>
<p class="body-text">Verbal informed consent was obtained from each respondent prior to the interview. Respondents were informed of the purpose of the study, their right to withdraw, and the confidentiality of their responses. No names or personal identifiers were recorded in the dataset.</p>

<!-- ═══ 3. RESULTS ═══ -->
<h2 class="sec">3. Results</h2>
<h3 class="sub">3.1 Socio-Demographic Profile</h3>
<div class="stat-row">
  ${_statBox(n,'Households','blue')}
  ${_statBox(female,'Female Resp.','blue')}
  ${_statBox(male,'Male Resp.','blue')}
  ${_statBox(avgAge,'Avg Age (yrs)','blue')}
  ${_statBox(permanent,'Permanent HH','')}
  ${_statBox(locs.length,'Locations','blue')}
</div>
<table class="data-tbl">
  <thead><tr><th>Indicator</th><th>Count</th><th>Percentage</th><th>National Target</th><th>Status</th></tr></thead>
  <tbody>
    <tr><td class="label">Permanent housing</td><td class="center">${permanent}</td><td class="center">${_pct(permanent,n)}%</td><td class="center">≥50%</td><td class="center" style="color:${_pct(permanent,n)>=50?'#1a5c35':'#c0392b'};font-weight:700">${_pct(permanent,n)>=50?'✓ Met':'✗ Below'}</td></tr>
    <tr><td class="label">Semi-permanent housing</td><td class="center">${semi}</td><td class="center">${_pct(semi,n)}%</td><td class="center">—</td><td class="center">—</td></tr>
    <tr><td class="label">Temporary housing</td><td class="center">${temp}</td><td class="center">${_pct(temp,n)}%</td><td class="center">—</td><td class="center">—</td></tr>
  </tbody>
</table>

<h3 class="sub">3.2 Water, Sanitation and Hygiene (WASH)</h3>
${_indBar('Pit Latrine Coverage', latrine, n)}
${_indBar('Water Treatment', waterTx, n)}
${_indBar('Protected Water Source', _count(records,'water_treated','Yes'), n)}
<table class="data-tbl" style="margin-top:8px">
  <thead><tr><th>WASH Indicator</th><th class="center">Yes</th><th class="center">No</th><th class="center">Coverage %</th><th class="center">Target</th><th class="center">Status</th></tr></thead>
  <tbody>
    <tr><td class="label">Pit latrine access</td><td class="center">${latrine}</td><td class="center">${n-latrine}</td><td class="center">${_pct(latrine,n)}%</td><td class="center">≥80%</td><td class="center" style="color:${_pct(latrine,n)>=80?'#1a5c35':'#c0392b'};font-weight:700">${_pct(latrine,n)>=80?'✓':'✗'}</td></tr>
    <tr><td class="label">Water treatment</td><td class="center">${waterTx}</td><td class="center">${n-waterTx}</td><td class="center">${_pct(waterTx,n)}%</td><td class="center">≥80%</td><td class="center" style="color:${_pct(waterTx,n)>=80?'#1a5c35':'#c0392b'};font-weight:700">${_pct(waterTx,n)>=80?'✓':'✗'}</td></tr>
  </tbody>
</table>

<h3 class="sub">3.3 HIV/AIDS Indicators</h3>
${_indBar('HIV/AIDS Awareness', hivHeard, n)}
${_indBar('Ever Tested for HIV', hivTested, n)}
<table class="data-tbl" style="margin-top:8px">
  <thead><tr><th>HIV Indicator</th><th class="center">Yes</th><th class="center">No</th><th class="center">Coverage %</th><th class="center">Target</th><th class="center">Status</th></tr></thead>
  <tbody>
    <tr><td class="label">Heard of HIV/AIDS</td><td class="center">${hivHeard}</td><td class="center">${n-hivHeard}</td><td class="center">${_pct(hivHeard,n)}%</td><td class="center">≥90%</td><td class="center" style="color:${_pct(hivHeard,n)>=90?'#1a5c35':'#c0392b'};font-weight:700">${_pct(hivHeard,n)>=90?'✓':'✗'}</td></tr>
    <tr><td class="label">Ever tested for HIV</td><td class="center">${hivTested}</td><td class="center">${n-hivTested}</td><td class="center">${_pct(hivTested,n)}%</td><td class="center">≥95%</td><td class="center" style="color:${_pct(hivTested,n)>=95?'#1a5c35':'#c0392b'};font-weight:700">${_pct(hivTested,n)>=95?'✓':'✗'}</td></tr>
  </tbody>
</table>

<h3 class="sub">3.4 Disease Burden</h3>
<p class="body-text">The following illnesses were reported in the 6 months preceding the survey. <strong>${deathsHH} household${deathsHH!==1?'s':''}</strong> reported deaths in the past 5 years, with a total of <strong>${totalDeaths} death${totalDeaths!==1?'s':''}</strong> recorded.</p>
${topIll.length?`<table class="data-tbl">
  <thead><tr><th>Illness / Condition</th><th class="center">Cases</th><th class="center">Percentage</th><th class="center">Rank</th></tr></thead>
  <tbody>${topIll.map(([k,v],i)=>`<tr><td class="label">${k}</td><td class="center">${v}</td><td class="center">${_pct(v,n)}%</td><td class="center">#${i+1}</td></tr>`).join('')}</tbody>
</table>`:'<p class="note">No illnesses were reported across the surveyed households.</p>'}

<h3 class="sub">3.5 Summary of All Interviews</h3>
<p class="note">Table below summarises all ${n} household interviews. F=Flags raised, M=Male, F=Female. Latrine, Water & HIV columns show Yes/No response.</p>
<div style="overflow-x:auto">
<table class="data-tbl">
  <thead><tr>
    <th class="center">#</th><th>Date</th><th>Location</th>
    <th class="center">Age/Sex</th><th>House</th>
    <th class="center">Latrine</th><th class="center">Water Tx</th>
    <th class="center">HIV Aware</th><th>Illnesses</th><th class="center">Flags</th>
  </tr></thead>
  <tbody>${caseRows}</tbody>
</table>
</div>

<h3 class="sub">3.6 Red Flags Identified</h3>
${allFlags.length
  ? allFlags.map(({r,f})=>`<div class="${flagLvl(f)}">
      <div class="flag-title">⚠ ${f}</div>
      <div class="flag-body">Location: ${r.location||'?'} · Date: ${r.interview_date||'?'} · Respondent: ${r.respondent_age||'?'} yrs, ${r.respondent_gender||'?'}</div>
    </div>`).join('')
  : '<div class="flag-ok"><div class="flag-title">✓ No Critical Red Flags</div><div class="flag-body">No critical red flags were identified across all surveyed households.</div></div>'}

<!-- ═══ 4. DISCUSSION ═══ -->
<h2 class="sec">4. Discussion</h2>
<p class="body-text">The findings from this household survey in <strong>${locStr}</strong> reflect health patterns consistent with rural sub-Saharan Africa. The most critical concern identified is <strong>${lowestIndicator}</strong>, which presents the greatest risk to community health outcomes in the surveyed area.</p>
<p class="body-text">${_pct(latrine,n)<80
  ? `Latrine coverage of ${_pct(latrine,n)}% (${latrine}/${n} households) falls below the Kenya national target of 80%. Open defecation in the remaining ${n-latrine} household${n-latrine!==1?'s':''} represents a direct risk of faecal-oral disease transmission, including cholera, typhoid and diarrhoeal diseases — which remain leading causes of morbidity and mortality in Kisii County. This finding necessitates immediate community mobilisation under the Community-Led Total Sanitation framework.`
  : `Latrine coverage of ${_pct(latrine,n)}% meets the national target of 80%, which is a commendable achievement. Efforts should be made to sustain this coverage and further improve to 100% through continued community engagement and behaviour change communication.`}</p>
<p class="body-text">${_pct(waterTx,n)<80
  ? `Water treatment compliance stands at ${_pct(waterTx,n)}% — below the recommended threshold. Untreated water is the primary driver of waterborne diseases, which disproportionately affect children under five. The distribution of low-cost point-of-use water treatment products (e.g., WaterGuard) and hygiene promotion are urgently required.`
  : `Water treatment compliance of ${_pct(waterTx,n)}% is satisfactory and indicates uptake of safe water practices in the surveyed area.`}</p>
<p class="body-text">${_pct(hivHeard,n)<90
  ? `HIV/AIDS awareness at ${_pct(hivHeard,n)}% falls short of the UNAIDS 90-90-90 target. The ${n-hivHeard} respondent${n-hivHeard!==1?'s':''} who have never heard of HIV/AIDS represent a vulnerable population requiring immediate health education outreach. Low awareness is strongly correlated with low testing rates and late presentation for treatment.`
  : `HIV/AIDS awareness at ${_pct(hivHeard,n)}% is above the 90% benchmark, indicating effective prior health education in the community. Focus should now shift to ensuring that all aware individuals know their HIV status through routine testing.`}</p>
${topIll.length?`<p class="body-text">${topIll[0][0]} is the most frequently reported illness, affecting ${topIll[0][1]} household${topIll[0][1]!==1?'s':''} (${_pct(topIll[0][1],n)}%). ${topIll[0][0]==='Malaria'?'Malaria remains the leading cause of morbidity in Kisii County, driven by the sub-humid climate and the presence of stagnant water breeding sites. Promotion of insecticide-treated bed nets (ITNs), indoor residual spraying (IRS), and environmental management are the cornerstone interventions.':topIll[0][0].includes('Diarrh')?'Diarrhoeal disease burden is directly linked to the WASH deficits identified in this survey. Addressing water treatment and sanitation will have the greatest impact on reducing this burden.':'Targeted health education, community awareness, and improved access to treatment at the nearest health facility are the recommended interventions.'}</p>`:''}
${deathsHH>0?`<p class="body-text">A total of ${totalDeaths} death${totalDeaths!==1?'s':''} were reported across ${deathsHH} household${deathsHH!==1?'s':''} in the past five years. These deaths require verbal autopsy follow-up to determine cause-specific mortality and to identify any preventable deaths that should inform local health planning.</p>`:''}

<!-- ═══ 5. CONCLUSION ═══ -->
<h2 class="sec">5. Conclusion</h2>
<p class="body-text">This community health situation analysis conducted by <strong>${interviewer}</strong> has provided a systematic assessment of the health status of <strong>${n} household${n!==1?'s':''}</strong> in <strong>${locStr}</strong>, Nyamache Sub County. The key findings reveal ${_pct(latrine,n)<60||_pct(waterTx,n)<60||_pct(hivHeard,n)<70?'significant gaps in basic health coverage that require urgent intervention':'generally acceptable health coverage with targeted areas for improvement'}. ${allFlags.length>0?`A total of ${allFlags.length} red flag${allFlags.length!==1?'s':''} were identified, each requiring documented follow-up action.`:''}</p>
<p class="body-text">The data collected through this survey will inform the planning of targeted health interventions by the <strong>Nyamache Sub County Hospital</strong> health management team and contribute to the annual County Integrated Development Plan (CIDP) reporting cycle. This report is submitted for the attention of the course coordinator and the sub-county health management team for review and action.</p>

<!-- ═══ 6. RECOMMENDATIONS ═══ -->
<h2 class="sec">6. Recommendations</h2>
${recs.map(r=>`<div class="flag-${r.lvl==='critical'?'critical':r.lvl==='warning'?'warning':'ok'}">
  <div class="flag-title">${r.icon} ${r.t}</div>
  <div class="flag-body">${r.b}</div>
</div>`).join('')}

<!-- ═══ SIGNATURES ═══ -->
<h2 class="sec">Declaration and Signatures</h2>
<p class="body-text">I, <strong>${student.full_name||interviewer}</strong> (Admission No: ${student.reg_number||"—"}), hereby declare that the data presented in this report was collected personally, accurately, and in accordance with the ethical guidelines of Great Lakes University of Kisumu. All respondents provided verbal informed consent prior to participation.</p>
<div class="sig-section">
  <div class="sig-box">
    <div class="sig-line"></div>
    <div class="sig-name">${student.full_name||interviewer}</div>
    <div class="sig-label">${student.reg_number||""} · ${student.email||""} · GLU Kisumu</div>
  </div>
  <div class="sig-box">
    <div class="sig-line"></div>
    <div class="sig-name">Course Supervisor</div>
    <div class="sig-label">Faculty · Community Health · GLU Kisumu</div>
  </div>
  <div class="sig-box">
    <div class="sig-line"></div>
    <div class="sig-name">Sub-County Health Officer</div>
    <div class="sig-label">Nyamache Sub County Hospital</div>
  </div>
</div>

<p class="note" style="margin-top:20px;text-align:center">Report generated on ${now} by the Community Health Survey System v2.0 · Great Lakes University of Kisumu · Nyamache Sub County Hospital, Kisii County · © 2026 HazzinBR · Free to Use</p>

</div><!-- end .doc -->
</div><!-- end .page -->

<button class="print-fab" onclick="window.print()">🖨 Print / Save as PDF</button>
</body></html>`;
}


// ─────────────────────────────────────────────────────────────────
//  REPORT 2 — GROUP / CLASS AGGREGATED OFFICIAL REPORT
//  Called from admin: openGroupReport()
//  Full class report with individual comparison + aggregated analysis
// ─────────────────────────────────────────────────────────────────
function buildGroupReport(records,students){
  students=students||{};
  const n = records.length;
  if(!n) return '<html><body>No records loaded.</body></html>';

  const now = new Date().toLocaleDateString('en-KE',{year:'numeric',month:'long',day:'numeric'});
  const ivNames = [...new Set(records.map(r=>r.interviewer||'Unknown'))].sort();
  const dates = records.map(r=>r.interview_date||'').filter(Boolean).sort();
  const dateRange = dates.length>1?`${dates[0]} to ${dates[dates.length-1]}`:dates[0]||now;
  const locs = [...new Set(records.map(r=>r.location||'').filter(Boolean))];

  const latrine    = _count(records,'latrine','Yes');
  const waterTx    = _count(records,'water_treated','Yes');
  const hivHeard   = _count(records,'hiv_heard','Yes');
  const hivTested  = _count(records,'hiv_tested','Yes');
  const deathsHH   = _count(records,'deaths_5yr','Yes');
  const totalDeaths= records.reduce((s,r)=>s+(parseInt(r.deaths_count)||0),0);
  const permanent  = _count(records,'house_type','Permanent');
  const semi       = _count(records,'house_type','Semi-permanent');
  const temp       = _count(records,'house_type','Temporary');
  const female     = _count(records,'respondent_gender','Female');
  const male       = _count(records,'respondent_gender','Male');
  const avgAge     = _avg(records,'respondent_age');
  const topIll     = _illCount(records);
  const illMax     = topIll[0]?.[1]||1;
  const allFlags   = records.reduce((acc,r)=>acc+_flags(r).length,0);

  // Per-interviewer comparison rows
  const ivRows = ivNames.map(iv=>{
    const recs = records.filter(r=>r.interviewer===iv);
    const m=recs.length;
    const st=students[iv]||{};
    return `<tr>
      <td class="label">${iv}<br><span style="font-size:7pt;color:#888;font-weight:400">${st.reg_number||'—'}</span></td>
      <td class="center">${m}</td>
      <td class="center" style="color:${_pct(_count(recs,'latrine','Yes'),m)>=80?'#1a5c35':'#c0392b'};font-weight:700">${_pct(_count(recs,'latrine','Yes'),m)}%</td>
      <td class="center" style="color:${_pct(_count(recs,'water_treated','Yes'),m)>=80?'#1a5c35':'#c0392b'};font-weight:700">${_pct(_count(recs,'water_treated','Yes'),m)}%</td>
      <td class="center" style="color:${_pct(_count(recs,'hiv_heard','Yes'),m)>=90?'#1a5c35':'#c0392b'};font-weight:700">${_pct(_count(recs,'hiv_heard','Yes'),m)}%</td>
      <td class="center" style="color:${_pct(_count(recs,'hiv_tested','Yes'),m)>=50?'#1a5c35':'#e67e22'};font-weight:700">${_pct(_count(recs,'hiv_tested','Yes'),m)}%</td>
      <td class="center" style="color:${recs.reduce((a,r)=>a+_flags(r).length,0)>0?'#c0392b':'#1a5c35'};font-weight:700">${recs.reduce((a,r)=>a+_flags(r).length,0)}</td>
      <td style="font-size:7.5pt">${(()=>{const t=_illCount(recs);return t[0]?(t[0][0]+' ('+t[0][1]+')'):'None';})()}</td>
    </tr>`;
  }).join('');

  // Group recommendations
  const grecs=[];
  if(_pct(latrine,n)<80)  grecs.push({lvl:'critical',icon:'🚽',t:'Priority 1: Latrine Construction Programme',b:`Class-wide latrine coverage of ${_pct(latrine,n)}% is below the 80% national target. ${n-latrine} households across the surveyed area require immediate CLTS follow-up. The sub-county sanitation officer should be formally notified with a list of affected households.`});
  if(_pct(waterTx,n)<80)  grecs.push({lvl:'critical',icon:'💧',t:'Priority 2: Safe Water Campaign',b:`Water treatment compliance of ${_pct(waterTx,n)}% across ${n} households presents a significant waterborne disease risk. Mass distribution of WaterGuard, combined with community demonstrations, should be rolled out immediately.`});
  if(_pct(hivHeard,n)<90) grecs.push({lvl:'critical',icon:'🔴',t:'Priority 3: HIV/AIDS Outreach',b:`HIV/AIDS awareness at ${_pct(hivHeard,n)}% across all surveyed households falls below the 90% UNAIDS benchmark. A structured community health education campaign, including mobile VCT services, is urgently required.`});
  if(topIll.length&&topIll[0][1]>n*0.15) grecs.push({lvl:'warning',icon:'🏥',t:`Disease Burden: ${topIll[0][0]}`,b:`${topIll[0][0]} is the most prevalent illness class-wide (${topIll[0][1]} cases, ${_pct(topIll[0][1],n)}%). Targeted prevention, early treatment access and community education are recommended.`});
  if(deathsHH>n*0.1) grecs.push({lvl:'warning',icon:'📋',t:'Mortality Investigation',b:`${deathsHH} households (${_pct(deathsHH,n)}%) reported deaths in the past 5 years (${totalDeaths} total). A verbal autopsy programme should be initiated to determine cause-specific mortality.`});
  grecs.push({lvl:'good',icon:'📅',t:'Scheduled Follow-Up',b:`All households with red flags should receive a follow-up visit within 30 days. A full repeat survey should be conducted in 6 months to measure progress on key indicators.`});

  return `<!DOCTYPE html><html lang="en"><head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Class Group Report — Community Health Survey</title>
<style>${RPT_CSS}</style>
</head><body>
<div class="page">

${_coverPage(
  'Community Health Situation Analysis',
  'Class Aggregated Group Report — Nyamache Sub County',
  [
    ['Institution', 'Great Lakes University of Kisumu'],
    ['Supervised at', 'Nyamache Sub County Hospital'],
    ['Survey Area', locs.join(', ')||'Nyamache Sub County'],
    ['Survey Period', dateRange],
    ['Total Households', `${n}`],
    ['Total Interviewers', `${ivNames.length}`],
    ['Interviewers', ivNames.join(', ')],
  ],
  'OFFICIAL CLASS GROUP REPORT'
)}

<div class="doc">
${_rptHeader(
  'Community Health Situation Analysis — Class Group Report',
  `Nyamache Sub County, Kisii County · ${dateRange}`,
  'Group Report'
)}

<!-- ═══ EXECUTIVE SUMMARY ═══ -->
<h2 class="sec">Executive Summary</h2>
<p class="body-text">This report aggregates findings from <strong>${n} household interview${n!==1?'s':''}</strong> conducted by <strong>${ivNames.length} student interviewer${ivNames.length!==1?'s':''}</strong> from <strong>Great Lakes University of Kisumu</strong> across <strong>${locs.join(', ')||'Nyamache Sub County'}</strong> during <strong>${dateRange}</strong>. The survey was conducted under the supervision of <strong>Nyamache Sub County Hospital</strong> as part of the community health practical module.</p>
<p class="body-text">At the class level, latrine coverage stands at <strong>${_pct(latrine,n)}%</strong>, water treatment compliance at <strong>${_pct(waterTx,n)}%</strong>, and HIV/AIDS awareness at <strong>${_pct(hivHeard,n)}%</strong>. The most prevalent illness is <strong>${topIll[0]?topIll[0][0]:'none recorded'}</strong>${topIll[0]?` (${topIll[0][1]} cases, ${_pct(topIll[0][1],n)}%)`:''}. A total of <strong>${allFlags} red flag${allFlags!==1?'s':''}</strong> were identified across all interviews. This report is submitted to the course coordinator and sub-county health officer for review.</p>
<div class="stat-row">
  ${_statBox(n,'Total HHs','blue')}
  ${_statBox(ivNames.length,'Interviewers','blue')}
  ${_statBox(_pct(latrine,n)+'%','Latrine',_pct(latrine,n)<60?'red':_pct(latrine,n)<80?'amber':'')}
  ${_statBox(_pct(waterTx,n)+'%','Water Tx',_pct(waterTx,n)<60?'red':_pct(waterTx,n)<80?'amber':'')}
  ${_statBox(_pct(hivHeard,n)+'%','HIV Aware',_pct(hivHeard,n)<70?'red':_pct(hivHeard,n)<90?'amber':'')}
  ${_statBox(allFlags,'Red Flags',allFlags>0?'red':'')}
</div>

<!-- ═══ 1. INTRODUCTION ═══ -->
<h2 class="sec">1. Introduction</h2>
<p class="body-text">This group report presents the aggregated findings of the community health situation analysis practical exercise conducted by students of <strong>Great Lakes University of Kisumu</strong> in partnership with <strong>Nyamache Sub County Hospital</strong>, Kisii County. The survey contributes to the evidence base for health service planning at the sub-county level, with specific relevance to Kenya's <em>Health Policy 2014–2030</em>, the <em>County Integrated Development Plan (CIDP)</em>, and the global <em>Sustainable Development Goal 3: Good Health and Well-Being</em>.</p>
<p class="body-text">A total of <strong>${ivNames.length} student interviewers</strong> — ${ivNames.join(', ')} — conducted structured household interviews across <strong>${locs.join(', ')||'Nyamache Sub County'}</strong>. The survey provides both individual-level findings (detailed in the individual interviewer reports) and this class-level aggregated report for comparison and trend analysis.</p>

<!-- ═══ 2. METHODS ═══ -->
<h2 class="sec">2. Methods</h2>
<p class="body-text">A descriptive cross-sectional study design was employed. A pre-designed, 12-section structured questionnaire was administered face-to-face to consenting adult household representatives (aged 18–85 years) in <strong>${locs.join(', ')||'Nyamache Sub County'}</strong> during <strong>${dateRange}</strong>. Data was collected digitally using the Community Health Survey Progressive Web Application (PWA) and automatically synchronised to a secure cloud database. Analysis was conducted descriptively, with frequencies, proportions, and comparisons against national and international benchmarks.</p>

<!-- ═══ 3. RESULTS ═══ -->
<h2 class="sec">3. Results</h2>
<h3 class="sub">3.1 Socio-Demographic Profile</h3>
<div class="stat-row">
  ${_statBox(n,'Households','blue')}
  ${_statBox(female,'Female','blue')}
  ${_statBox(male,'Male','blue')}
  ${_statBox(avgAge+'yrs','Avg Age','blue')}
  ${_statBox(permanent,'Permanent','')}
  ${_statBox(temp,'Temporary','amber')}
</div>

<h3 class="sub">3.2 Key Health Indicators — All Interviewers Combined</h3>
${_indBar('Pit Latrine Coverage', latrine, n)}
${_indBar('Water Treatment', waterTx, n)}
${_indBar('HIV/AIDS Awareness', hivHeard, n)}
${_indBar('HIV Testing', hivTested, n)}
${_indBar('Permanent Housing', permanent, n)}
<table class="data-tbl" style="margin-top:10px">
  <thead><tr><th>Indicator</th><th class="center">Yes</th><th class="center">No</th><th class="center">Coverage</th><th class="center">Target</th><th class="center">Status</th></tr></thead>
  <tbody>
    <tr><td class="label">Pit latrine access</td><td class="center">${latrine}</td><td class="center">${n-latrine}</td><td class="center">${_pct(latrine,n)}%</td><td class="center">≥80%</td><td class="center" style="color:${_pct(latrine,n)>=80?'#1a5c35':'#c0392b'};font-weight:700">${_pct(latrine,n)>=80?'✓ Met':'✗ Below'}</td></tr>
    <tr><td class="label">Water treatment</td><td class="center">${waterTx}</td><td class="center">${n-waterTx}</td><td class="center">${_pct(waterTx,n)}%</td><td class="center">≥80%</td><td class="center" style="color:${_pct(waterTx,n)>=80?'#1a5c35':'#c0392b'};font-weight:700">${_pct(waterTx,n)>=80?'✓ Met':'✗ Below'}</td></tr>
    <tr><td class="label">HIV/AIDS awareness</td><td class="center">${hivHeard}</td><td class="center">${n-hivHeard}</td><td class="center">${_pct(hivHeard,n)}%</td><td class="center">≥90%</td><td class="center" style="color:${_pct(hivHeard,n)>=90?'#1a5c35':'#c0392b'};font-weight:700">${_pct(hivHeard,n)>=90?'✓ Met':'✗ Below'}</td></tr>
    <tr><td class="label">HIV testing</td><td class="center">${hivTested}</td><td class="center">${n-hivTested}</td><td class="center">${_pct(hivTested,n)}%</td><td class="center">≥95%</td><td class="center" style="color:${_pct(hivTested,n)>=95?'#1a5c35':'#c0392b'};font-weight:700">${_pct(hivTested,n)>=95?'✓ Met':'✗ Below'}</td></tr>
    <tr><td class="label">Permanent housing</td><td class="center">${permanent}</td><td class="center">${n-permanent}</td><td class="center">${_pct(permanent,n)}%</td><td class="center">≥50%</td><td class="center" style="color:${_pct(permanent,n)>=50?'#1a5c35':'#c0392b'};font-weight:700">${_pct(permanent,n)>=50?'✓ Met':'✗ Below'}</td></tr>
  </tbody>
</table>

<h3 class="sub">3.3 Disease Burden</h3>
${topIll.length?`<table class="data-tbl">
  <thead><tr><th>Illness</th><th class="center">Cases</th><th class="center">% HHs Affected</th><th class="center">Rank</th></tr></thead>
  <tbody>${topIll.map(([k,v],i)=>`<tr><td class="label">${k}</td><td class="center">${v}</td><td class="center">${_pct(v,n)}%</td><td class="center">#${i+1}</td></tr>`).join('')}</tbody>
</table>`:'<p class="note">No illnesses recorded.</p>'}
${deathsHH>0?`<div class="flag-warning"><div class="flag-title">⚠ Mortality: ${totalDeaths} deaths reported</div><div class="flag-body">${deathsHH} household${deathsHH!==1?'s':''} (${_pct(deathsHH,n)}%) reported a total of ${totalDeaths} death${totalDeaths!==1?'s':''} in the past 5 years. Verbal autopsy investigation is recommended.</div></div>`:''}

<h3 class="sub">3.4 Per-Interviewer Comparison</h3>
<p class="note">Green = at or above target; Red = below target. Latrine & Water target: ≥80%. HIV Aware target: ≥90%.</p>
<div style="overflow-x:auto">
<table class="data-tbl">
  <thead><tr>
    <th>Interviewer</th><th class="center">HHs</th>
    <th class="center">Latrine%</th><th class="center">Water Tx%</th>
    <th class="center">HIV Aware%</th><th class="center">HIV Tested%</th>
    <th class="center">Flags</th><th>Top Illness</th>
  </tr></thead>
  <tbody>${ivRows}</tbody>
  <tr style="font-weight:700;background:#e8f5ed">
    <td class="label">CLASS TOTAL / AVERAGE</td>
    <td class="center">${n}</td>
    <td class="center" style="color:${_pct(latrine,n)>=80?'#1a5c35':'#c0392b'}">${_pct(latrine,n)}%</td>
    <td class="center" style="color:${_pct(waterTx,n)>=80?'#1a5c35':'#c0392b'}">${_pct(waterTx,n)}%</td>
    <td class="center" style="color:${_pct(hivHeard,n)>=90?'#1a5c35':'#c0392b'}">${_pct(hivHeard,n)}%</td>
    <td class="center" style="color:${_pct(hivTested,n)>=50?'#1a5c35':'#e67e22'}">${_pct(hivTested,n)}%</td>
    <td class="center" style="color:${allFlags>0?'#c0392b':'#1a5c35'}">${allFlags}</td>
    <td class="label">${topIll[0]?topIll[0][0]:'—'}</td>
  </tr>
</table>
</div>

<!-- ═══ 4. DISCUSSION ═══ -->
<h2 class="sec">4. Discussion</h2>
<p class="body-text">The class-aggregated data from ${n} households across ${locs.length} location${locs.length!==1?'s':''} provides a comprehensive picture of the health situation in Nyamache Sub County. ${_pct(latrine,n)<80?`Latrine coverage of ${_pct(latrine,n)}% represents the most critical gap, falling ${80-_pct(latrine,n)} percentage points below the 80% national target. Open defecation in ${n-latrine} households creates direct risk of faecal-oral pathogen transmission, particularly for children under five who are most vulnerable to diarrhoeal diseases, cholera and typhoid fever.`:`Latrine coverage of ${_pct(latrine,n)}% meets the national target — a positive finding that reflects effective community mobilisation in the surveyed area.`}</p>
<p class="body-text">${_pct(waterTx,n)<80?`Water treatment compliance of ${_pct(waterTx,n)}% is below the recommended threshold. Given that the primary water sources in this area include surface water and shallow wells, the risk of waterborne disease among the ${n-waterTx} households consuming untreated water is high. Chlorination at point of use and promotion of safe water storage practices are essential interventions.`:`Water treatment compliance of ${_pct(waterTx,n)}% is acceptable, indicating community awareness of safe water practices.`}</p>
<p class="body-text">Inter-interviewer variation in key indicators reflects genuine community-level heterogeneity across different geographic areas rather than data collection inconsistencies. Areas with lower indicator scores should be prioritised for targeted health interventions.</p>
<p class="body-text">${topIll.length?`The high prevalence of ${topIll[0][0]} (${topIll[0][1]} cases, ${_pct(topIll[0][1],n)}%) is consistent with epidemiological patterns in rural Kisii County and is directly linked to the environmental and behavioural risk factors identified in this survey.`:''}</p>

<!-- ═══ 5. CONCLUSION ═══ -->
<h2 class="sec">5. Conclusion</h2>
<p class="body-text">The class-wide community health situation analysis has generated valuable data on the health status of households in Nyamache Sub County. The findings confirm the presence of preventable health risks — particularly in water, sanitation, and HIV/AIDS awareness — that are amenable to targeted public health interventions. Individual interviewer reports (attached separately) provide granular, household-level findings for each interviewer's survey area.</p>
<p class="body-text">These findings are submitted to the <strong>course coordinator</strong>, the <strong>Nyamache Sub County Hospital health management team</strong>, and the <strong>Kisii County Department of Health</strong> for review, action planning, and integration into the sub-county health planning cycle.</p>

<!-- ═══ 6. RECOMMENDATIONS ═══ -->
<h2 class="sec">6. Recommendations</h2>
${grecs.map(r=>`<div class="flag-${r.lvl==='critical'?'critical':r.lvl==='warning'?'warning':'ok'}">
  <div class="flag-title">${r.icon} ${r.t}</div>
  <div class="flag-body">${r.b}</div>
</div>`).join('')}

<!-- ═══ SIGNATURES ═══ -->
<h2 class="sec">Submission and Approval</h2>
<p class="body-text">This report is submitted on behalf of the <strong>Community Health Practical Group</strong>, Great Lakes University of Kisumu, for the academic year. The data was collected by ${ivNames.join(', ')} under the supervision of the faculty and Nyamache Sub County Hospital.</p>
<div class="sig-section">
  <div class="sig-box">
    <div class="sig-line"></div>
    <div class="sig-name">Group Leader / Coordinator</div>
    <div class="sig-label">Community Health Practical Group</div>
  </div>
  <div class="sig-box">
    <div class="sig-line"></div>
    <div class="sig-name">Course Coordinator</div>
    <div class="sig-label">Community Health · GLU Kisumu</div>
  </div>
  <div class="sig-box">
    <div class="sig-line"></div>
    <div class="sig-name">Sub-County Health Officer</div>
    <div class="sig-label">Nyamache Sub County Hospital</div>
  </div>
</div>

<p class="note" style="margin-top:20px;text-align:center">Generated ${now} · Community Health Survey System v2.0 · Great Lakes University of Kisumu · © 2026 HazzinBR</p>
</div>
</div>
<button class="print-fab" onclick="window.print()">🖨 Print / Save as PDF</button>
</body></html>`;
}


// ─────────────────────────────────────────────────────────────────
//  ADMIN ENTRY POINTS
// ─────────────────────────────────────────────────────────────────
async function openInterviewerReport(interviewer){
  if(typeof _admRecs==='undefined'||!_admRecs.length){showToast('No records loaded',true);return;}
  const recs=_admRecs.filter(r=>r.interviewer===interviewer);
  if(!recs.length){showToast('No records for '+interviewer,true);return;}
  showToast('Building report...');
  const student=await _getStudentDetails(interviewer);
  const html=buildInterviewerReport(interviewer,recs,student);
  _openReportFrame(html,'📑 Report — '+interviewer);
}

function openAllInterviewerReports(){
  if(!_admRecs||!_admRecs.length){ showToast('No records loaded — refresh first', true); return; }
  const ivNames = [...new Set(_admRecs.map(r=>r.interviewer||'Unknown'))].sort();
  if(ivNames.length===1){
    openInterviewerReport(ivNames[0]);
    return;
  }
  // Ask which report to open
  const menu = document.createElement('div');
  menu.style.cssText='position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,.6);display:flex;align-items:flex-end;justify-content:center;';
  menu.innerHTML=`<div style="background:#fff;width:100%;max-width:480px;border-radius:20px 20px 0 0;padding:22px 18px calc(22px + env(safe-area-inset-bottom))">
    <div style="font-weight:800;font-size:1rem;color:#1a5c35;margin-bottom:4px">Select Report</div>
    <div style="font-size:.78rem;color:#6b8a74;margin-bottom:16px">Choose an interviewer or the full group report</div>
    <div style="display:flex;flex-direction:column;gap:8px">
      ${ivNames.map(iv=>`<button onclick="document.body.removeChild(document.getElementById('rpt-menu'));openInterviewerReport('${iv.replace(/'/g,"\\'")}');" style="width:100%;padding:13px 16px;background:#f4f8f5;border:1.5px solid #cce0d4;border-radius:12px;font-family:inherit;font-size:.9rem;font-weight:700;color:#1a5c35;cursor:pointer;text-align:left;display:flex;justify-content:space-between;align-items:center">📑 ${iv} <span style="font-size:.72rem;font-weight:400;color:#6b8a74">${_admRecs.filter(r=>r.interviewer===iv).length} record${_admRecs.filter(r=>r.interviewer===iv).length!==1?'s':''}</span></button>`).join('')}
      <button onclick="document.body.removeChild(document.getElementById('rpt-menu'));openGroupReport();" style="width:100%;padding:13px 16px;background:linear-gradient(135deg,#1a5c35,#1a4060);border:none;border-radius:12px;font-family:inherit;font-size:.9rem;font-weight:700;color:#fff;cursor:pointer;text-align:left;display:flex;justify-content:space-between;align-items:center">👥 Full Class Group Report <span style="font-size:.72rem;font-weight:400;opacity:.7">${_admRecs.length} records</span></button>
      <button onclick="document.body.removeChild(document.getElementById('rpt-menu'))" style="width:100%;padding:12px;background:#f0f0f0;border:none;border-radius:12px;font-family:inherit;font-size:.88rem;cursor:pointer;color:#888">Cancel</button>
    </div>
  </div>`;
  menu.id='rpt-menu';
  document.body.appendChild(menu);
}

async function openGroupReport(){
  if(typeof _admRecs==='undefined'||!_admRecs.length){showToast('No records loaded — tap Refresh first',true);return;}
  showToast('Building group report...');
  const ivNames=[...new Set(_admRecs.map(r=>r.interviewer||'Unknown'))].sort();
  const students={};
  for(const iv of ivNames){students[iv]=await _getStudentDetails(iv);}
  const html=buildGroupReport(_admRecs,students);
  _openReportFrame(html,'👥 Class Group Report');
}

function _openReportFrame(html, title){
  const ov = document.getElementById('report-overlay');
  const fr = document.getElementById('report-frame');
  const ti = document.getElementById('report-title');
  if(!ov||!fr){ showToast('Report error', true); return; }
  const doc = fr.contentDocument||fr.contentWindow.document;
  doc.open(); doc.write(html); doc.close();
  if(ti) ti.textContent = title;
  ov.classList.add('open');
}


// ─────────────────────────────────────────────────────────────────
//  SURVEY FINISH MODAL REPORTS (brief / full / IMRaD)
//  These use the existing record in local storage
// ─────────────────────────────────────────────────────────────────
function openBriefReport(){ closeFinish(); _openReportFrame(buildBriefReport(cRec()), '📋 Brief Report'); }
function openFullReport(){  closeFinish(); _openReportFrame(buildFullReport(),       '📄 Full Report'); }
function openIMRaDReport(){ closeFinish(); _openReportFrame(buildIMRaDReport(cRec()),'📑 IMRaD Report'); }

function printReport(){
  const f=document.getElementById('report-frame');
  if(f&&f.contentWindow){ f.contentWindow.focus(); f.contentWindow.print(); }
  else window.print();
}
function closeReportOverlay(){ document.getElementById('report-overlay')?.classList.remove('open'); }
function startNewSurveyFromReport(){ closeReportOverlay(); newRec(); showToast('✓ New survey started'); }
function goHomeFromReport(){ closeReportOverlay(); goSec(0,'back'); }

function exportJSON(){
  closeFinish();
  const rec=cRec();
  const blob=new Blob([JSON.stringify(rec,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url; a.download=`health_survey_${(rec.interviewer_name||'record').replace(/\s/g,'_')}_${rec.interview_date||new Date().toISOString().split('T')[0]}.json`;
  a.click(); URL.revokeObjectURL(url);
  showToast('✓ JSON saved');
}

function showSupportPrompt(){
  const ex=document.getElementById('support-prompt'); if(ex)ex.remove();
  const el=document.createElement('div'); el.id='support-prompt';
  el.style.cssText='position:fixed;bottom:calc(92px + env(safe-area-inset-bottom));left:12px;right:12px;z-index:490;background:linear-gradient(135deg,#0f1f18ee,#0a1a2eee);backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,.1);border-radius:16px;padding:14px 16px;display:flex;align-items:center;gap:12px;box-shadow:0 8px 32px rgba(0,0,0,.3);animation:slideUpPrompt .35s cubic-bezier(.4,0,.2,1) both;';
  el.innerHTML=`<div style="font-size:24px;flex-shrink:0">💚</div><div style="flex:1"><div style="color:#fff;font-size:.8rem;font-weight:700;margin-bottom:2px">Can I get a coffee? ☕</div><div style="color:rgba(255,255,255,.5);font-size:.7rem">This app is free — a small M-Pesa treat keeps the code warm!</div></div><div style="display:flex;flex-direction:column;gap:5px;flex-shrink:0"><button onclick="document.getElementById('support-prompt').remove();showDonateModal()" style="padding:7px 12px;background:linear-gradient(135deg,#3db86a,#2a9054);color:#fff;border:none;border-radius:8px;font-family:inherit;font-size:.72rem;font-weight:700;cursor:pointer">☕ Buy me a coffee</button><button onclick="document.getElementById('support-prompt').remove()" style="padding:5px 12px;background:rgba(255,255,255,.08);color:rgba(255,255,255,.4);border:none;border-radius:8px;font-family:inherit;font-size:.68rem;cursor:pointer">Later</button></div>`;
  document.body.appendChild(el);
  setTimeout(()=>{ if(document.getElementById('support-prompt'))el.remove(); },12000);
}


// ─── BRIEF / FULL / IMRaD BUILDERS (for survey finish modal) ───

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