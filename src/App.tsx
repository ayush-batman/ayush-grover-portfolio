import { Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import * as THREE from 'three'
import Scene from './scene/Scene'
import NoiseOverlay from './ui/NoiseOverlay'
import Story from './ui/Story'
import Proof from './ui/Proof'
import TypeLine from './ui/TypeLine'
import LoadingScreen from './ui/LoadingScreen'
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

// One screen: the character alive, one line, the engine quietly working.
function Hero({ cueOpacity }: { cueOpacity: MotionValue<number> }) {
  return (
    <section className="hero hero-v2">
      <div className="about">
        <div className="about-intro">
          <p className="hero-kicker">Ayush Grover</p>
          <div className="hero-title-wrap">
            <h1 className="about-title">I make brands findable in the age of AI&nbsp;answers.</h1>
          </div>
          <p className="hero-query">
            <TypeLine text="› who is ayush grover?" speed={55} />
          </p>
        </div>
      </div>
      <motion.div className="scroll-cue" style={{ opacity: cueOpacity }} aria-hidden="true">
        <span className="scroll-cue-track">
          <span className="scroll-cue-dot" />
        </span>
      </motion.div>
    </section>
  )
}

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
      <motion.div
        className="contact-links"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <a className="contact-link" href="mailto:work.ayushg@gmail.com">
          work.ayushg@gmail.com
        </a>
        <a className="contact-link" href="tel:+919557311538">
          +91 95573 11538
        </a>
      </motion.div>
      <p className="contact-foot">Agra / Gurgaon, India</p>
    </section>
  )
}

export default function App() {
  const { scrollY } = useScroll()
  const scrimOpacity = useTransform(scrollY, [0, 520], [0, 0.32])
  const cueOpacity = useTransform(scrollY, [0, 160], [1, 0])
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
      <motion.div className="hero-gradient" style={{ opacity: heroGradientOpacity }} aria-hidden="true" />
      <NoiseOverlay />

      <main className="content">
        <Hero cueOpacity={cueOpacity} />
        <Story />
        <Proof />
        <Contact />
      </main>
    </>
  )
}
