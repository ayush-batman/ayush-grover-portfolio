import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

// The answer engine's voice: one quiet typed line. Types once when in view.
export default function TypeLine({ text, className, speed = 26 }: { text: string; className?: string; speed?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-4% 0px' })
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (n >= text.length) return
    const t = setTimeout(() => setN((v) => v + 1), speed)
    return () => clearTimeout(t)
  }, [inView, n, text, speed])

  return (
    <span ref={ref} className={className} aria-label={text}>
      {text.slice(0, n)}
      {n < text.length && <span className="type-caret" aria-hidden="true" />}
    </span>
  )
}
