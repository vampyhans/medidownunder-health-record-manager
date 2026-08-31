import http.server
import socketserver
import os
import sys

PUBLIC_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "public")
DEFAULT_PORT = 8000

class MediDownUnderHandler(http.server.SimpleHTTPRequestHandler):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=PUBLIC_DIR, **kwargs)

    def log_message(self, format, *args):
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
