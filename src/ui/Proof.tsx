import { motion } from 'framer-motion'
import TypeLine from './TypeLine'

// Proof, quietly: four lines, one link each.
const LINKS = [
  { name: 'AELO — AI-search visibility', href: 'https://aelohq.com' },
  { name: 'Case studies', href: 'https://tree-cobalt-023.notion.site' },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/ayushgrover123/' },
  { name: 'X — @ayushgrover20', href: 'https://x.com/ayushgrover20' },
]

export default function Proof() {
  return (
    <section className="proof js-story-end">
      <motion.h2
        className="proof-title"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-15% 0px' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        Elsewhere
      </motion.h2>
      <ul className="proof-list">
        {LINKS.map((l, i) => (
          <motion.li
            key={l.name}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 0.6, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
          >
            <a href={l.href} target="_blank" rel="noopener noreferrer">
              {l.name} <span aria-hidden="true">↗</span>
            </a>
          </motion.li>
        ))}
      </ul>
      <p className="proof-typed">
        <TypeLine text="answer verified. sources linked." speed={34} />
      </p>
    </section>
  )
}
