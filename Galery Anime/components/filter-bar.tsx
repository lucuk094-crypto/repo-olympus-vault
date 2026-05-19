"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { ChevronDown } from "lucide-react"

export interface FilterDef {
  key: string
  label: string
  options: { value: string; label: string }[]
  default?: string
}

interface Props {
  filters: FilterDef[]
}

export default function FilterBar({ filters }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const [open, setOpen] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  const onChange = (key: string, value: string) => {
    const newParams = new URLSearchParams(params?.toString() || "")
    if (!value || value === "all") newParams.delete(key)
    else newParams.set(key, value)
    router.push(`${pathname}?${newParams}`)
    setOpen(null)
  }

  const reset = () => {
    router.push(pathname)
  }

  const hasFilter = filters.some((f) => params?.get(f.key))

  return (
    <div className="vx-tabstrip" style={{ paddingTop: "1.25rem" }}>
      {filters.map((f) => {
        const cur = params?.get(f.key) || f.default || "all"
        const curLabel = f.options.find((o) => o.value === cur)?.label || f.label
        return (
          <div key={f.key} style={{ position: "relative" }}>
            <button
              className={`vx-tab ${cur && cur !== "all" ? "active" : ""}`}
              onClick={() => setOpen(open === f.key ? null : f.key)}
            >
              {f.label}: {curLabel} <ChevronDown size={12} style={{ marginLeft: 4 }} />
            </button>
            {open === f.key && (
              <>
                <div
                  onClick={() => setOpen(null)}
                  style={{ position: "fixed", inset: 0, zIndex: 90 }}
                />
                <div style={{
                  position: "absolute", top: "calc(100% + 6px)", left: 0, zIndex: 91,
                  background: "var(--bg-2)", border: "1px solid var(--border-2)",
                  borderRadius: 6, padding: "0.4rem", minWidth: 180,
                  maxHeight: 320, overflowY: "auto",
                  boxShadow: "0 12px 30px rgba(0,0,0,0.4)",
                }}>
                  {f.options.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => onChange(f.key, opt.value)}
                      style={{
                        display: "block", width: "100%",
                        padding: "0.5rem 0.7rem", borderRadius: 4,
                        background: cur === opt.value ? "var(--gold-soft)" : "transparent",
                        color: cur === opt.value ? "var(--gold)" : "var(--text-2)",
                        border: 0, cursor: "pointer", textAlign: "left",
                        fontSize: "0.82rem", fontWeight: 600, fontFamily: "var(--serif)",
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )
      })}
      {hasFilter && (
        <button className="vx-tab" onClick={reset} style={{ borderColor: "#9b1c1c", color: "#ff6b6b" }}>
          Reset
        </button>
      )}
    </div>
  )
}
