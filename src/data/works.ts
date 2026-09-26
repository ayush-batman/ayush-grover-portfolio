// Portfolio data: 4 sections -> click an item for a full-screen detail.
// Pure data-driven: add/remove sections or items here only.

export interface WorkListItem {
  name: string
  meta?: string
  tags?: string[]
  link?: string
  slug?: string
}

export interface WorkGroup {
  heading: string
  items: string[]
}

export interface WorkSection {
  id: string
  no: string
  title: string
  tagline: string
  items?: WorkListItem[]
  groups?: WorkGroup[]
  awards?: string[]
  footer?: string
}

export interface WorksLang {
  title: string
  closeLabel: string
  openLabel: string
  hint: string
  awardsLabel: string
  visitLabel: string
  detailPlaceholder: string
  phImageLabel: string
  phButtonLabel: string
  countLabel: (n: number) => string
  sections: WorkSection[]
}

export const WORKS: WorksLang = {
  title: 'Works',
  closeLabel: 'Back',
  openLabel: 'Explore',
  hint: 'Keep scrolling',
  awardsLabel: 'Awards',
  visitLabel: 'Visit',
  detailPlaceholder: 'More on this soon.',
  phImageLabel: 'Image / Video',
  phButtonLabel: 'Link',
  countLabel: (n) => `${n} works`,
  sections: [
    {
      id: 'aeo',
      no: '01',
      title: 'AEO & AI Search',
      tagline: 'How brands get found in AI answers',
      items: [
        { name: 'Dylect — 4.2× organic in 9 months', meta: 'AEO / SEO', slug: 'dylect-aeo' },
        { name: 'AELO', meta: 'AI-search visibility SaaS', link: 'https://aelohq.com', slug: 'aelo' },
        { name: 'AI-visibility checker', meta: 'Top-of-funnel concept', slug: 'ai-checker' },
      ],
      awards: ['Exchange4Media Gold'],
    },
    {
      id: 'campaigns',
      no: '02',
      title: 'Campaigns & Content',
      tagline: '50M+ views across creator work',
      items: [
        { name: 'Creator campaigns at Cre8r', meta: '50M+ views', slug: 'cre8r-campaigns' },
        { name: 'Founder ghostwriting', meta: 'LinkedIn', slug: 'ghostwriting' },
        { name: 'Waffle — D2C launch content', meta: 'Early client', slug: 'waffle' },
      ],
      footer: 'Strategy · Copy · Production · BD',
    },
    {
      id: 'products',
      no: '03',
      title: 'Products',
      tagline: 'Things I build and ship',
      items: [
        { name: 'AELO', meta: 'aelohq.com', link: 'https://aelohq.com', slug: 'aelo' },
        { name: 'Bloomscroll', meta: 'Micro social network', slug: 'bloomscroll' },
        { name: 'Drift', meta: 'mymind-style canvas', slug: 'drift' },
      ],
    },
    {
      id: 'writing',
      no: '04',
      title: 'Writing & Strategy',
      tagline: 'Case studies and essays',
      items: [
        {
          name: 'Portfolio — case studies',
          meta: 'Notion',
          link: 'https://tree-cobalt-023.notion.site',
          slug: 'portfolio',
        },
        {
          name: 'LinkedIn',
          meta: '@ayushgrover123',
          link: 'https://www.linkedin.com/in/ayushgrover123/',
          slug: 'linkedin',
        },
      ],
    },
  ],
}

// Section covers (full-height image on the left of each gallery card).
// Missing images fall back to a large-number gradient placeholder.
export const SECTION_COVERS: Record<string, string> = {
  aeo: `${import.meta.env.BASE_URL}works/covers/aeo.png`,
  campaigns: `${import.meta.env.BASE_URL}works/covers/campaigns.png`,
  products: `${import.meta.env.BASE_URL}works/covers/products.png`,
  writing: `${import.meta.env.BASE_URL}works/covers/writing.png`,
}

export function sectionCount(section: WorkSection): number {
  if (section.items) return section.items.length
  if (section.groups) return section.groups.reduce((n, g) => n + g.items.length, 0)
  return 0
}
