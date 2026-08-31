/* ====================================================================
   data.js — the shared "database" for MediDownUnder.

   This app has no real backend/server database. Instead, everything is
   saved in the browser's localStorage as simple JSON text. Every page
   loads this file first (see the <script> tags at the bottom of each
   HTML page), so every page shares the same DB object and the same
   helper functions below.

   localStorage keys used:
     mdu_users     -> the two demo accounts (never changes at runtime)
     mdu_patients  -> array of patient records
     mdu_notes     -> array of consultation notes
     mdu_audit     -> array of audit log entries (who did what, when)
   ==================================================================== */

const DB = {

  // Runs once, the very first time the app is opened in a browser.
  // If there's no data yet, it creates the starting (seed) data.
  init(){
    if(!localStorage.getItem('mdu_users')){
      localStorage.setItem('mdu_users', JSON.stringify([
        {email:'alice@medidownunder.au', password:'reception123', role:'receptionist', name:'Alice Ngata'},
        {email:'ben@medidownunder.au', password:'clinician123', role:'clinician', name:'Dr. Ben Okafor'}
      ]));
    }
    if(!localStorage.getItem('mdu_patients')) localStorage.setItem('mdu_patients', '[]');
    if(!localStorage.getItem('mdu_notes'))    localStorage.setItem('mdu_notes', '[]');
    if(!localStorage.getItem('mdu_audit'))    localStorage.setItem('mdu_audit', '[]');
  },

  // ---- Read helpers: pull data out of localStorage and turn it back
  // ---- into a normal JavaScript array/object with JSON.parse.
  users(){    return JSON.parse(localStorage.getItem('mdu_users')); },
  patients(){ return JSON.parse(localStorage.getItem('mdu_patients')); },
  notes(){    return JSON.parse(localStorage.getItem('mdu_notes')); },
  audit(){    return JSON.parse(localStorage.getItem('mdu_audit')); },

  // ---- Write helpers: turn a JavaScript array back into text with
  // ---- JSON.stringify, then save it into localStorage.
  savePatients(list){ localStorage.setItem('mdu_patients', JSON.stringify(list)); },
  saveNotes(list){    localStorage.setItem('mdu_notes', JSON.stringify(list)); },

  // Adds one new entry to the audit log. Called whenever something
  // important happens (login, patient created/edited, note added).
  log(userName, action, target){
    const entries = DB.audit();
    entries.unshift({ userName, action, target, at: new Date().toISOString() });
    localStorage.setItem('mdu_audit', JSON.stringify(entries));
  },

  // ---- Session helpers: who is currently logged in, in THIS browser
  // ---- tab only (sessionStorage clears itself when the tab closes,
  // ---- unlike localStorage which stays until it's cleared).
  session(){ return JSON.parse(sessionStorage.getItem('mdu_session') || 'null'); },
  setSession(s){ sessionStorage.setItem('mdu_session', JSON.stringify(s)); },
  clearSession(){ sessionStorage.removeItem('mdu_session'); }
};

// Make sure the seed data exists as soon as this file loads.
DB.init();


// Escapes text before putting it into HTML, so that if a patient's name
// contained something like <script>, it would just show as text and not
// actually run as code. Every place we insert user-typed text into the
// page uses this function first.
function esc(s){
  return (s || '').replace(/[&<>"]/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'
  }[c]));
}

// Turns a stored ISO date/time (e.g. "2026-08-29T10:15:00.000Z") into a
// friendly Australian format like "29 Aug 2026 · 10:15 am".
function fmtDate(iso){
  const d = new Date(iso);
  return d.toLocaleDateString('en-AU', {day:'2-digit', month:'short', year:'numeric'})
    + ' · '
    + d.toLocaleTimeString('en-AU', {hour:'2-digit', minute:'2-digit'});
}

// Shows a small pop-up message at the bottom of the screen for a couple
// of seconds (used after saving something successfully).
function toast(msg){
  const t = document.getElementById('toast');
  if(!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove('show'), 2400);
}

// Reads a value from the page's URL, e.g. on "patient-detail.html?id=P1001"
// calling qs('id') returns "P1001".
function qs(name){
  return new URLSearchParams(window.location.search).get(name);
}
