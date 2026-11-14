VEOX AI — AI Video Generator starter (website + installable mobile web app)

Yeh pichhle demo se aage ka code hai:
- Text-to-video aur photo-to-video backend integration
- fal.ai Veo 3.1 API connector
- API key server par rakhi jaati hai, browser mein nahi
- Mobile-friendly website + PWA manifest (Android Chrome se Add to Home screen)

IMPORTANT:
1) Is project ko chalane ke liye hosting/server aur fal.ai account/API key zaroori hai.
2) API key ko kabhi bhi kisi chat mein paste/share mat karna. Hosting ke Environment Variables mein FAL_KEY ke naam se set karna.
3) API generation paid hai. Provider ki current pricing/credits check karo. App mein 4K select karne par standard model use hota hai; 4K generation mehngi ho sakti hai.
4) Android install: deployed website ko Chrome mein kholo > menu (⋮) > Add to Home screen / Install app.
5) Yeh PWA Android par app jaisa install hota hai. Native APK banane aur Play Store par publish karne ke liye agla build step alag hoga.

Run locally (computer/server):
- Node.js 20+
- npm install
- Set FAL_KEY in environment
- npm start
- Open http://localhost:3000

Mobile-only user ke liye:
Aap phone se code ZIP download kar sakte ho, lekin server deploy karne ke liye hosting account setup karna hoga. Main agle step mein phone se deployment aur API key setup guide kar sakta hoon.
