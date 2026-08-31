"""
MediDownUnder - static file server
-----------------------------------
Plain Python HTTP server (standard library only, no Flask/Django).
Serves the static frontend (HTML/CSS/JS) from the ./public directory.

All application data (users, patients, consultation notes, audit log) is
stored client-side in the browser (localStorage / sessionStorage). This
server's only job is to serve the static files; it does not process any
patient data itself.

Local usage:
    python3 server.py
    python3 server.py 8080

EC2 usage (manual deployment):
    python3 server.py 80
    (or run on a high port, e.g. 8000, behind the instance's security group
    rule that allows inbound HTTP on that port)

To keep it running after you disconnect from SSH:
    nohup python3 server.py 80 > server.log 2>&1 &
"""

import http.server
import socketserver
import os
import sys

PUBLIC_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "public")
DEFAULT_PORT = 8000


class MediDownUnderHandler(http.server.SimpleHTTPRequestHandler):
    """Serves files from the public/ directory only."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=PUBLIC_DIR, **kwargs)

    def log_message(self, format, *args):
        # Slightly clearer log lines than the default
        sys.stderr.write("[MediDownUnder] %s - %s\n" % (self.address_string(), format % args))


def main():
    port = DEFAULT_PORT
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            print(f"Invalid port '{sys.argv[1]}', using default {DEFAULT_PORT}")

    if not os.path.isdir(PUBLIC_DIR):
        print(f"Error: public directory not found at {PUBLIC_DIR}")
        sys.exit(1)

    with socketserver.TCPServer(("0.0.0.0", port), MediDownUnderHandler) as httpd:
        print(f"MediDownUnder serving {PUBLIC_DIR}")
        print(f"Listening on http://0.0.0.0:{port}  (Ctrl+C to stop)")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nStopping server.")
            httpd.shutdown()


if __name__ == "__main__":
    main()
