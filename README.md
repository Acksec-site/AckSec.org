# AckSec Website

Professional penetration testing company website with gold/black color scheme.

## Features

- Clean, professional design (no gimmicks)
- Subtle geometric background animations
- Scroll-triggered reveal animations
- Real terminal simulation with actual pentest commands
- Mobile responsive
- Gold/black color palette

---

## Deploy to Cloudflare Pages

### Step 1: Push to GitHub

```bash
cd acksec-website
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOURUSERNAME/acksec-website.git
git push -u origin main
```

### Step 2: Connect to Cloudflare Pages

1. Cloudflare Dashboard → Workers & Pages → Create → Pages
2. Connect to Git → Select your repo
3. Build settings:
   - Framework preset: Vite
   - Build command: `npm run build`
   - Build output directory: `dist`
4. Deploy

### Step 3: Add Custom Domain

1. Pages project → Custom domains
2. Add `acksec.org`
3. DNS auto-configured

---

## Local Development

```bash
npm install
npm run dev
```

---

## Project Structure

```
acksec-website/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx
    ├── index.css
    └── App.jsx
```

---

## Customization

### Contact Form
The form needs a backend. Options:
- Formspree (free tier)
- Cloudflare Workers

### Pricing
Edit the `plans` array in the Pricing component.

### Team Info
Edit the `team` array in the Team component.

---

## Pages

- **Home** - Hero with terminal demo
- **Process** - 6-step penetration testing methodology
- **Pricing** - 4 tiers (Starter CHF 75, Standard CHF 150, Professional CHF 500, Custom)
- **Team** - Noah & Nico
- **Contact** - Form + contact info

---

© 2025 AckSec
