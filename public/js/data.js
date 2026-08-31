const DB = {

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

  users(){    return JSON.parse(localStorage.getItem('mdu_users')); },
  patients(){ return JSON.parse(localStorage.getItem('mdu_patients')); },
  notes(){    return JSON.parse(localStorage.getItem('mdu_notes')); },
  audit(){    return JSON.parse(localStorage.getItem('mdu_audit')); },

  savePatients(list){ localStorage.setItem('mdu_patients', JSON.stringify(list)); },
  saveNotes(list){    localStorage.setItem('mdu_notes', JSON.stringify(list)); },

  log(userName, action, target){
    const entries = DB.audit();
    entries.unshift({ userName, action, target, at: new Date().toISOString() });
    localStorage.setItem('mdu_audit', JSON.stringify(entries));
  },

  session(){ return JSON.parse(sessionStorage.getItem('mdu_session') || 'null'); },
  setSession(s){ sessionStorage.setItem('mdu_session', JSON.stringify(s)); },
  clearSession(){ sessionStorage.removeItem('mdu_session'); }
};

DB.init();

function esc(s){
  return (s || '').replace(/[&<>"]/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'
  }[c]));
}

function fmtDate(iso){
  const d = new Date(iso);
  return d.toLocaleDateString('en-AU', {day:'2-digit', month:'short', year:'numeric'})
    + ' · '
    + d.toLocaleTimeString('en-AU', {hour:'2-digit', minute:'2-digit'});
}

function toast(msg){
  const t = document.getElementById('toast');
  if(!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove('show'), 2400);
}

function qs(name){
  return new URLSearchParams(window.location.search).get(name);
}
