"use client"

import { useState, useEffect, FormEvent } from "react"
import { useRouter } from "next/navigation"
import {
  Mail, Lock, Eye, EyeOff, User as UserIcon, Loader2,
} from "lucide-react"
import BrandLogo from "@/components/brand-logo"

type Tab = "login" | "register"
type Status = { type: "error" | "success"; text: string } | null

export default function LoginForm() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>("login")
  const [status, setStatus] = useState<Status>(null)
  const [loading, setLoading] = useState(false)
  const [showLoginPwd, setShowLoginPwd] = useState(false)
  const [showRegPwd, setShowRegPwd] = useState(false)
  const [existingUser, setExistingUser] = useState<{ name?: string; email?: string; identifier?: string } | null>(null)

  // Form state
  const [loginIdent, setLoginIdent] = useState("")
  const [loginPwd, setLoginPwd] = useState("")
  const [loginRemember, setLoginRemember] = useState(false)

  const [regName, setRegName] = useState("")
  const [regEmail, setRegEmail] = useState("")
  const [regPwd, setRegPwd] = useState("")
  const [regTerms, setRegTerms] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem("vanx_user")
      if (raw) {
        const u = JSON.parse(raw)
        if (u && Date.now() - u.ts < 30 * 24 * 60 * 60 * 1000) {
          setExistingUser(u)
        }
      }
    } catch {}
  }, [])

  function flash(type: "error" | "success", text: string, autoHide = false) {
    setStatus({ type, text })
    if (autoHide) setTimeout(() => setStatus(null), 3500)
  }

  async function handleLogin(e: FormEvent) {
    e.preventDefault()
    setStatus(null)
    if (!loginIdent.trim() || !loginPwd) {
      return flash("error", "Isi email/username dan kata sandi terlebih dahulu.")
    }
    if (loginPwd.length < 8) {
      return flash("error", "Kata sandi minimal 8 karakter.")
    }
    setLoading(true)
    try {
      const r = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: loginIdent.trim(), password: loginPwd, remember: loginRemember }),
      }).catch(() => null)

      if (r && r.ok) {
        flash("success", "Berhasil masuk! Mengarahkan...", false)
        setTimeout(() => router.push("/"), 800)
      } else {
        // Demo mode — local-only
        localStorage.setItem("vanx_user", JSON.stringify({ identifier: loginIdent.trim(), ts: Date.now() }))
        flash("success", "Mode demo: tersimpan di browser. Mengarahkan...", false)
        setTimeout(() => router.push("/"), 1000)
      }
    } catch {
      flash("error", "Gagal masuk. Coba lagi.")
    } finally {
      setLoading(false)
    }
  }

  async function handleRegister(e: FormEvent) {
    e.preventDefault()
    setStatus(null)
    if (!regName.trim() || !regEmail.trim() || !regPwd) {
      return flash("error", "Lengkapi semua field.")
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail.trim())) {
      return flash("error", "Format email tidak valid.")
    }
    if (regPwd.length < 8) {
      return flash("error", "Kata sandi minimal 8 karakter.")
    }
    if (!regTerms) {
      return flash("error", "Setujui syarat & ketentuan untuk melanjutkan.")
    }

    setLoading(true)
    try {
      const r = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: regName.trim(), email: regEmail.trim(), password: regPwd }),
      }).catch(() => null)

      if (r && r.ok) {
        flash("success", "Akun dibuat! Mengarahkan...", false)
        setTimeout(() => router.push("/"), 800)
      } else {
        localStorage.setItem("vanx_user", JSON.stringify({ name: regName.trim(), email: regEmail.trim(), ts: Date.now() }))
        flash("success", "Mode demo: tersimpan di browser. Mengarahkan...", false)
        setTimeout(() => router.push("/"), 1000)
      }
    } catch {
      flash("error", "Gagal mendaftar. Coba lagi.")
    } finally {
      setLoading(false)
    }
  }

  function handleSocial(provider: string) {
    flash("error", `Login ${provider} belum dikonfigurasi. Hubungi developer untuk setup OAuth.`)
  }

  function handleForgot(e: React.MouseEvent) {
    e.preventDefault()
    const email = window.prompt("Masukkan email Anda untuk reset sandi:")
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      flash("success", `Link reset sandi akan dikirim ke ${email} (mode demo).`, true)
    } else if (email) {
      flash("error", "Format email tidak valid.")
    }
  }

  return (
    <div className="vx-login-shell">
      {/* Background particles */}
      <div className="vx-login-particles" aria-hidden="true">
        {Array.from({ length: 14 }).map((_, i) => (
          <span key={i} style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 12}s`,
            animationDuration: `${8 + Math.random() * 8}s`,
            opacity: 0.4 + Math.random() * 0.5,
          }} />
        ))}
      </div>

      {existingUser && (
        <div className="vx-login-banner">
          Sudah login sebagai <strong>{existingUser.name || existingUser.email || existingUser.identifier}</strong>
          {" · "}
          <button onClick={() => router.push("/")}>Lanjut ke beranda</button>
        </div>
      )}

      <main className="vx-auth-card">
        <div className="vx-auth-brand">
          <div className="vx-auth-brand-mark">
            <BrandLogo size={36} />
          </div>
          <h1 className="vx-auth-brand-title">VanX Stream</h1>
          <div className="vx-auth-brand-tag">καλώς ήρθατε</div>
        </div>

        <div className="vx-auth-tabs" role="tablist">
          <button
            type="button"
            className={`vx-auth-tab ${tab === "login" ? "active" : ""}`}
            onClick={() => { setTab("login"); setStatus(null) }}
            role="tab" aria-selected={tab === "login"}
          >Masuk</button>
          <button
            type="button"
            className={`vx-auth-tab ${tab === "register" ? "active" : ""}`}
            onClick={() => { setTab("register"); setStatus(null) }}
            role="tab" aria-selected={tab === "register"}
          >Daftar</button>
        </div>

        {status && (
          <div className={`vx-auth-status ${status.type}`} role="alert">{status.text}</div>
        )}

        {tab === "login" ? (
          <form className="vx-auth-form" onSubmit={handleLogin} autoComplete="on" noValidate>
            <div className="vx-auth-field">
              <label htmlFor="login-email">Email atau Username</label>
              <div className="vx-auth-input">
                <span className="vx-auth-input-icon"><Mail size={16} /></span>
                <input
                  id="login-email" type="text"
                  value={loginIdent} onChange={(e) => setLoginIdent(e.target.value)}
                  placeholder="alwi@vanx.dev" autoComplete="username" required
                />
              </div>
            </div>

            <div className="vx-auth-field">
              <label htmlFor="login-pwd" className="vx-auth-label-row">
                Kata Sandi
                <a href="#" className="vx-auth-forgot" onClick={handleForgot}>Lupa sandi?</a>
              </label>
              <div className="vx-auth-input">
                <span className="vx-auth-input-icon"><Lock size={16} /></span>
                <input
                  id="login-pwd" type={showLoginPwd ? "text" : "password"}
                  value={loginPwd} onChange={(e) => setLoginPwd(e.target.value)}
                  placeholder="Minimal 8 karakter" autoComplete="current-password" required minLength={8}
                />
                <button type="button" className="vx-auth-toggle" onClick={() => setShowLoginPwd((s) => !s)} aria-label={showLoginPwd ? "Sembunyikan sandi" : "Tampilkan sandi"}>
                  {showLoginPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <label className="vx-auth-checkbox">
              <input type="checkbox" checked={loginRemember} onChange={(e) => setLoginRemember(e.target.checked)} />
              Ingat saya selama 30 hari
            </label>

            <button type="submit" className="vx-auth-submit" disabled={loading}>
              {loading ? <><Loader2 size={14} className="vx-spin" /> Memproses...</> : "Masuk ke Akun"}
            </button>
          </form>
        ) : (
          <form className="vx-auth-form" onSubmit={handleRegister} autoComplete="on" noValidate>
            <div className="vx-auth-field">
              <label htmlFor="reg-name">Nama Lengkap</label>
              <div className="vx-auth-input">
                <span className="vx-auth-input-icon"><UserIcon size={16} /></span>
                <input id="reg-name" type="text"
                  value={regName} onChange={(e) => setRegName(e.target.value)}
                  placeholder="Contoh: Alwi Vanx" autoComplete="name" required minLength={2} />
              </div>
            </div>

            <div className="vx-auth-field">
              <label htmlFor="reg-email">Email</label>
              <div className="vx-auth-input">
                <span className="vx-auth-input-icon"><Mail size={16} /></span>
                <input id="reg-email" type="email"
                  value={regEmail} onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="kamu@email.com" autoComplete="email" required />
              </div>
            </div>

            <div className="vx-auth-field">
              <label htmlFor="reg-pwd">Kata Sandi</label>
              <div className="vx-auth-input">
                <span className="vx-auth-input-icon"><Lock size={16} /></span>
                <input id="reg-pwd" type={showRegPwd ? "text" : "password"}
                  value={regPwd} onChange={(e) => setRegPwd(e.target.value)}
                  placeholder="Minimal 8 karakter" autoComplete="new-password" required minLength={8} />
                <button type="button" className="vx-auth-toggle" onClick={() => setShowRegPwd((s) => !s)} aria-label={showRegPwd ? "Sembunyikan sandi" : "Tampilkan sandi"}>
                  {showRegPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <label className="vx-auth-checkbox">
              <input type="checkbox" checked={regTerms} onChange={(e) => setRegTerms(e.target.checked)} required />
              Saya setuju dengan syarat &amp; ketentuan
            </label>

            <button type="submit" className="vx-auth-submit" disabled={loading}>
              {loading ? <><Loader2 size={14} className="vx-spin" /> Memproses...</> : "Buat Akun Baru"}
            </button>
          </form>
        )}

        <div className="vx-auth-divider">atau lanjutkan dengan</div>

        <div className="vx-auth-social">
          <button type="button" onClick={() => handleSocial("Google")}>
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google
          </button>
          <button type="button" onClick={() => handleSocial("GitHub")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55v-1.93c-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.27-1.69-1.27-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.25 3.34.95.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.16 1.18a10.93 10.93 0 0 1 5.75 0c2.2-1.49 3.16-1.18 3.16-1.18.62 1.58.23 2.75.11 3.04.74.81 1.18 1.84 1.18 3.1 0 4.43-2.7 5.41-5.27 5.69.41.36.78 1.06.78 2.13v3.16c0 .31.21.66.79.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
            </svg>
            GitHub
          </button>
        </div>

        <div className="vx-auth-footer-link">
          {tab === "login" ? (
            <>Belum punya akun?<button type="button" onClick={() => setTab("register")}>Daftar gratis</button></>
          ) : (
            <>Sudah punya akun?<button type="button" onClick={() => setTab("login")}>Masuk</button></>
          )}
        </div>

        <div className="vx-auth-laurel" aria-hidden="true">✦ ✦ ✦</div>
      </main>
    </div>
  )
}
