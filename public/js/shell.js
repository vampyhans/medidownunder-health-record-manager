/* ====================================================================
   shell.js — the shared "page frame" (nav rail + top bar) and the
   role-based access guard.

   Every page except login.html calls requireAuth() near the top of its
   script, then renderShell() to draw the nav rail, top bar, and that
   page's own content all in one go.
   ==================================================================== */

// The little 5-dot "Southern Cross" logo mark, reused everywhere.
const MARK = `<div class="mark"><i></i><i></i><i></i><i></i><i></i></div>`;

// Checks who's logged in and (optionally) which role is allowed here.
//   requireAuth()               -> any logged-in user may see this page
//   requireAuth('receptionist') -> only the receptionist role may
//   requireAuth('clinician')    -> only the clinician role may
//
// Returns:
//   the session object   -> okay, continue building the page
//   null                 -> not logged in at all (already redirected)
//   false                -> logged in, but wrong role (blocked message shown)
function requireAuth(role){
  const s = DB.session();

  if(!s){
    window.location.href = 'login.html';
    return null;
  }

  if(role && s.role !== role){
    renderBlocked(s, role);
    return false;
  }

  return s;
}

// Clears the session and sends the user back to the login page.
function doLogout(){
  DB.clearSession();
  window.location.href = 'login.html';
}

// Builds the nav rail + top bar + page content, and puts it all into
// the empty <div id="app"> that every page starts with.
//   session     -> the logged-in user (from requireAuth)
//   activeKey   -> which nav button should be highlighted ('search', 'register', 'audit')
//   contentHtml -> the HTML for the middle of the page (built by each page itself)
function renderShell(session, activeKey, contentHtml){
  const isReceptionist = session.role === 'receptionist';

  // Receptionists see one extra nav button ("Register") that clinicians don't.
  const navItems = isReceptionist ? [
    {key:'search',   ic:'&#128269;', label:'Patients',  href:'patients.html'},
    {key:'register', ic:'&#128221;', label:'Register',  href:'patient-new.html'},
    {key:'audit',    ic:'&#128203;', label:'Audit',     href:'audit.html'},
  ] : [
    {key:'search', ic:'&#128269;', label:'Patients', href:'patients.html'},
    {key:'audit',  ic:'&#128203;', label:'Audit',    href:'audit.html'},
  ];

  const railButtonsHtml = navItems.map(item => `
    <a class="rail-btn ${activeKey === item.key ? 'active' : ''}" href="${item.href}">
      <span class="ic">${item.ic}</span><span>${item.label}</span>
    </a>`).join('');

  document.getElementById('app').innerHTML = `
    <div class="shell">

      <div class="rail">
        <div class="rail-logo">${MARK}</div>
        ${railButtonsHtml}
        <div class="rail-spacer"></div>
        <a class="rail-btn logout" href="javascript:void(0)" onclick="doLogout()">
          <span class="ic">&#9099;</span><span>Log out</span>
        </a>
      </div>

      <div class="main">
        <div class="topbar">
          <h1 class="brand-font">MediDownUnder</h1>
          <div class="role-badge">
            <span class="role-dot"></span>
            ${esc(session.name)} · ${isReceptionist ? 'Receptionist' : 'Clinician'}
          </div>
        </div>
        <div class="content">${contentHtml}</div>
      </div>

    </div>`;
}

// Shown instead of the normal page content when a logged-in user tries
// to open a page that isn't meant for their role (e.g. a receptionist
// opening the "add consultation note" page).
function renderBlocked(session, neededRole){
  renderShell(session, '', `
    <div class="card empty-state">
      <div class="ic">&#128274;</div>
      <p><strong>This page isn't part of your role.</strong></p>
      <p class="hint">
        ${neededRole === 'receptionist'
          ? 'Patient registration and edits are handled by reception staff.'
          : 'Consultation notes are recorded by clinicians.'}
      </p>
      <div style="margin-top:16px;">
        <a class="btn btn-secondary" href="patients.html">Back to patients</a>
      </div>
    </div>`);
}
