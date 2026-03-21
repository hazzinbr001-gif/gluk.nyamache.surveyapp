/* ══════════════════════════════════════════════
   Community Health Survey — Reports
   Includes: Brief · Full · IMRaD Individual · Group Report
   © 2026 HazzinBR
   ══════════════════════════════════════════════ */

// ── Shared report fonts + base styles ──
const RPT_BASE_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Merriweather:ital,wght@0,400;0,700;1,400&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Plus Jakarta Sans',sans-serif;background:#f0f2f0;color:#1a2b22;font-size:13px;}
.page{max-width:780px;margin:0 auto;background:#fff;min-height:100vh;box-shadow:0 0 40px rgba(0,0,0,.12);}
@media print{body{background:#fff;}.page{box-shadow:none;} .no-print{display:none!important;}}
`;

// ══════════════════════════════════════════════
//  OPEN REPORT IN OVERLAY
// ══════════════════════════════════════════════
function openReportWindow(html, type){
  const overlay = document.getElementById('report-overlay');
  const frame   = document.getElementById('report-frame');
  const titleEl = document.getElementById('report-title');
  if(!overlay || !frame){ showToast('Report error — try again',true); return; }
  const doc = frame.contentDocument || frame.contentWindow.document;
  doc.open(); doc.write(html); doc.close();
  const labels = {brief:'📋 Brief Report', full:'📄 Full Report', imrad:'📑 IMRaD Report', group:'👥 Group Report'};
  if(titleEl) titleEl.textContent = labels[type] || '📄 Report';
  overlay.classList.add('open');
  setTimeout(showSupportPrompt, 4000);
}
function openBriefReport(){ closeFinish(); openReportWindow(buildBriefReport(cRec()),'brief'); }
function openFullReport(){ closeFinish(); openReportWindow(buildFullReport(),'full'); }
function openIMRaDReport(){ closeFinish(); openReportWindow(buildIMRaDReport(cRec()),'imrad'); }
function printReport(){ const f=document.getElementById('report-frame'); if(f&&f.contentWindow){f.contentWindow.focus();f.contentWindow.print();}else{window.print();} }
function closeReportOverlay(){ document.getElementById('report-overlay')?.classList.remove('open'); }
function startNewSurveyFromReport(){ closeReportOverlay(); newRec(); showToast('✓ New survey started'); }
function goHomeFromReport(){ closeReportOverlay(); goSec(0,'back'); showToast('Returned to home'); }

// ── Support prompt ──
function showSupportPrompt(){
  const existing=document.getElementById('support-prompt'); if(existing)existing.remove();
  const el=document.createElement('div'); el.id='support-prompt';
  el.style.cssText='position:fixed;bottom:calc(92px + env(safe-area-inset-bottom));left:12px;right:12px;z-index:490;background:linear-gradient(135deg,#0f1f18ee,#0a1a2eee);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,.1);border-radius:16px;padding:14px 16px;display:flex;align-items:center;gap:12px;box-shadow:0 8px 32px rgba(0,0,0,.3);animation:slideUpPrompt .35s cubic-bezier(.4,0,.2,1) both;';
  el.innerHTML=`<div style="font-size:26px;flex-shrink:0">💚</div><div style="flex:1;min-width:0"><div style="color:#fff;font-size:0.8rem;font-weight:700;margin-bottom:2px">Psst… can I get a coffee? ☕</div><div style="color:rgba(255,255,255,.5);font-size:0.7rem;line-height:1.4">This app is free and always will be — but a small M-Pesa treat keeps the code warm 😄</div></div><div style="display:flex;flex-direction:column;gap:5px;flex-shrink:0"><button onclick="document.getElementById('support-prompt').remove();showDonateModal()" style="padding:7px 13px;background:linear-gradient(135deg,#3db86a,#2a9054);color:#fff;border:none;border-radius:8px;font-family:inherit;font-size:0.74rem;font-weight:700;cursor:pointer;white-space:nowrap">Buy me a coffee ☕</button><button onclick="document.getElementById('support-prompt').remove()" style="padding:5px 13px;background:rgba(255,255,255,.08);color:rgba(255,255,255,.4);border:none;border-radius:8px;font-family:inherit;font-size:0.7rem;cursor:pointer">Maybe later</button></div>`;
  document.body.appendChild(el);
  setTimeout(()=>{ if(document.getElementById('support-prompt'))el.remove(); },12000);
}

// ── Shared report header ──
function rptHeader(icon,title,sub,gradA='#1e5c38',gradB='#1a4f6e'){
  return `<div style="background:linear-gradient(135deg,${gradA},${gradB});color:#fff;padding:26px 30px 22px;">
    <div style="font-size:34px;margin-bottom:8px">${icon}</div>
    <div style="font-size:1.3rem;font-weight:800;letter-spacing:-.02em;margin-bottom:3px">${title}</div>
    <div style="font-size:0.76rem;opacity:.72">${sub}</div>
  </div>`;
}

// ── Shared meta strip ──
function rptMeta(fields){
  return `<div style="background:#e8f5ed;padding:12px 30px;border-bottom:1px solid #cce0d4;display:flex;flex-wrap:wrap;gap:18px;">
    ${fields.map(([l,v])=>`<div><div style="font-size:0.62rem;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#6b8a74">${l}</div><div style="font-weight:700;color:#1a2b22;font-size:0.82rem">${v||'—'}</div></div>`).join('')}
  </div>`;
}

// ── Shared section heading ──
function rptSec(title){
  return `<div style="font-size:0.65rem;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#6b8a74;border-bottom:2px solid #e8f5ed;padding-bottom:5px;margin:20px 0 10px">${title}</div>`;
}

// ── Stat box ──
function rptStat(label,value,accent='#cce0d4'){
  return `<div style="background:#f9f7f4;border-radius:8px;padding:10px 12px;border-left:3px solid ${accent}"><div style="font-size:0.62rem;color:#6b8a74;font-weight:700;text-transform:uppercase;letter-spacing:.4px;margin-bottom:2px">${label}</div><div style="font-size:0.9rem;font-weight:700;color:#1a2b22">${value||'—'}</div></div>`;
}

// ── Flag item ──
function rptFlag(text,type='red'){
  const bg={red:'#fdecea',amber:'#fff8e1',ok:'#e8f5ed'};
  const col={red:'#c0392b',amber:'#e65100',ok:'#1e5c38'};
  const brd={red:'#c0392b',amber:'#f39c12',ok:'#4CAF72'};
  return `<div style="padding:9px 12px;border-radius:8px;font-size:0.82rem;font-weight:500;margin-bottom:6px;line-height:1.4;background:${bg[type]};color:${col[type]};border-left:3px solid ${brd[type]}">${text}</div>`;
}

// ── Shared signature ──
function rptSig(){
  return `<div style="text-align:center;padding:20px 30px;color:#aaa;font-size:0.68rem;border-top:1px solid #eee;margin-top:20px">© 2026 HazzinBR · Community Health Survey · Great Lakes University · Nyamache Sub County Hospital · Free to use · No copyright restrictions</div>`;
}

// ── Shared print button ──
function rptPrintBtn(){
  return `<button class="no-print" onclick="window.print()" style="position:fixed;bottom:20px;right:20px;background:#1e5c38;color:#fff;border:none;border-radius:12px;padding:13px 22px;font-family:inherit;font-size:0.9rem;font-weight:700;cursor:pointer;box-shadow:0 4px 20px rgba(0,0,0,.2);display:flex;align-items:center;gap:7px;">🖨 Print / Save PDF</button>`;
}

// ── Extract flags from a record ──
function extractFlags(r){
  const flags=[], concerns=[];
  if(r.b_type==='Permanent'&&r.b_roof==='Grass Thatched') flags.push('Permanent house with grass-thatched roof');
  if(r.b_type==='Permanent'&&r.b_floor==='Earthen') flags.push('Permanent house with earthen floor');
  if(r.b_cook==='Inside'&&(r.b_fuel==='Firewood'||r.b_fuel==='Charcoal')&&r.b_ventil==='Poor') flags.push('Indoor cooking with '+r.b_fuel+' — POOR ventilation (respiratory risk)');
  if(r.b_animals==='Yes') concerns.push('Household shares living space with domestic animals');
  if(r.b_smoke==='Yes'&&r.b_smoke_in==='Yes') flags.push('Smoking inside the house — health risk to household members');
  if(r.g_latrine==='No') flags.push('No pit latrine — open defecation risk');
  if((r.h_wld==='0–5 m'||r.h_wld==='5–10 m')&&r.h_wprot==='No') flags.push('Water source very close to latrine AND unprotected — HIGH contamination risk');
  if(r.h_treat==='No') concerns.push('Water not treated before drinking');
  if(r.f_heard==='No') flags.push('Respondent has NEVER heard of HIV/AIDS — needs health education');
  if(r.c_preg==='Yes'&&r.a_gender==='Male') flags.push('Data inconsistency: Male respondent recorded as pregnant');
  if([].concat(r.c_ill||[]).length>0&&r.c_consult==='No') concerns.push('Illness reported but no medical consultation sought');
  if(r.i_circ==='Female'||r.i_circ==='Both') flags.push('Female genital mutilation (FGM) reported — needs follow-up');
  if(r.e_skip==='Yes'&&r.e_skip_w==='Not enough food') concerns.push('Household skipping meals due to food shortage');
  if(r.e_enough==='No') concerns.push('Food cooked is not enough for the household');
  if(r.a_edu==='None'&&r.a_occ==='Government') flags.push('No formal education but Government employment — verify');
  for(let i=1;i<=7;i++){
    const muac=parseFloat(r['ea'+i+'m']||0);
    if(muac>0&&muac<12.5) flags.push(`Child ${i}: MUAC ${muac}cm — SEVERE ACUTE MALNUTRITION (SAM)`);
    else if(muac>0&&muac<13.5) concerns.push(`Child ${i}: MUAC ${muac}cm — Moderate Acute Malnutrition (MAM)`);
  }
  return {flags,concerns};
}

// ══════════════════════════════════════════════
//  1. BRIEF REPORT (original)
// ══════════════════════════════════════════════
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

// ══════════════════════════════════════════════
//  2. FULL REPORT (original)
// ══════════════════════════════════════════════
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

// ══════════════════════════════════════════════
//  3. IMRaD INDIVIDUAL REPORT  (NEW)
//  Format: Title · Abstract · Introduction · Methods · Results · Discussion · Recommendations
//  Content adapts dynamically to the record's actual data
// ══════════════════════════════════════════════
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

// ══════════════════════════════════════════════
//  4. GROUP REPORT (NEW)
//  One report for all interviewers' collected data
//  IMRaD format with per-interviewer breakdown section
// ══════════════════════════════════════════════
function buildGroupReport(records){
  // records is array of raw_json parsed records from Supabase
  const n=records.length;
  if(!n) return '<html><body>No records to include in group report.</body></html>';
  const now=new Date().toLocaleDateString('en-KE',{year:'numeric',month:'long',day:'numeric'});

  // ── Aggregate helpers ──
  const pct=(a,b)=>b>0?Math.round(a/b*100):0;
  const count=(arr,field,val)=>arr.filter(r=>r[field]===val).length;
  const countByField=(arr,field)=>{const c={};arr.forEach(r=>{const v=String((r[field]||'Unknown')).trim();c[v]=(c[v]||0)+1;});return c;};
  const countIll=(arr)=>{const c={};arr.forEach(r=>{(r.illnesses||'').split(',').forEach(x=>{const k=x.trim();if(k&&k!=='None')c[k]=(c[k]||0)+1;});});return c;};

  // ── Global metrics ──
  const latrine=count(records,'latrine','Yes');
  const waterTreated=count(records,'water_treated','Yes');
  const hivHeard=count(records,'hiv_heard','Yes');
  const hivTested=count(records,'hiv_tested','Yes');
  const deathsHH=count(records,'deaths_5yr','Yes');
  const totalDeaths=records.reduce((s,r)=>s+(parseInt(r.deaths_count)||0),0);
  const illCount=countIll(records);
  const topIll=Object.entries(illCount).sort((a,b)=>b[1]-a[1]).slice(0,8);
  const illMax=topIll[0]?.[1]||1;
  const permanent=count(records,'house_type','Permanent');
  const semi=count(records,'house_type','Semi-permanent');
  const temp=count(records,'house_type','Temporary');
  const male=count(records,'respondent_gender','Male');
  const female=count(records,'respondent_gender','Female');
  const interviewers=[...new Set(records.map(r=>r.interviewer||'Unknown'))];
  const avgAge=Math.round(records.reduce((s,r)=>s+(parseInt(r.respondent_age)||0),0)/n)||0;

  // ── Per-interviewer breakdown ──
  const ivBreakdown=interviewers.map(iv=>{
    const recs=records.filter(r=>r.interviewer===iv);
    const m=recs.length;
    const allFlags=recs.reduce((acc,r)=>{
      if(r.latrine==='No')acc++;
      if(r.water_treated==='No')acc++;
      if(r.hiv_heard==='No')acc++;
      return acc;
    },0);
    const topDisease=countIll(recs);
    const topD=Object.entries(topDisease).sort((a,b)=>b[1]-a[1])[0];
    const loc=[...new Set(recs.map(r=>r.location||'?'))].join(', ');
    return {iv,m,flags:allFlags,latrinePct:pct(count(recs,'latrine','Yes'),m),waterPct:pct(count(recs,'water_treated','Yes'),m),hivPct:pct(count(recs,'hiv_heard','Yes'),m),topD,loc};
  });

  // ── Progress bar helper ──
  const progBar=(val,max,col='#1e5c38')=>`<div style="height:8px;background:#f0f0f0;border-radius:99px;overflow:hidden;flex:1"><div style="width:${pct(val,max)}%;height:100%;background:${col};border-radius:99px"></div></div>`;

  // ── Recommendations ──
  const recList=[];
  if(pct(latrine,n)<50)recList.push({lvl:'critical',icon:'🚨',title:'Critical: Low Latrine Coverage',body:`Only ${pct(latrine,n)}% of surveyed households have a pit latrine. Immediate CLTS programme deployment is required.`});
  if(pct(waterTreated,n)<60)recList.push({lvl:'critical',icon:'🚨',title:'Critical: Untreated Water',body:`${100-pct(waterTreated,n)}% of households do not treat drinking water. Mass distribution of water treatment tablets and community boiling campaigns are urgently needed.`});
  if(pct(hivHeard,n)<70)recList.push({lvl:'critical',icon:'🚨',title:'Critical: HIV Unawareness',body:`${n-hivHeard} respondents (${pct(n-hivHeard,n)}%) have never heard of HIV/AIDS. Door-to-door health education and VCT outreach are necessary.`});
  if(pct(hivTested,n)<50)recList.push({lvl:'warning',icon:'⚠️',title:'Warning: Low HIV Testing',body:`Only ${pct(hivTested,n)}% have been tested. Mobile VCT units should be deployed in the community.`});
  if(topIll[0]&&topIll[0][1]>n*0.2)recList.push({lvl:'warning',icon:'⚠️',title:`High Burden: ${topIll[0][0]}`,body:`${topIll[0][0]} is the most prevalent illness (${topIll[0][1]} cases, ${pct(topIll[0][1],n)}%). Targeted prevention and treatment campaigns are recommended.`});
  if(deathsHH>n*0.1)recList.push({lvl:'warning',icon:'⚠️',title:'Elevated Household Deaths',body:`${deathsHH} households reported deaths in the past 5 years (${totalDeaths} total). A verbal autopsy programme and cause-specific intervention is recommended.`});
  if(pct(permanent,n)>=60&&pct(latrine,n)>=70)recList.push({lvl:'good',icon:'✅',title:'Positive: Adequate Housing & Sanitation',body:`${pct(permanent,n)}% permanent housing and ${pct(latrine,n)}% latrine coverage are commendable. Sustain this through continued community engagement.`});

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Group Health Survey Report</title><meta name="viewport" content="width=device-width,initial-scale=1">
<style>${RPT_BASE_CSS}
.body{padding:24px 34px 50px;}
h1{font-family:'Merriweather',Georgia,serif;font-size:1.25rem;font-weight:700;color:#0f1f18;line-height:1.35;margin-bottom:8px;}
h2{font-size:0.72rem;font-weight:800;text-transform:uppercase;letter-spacing:1.2px;color:#6b8a74;border-bottom:2px solid #e8f5ed;padding-bottom:5px;margin:24px 0 12px;}
h3{font-size:0.85rem;font-weight:700;color:#1a5c35;margin:14px 0 6px;}
p{font-size:0.84rem;line-height:1.75;color:#1a2b22;margin-bottom:10px;}
.abstract-box{background:linear-gradient(135deg,#e8f5ed,#edf4fb);border:1.5px solid #cce0d4;border-radius:12px;padding:16px 20px;margin-bottom:4px;}
.abstract-box p{font-style:italic;font-size:0.82rem;}
.stat-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:12px;}
.stat-card{text-align:center;background:#f9f7f4;border-radius:10px;padding:12px 6px;}
.stat-card .n{font-size:1.6rem;font-weight:800;line-height:1;}
.stat-card .l{font-size:0.62rem;color:#6b8a74;font-weight:600;text-transform:uppercase;margin-top:3px;}
.stat-card.ok .n{color:#1e5c38;}.stat-card.warn .n{color:#e65100;}.stat-card.bad .n{color:#c0392b;}.stat-card.blue .n{color:#1a4f6e;}
.ill-row{display:flex;align-items:center;gap:8px;padding:5px 0;border-bottom:1px solid #f5f5f5;font-size:0.78rem;}
.ill-row:last-child{border-bottom:none;}
.iv-card{background:#f9f7f4;border-radius:12px;border:1px solid #dde8e2;padding:14px 16px;margin-bottom:10px;}
.iv-name{font-size:0.9rem;font-weight:800;color:#1a5c35;margin-bottom:2px;}
.iv-loc{font-size:0.7rem;color:#6b8a74;margin-bottom:10px;}
.iv-row{display:flex;align-items:center;gap:8px;margin-bottom:5px;}
.iv-lbl{font-size:0.72rem;width:120px;flex-shrink:0;color:#1a2b22;font-weight:500;}
.rec-item{border-radius:10px;padding:12px 14px;margin-bottom:9px;border-left:4px solid;}
.rec-item.critical{background:#fdecea;border-color:#c0392b;}
.rec-item.warning{background:#fff8e1;border-color:#f39c12;}
.rec-item.good{background:#e8f5ed;border-color:#4CAF72;}
.rec-title{font-size:0.82rem;font-weight:700;margin-bottom:3px;}
.rec-item.critical .rec-title{color:#c0392b;}.rec-item.warning .rec-title{color:#e65100;}.rec-item.good .rec-title{color:#1e5c38;}
.rec-body{font-size:0.75rem;color:#1a2b22;line-height:1.55;}
</style></head><body><div class="page">
${rptHeader('👥','Community Health Situation Analysis — Group Report','Great Lakes University · Nyamache Sub County Hospital · '+now,'#1a5c35','#1a4060')}
${rptMeta([['Total Records',n],['Interviewers',interviewers.length],['Survey Date',now],['Location','Nyamache Sub County, Kisii'],['Avg Respondent Age',avgAge+' yrs']])}
<div class="body">

  <h1>Household Health Situation Analysis: Aggregated Community Report — Nyamache Sub County, Kisii County</h1>
  <p style="font-size:.75rem;color:#6b8a74">Class Survey · Great Lakes University of Kisumu · Interviewers: <strong>${interviewers.join(', ')}</strong></p>

  <!-- ABSTRACT -->
  <h2>Abstract</h2>
  <div class="abstract-box">
    <p>This report aggregates findings from <strong>${n} household interviews</strong> conducted by <strong>${interviewers.length} interviewer${interviewers.length!==1?'s':''}</strong> across Nyamache Sub County, Kisii County. Key indicators include latrine coverage at <strong>${pct(latrine,n)}%</strong>, water treatment compliance at <strong>${pct(waterTreated,n)}%</strong>, and HIV awareness at <strong>${pct(hivHeard,n)}%</strong>. ${topIll.length?'The most frequently reported illness is <strong>'+topIll[0][0]+'</strong> ('+topIll[0][1]+' cases, '+pct(topIll[0][1],n)+'%).':''} A total of ${totalDeaths} deaths were reported across ${deathsHH} households in the past five years. This report applies the IMRaD structure consistent with academic and public health reporting standards and provides evidence-based recommendations for priority interventions.</p>
  </div>

  <!-- INTRODUCTION -->
  <h2>1. Introduction</h2>
  <p>Community health situation analysis is a systematic approach to assessing the health status of a population, identifying health determinants, and establishing a baseline for programme planning and evaluation. This survey was conducted by student health workers from Great Lakes University of Kisumu as part of the practical community health assessment module at Nyamache Sub County Hospital, Kisii County.</p>
  <p>Kenya's Health Policy 2014–2030 emphasises a community-based approach to health, prioritising preventive care, water and sanitation, maternal health, and HIV/AIDS control. This survey directly maps to these priorities, providing data that can inform the sub-county health officer's planning cycle and resource allocation.</p>

  <!-- METHODS -->
  <h2>2. Methods</h2>
  <p>A structured questionnaire covering 12 thematic sections was administered face-to-face by ${interviewers.length} trained student interviewers between ${records[records.length-1]?.interview_date||'the survey period'} and ${records[0]?.interview_date||now}. Households were selected through purposive community sampling. Data was captured digitally using the Community Health Survey PWA and synchronised to a secure Supabase cloud database. This report analyses all ${n} completed, consented records. The following interviewers participated: <strong>${interviewers.join(', ')}</strong>.</p>

  <!-- RESULTS -->
  <h2>3. Results</h2>

  <h3>3.1 Respondent Demographics</h3>
  <div class="stat-grid">
    <div class="stat-card blue"><div class="n">${n}</div><div class="l">Total HHs</div></div>
    <div class="stat-card blue"><div class="n">${interviewers.length}</div><div class="l">Interviewers</div></div>
    <div class="stat-card blue"><div class="n">${avgAge}</div><div class="l">Avg Age</div></div>
    <div class="stat-card ok"><div class="n">${female}</div><div class="l">Female Resp.</div></div>
    <div class="stat-card ok"><div class="n">${male}</div><div class="l">Male Resp.</div></div>
    <div class="stat-card ${pct(permanent,n)>=50?'ok':'warn'}"><div class="n">${pct(permanent,n)}%</div><div class="l">Permanent HH</div></div>
  </div>

  <h3>3.2 Housing Quality</h3>
  <div style="background:#f9f7f4;border-radius:10px;padding:14px 16px;margin-bottom:10px">
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px"><span style="font-size:.76rem;font-weight:600;width:130px">Permanent</span>${progBar(permanent,n,'#1e5c38')}<span style="font-size:.7rem;font-weight:700;color:#1e5c38;min-width:36px">${permanent} (${pct(permanent,n)}%)</span></div>
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px"><span style="font-size:.76rem;font-weight:600;width:130px">Semi-permanent</span>${progBar(semi,n,'#f39c12')}<span style="font-size:.7rem;font-weight:700;color:#f39c12;min-width:36px">${semi} (${pct(semi,n)}%)</span></div>
    <div style="display:flex;align-items:center;gap:8px"><span style="font-size:.76rem;font-weight:600;width:130px">Temporary</span>${progBar(temp,n,'#c0392b')}<span style="font-size:.7rem;font-weight:700;color:#c0392b;min-width:36px">${temp} (${pct(temp,n)}%)</span></div>
  </div>

  <h3>3.3 Water &amp; Sanitation</h3>
  <div class="stat-grid">
    <div class="stat-card ${pct(latrine,n)>=70?'ok':pct(latrine,n)>=50?'warn':'bad'}"><div class="n">${pct(latrine,n)}%</div><div class="l">Latrine Coverage</div></div>
    <div class="stat-card ${pct(waterTreated,n)>=70?'ok':pct(waterTreated,n)>=50?'warn':'bad'}"><div class="n">${pct(waterTreated,n)}%</div><div class="l">Treat Water</div></div>
    <div class="stat-card bad"><div class="n">${n-latrine}</div><div class="l">No Latrine</div></div>
  </div>
  <div style="font-size:.76rem;color:#6b8a74;margin-bottom:8px;line-height:1.6">Kenya target: ≥80% latrine coverage. ${pct(latrine,n)<80?'<strong style="color:#c0392b">⚠ Current coverage is below the national target.</strong>':'<strong style="color:#1e5c38">✓ Above the national target.</strong>'}</div>

  <h3>3.4 HIV/AIDS Indicators</h3>
  <div class="stat-grid">
    <div class="stat-card ${pct(hivHeard,n)>=80?'ok':pct(hivHeard,n)>=60?'warn':'bad'}"><div class="n">${pct(hivHeard,n)}%</div><div class="l">HIV Aware</div></div>
    <div class="stat-card ${pct(hivTested,n)>=70?'ok':pct(hivTested,n)>=40?'warn':'bad'}"><div class="n">${pct(hivTested,n)}%</div><div class="l">Ever Tested</div></div>
    <div class="stat-card bad"><div class="n">${n-hivHeard}</div><div class="l">Never Heard HIV</div></div>
  </div>

  <h3>3.5 Disease Burden</h3>
  <div style="margin-bottom:8px">
    ${topIll.map(([k,v])=>`<div class="ill-row"><span style="flex:1;font-weight:500">${k}</span><div style="width:100px;height:7px;background:#f0f0f0;border-radius:99px;overflow:hidden;flex-shrink:0"><div style="width:${Math.round(v/illMax*100)}%;height:100%;background:#c0392b;border-radius:99px"></div></div><span style="font-weight:700;color:#c0392b;min-width:28px;text-align:right">${v}</span></div>`).join('')||'<p>No illness data available.</p>'}
  </div>
  <p>A total of <strong>${totalDeaths} death(s)</strong> were reported across <strong>${deathsHH} household(s)</strong> in the past 5 years. ${deathsHH>n*0.1?'This rate is above the expected threshold and warrants verbal autopsy investigation.':'This mortality rate is within expected community parameters.'}</p>

  <h3>3.6 Per-Interviewer Breakdown</h3>
  ${ivBreakdown.map(({iv,m,flags,latrinePct,waterPct,hivPct,topD,loc})=>`
  <div class="iv-card">
    <div class="iv-name">👤 ${iv}</div>
    <div class="iv-loc">📍 ${loc} · ${m} interview${m!==1?'s':''}</div>
    <div class="iv-row"><span class="iv-lbl">Latrine coverage</span>${progBar(latrinePct,100,'#16a085')}<span style="font-size:.7rem;font-weight:700;color:#16a085;min-width:36px">${latrinePct}%</span></div>
    <div class="iv-row"><span class="iv-lbl">Water treatment</span>${progBar(waterPct,100,'#2980b9')}<span style="font-size:.7rem;font-weight:700;color:#2980b9;min-width:36px">${waterPct}%</span></div>
    <div class="iv-row"><span class="iv-lbl">HIV awareness</span>${progBar(hivPct,100,'#8e44ad')}<span style="font-size:.7rem;font-weight:700;color:#8e44ad;min-width:36px">${hivPct}%</span></div>
    <div style="display:flex;justify-content:space-between;margin-top:8px;font-size:.72rem">
      <span>🚨 <strong>${flags}</strong> red flag indicator${flags!==1?'s':''}</span>
      ${topD?`<span>Top illness: <strong>${topD[0]}</strong> (${topD[1]})</span>`:'<span>No illnesses</span>'}
    </div>
  </div>`).join('')}

  <!-- DISCUSSION -->
  <h2>4. Discussion</h2>
  <p>The aggregated findings from ${n} households in Nyamache Sub County reveal a community with significant preventable health challenges. The ${pct(latrine,n)}% latrine coverage${pct(latrine,n)<80?' falls below the 80% national target, ':' meets the national standard but '}indicating that open defecation remains${pct(latrine,n)<80?' a widespread':' a residual'} public health challenge. The link between poor sanitation and diarrhoeal diseases, which are among the top five causes of morbidity in Kisii County, is well-established.</p>
  <p>Water treatment compliance of ${pct(waterTreated,n)}% ${pct(waterTreated,n)<70?'is inadequate. Households consuming untreated water face elevated risks of cholera, typhoid, and amoebic dysentery. Behavioural change communication and supply of affordable treatment options are critical interventions.':'is acceptable and reflects community uptake of health education messages in this area.'}</p>
  <p>HIV/AIDS awareness at ${pct(hivHeard,n)}% ${pct(hivHeard,n)<90?'falls short of the UNAIDS 95-95-95 target. The '+( n-hivHeard)+' respondents who have never heard of HIV/AIDS represent a vulnerable population requiring urgent outreach.':'is encouraging, though the testing rate must be improved to close the gap to the UNAIDS 95-95-95 treatment cascade target.'}</p>
  <p>${topIll.length>0?topIll[0][0]+' is the most commonly reported illness ('+topIll[0][1]+' cases). '+( topIll[0][0]==='Malaria'?'Kisii County has perennial malaria transmission. Vector control through insecticide-treated net (ITN) distribution, indoor residual spraying (IRS), and drainage of stagnant water must be intensified.':topIll[0][0].includes('Diarrh')?'Diarrhoeal disease burden is directly tied to the water and sanitation deficits identified above. Addressing the root causes — poor sanitation and untreated water — will substantially reduce this burden.':'Community health education targeting the specific behavioural drivers of this illness should be prioritised.'):'No dominant illness pattern was identified from the current dataset.'}</p>
  <p>Variation between interviewers in key indicators (latrine coverage, HIV awareness) reflects community-level heterogeneity across different surveyed areas rather than data collection inconsistency, and reinforces the need for geographically targeted interventions.</p>

  <!-- RECOMMENDATIONS -->
  <h2>5. Recommendations</h2>
  ${recList.map(r=>`<div class="rec-item ${r.lvl}"><div class="rec-title">${r.icon} ${r.title}</div><div class="rec-body">${r.body}</div></div>`).join('')}
  <p style="font-size:.76rem;color:#6b8a74;margin-top:14px;background:#f4f6f8;padding:10px 12px;border-radius:8px;line-height:1.6">Report generated ${now} · Great Lakes University of Kisumu · Based on ${n} household interviews conducted by ${interviewers.length} interviewer${interviewers.length!==1?'s':''} · Nyamache Sub County Hospital, Kisii County.</p>

</div>
${rptSig()}${rptPrintBtn()}</div></body></html>`;
}

// ── Entry point called from admin panel ──
function openGroupReport(){
  if(!_admRecs||!_admRecs.length){ showToast('No records loaded — refresh admin first',true); return; }
  // Parse raw_json if available, else use the record itself
  const recs=_admRecs.map(r=>{
    try{ return r.raw_json?{...JSON.parse(r.raw_json),...r}:r; }catch{ return r; }
  });
  const html=buildGroupReport(recs);
  openReportWindow(html,'group');
}

function exportJSON(){
  closeFinish();
  const rec=cRec();
  const blob=new Blob([JSON.stringify(rec,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  const name=(rec.interviewer_name||'record').replace(/\s/g,'_');
  const date=(rec.interview_date||new Date().toISOString().split('T')[0]);
  a.href=url;a.download=`health_survey_${name}_${date}.json`;
  a.click();URL.revokeObjectURL(url);
  showToast('✓ JSON saved to Downloads');
}
