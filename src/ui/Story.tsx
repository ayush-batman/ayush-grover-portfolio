import { motion } from 'framer-motion'
import TypeLine from './TypeLine'
import { FOCUS_POINTS } from '../data/focusPoints'

// One idea per screen. The camera docks on each; the engine whispers the source.
const IDEAS = [
  {
    point: FOCUS_POINTS[0],
    big: '4.2×',
    small: 'organic clicks for Dylect in nine months. Paid stayed flat.',
    source: 'source: dylect.in · search console',
    href: null,
  },
  {
    point: FOCUS_POINTS[1],
    big: '50M+',
    small: 'views across creator campaigns written and run at Cre8r.',
    source: 'source: cre8r.ai · exchange4media gold',
    href: null,
  },
  {
    point: FOCUS_POINTS[2],
    big: 'Now, AELO.',
    small: 'receipts for what AI answers say about your brand.',
    source: 'live: aelohq.com',
    href: 'https://aelohq.com',
  },
]

const EASE = [0.22, 1, 0.36, 1]

export default function Story() {
  return (
    <>
      {IDEAS.map((idea, i) => (
        <section className="idea" key={i} data-point={idea.point}>
          <motion.div
            className="idea-inner"
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-25% 0px -25% 0px' }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <h2 className="idea-big">{idea.big}</h2>
            <p className="idea-small">{idea.small}</p>
            <p className="idea-source">
              {idea.href ? (
                <a href={idea.href} target="_blank" rel="noopener noreferrer">
                  <TypeLine text={idea.source} />
                </a>
              ) : (
                <TypeLine text={idea.source} />
              )}
            </p>
          </motion.div>
        </section>
      ))}
    </>
  )
}
