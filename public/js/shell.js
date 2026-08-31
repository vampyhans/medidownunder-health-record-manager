const MARK = `<div class="mark"><i></i><i></i><i></i><i></i><i></i></div>`;

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

function doLogout(){
  DB.clearSession();
  window.location.href = 'login.html';
}

function renderShell(session, activeKey, contentHtml){
  const isReceptionist = session.role === 'receptionist';

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
