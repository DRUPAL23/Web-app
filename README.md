# Web-app
App and site development resources 
# YouTube Channel Manager

A zero-dependency, single-file YouTube channel dashboard.  
Live via **GitHub Pages** — no build step, no npm, no server.

## 🚀 Deploy to GitHub Pages (3 steps)

### 1. Create a new GitHub repo
```
Repository name: yt-channel-manager   (or any name you like)
Visibility: Public  ← required for free GitHub Pages
```

### 2. Upload the file
- Click **Add file → Upload files**
- Drop in `index.html`
- Commit changes

### 3. Enable GitHub Pages
- Go to **Settings → Pages**
- Source: **Deploy from a branch**
- Branch: `main` / `(root)`
- Click **Save**

Your live URL will be:
```
https://<your-username>.github.io/<repo-name>/
```
(Takes ~60 seconds to go live after saving.)

---

## 🔑 Getting Your API Key

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a project (or select existing)
3. **APIs & Services → Enable APIs → YouTube Data API v3**
4. **Credentials → Create Credentials → API Key**
5. (Optional) Restrict the key to `https://<your-username>.github.io/*`

## 📌 Finding Your Channel ID

YouTube → click your profile picture → **Settings → Advanced settings**  
Copy the ID that starts with `UC…`

---

## Features

| Tab | What it shows |
|-----|--------------|
| 📊 Overview | Channel info, subscriber/view counts, upload performance bars |
| 🎬 All Videos | Searchable grid — thumbnails, views, likes, comments, duration |
| 🏆 Top 5 | Your top 5 videos ranked by total views |

---

## Notes

- Uses **YouTube Data API v3** (public key, read-only)
- Revenue / CTR / impressions require YouTube Studio OAuth — not available with an API key alone
- Your API key is used only in-browser and never sent to any third-party server
