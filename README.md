# Color Voice Game

A playful, mobile-first web game where you say the color you see (not the word you read)!

## Features
- Fun color-voice challenge
- Mobile-first, responsive design
- Voice recognition (Web Speech API)
- Animated splash, countdown, and results
- Playful, vibrant UI

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Run locally:**
   ```bash
   npm run dev
   ```

## Deployment

### Deploy to Vercel
- Click the button or run:
  ```bash
  npx vercel
  ```
- Follow the prompts to deploy.

### Deploy to Netlify
- Click the button or run:
  ```bash
  npx netlify deploy
  ```
- Set build command: `npm run build`
- Set publish directory: `.next`

## Notes
- Works best in Chrome/Edge (Web Speech API support).
- For Cordova/Capacitor: Use a plugin for speech recognition (e.g., cordova-plugin-speechrecognition) and adapt the game logic to use the plugin API instead of the browser's Web Speech API.

---

Made with ❤️ using Next.js, Tailwind CSS, and Framer Motion.
