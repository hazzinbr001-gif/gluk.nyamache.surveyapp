/* ══════════════════════════════════════════════
   Community Health Survey — Sync Engine (Supabase)
   © 2026 HazzinBR
   ══════════════════════════════════════════════ */
// ══════════════════════════════════════════════════════
//  SUPABASE CONFIG
// ══════════════════════════════════════════════════════
const SUPABASE_URL = 'https://tftbysxozanxauxuuptw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmdGJ5c3hvemFueGF1eHV1cHR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5OTgzNzQsImV4cCI6MjA4OTU3NDM3NH0.xipP0OctBF7SwhFUwGJ7D8APVmSlmA0Qyvv5-_5J6Co';
const SYNC_TABLE   = 'health_survey_records';
// IMPORTANT: _synced flag is ONLY set after Supabase confirms the write.
// It is NEVER set optimistically. If it is not set, syncAll will retry.

// ── Sync button state ──
let _syncBusy = false;

function setSyncStatus(status, detail){
  const btn = document.getElementById('sync-btn');
  const dot = document.getElementById('sync-dot');
  const lbl = document.getElementById('sync-lbl');
  const colors = {idle:'rgba(255,255,255,.25)',syncing:'#f39c12',ok:'#4CAF72',offline:'rgba(255,255,255,.15)',error:'#e74c3c'};
  const labels = {idle:'Sync',syncing:'Syncing…',ok:'Synced ✓',offline:'Offline',error:'Sync Failed'};
  if(dot) dot.style.background = colors[status]||colors.idle;
  if(lbl) lbl.textContent = labels[status]||'Sync';
  if(btn){
    btn.disabled = (status === 'syncing');
    btn.style.opacity = (status === 'syncing') ? '0.65' : '1';
  }
  if(detail) console.warn('[Sync]', status, detail);
}

function isSyncConfigured(){
  return SUPABASE_URL.startsWith('https://') && SUPABASE_KEY.length > 10;
}

// ── Build the flat payload from a raw record ──
function buildPayload(recData){
  return {
    record_id:         recData._id || recData.record_id || ('R'+Date.now()),
    interviewer:       recData.interviewer_name || localStorage.getItem('chsa_user_name') || 'Unknown',
    interview_date:    recData.interview_date   || new Date().toISOString().split('T')[0],
    location:          (recData.interview_location === '__other__'
                          ? recData.interview_location_custom
                          : recData.interview_location)
                       || recData.interview_location_custom
                       || 'Nyamache Sub County Hospital',
    respondent_age:    parseInt(recData.a_age)  || null,
    respondent_gender: recData.a_gender         || '',
    house_type:        recData.b_type           || '',
    water_source:      [].concat(recData.h_wsrc || []).join(', '),
    water_treated:     recData.h_treat          || '',
    latrine:           recData.g_latrine        || '',
    hiv_heard:         recData.f_heard          || '',
    hiv_tested:        recData.f_tested         || '',
    illnesses:         [].concat(recData.c_ill  || []).join(', '),
    deaths_5yr:        recData.c_deaths         || '',
    deaths_count:      parseInt(recData.c_deaths_n) || 0,
    fuel:              recData.b_fuel           || '',
    education:         recData.a_edu            || '',
    occupation:        recData.a_occ            || '',
    consent:           recData.consent_given    || '',
    synced_at:         new Date().toISOString(),
    raw_json:          JSON.stringify(recData),
  };
}

// ── Upload ONE record ──
// Strategy: always POST first. If 409 duplicate, fall back to PATCH update.
async function syncRecord(recData){
  if(!isSyncConfigured()) return {ok:false, err:'Not configured'};
  if(!navigator.onLine) return {ok:false, err:'Offline'};
  try {
    const payload = buildPayload(recData);
    const rid = encodeURIComponent(payload.record_id);
    const baseHeaders = {
      'Content-Type':  'application/json',
      'apikey':        SUPABASE_KEY,
      'Authorization': 'Bearer ' + SUPABASE_KEY,
      'Prefer':        'return=minimal',
    };

    console.log('[Sync] Attempting POST for record_id:', payload.record_id);

    // Step 1: Try POST (insert new row)
    const post = await fetch(
      `${SUPABASE_URL}/rest/v1/${SYNC_TABLE}`,
      { method:'POST', headers:baseHeaders, body:JSON.stringify(payload) }
    );

    console.log('[Sync] POST status:', post.status);

    if(post.status === 200 || post.status === 201 || post.status === 204){
      // INSERT confirmed by Supabase — mark synced NOW
      markSynced(recData, true);
      return {ok:true};
    }

    if(post.status === 409){
      // Row already exists — update it with PATCH
      console.log('[Sync] 409 duplicate — trying PATCH update');
      const patch = await fetch(
        `${SUPABASE_URL}/rest/v1/${SYNC_TABLE}?record_id=eq.${rid}`,
        { method:'PATCH', headers:baseHeaders, body:JSON.stringify(payload) }
      );
      console.log('[Sync] PATCH status:', patch.status);
      if(patch.status === 200 || patch.status === 204 || patch.status === 201){
        // UPDATE confirmed by Supabase — mark synced NOW
        markSynced(recData, true);
        return {ok:true};
      } else {
        const body = await patch.text();
        markSynced(recData, false); // ensure not falsely marked
        return {ok:false, err:`PATCH failed ${patch.status}: ${body.slice(0,120)}`};
      }
    }

    // Any other error from POST — do NOT mark synced
    const body = await post.text();
    console.warn('[Sync] POST error:', post.status, body);
    markSynced(recData, false);
    return {ok:false, err:`HTTP ${post.status}: ${body.slice(0,120)}`};

  } catch(e){
    console.error('[Sync] Exception:', e);
    markSynced(recData, false);
    return {ok:false, err: e.message};
  }
}

function markSynced(recData, success){
  const stored = JSON.parse(localStorage.getItem('chsa4')||'{}');
  const id = recData._id || recData.record_id;
  if(id && stored[id]){
    if(success){
      stored[id]._synced    = true;
      stored[id]._synced_at = new Date().toISOString();
    } else {
      // Make sure failed records are NOT marked synced so they retry
      stored[id]._synced = false;
    }
    localStorage.setItem('chsa4', JSON.stringify(stored));
  }
}

// ── Sync unsynced records only ──
async function syncAll(){
  if(_syncBusy) return;
  if(!isSyncConfigured()){ showToast('⚠ Sync not configured', true); return; }
  if(!navigator.onLine){ setSyncStatus('offline'); showToast('⚠ No internet connection', true); return; }
  _syncBusy = true;
  setSyncStatus('syncing');
  const stored = JSON.parse(localStorage.getItem('chsa4')||'{}');
  const pending = Object.entries(stored).filter(([id,r])=>
    typeof r === 'object' && r !== null && !id.startsWith('_') && !r._synced && r._finished===true
  );
  if(!pending.length){
    setSyncStatus('ok');
    showToast('✓ All records already synced');
    _syncBusy = false;
    return;
  }
  showToast('Uploading '+pending.length+' record(s)…');
  let ok=0, fail=0, lastErr='';
  for(const [id, rec] of pending){
    const result = await syncRecord({...rec, _id:id});
    if(result.ok) ok++;
    else { fail++; lastErr = result.err; }
  }
  _syncBusy = false;
  if(fail > 0){
    setSyncStatus('error', lastErr);
    showToast(`⚠ ${ok} synced, ${fail} failed — tap Sync to retry`, true);
  } else {
    setSyncStatus('ok');
    showToast(`✓ ${ok} record(s) synced to admin!`);
  }
}

// ── FORCE SYNC — pushes ALL records regardless of _synced flag ──
async function forceSyncAll(){
  if(_syncBusy) return;
  if(!isSyncConfigured()){ showToast('⚠ Sync not configured', true); return; }
  if(!navigator.onLine){ setSyncStatus('offline'); showToast('⚠ No internet connection', true); return; }
  _syncBusy = true;
  setSyncStatus('syncing');
  // First reset all _synced flags so everything is re-pushed
  const stored = JSON.parse(localStorage.getItem('chsa4')||'{}');
  const all = Object.entries(stored).filter(([id,r])=>
    typeof r === 'object' && r !== null && !id.startsWith('_')
  );
  if(!all.length){
    setSyncStatus('ok');
    showToast('No records to sync', true);
    _syncBusy = false;
    return;
  }
  showToast('Force pushing '+all.length+' record(s)…');
  let ok=0, fail=0, lastErr='';
  for(const [id, rec] of all){
    // Clear synced flag so syncRecord marks it fresh
    const result = await syncRecord({...rec, _id:id, _synced:false});
    if(result.ok) ok++;
    else { fail++; lastErr = result.err; }
  }
  _syncBusy = false;
  if(fail > 0){
    setSyncStatus('error', lastErr);
    showToast(`⚠ ${ok} pushed, ${fail} failed: ${lastErr.slice(0,60)}`, true);
  } else {
    setSyncStatus('ok');
    showToast(`✓ Force pushed ${ok} record(s) to admin!`);
  }
}

// ── Auto sync on page load ──
window.addEventListener('load', ()=>{
  setTimeout(()=>{
    setSyncStatus(navigator.onLine ? 'idle' : 'offline');
    if(navigator.onLine && isSyncConfigured()) syncAll();
  }, 2500);
});

// ── Auto sync when coming back online ──
window.addEventListener('online',  ()=>{ setSyncStatus('idle'); setTimeout(syncAll, 1500); });
window.addEventListener('offline', ()=>{ setSyncStatus('offline'); showToast('⚠ Gone offline — data saved locally', true); });

// nextSec now syncs inline — no patch needed here
