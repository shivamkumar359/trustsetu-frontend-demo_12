# TrustSetu X TrustNet

Professional AI Trust Platform — digital trust verification and AI-based risk analysis.

## Folder structure

```
react/
├── index.html    # Single-page layout (all sections)
├── style.css     # Custom CSS, no Bootstrap
├── script.js     # Smooth scroll, modals, navbar, form validation
├── logo.svg      # SVG logo (bridge/network concept)
└── README.md     # This file
```

## How to run locally

1. **Open in browser (no server)**  
   Double-click `index.html` or drag it into your browser.  
   Everything works from the file system (no build step).

2. **Optional: local HTTP server**  
   If you prefer a local server (e.g. to avoid file:// restrictions):

   - **Node (npx):**
     ```bash
     npx serve .
     ```
     Then open the URL shown (e.g. http://localhost:3000).

   - **Python 3:**
     ```bash
     python -m http.server 8000
     ```
     Then open http://localhost:8000.

   - **VS Code:** Install the “Live Server” extension and “Open with Live Server” on `index.html`.

All assets (HTML, CSS, JS, inline SVG) are in this folder; no external dependencies except the Inter font from Google Fonts.
