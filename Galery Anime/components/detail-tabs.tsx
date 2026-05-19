"use client"

import { Children, ReactNode, useState, isValidElement } from "react"

interface Props {
  labels: string[]
  initial?: number
  children: ReactNode
}

export default function DetailTabs({ labels, initial = 0, children }: Props) {
  const [active, setActive] = useState(initial)
  const arr = Children.toArray(children).filter(isValidElement)

  return (
    <div className="vx-detail-tabs">
      <div className="vx-detail-tabs-bar">
        <div className="vx-detail-tabs-inner">
          {labels.map((label, i) => (
            <button
              key={label}
              onClick={() => setActive(i)}
              className={"vx-detail-tab" + (i === active ? " is-active" : "")}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="vx-detail-tabs-panel">
        {arr[active] || arr[0]}
      </div>
    </div>
  )
}
