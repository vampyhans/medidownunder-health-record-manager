<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:1F6F5C,100:2C8A73&height=180&section=header&text=MediDownUnder&fontSize=42&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=Patient%20record%20management%20for%20Australian%20GP%20clinics&descAlignY=58&descSize=16" width="100%"/>
</p>

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=18&pause=1000&color=1F6F5C&center=true&vCenter=true&width=600&lines=Built+for+IFN636+%E2%80%94+Software+Life+Cycle+Management;Receptionist+%2B+Clinician+roles%2C+one+shared+workflow;Static+frontend+%C2%B7+Python+HTTP+server+%C2%B7+no+frameworks" alt="Typing SVG" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/frontend-HTML%2FCSS%2FJS-1F6F5C?style=for-the-badge" />
  <img src="https://img.shields.io/badge/server-Python%20stdlib-2C548C?style=for-the-badge" />
  <img src="https://img.shields.io/badge/storage-localStorage-B4532A?style=for-the-badge" />
  <img src="https://img.shields.io/badge/status-Assessment%201-DCEDE7?style=for-the-badge&logoColor=black" />
</p>

---

## What it does

Two roles share one system, each seeing a different slice of it:

- **Receptionist** — registers new patients, edits their details, searches records
- **Clinician** — searches records, views a patient's consultation history, adds new consultation notes

Every meaningful action (login, registration, edit, note added) is written to a read-only audit log, so the practice has a record of who did what, and when.

## Design touches

- A hero login screen with a gently animated "Southern Cross" constellation
- A live dashboard stat strip (total patients, notes recorded, notes added today) that counts up on load
- Smooth card and page transitions, hover lift on buttons, a soft pulse on the role indicator
- A consistent visual system: Eucalyptus green + Bone neutral palette, Fraunces for headings, IBM Plex Sans for UI text, IBM Plex Mono for record IDs and timestamps

## Architecture summary

- **Frontend:** plain HTML, CSS and JavaScript, one file per screen, no framework.
- **Data storage:** browser `localStorage` (patients, notes, audit log) and `sessionStorage` (login session), shared across pages via `js/data.js`.
- **Shared chrome:** `js/shell.js` builds the nav rail/topbar and enforces role-based access on every page load.
- **Server:** a plain Python 3 script (`server.py`), standard library only (`http.server`), no Flask or Django. It only serves static files; it never touches patient data itself.
- **Backend/API/database:** out of scope for this assessment, planned for a later unit.

## Pages

| File | Purpose | Access |
|---|---|---|
| `login.html` | Sign in | Public |
| `patients.html` | Search / list patients, dashboard stats | Both roles |
| `patient-new.html` | Register a new patient | Receptionist |
| `patient-edit.html?id=` | Edit patient details | Receptionist |
| `patient-detail.html?id=` | View a patient record | Both roles (content differs by role) |
| `note-new.html?id=` | Add a consultation note | Clinician |
| `audit.html` | View activity log | Both roles |
| `wireframes.html` | Low-fidelity wireframes | Reference document |

## Demo accounts

| Role | Email | Password |
|---|---|---|
| Receptionist | alice@medidownunder.au | reception123 |
| Clinician | ben@medidownunder.au | clinician123 |

## Running it locally

Requirements: Python 3.8+, nothing else to install.

```bash
python3 server.py
# then open http://localhost:8000/login.html
```

Or on a different port:

```bash
python3 server.py 8080
```

> Open it through the server URL, not by double-clicking the HTML files. Pages opened directly from disk (`file://...`) don't share browser storage with each other, so data won't carry over between screens.

## Deployment procedure (manual, EC2)

CI/CD is out of scope for this assessment; deployment is manual and documented here.

1. Launch an EC2 instance (Amazon Linux or Ubuntu), with a security group allowing inbound TCP on the port you'll use (e.g. 80 or 8000) and SSH (22) from your IP only.
2. Copy this project to the instance:
   ```bash
   scp -i your-key.pem -r medidownunder ec2-user@<EC2_PUBLIC_IP>:~/
   ```
3. SSH in:
   ```bash
   ssh -i your-key.pem ec2-user@<EC2_PUBLIC_IP>
   ```
4. Confirm Python 3 is available (`python3 --version`); install it if not.
5. Run the server so it survives logout:
   ```bash
   cd medidownunder
   nohup python3 server.py 80 > server.log 2>&1 &
   ```
   (Port 80 needs root/sudo; alternatively use a high port like 8000 and open that in the security group instead.)
6. Confirm it's reachable at `http://<EC2_PUBLIC_IP>/login.html` from a browser outside the instance.
7. No secrets are used by this application, so none are committed to the repository or required on the instance.

## Known limitations

- Data is stored per-browser, not in a shared database, so records aren't visible across different devices or browsers in this phase.
- Authentication and role checks are enforced client-side, appropriate for this static-frontend phase; a real backend is planned for a later unit.
- Two-factor authentication was considered during design and descoped due to project timeframe; noted as a recommended future enhancement.

## Project structure

```
medidownunder/
├── server.py
├── README.md
└── public/
    ├── login.html
    ├── patients.html
    ├── patient-new.html
    ├── patient-edit.html
    ├── patient-detail.html
    ├── note-new.html
    ├── audit.html
    ├── wireframes.html
    ├── css/
    │   └── style.css
    └── js/
        ├── data.js
        └── shell.js
```

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:1F6F5C,100:2C8A73&height=100&section=footer" width="100%"/>
</p>
