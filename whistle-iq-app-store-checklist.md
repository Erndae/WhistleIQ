# Whistle IQ — App Store Submission Checklist

This covers everything needed to get Whistle IQ into the actual App Store, split into what I could prepare for you and what only you can do (accounts and payments have to be in your own name — I can't create or hold them for you).

## What's already prepared

- **App Store icon** (`appstore-icon-1024.png`, 1024×1024, no transparency) — ready to upload as-is.
- **`manifest.json`** — checked and polished for PWABuilder compatibility.
- **`privacy.html`** — a hosted privacy policy page (Apple requires a live URL for this, even for an app that collects nothing). Uses your email as the contact — swap it out if you'd rather use a different one.
- **Listing copy** below, ready to paste into App Store Connect.

## Why I'm not handing you a ready-to-build Xcode project

I looked into generating the actual native iOS project (via Capacitor) directly in this session, but this sandbox's network policy blocks access to the npm package registry, so I can't pull down the tooling that generates it — and I don't have Xcode or a Mac here to verify a hand-written project would even compile. Rather than hand you something that might silently be broken and waste your Codemagic build minutes, the right tool for that step is **PWABuilder** (pwabuilder.com) — it's a free, maintained Microsoft tool built specifically to turn a live PWA into a real iOS Xcode project, and it's what generates a project that's actually known to work. Once you've run it, send me what it gives you and I'll help you take it the rest of the way (Codemagic setup, debugging build errors, etc.).

## Step-by-step

**1. Get Whistle IQ live on a public URL, if it isn't already.**
PWABuilder needs to fetch your manifest and service worker from a real HTTPS address. If you haven't already deployed `whistle-iq-github.zip` to GitHub Pages, do that first (create a repo, upload the contents, enable Pages in Settings). You'll get a URL like `yourname.github.io/whistle-iq`.

**2. Enroll in the Apple Developer Program.**
Go to [developer.apple.com/programs](https://developer.apple.com/programs) and enroll — $99/year, paid to Apple directly, in your name (individual) or a business you control. This is required to submit anything to the App Store; there's no way around it and no way I can do it for you.

**3. Generate the iOS project with PWABuilder.**
Go to [pwabuilder.com](https://www.pwabuilder.com), enter your GitHub Pages URL, and let it scan the site. Go to the iOS package section, upload `appstore-icon-1024.png` when it asks for an icon, and download the generated project (it'll be a zip containing a real Xcode project).

**4. Push that generated project to a new GitHub repo.**
This is what Codemagic will build from.

**5. Set up Codemagic.**
Go to [codemagic.io](https://codemagic.io), sign up free (500 build minutes/month, no card needed to start), and connect the GitHub repo from step 4. Codemagic detects the project type and can auto-generate its own build config — you shouldn't need to hand-write one.

**6. Set up code signing in Codemagic — no Mac needed.**
In Codemagic's app settings, connect your Apple Developer account via an **App Store Connect API key** (you generate this in App Store Connect → Users and Access → Integrations, then paste it into Codemagic). Codemagic uses it to handle signing certificates and provisioning automatically. This is the step that replaces needing your own Mac entirely.

**7. Create the app record in App Store Connect.**
At [appstoreconnect.apple.com](https://appstoreconnect.apple.com), create a new app: pick a bundle ID (e.g. `com.ernestoclark.whistleiq` — it doesn't need to match a domain you own, just be unique to your account), and use the listing copy below.

**8. Run the build in Codemagic.**
Trigger a build — it compiles, signs, and can auto-upload the result straight to App Store Connect / TestFlight. Install it via TestFlight on your own phone first and make sure it looks/works right.

**9. Submit for review.**
Fill in the remaining App Store Connect fields (screenshots — you can take these from TestFlight on your phone; age rating questionnaire; support URL), and submit. Apple's review typically takes 1–3 days. Since this is a wrapped web app, review sometimes pushes back if the app doesn't feel sufficiently "native" — the Casebook/Scenarios/Court Builder/offline support all help make the case that it's a genuine app, not just a bookmarked website.

---

## Listing copy (ready to paste into App Store Connect)

**App name** (max 30 characters): `Whistle IQ`

**Subtitle** (max 30 characters): `HS Basketball Officiating`

**Category:** Sports (primary), Education (secondary)

**Promotional text** (max 170 characters, editable anytime without review):
> Now with a full Casebook browse mode grouped by rule chapter, plus Court Diagram Builder mechanics — built for NFHS high school officials.

**Description:**
> Whistle IQ is a study and quiz tool built for high school basketball officials working under NFHS rules.
>
> Learn the Rule Book and Officials Manual section by section, then test yourself with rules questions, real Case Book game-situation scenarios, and mechanics/signals drills. Missed questions go into their own practice bank so you can drill exactly what you got wrong. The Court Diagram Builder lets you place officials and players, draw mechanics, and quiz yourself on positioning for 2-person and 3-person crews.
>
> Everything works fully offline once loaded, with no account, login, or ads — your progress stays on your device.
>
> Features:
> • Rule Book study guide with full-text search
> • Case Book scenarios, browsable by rule chapter
> • Officials Manual — principles, terminology, and signals
> • Missed-question bank for targeted practice
> • Court Diagram Builder with 2-Man and 3-Man mechanics presets
> • Badges and streak tracking to keep you sharp
>
> Whistle IQ is an independent educational tool and is not affiliated with or endorsed by the NFHS. Always consult current official NFHS publications and your state association for authoritative rulings.

**Keywords** (max 100 characters, comma-separated, no spaces after commas):
`basketball,officiating,referee,NFHS,rules,rulebook,casebook,umpire,ref,quiz,sports,study`

**Support URL:** your GitHub Pages URL (e.g. `https://yourname.github.io/whistle-iq/`), or a dedicated support page if you'd rather keep it separate.

**Privacy Policy URL:** your GitHub Pages URL + `/privacy.html` (e.g. `https://yourname.github.io/whistle-iq/privacy.html`)

**Age rating questionnaire:** no objectionable content anywhere in the app — this should come out to 4+.

**What's New (for the first version):** `Initial release.`
