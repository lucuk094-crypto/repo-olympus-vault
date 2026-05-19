# Quick Start - Olympus Vault Deployment

## Pilih Platform Deploy

### 1️⃣ Railway (RECOMMENDED untuk Production)
✅ Persistent storage
✅ Gratis
✅ Mudah setup

```bash
# Install CLI
npm install -g @railway/cli

# Login dan deploy
railway login
railway init
railway up
```

### 2️⃣ Vercel (Demo/Testing Only)
⚠️ Ephemeral storage - file hilang saat restart

```bash
# Windows
deploy-vercel.bat

# Manual
npm install -g vercel
vercel login
vercel --prod
```

### 3️⃣ Netlify (Demo/Testing Only)
⚠️ Ephemeral storage - file hilang saat restart

```bash
# Windows
deploy-netlify.bat

# Manual
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

## Environment Variables (Semua Platform)

Set di dashboard masing-masing platform:

```
SECRET_KEY=<random-32-character-string>
UPLOAD_FOLDER=/tmp/uploads
DATABASE_PATH=/tmp/vault.db
```

Generate SECRET_KEY:
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

## Troubleshooting

**File upload tidak tersimpan?**
- Vercel/Netlify: Normal, gunakan Railway untuk persistent storage
- Railway: Check logs dengan `railway logs`

**Database error?**
- Pastikan DATABASE_PATH sudah di-set
- Check folder permissions

**500 Error?**
- Check environment variables
- Lihat logs di dashboard platform

---
Butuh bantuan? Baca [DEPLOY.md](DEPLOY.md) untuk panduan lengkap.
