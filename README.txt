RASAM — MOBILE DRAWER NAVIGATION FIX

Package contents:
- index.html (unchanged)
- style.css (unchanged)
- script.js (navigation handler updated only)

Fix:
When a chapter is selected from the Cosmic Directory on mobile (viewport <= 768px),
the drawer is closed first. The script waits for the panel's existing 450ms fade/
visibility transition, then waits two animation frames, recalculates the target's
position, and scrolls to that section.

Desktop:
The existing immediate navigation timing is retained.

Not changed:
- Drawer design or CSS
- Section content/layout
- Starfield, constellation visuals, or animations
- Case Study pages
- Other interaction logic

Replace these three files in the RASAM homepage project.
Test locally at mobile width, then test the deployed Cloudflare Pages site.
Do not deploy until local QA is approved.
