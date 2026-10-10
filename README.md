# SmartZone — Phone Repair Timaru

Static website (HTML + CSS + vanilla JS, no build step) for https://smartzonenz.co.nz/, ready for Firebase Hosting (free Spark plan).

## Structure
```
public/
  index.html          Main one-page site
  404.html            Not-found page
  css/styles.css      All styles (brand tokens at the top in :root)
  js/main.js          Menu, scroll effects, live open/closed status, counters
  images/             Logo, hero and service photos
  robots.txt, sitemap.xml, site.webmanifest, favicons
firebase.json         Hosting config (caching + security headers)
.firebaserc           Firebase project id (set before deploying)
```

## Edit common things
- Phone number: search `6439272312` / `03 927 2312` in `public/index.html`
- Opening hours: `OPEN_HOUR` / `CLOSE_HOUR` in `public/js/main.js` + text in `index.html` + JSON-LD in `<head>`
- Colours / fonts: `:root` in `public/css/styles.css`

## Preview locally
```
npx serve public
```

## Deploy to Firebase (when ready)
```
npm install -g firebase-tools
firebase login
# put your project id in .firebaserc
firebase deploy --only hosting
```
Then connect the custom domain smartzonenz.co.nz in Firebase Console → Hosting → Add custom domain.
