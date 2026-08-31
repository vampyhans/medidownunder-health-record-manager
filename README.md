# MediDownUnder | Health Record Manager

A staff-facing patient record management prototype for a small Australian GP clinic, built for IFN636 Assessment 1 (Software Requirements Analysis and Design).

## Architecture summary

This phase of the project is a static frontend application, one HTML file per screen:

- **Frontend:** plain HTML, CSS and JavaScript, no framework.
- **Data storage:** browser `localStorage` (patients, consultation notes, audit log) and `sessionStorage` (login session), managed entirely client-side, shared across pages via `js/data.js`.
- **Shared chrome:** `js/shell.js` builds the nav rail/topbar and enforces role-based access on each page load.
- **Server:** a plain Python 3 script (`server.py`) using only the standard library (`http.server`), no Flask or Django. Its only job is to serve the static files; it does not process or store any patient data itself.
- **Backend/API/database:** out of scope for this assessment. Planned for a later unit.

Two roles are supported: **Receptionist** (patient registration, search, editing) and **Clinician** (patient search, viewing records, adding consultation notes).

## Pages

| File                      | Purpose                 | Access                               |
| ------------------------- | ----------------------- | ------------------------------------ |
| `login.html`              | Sign in                 | Public                               |
| `patients.html`           | Search / list patients  | Both roles                           |
| `patient-new.html`        | Register a new patient  | Receptionist                         |
| `patient-edit.html?id=`   | Edit patient details    | Receptionist                         |
| `patient-detail.html?id=` | View a patient record   | Both roles (content differs by role) |
| `note-new.html?id=`       | Add a consultation note | Clinician                            |
| `audit.html`              | View activity log       | Both roles                           |
| `wireframes.html`         | Low-fidelity wireframes | Reference document                   |

## Demo accounts

| Role         | Email               | Password                 |
| ------------ | ------------------- | ------------------------ | ------------ |
| Receptionist | alice@MediDownUnder | Health Record Manager.au | reception123 |
| Clinician    | ben@MediDownUnder   | Health Record Manager.au | clinician123 |

## Local setup

Requirements: Python 3.8+, no other dependencies.

```bash
python3 server.py
# serves on http://localhost:8000, open login.html to start
```

Or specify a port:

```bash
python3 server.py 8080
```

## Deployment procedure (manual, EC2)

CI/CD is out of scope for this assessment; deployment is manual and documented here.

1. Launch an EC2 instance (Amazon Linux or Ubuntu), with a security group allowing inbound TCP on the port you'll use (e.g. 80 or 8000) and SSH (22) from your IP only.
2. Copy this project to the instance, e.g.:
   ```bash
   scp -i your-key.pem -r MediDownUnder | Health Record Manager ec2-user@<EC2_PUBLIC_IP>:~/
   ```
3. SSH into the instance:
   ```bash
   ssh -i your-key.pem ec2-user@<EC2_PUBLIC_IP>
   ```
4. Confirm Python 3 is available (`python3 --version`), install it if not (e.g. `sudo yum install python3` or `sudo apt install python3`).
5. Run the server, keeping it alive after logout:
   ```bash
   cd MediDownUnder | Health Record Manager
   nohup python3 server.py 80 > server.log 2>&1 &
   ```
   (Port 80 requires running as root/sudo, or use a high port like 8000 and open that in the security group instead.)
6. Confirm it's reachable at `http://<EC2_PUBLIC_IP>/login.html` from a browser outside the instance.
7. No secrets are used by this application, so none are committed to the repository or required on the instance.

## Known limitations

- Data is stored per-browser (localStorage), not in a shared database, so records are not visible across different devices or browsers in this phase.
- Authentication and role checks are enforced client-side, appropriate for this static-frontend phase of the project.
- Two-factor authentication was considered during design and descoped due to project timeframe; recommended as a future enhancement.

## Project structure

```
MediDownUnder | Health Record Manager/
├── server.py
├── public/
│   ├── login.html
│   ├── patients.html
│   ├── patient-new.html
│   ├── patient-edit.html
│   ├── patient-detail.html
│   ├── note-new.html
│   ├── audit.html
│   ├── wireframes.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── data.js
│       └── shell.js
└── README.md
```
