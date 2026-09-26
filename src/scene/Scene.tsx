import { Suspense, useMemo, useRef, useEffect, type MutableRefObject } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import { EffectComposer, Bloom, DepthOfField, SMAA } from '@react-three/postprocessing'
import * as THREE from 'three'
import Env from './Env'
import { FOCUS_POINTS, FRAMES_PER_NODE } from '../data/focusPoints'

// Scroll-driven camera + abstract centerpiece ("the answer engine"):
// the original shipped a GLB character with a baked camera clip; this adaptation
// keeps the scroll engine (DOM anchors -> frames) but drives the camera
// procedurally through keyframed stations around an abstract object.

const POINTS = FOCUS_POINTS as readonly string[]
const M = POINTS.length
const RESUME_FRAMES = M * FRAMES_PER_NODE
const WORKS_ENTRANCE = 50
const TOTAL_FRAMES = RESUME_FRAMES + 2 * WORKS_ENTRANCE
const FPS = 24
const NODE_LINE = 0.3

const CENTER = new THREE.Vector3(0, 1.3, 0)

// Camera stations: frame -> position + lookAt. Frames: 0 intro, 50*k resume nodes,
// RESUME_FRAMES+WORKS_ENTRANCE works entrance end, TOTAL_FRAMES works end.
const STATIONS: { frame: number; pos: [number, number, number]; look: [number, number, number] }[] = [
  { frame: 0, pos: [0, 2.4, 14.5], look: [0, 1.3, 0] },
  { frame: 50, pos: [6.8, 1.7, 9.2], look: [0, 1.3, 0] },
  { frame: 100, pos: [-7.2, 2.8, 8.2], look: [0, 1.4, 0] },
  { frame: 150, pos: [4.4, 0.5, 8.6], look: [0, 1.2, 0] },
  { frame: 200, pos: [-4.6, 3.6, 7.4], look: [0, 1.4, 0] },
  { frame: 250, pos: [0.4, 1.5, 6.2], look: [0, 1.35, 0] },
  { frame: 300, pos: [0, 2.0, 16.5], look: [0, 1.2, 0] },
  { frame: 350, pos: [9.5, 2.4, 13.5], look: [0, 1.2, 0] },
]

function GradientBackground() {
  const top = '#71906c'
  const bottom = '#e2cfae'
  const steep = 1.4

  const uniforms = useMemo(
    () => ({
      uTop: { value: new THREE.Color() },
      uBottom: { value: new THREE.Color() },
      uSteep: { value: 1 },
    }),
    []
  )
  uniforms.uTop.value.set(top)
  uniforms.uBottom.value.set(bottom)
  uniforms.uSteep.value = steep

  return (
    <mesh scale={100}>
      <sphereGeometry args={[1, 32, 32]} />
      <shaderMaterial
        side={THREE.BackSide}
        depthWrite={false}
        uniforms={uniforms}
        vertexShader={/* glsl */ `
          varying vec3 vDir;
          void main() {
            vDir = normalize(position);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={/* glsl */ `
          uniform vec3 uTop;
          uniform vec3 uBottom;
          uniform float uSteep;
          varying vec3 vDir;
          void main() {
            float t = clamp(vDir.y * uSteep * 0.5 + 0.5, 0.0, 1.0);
            gl_FragColor = vec4(mix(uBottom, uTop, t), 1.0);
          }
        `}
      />
    </mesh>
  )
}

function Lights() {
  return (
    <>
      <Env intensity={0.85} rotationX={0} rotationY={0} rotationZ={0} asBackground={false} bgIntensity={0.4} bgBlur={0} />
      <hemisphereLight args={['#ffffff', '#404040', 1.15]} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={2.35}
        color="#ffd9c6"
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <directionalLight position={[-5, 4, -4]} intensity={2.25} color="#9fc6ff" />
    </>
  )
}

// The centerpiece: an abstract "answer engine" — a faceted core wrapped in
// orbit rings with satellite spheres (queries) and warm dust particles.
function AnswerEngine({ frameRef }: { frameRef: MutableRefObject<number> }) {
  const core = useRef<THREE.Mesh>(null)
  const ring1 = useRef<THREE.Mesh>(null)
  const ring2 = useRef<THREE.Mesh>(null)
  const ring3 = useRef<THREE.Mesh>(null)
  const sats = useRef<(THREE.Mesh | null)[]>([])
  const points = useRef<THREE.Points>(null)

  const SAT_COUNT = 7
  const satSeed = useMemo(
    () =>
      Array.from({ length: SAT_COUNT }, (_, i) => ({
        ring: i % 3,
        phase: (i / SAT_COUNT) * Math.PI * 2,
        speed: 0.25 + ((i * 37) % 10) / 28,
        size: 0.055 + ((i * 13) % 5) * 0.012,
      })),
    []
  )

  const dust = useMemo(() => {
    const n = 320
    const arr = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      const r = 3.2 + Math.random() * 5.5
      const th = Math.random() * Math.PI * 2
      const ph = Math.acos(2 * Math.random() - 1)
      arr[i * 3] = r * Math.sin(ph) * Math.cos(th)
      arr[i * 3 + 1] = r * Math.cos(ph) * 0.6 + 1.3
      arr[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th)
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(arr, 3))
    return g
  }, [])

  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime
    const f = frameRef.current
    // scroll progress 0..1 across the resume timeline drives ring spread + core facets
    const p = THREE.MathUtils.clamp(f / RESUME_FRAMES, 0, 1)
    const spread = 1 + p * 0.35

    if (core.current) {
      core.current.rotation.y += dt * 0.28
      core.current.rotation.x = Math.sin(t * 0.3) * 0.12
      const s = 1 + Math.sin(t * 1.4) * 0.02
      core.current.scale.setScalar(s)
    }
    const rings = [ring1.current, ring2.current, ring3.current]
    const tilts = [0.42, -0.9, 1.85]
    rings.forEach((r, i) => {
      if (!r) return
      r.rotation.z = tilts[i] + Math.sin(t * 0.22 + i) * 0.08 + p * (i - 1) * 0.22
      r.rotation.y = t * (0.05 + i * 0.02)
      r.scale.setScalar(spread + i * 0.02)
    })
    satSeed.forEach((sd, i) => {
      const m = sats.current[i]
      if (!m) return
      const radius = (1.45 + sd.ring * 0.42) * spread
      const a = sd.phase + t * sd.speed
      const tilt = tilts[sd.ring]
      // rotate the flat orbit by the ring's z-tilt
      const x = Math.cos(a) * radius
      const y0 = Math.sin(a) * radius
      const y = y0 * Math.cos(tilt)
      const z = y0 * Math.sin(tilt)
      m.position.set(x, y, z)
    })
    if (points.current) points.current.rotation.y = t * 0.02
  })

  return (
    <group position={[CENTER.x, CENTER.y, CENTER.z]}>
      {/* faceted core */}
      <mesh ref={core} castShadow>
        <icosahedronGeometry args={[0.85, 0]} />
        <meshStandardMaterial
          color="#e8975d"
          metalness={0.55}
          roughness={0.24}
          flatShading
          emissive="#5a2c10"
          emissiveIntensity={0.35}
        />
      </mesh>
      {/* inner glow shell */}
      <mesh scale={1.18}>
        <icosahedronGeometry args={[0.85, 1]} />
        <meshBasicMaterial color="#ffcf9e" transparent opacity={0.06} depthWrite={false} />
      </mesh>
      {/* orbit rings */}
      {[1.45, 1.87, 2.29].map((r, i) => (
        <mesh key={i} ref={[ring1, ring2, ring3][i] as any}>
          <torusGeometry args={[r, 0.016, 12, 128]} />
          <meshStandardMaterial
            color={i === 1 ? '#c98d54' : '#8a9a7d'}
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>
      ))}
      {/* satellites */}
      {satSeed.map((sd, i) => (
        <mesh key={i} ref={(el) => (sats.current[i] = el)} castShadow>
          <sphereGeometry args={[sd.size, 16, 16]} />
          <meshStandardMaterial
            color={i % 3 === 0 ? '#f3e3c3' : '#d9b384'}
            metalness={0.4}
            roughness={0.35}
            emissive="#3d2a14"
            emissiveIntensity={0.25}
          />
        </mesh>
      ))}
      {/* dust */}
      <points ref={points} geometry={dust}>
        <pointsMaterial color="#f0dcae" size={0.035} sizeAttenuation transparent opacity={0.55} depthWrite={false} />
      </points>
    </group>
  )
}

// Scroll engine: DOM anchors -> continuous frame, then a procedural camera rig
// interpolates the stations. Structure mirrors the original Man2 driver.
function Rig({
  focusRef,
  frameRef,
  dofBokehRef,
  dofRangeRef,
}: {
  focusRef: MutableRefObject<THREE.Vector3>
  frameRef: MutableRefObject<number>
  dofBokehRef: MutableRefObject<number>
  dofRangeRef: MutableRefObject<number>
}) {
  const cam = {
    damping: 0.1,
    dwell: 0.35,
    parallax: 4,
    parallaxEase: 0.1,
    mobilePullback: 1.25,
    mobileTimelineShift: 0.12,
  }

  const get = useThree((s) => s.get)

  const mouse = useRef({ x: 0, y: 0 })
  const smouse = useRef({ x: 0, y: 0 })
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  const isMobile = useRef(
    typeof window !== 'undefined' &&
      (window.matchMedia?.('(pointer: coarse)').matches === true || window.innerWidth <= 640)
  )

  const anchorEls = useRef<any>(null)
  const galleryEl = useRef<any>(null)

  const frameSmooth = useRef(0)
  const tmpVec = useRef(new THREE.Vector3())
  const paraEuler = useRef(new THREE.Euler(0, 0, 0, 'YXZ'))
  const paraQuat = useRef(new THREE.Quaternion())
  const posA = useRef(new THREE.Vector3())
  const posB = useRef(new THREE.Vector3())
  const lookA = useRef(new THREE.Vector3())
  const lookB = useRef(new THREE.Vector3())

  useFrame((_, dt) => {
    const a = 1 - Math.pow(cam.damping, dt)

    if (!anchorEls.current) {
      anchorEls.current = POINTS.map((n) => document.querySelector(`[data-point="${n}"]`))
    }
    const els = anchorEls.current
    const d = THREE.MathUtils.clamp(cam.dwell, 0, 0.49)
    const dwell = (t: number) => {
      if (d <= 0) return t
      if (t < d) return 0
      if (t > 1 - d) return 1
      return THREE.MathUtils.smoothstep((t - d) / (1 - 2 * d), 0, 1)
    }
    let sTarget = THREE.MathUtils.clamp(frameSmooth.current / FRAMES_PER_NODE - 1, -1, M - 1)
    if (els && els.length === M && els.every(Boolean)) {
      const refLine = window.scrollY + window.innerHeight * NODE_LINE
      const tops = els.map((el: any) => el.getBoundingClientRect().top + window.scrollY)
      if (refLine <= tops[0]) {
        const heroScroll = Math.max(1, tops[0] - window.innerHeight * NODE_LINE)
        sTarget = -1 + dwell(THREE.MathUtils.clamp(window.scrollY / heroScroll, 0, 1))
      } else if (refLine >= tops[M - 1]) {
        sTarget = M - 1
      } else {
        for (let i = 0; i < M - 1; i++) {
          if (refLine <= tops[i + 1]) {
            const t = (refLine - tops[i]) / Math.max(1, tops[i + 1] - tops[i])
            sTarget = i + dwell(t)
            break
          }
        }
      }
    }

    let frameTarget = THREE.MathUtils.clamp((sTarget + 1) * FRAMES_PER_NODE, 0, RESUME_FRAMES)
    let inWorks = false
    if (!galleryEl.current) galleryEl.current = document.querySelector('.wk-gallery')
    if (galleryEl.current) {
      const ih = window.innerHeight
      const rectTop = galleryEl.current.getBoundingClientRect().top
      if (rectTop < ih) {
        inWorks = true
        const entranceEnd = Math.min(RESUME_FRAMES + WORKS_ENTRANCE, TOTAL_FRAMES)
        if (rectTop > 0) {
          const pA = THREE.MathUtils.clamp(1 - rectTop / ih, 0, 1)
          frameTarget = RESUME_FRAMES + (entranceEnd - RESUME_FRAMES) * pA
        } else {
          const range = Math.max(0, galleryEl.current.offsetHeight - ih)
          const scrolled = THREE.MathUtils.clamp(-rectTop, 0, range)
          const pB = THREE.MathUtils.clamp(scrolled / window.innerWidth, 0, 1)
          frameTarget = entranceEnd + (TOTAL_FRAMES - entranceEnd) * pB
        }
      }
    }

    const smoothOff = THREE.MathUtils.smoothstep(frameTarget, RESUME_FRAMES, RESUME_FRAMES + WORKS_ENTRANCE)
    const aEff = THREE.MathUtils.lerp(a, 1, smoothOff)
    frameSmooth.current += (frameTarget - frameSmooth.current) * aEff
    const frame = frameSmooth.current
    if (frameRef) frameRef.current = frame

    const s = THREE.MathUtils.clamp(frame / FRAMES_PER_NODE - 1, -1, M - 1)

    // Interpolate camera stations at the current frame
    let i0 = 0
    for (let i = 0; i < STATIONS.length - 1; i++) {
      if (frame >= STATIONS[i].frame && frame <= STATIONS[i + 1].frame) {
        i0 = i
        break
      }
      if (frame > STATIONS[i + 1].frame) i0 = i + 1
    }
    const i1 = Math.min(i0 + 1, STATIONS.length - 1)
    const stA = STATIONS[i0]
    const stB = STATIONS[i1]
    const span = Math.max(1, stB.frame - stA.frame)
    const tt = THREE.MathUtils.smoothstep(THREE.MathUtils.clamp((frame - stA.frame) / span, 0, 1), 0, 1)
    posA.current.set(...stA.pos)
    posB.current.set(...stB.pos)
    const camPos = posA.current.lerp(posB.current, tt)
    lookA.current.set(...stA.look)
    lookB.current.set(...stB.look)
    const look = lookA.current.lerp(lookB.current, tt)

    if (focusRef) focusRef.current.copy(look)
    if (dofBokehRef) dofBokehRef.current = -1 // use global frame-blend DoF in Post2
    if (dofRangeRef) dofRangeRef.current = 0.15

    const camera: any = get().camera
    if (camera && camera.isPerspectiveCamera) {
      // mouse parallax: orbit around the focus point, focus stays put
      const me = 1 - Math.pow(cam.parallaxEase, dt)
      smouse.current.x += (mouse.current.x - smouse.current.x) * me
      smouse.current.y += (mouse.current.y - smouse.current.y) * me
      const ax = THREE.MathUtils.degToRad(cam.parallax)
      paraEuler.current.set(-smouse.current.y * ax, -smouse.current.x * ax, 0)
      paraQuat.current.setFromEuler(paraEuler.current)
      tmpVec.current.copy(camPos).sub(look).applyQuaternion(paraQuat.current)
      if (isMobile.current) tmpVec.current.multiplyScalar(cam.mobilePullback)
      tmpVec.current.add(look)
      camera.position.copy(tmpVec.current)
      camera.lookAt(look)
      camera.quaternion.premultiply(paraQuat.current)
      if (isMobile.current && cam.mobileTimelineShift !== 0) {
        const tlWeight = THREE.MathUtils.smoothstep(s, -0.8, 0.3) * (1 - smoothOff)
        if (tlWeight > 0) {
          const dist = camera.position.distanceTo(look)
          camera.translateX(-dist * cam.mobileTimelineShift * tlWeight)
        }
      }
    }
  })

  return null
}

function Post2({
  focusRef,
  frameRef,
  dofBokehRef,
  dofRangeRef,
}: {
  focusRef: MutableRefObject<THREE.Vector3>
  frameRef: MutableRefObject<number>
  dofBokehRef: MutableRefObject<number>
  dofRangeRef: MutableRefObject<number>
}) {
  const post = {
    bloomIntensity: 0.6,
    bloomThreshold: 0.82,
    dof: true,
    startBokeh: 7.4,
    startRange: 2.0,
    focusBokeh: 11.0,
    focusRange: 0.15,
    startBlendFrame: 48,
    endBlendFrame: RESUME_FRAMES - 50,
  }

  const dofRef = useRef<any>(null)
  useFrame(() => {
    const e = dofRef.current
    if (!e) return
    if (e.target && focusRef) e.target.copy(focusRef.current)
    const f = frameRef ? frameRef.current : 0
    const wStart = 1 - THREE.MathUtils.smoothstep(f, 0, post.startBlendFrame)
    const wEnd = THREE.MathUtils.smoothstep(f, post.endBlendFrame, RESUME_FRAMES)
    const w = Math.max(wStart, wEnd)
    e.bokehScale = THREE.MathUtils.lerp(post.focusBokeh, post.startBokeh, w)
    if (e.cocMaterial) e.cocMaterial.focusRange = THREE.MathUtils.lerp(post.focusRange, post.startRange, w)
  })

  return (
    <EffectComposer multisampling={0} stencilBuffer={false} depthBuffer>
      {(post.dof ? (
        <DepthOfField
          ref={dofRef}
          target={[0, 1.3, 0]}
          worldFocusRange={post.focusRange}
          bokehScale={post.focusBokeh}
          height={480}
        />
      ) : null) as any}
      <Bloom
        mipmapBlur
        intensity={post.bloomIntensity}
        luminanceThreshold={post.bloomThreshold}
        luminanceSmoothing={0.3}
      />
      <SMAA />
    </EffectComposer>
  )
}

export default function Scene() {
  const focusRef = useRef(new THREE.Vector3(0, 1.3, 0))
  const frameRef = useRef(0)
  const dofBokehRef = useRef(-1)
  const dofRangeRef = useRef(0.15)
  return (
    <>
      <GradientBackground />
      <Suspense fallback={null}>
        <Lights />
        <AnswerEngine frameRef={frameRef} />
        <ContactShadows position={[0, -1.6, 0]} opacity={0.42} scale={14} blur={2.6} far={4} color="#1a2413" />
      </Suspense>
      <Rig focusRef={focusRef} frameRef={frameRef} dofBokehRef={dofBokehRef} dofRangeRef={dofRangeRef} />
      <Post2 focusRef={focusRef} frameRef={frameRef} dofBokehRef={dofBokehRef} dofRangeRef={dofRangeRef} />
    </>
  )
}
