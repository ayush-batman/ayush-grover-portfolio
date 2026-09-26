import { Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import * as THREE from 'three'
import Scene from './scene/Scene'
import NoiseOverlay from './ui/NoiseOverlay'
import Resume from './ui/Resume'
import Works from './ui/Works'
import LoadingScreen from './ui/LoadingScreen'
import { SOCIAL_ICONS } from './ui/SocialIcons'
import { useStore } from './store'

function Backdrop() {
  const setActive = useStore((s) => s.setActive)
  return (
    <mesh position={[0, 0, -40]} onClick={() => setActive(null)}>
      <planeGeometry args={[600, 300]} />
      <meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>
  )
}

const COPY = {
  title: 'About Ayush',
  paragraphs: [
    "I work on how brands get found in AI search — AEO, SEO and creative strategy, with a technical streak that started in machine learning. I run growth for consumer brands, and I'm building AELO: receipts for what AI answers actually say about you.",
  ],
}

function Hero({ cueOpacity }: { cueOpacity: MotionValue<number> }) {
  const aboutRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: aboutRef,
    offset: ['start 0.6', 'start start'],
  })
  const blur = useTransform(scrollYProgress, [0.14, 0.62], ['blur(0px)', 'blur(16px)'])
  const opacity = useTransform(scrollYProgress, [0.14, 0.62], [1, 0])
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -96])
  const bodyY = useTransform(scrollYProgress, [0, 1], [0, -52])
  const titleSpacing = useTransform(scrollYProgress, [0, 1], ['0.01em', '0.42em'])
  return (
    <section className="hero">
      <motion.div className="about" lang="en" ref={aboutRef} style={{ filter: blur, opacity }}>
        <div className="about-intro">
          <motion.h1 className="about-title" style={{ y: titleY, letterSpacing: titleSpacing }}>
            {COPY.title}
          </motion.h1>
          {COPY.paragraphs.map((p, i) => (
            <motion.p key={i} className="about-body" style={{ y: bodyY }}>
              {p}
            </motion.p>
          ))}
        </div>
      </motion.div>
      <motion.div className="scroll-cue" style={{ opacity: cueOpacity }} aria-hidden="true">
        <span className="scroll-cue-label">SCROLL</span>
        <span className="scroll-cue-track">
          <span className="scroll-cue-dot" />
        </span>
      </motion.div>
    </section>
  )
}

const CONTACT_LINKS = [
  { id: 'mail', label: 'work.ayushg@gmail.com', href: 'mailto:work.ayushg@gmail.com' },
  { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/ayushgrover123/' },
  { id: 'x', label: 'X · @ayushgrover20', href: 'https://x.com/ayushgrover20' },
  { id: 'web', label: 'AELO', href: 'https://aelohq.com' },
]

function Contact() {
  return (
    <section className="contact" lang="en">
      <motion.h2
        className="contact-title"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        Say hello
      </motion.h2>
      <motion.p
        className="contact-sub"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
      >
        AEO engagements, creative strategy, or just a good conversation.
      </motion.p>
      <motion.div
        className="contact-links"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: 0.7, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
      >
        {CONTACT_LINKS.map((l) => {
          const Icon = SOCIAL_ICONS[l.id as keyof typeof SOCIAL_ICONS]
          return (
            <a key={l.id} className="contact-link" href={l.href} target="_blank" rel="noopener noreferrer">
              <Icon />
              <span>{l.label}</span>
            </a>
          )
        })}
      </motion.div>
      <p className="contact-foot">Agra / Gurgaon, India · +91 95573 11538 · Portfolio 2026</p>
    </section>
  )
}

export default function App() {
  const { scrollY } = useScroll()
  const worksRef = useRef(null)
  const { scrollYProgress: worksProgress } = useScroll({
    target: worksRef,
    offset: ['start end', 'start center'],
  })
  const fogBg = useTransform(
    worksProgress,
    [0, 1],
    ['rgba(8, 11, 18, 0)', 'rgba(8, 11, 18, 0.41)']
  )
  const scrimOpacity = useTransform(scrollY, [0, 520], [0, 0.4])
  const cueOpacity = useTransform(scrollY, [0, 160], [1, 0])
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800
  const railOpacity = useTransform(scrollY, [vh * 0.5, vh * 1.1], [0, 1])
  const heroChromeOpacity = useTransform(scrollY, [0, 280], [1, 0])
  const heroGradientOpacity = useTransform(scrollY, [0, 240], [1, 0])

  return (
    <>
      <LoadingScreen />

      <div className="scene-bg">
        <Canvas
          shadows={{ type: THREE.PCFShadowMap }}
          dpr={[1, 1.5]}
          camera={{ position: [0, 5, 19], fov: 39, near: 0.1, far: 500 }}
          gl={{ antialias: false, stencil: false, depth: true, toneMapping: THREE.ACESFilmicToneMapping }}
        >
          <color attach="background" args={['#0a0e16']} />
          <Suspense fallback={null}>
            <Backdrop />
            <Scene />
          </Suspense>
        </Canvas>
      </div>

      <motion.div className="scrim" style={{ opacity: scrimOpacity }} aria-hidden="true" />
      <motion.div className="stage-fog" style={{ background: fogBg }} aria-hidden="true" />
      <motion.div className="hero-gradient" style={{ opacity: heroGradientOpacity }} aria-hidden="true" />
      <motion.div className="glass-rail" style={{ opacity: railOpacity }} aria-hidden="true" />

      <motion.div className="hero-chrome" style={{ opacity: heroChromeOpacity }} aria-hidden="true">
        <div className="hero-frame" />
        <span className="hero-mark tl">+</span>
        <span className="hero-mark tr">+</span>
        <span className="hero-mark bl">+</span>
        <span className="hero-mark br">+</span>
        <div className="hero-meta hm-tl">
          <span className="hm-name">Ayush Grover</span>
          <span>AEO · Creative Strategy</span>
        </div>
        <div className="hero-meta hm-tr">Portfolio — 2026</div>
        <div className="hero-meta hm-bl">Search · Strategy · Craft</div>
        <div className="hero-meta hm-right">Agra / Gurgaon, India</div>
      </motion.div>

      <NoiseOverlay />

      <main className="content">
        <Hero cueOpacity={cueOpacity} />
        <Resume />
        <Works innerRef={worksRef} />
        <Contact />
      </main>
    </>
  )
}
