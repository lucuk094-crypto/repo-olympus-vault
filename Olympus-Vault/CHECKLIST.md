# Olympus Vault - Deployment Checklist

## Pre-Deployment
- [ ] Python 3.11+ installed
- [ ] Node.js installed (for CLI tools)
- [ ] Git repository initialized
- [ ] All dependencies in requirements.txt

## Choose Your Platform

### ✅ Railway (Recommended for Production)
- [ ] Install Railway CLI: `npm install -g @railway/cli`
- [ ] Login: `railway login`
- [ ] Initialize: `railway init`
- [ ] Deploy: `railway up`
- [ ] Set environment variables in Railway dashboard
- [ ] Test deployment: `railway open`

**Pros**: Persistent storage, free tier, easy setup
**Cons**: None for this use case

---

### ⚠️ Vercel (Demo/Testing Only)
- [ ] Install Vercel CLI: `npm install -g vercel`
- [ ] Login: `vercel login`
- [ ] Deploy: `vercel --prod`
- [ ] Set environment variables in Vercel dashboard
- [ ] Test deployment

**Pros**: Fast deployment, global CDN
**Cons**: Ephemeral storage (files/database reset on restart)

---

### ⚠️ Netlify (Demo/Testing Only)
- [ ] Install Netlify CLI: `npm install -g netlify-cli`
- [ ] Login: `netlify login`
- [ ] Deploy: `netlify deploy --prod`
- [ ] Set environment variables in Netlify dashboard
- [ ] Test deployment

**Pros**: Easy setup, good for static sites
**Cons**: Ephemeral storage (files/database reset on restart)

---

## Environment Variables (All Platforms)

Set these in your platform's dashboard:

```
SECRET_KEY = [Generate with: python -c "import secrets; print(secrets.token_hex(32))"]
UPLOAD_FOLDER = /tmp/uploads
DATABASE_PATH = /tmp/vault.db
```

---

## Post-Deployment Testing

- [ ] Visit deployed URL
- [ ] Register new account
- [ ] Login successfully
- [ ] Upload a test file
- [ ] Download the uploaded file
- [ ] Delete the test file
- [ ] Logout and login again
- [ ] Check if files persist (Railway only)

---

## Troubleshooting

**Deployment fails?**
1. Check logs in platform dashboard
2. Verify all environment variables are set
3. Ensure requirements.txt is complete
4. Check Python version compatibility

**Files disappear after restart?**
- Expected on Vercel/Netlify (use Railway instead)

**Can't login/register?**
- Check SECRET_KEY is set
- Verify DATABASE_PATH is writable

---

## Quick Commands Reference

```bash
# Railway
railway login && railway init && railway up

# Vercel
vercel login && vercel --prod

# Netlify
netlify login && netlify deploy --prod

# Generate SECRET_KEY
python -c "import secrets; print(secrets.token_hex(32))"

# Local development
python backend/app.py
```

---

**Ready to deploy?** Run `deploy.bat` (Windows) or `./deploy.sh` (Linux/Mac) for interactive menu!
