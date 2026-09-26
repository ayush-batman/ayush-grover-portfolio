import { motion } from 'framer-motion'
import { SOCIAL_ICONS } from './SocialIcons'
import { FOCUS_POINTS } from '../data/focusPoints'

const SOCIAL_LINKS = [
  { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/ayushgrover123/' },
  { id: 'x', label: 'X', href: 'https://x.com/ayushgrover20' },
  { id: 'mail', label: 'Email', href: 'mailto:work.ayushg@gmail.com' },
]

interface ResumeGroup {
  heading?: string
  sub?: string
  link?: string
  items?: string[]
  links?: { id: string; label: string; href: string }[]
}
interface ResumeEntry {
  period: string
  place: string
  role?: string
  points?: string[]
  groups?: ResumeGroup[]
}

const ENTRIES: ResumeEntry[] = [
  {
    period: '2021 – 2022',
    place: 'Tata Technologies',
    role: 'Machine Learning Engineer',
    points: [
      'Started as an ML engineer on engineering data',
      'Left to work on things people actually see and read',
    ],
  },
  {
    period: '2022 – 2025',
    place: 'Cre8r',
    role: 'Creative Lead',
    points: [
      'Promoted to creative lead within ~3 months',
      'Copy, campaign strategy, end-to-end production + BD',
      'Creator campaigns totalling 50M+ views',
      'Exchange4Media Gold',
    ],
  },
  {
    period: '2025',
    place: 'Ylytic',
    role: 'Creator Affiliate Consultant · Contract',
    points: ['Product marketing, workflows and campaign strategy'],
  },
  {
    period: '2025 – Now',
    place: 'Dylect · eTrade Marketing',
    role: 'AEO & SEO Growth',
    points: [
      'Organic Google clicks 3.5K → 14.9K (4.2×) in nine months',
      'Organic users 6.1K → 20K, with every paid channel flat',
      'Content systems, Search Console discipline, AI-search receipts',
    ],
  },
  {
    period: '2026 – Now',
    place: 'Independent Practice',
    groups: [
      {
        heading: 'AELO',
        sub: 'AI-search visibility, with receipts',
        link: 'https://aelohq.com',
        items: [
          'Scans AI answer engines and publishes permalink receipts',
          'Evidence, not a vanity score',
        ],
      },
      {
        heading: 'Elsewhere',
        sub: 'find me',
        links: SOCIAL_LINKS,
      },
    ],
  },
]

const POINT_ORDER = FOCUS_POINTS

const EASE = [0.22, 1, 0.36, 1]
const containerV = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.04 } },
}
const itemV = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } },
}

function Group({ group }: { group: ResumeGroup }) {
  const heading = group.link ? (
    <a className="about-link" href={group.link} target="_blank" rel="noopener noreferrer">
      {group.heading}
    </a>
  ) : (
    <span>{group.heading}</span>
  )

  return (
    <motion.div className="tl-group" variants={itemV}>
      <div className="tl-group-head">
        {heading}
        {group.sub && <span className="tl-group-sub">{group.sub}</span>}
      </div>
      {group.items && (
        <ul className="tl-points">
          {group.items.map((it, i) => (
            <li key={i}>{it}</li>
          ))}
        </ul>
      )}
      {group.links && (
        <div className="tl-logos">
          {group.links.map((l) => {
            const Icon = SOCIAL_ICONS[l.id as keyof typeof SOCIAL_ICONS]
            return (
              <a
                key={l.id}
                className="tl-logo"
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={l.label}
                title={l.label}
              >
                <Icon />
              </a>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}

function Entry({ entry, index }: { entry: ResumeEntry; index: number }) {
  return (
    <motion.div
      className="tl-entry"
      data-point={POINT_ORDER[index]}
      variants={containerV}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-12% 0px -12% 0px' }}
    >
      <motion.span className="tl-dot" variants={itemV} aria-hidden="true" />
      <div className="tl-body">
        <motion.div className="tl-period" variants={itemV}>
          {entry.period}
        </motion.div>
        <motion.div className="tl-head" variants={itemV}>
          <h3 className="tl-place">{entry.place}</h3>
        </motion.div>
        {entry.role && (
          <motion.div className="tl-role" variants={itemV}>
            {entry.role}
          </motion.div>
        )}
        {entry.points && (
          <motion.ul className="tl-points" variants={itemV}>
            {entry.points.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </motion.ul>
        )}
        {entry.groups && entry.groups.map((g, i) => <Group key={i} group={g} />)}
      </div>
    </motion.div>
  )
}

export default function Resume() {
  return (
    <section className="resume" lang="en">
      <motion.h2
        className="resume-title"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        Résumé
      </motion.h2>
      <div className="timeline">
        {ENTRIES.map((e, i) => (
          <Entry key={i} entry={e} index={i} />
        ))}
      </div>
    </section>
  )
}
