import type { Metadata } from "next"
import LoginForm from "@/components/login-form"

export const metadata: Metadata = {
  title: "Masuk · VanX Stream",
  description: "Masuk atau daftar ke VanX Stream — galeri streaming anime, drama, film, komik dengan tema Yunani klasik",
}

export default function LoginPage() {
  return <LoginForm />
}
