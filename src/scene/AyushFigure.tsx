import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group, MathUtils } from 'three'

/**
 * Stylized low-poly bust of Ayush.
 * Faceted clay statue with editorial styling: swept-back hair, olive bomber
 * jacket, cream tee, brass chain. Head follows the mouse gently and breathes
 * at idle.
 */
export function AyushFigure() {
  const head = useRef<Group>(null)
  const chest = useRef<Group>(null)
  const root = useRef<Group>(null)

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    const px = state.pointer.x
    const py = state.pointer.y
    if (head.current) {
      head.current.rotation.y = MathUtils.lerp(head.current.rotation.y, px * 0.45, 0.05)
      head.current.rotation.x = MathUtils.lerp(head.current.rotation.x, -py * 0.22, 0.05)
      head.current.rotation.z = Math.sin(t * 0.4) * 0.02
      head.current.position.y = 1.66 + Math.sin(t * 1.1) * 0.012
    }
    if (chest.current) {
      const b = 1 + Math.sin(t * 1.1) * 0.011
      chest.current.scale.set(1, b, 1)
    }
    if (root.current) {
      root.current.rotation.y = MathUtils.lerp(root.current.rotation.y, px * 0.14, 0.03)
    }
  })

  const skin = '#e0aa85'
  const skinDeep = '#c58a60'
  const hair = '#33261c'
  const jacket = '#5c6b4a'
  const jacketDark = '#49573a'
  const tee = '#cfc3ac'
  const brass = '#c9a35a'

  return (
    <group ref={root} scale={0.92} position={[0, 0.3, 0]}>
      {/* ---- neck + chest ---- */}
      <group ref={chest}>
        {/* neck */}
        <mesh position={[0, 1.28, 0]}>
          <cylinderGeometry args={[0.15, 0.19, 0.32, 8]} />
          <meshStandardMaterial color={skin} flatShading />
        </mesh>
        {/* cream tee base */}
        <mesh position={[0, 0.62, 0.02]}>
          <cylinderGeometry args={[0.46, 0.52, 1.02, 12]} />
          <meshStandardMaterial color={tee} flatShading />
        </mesh>
        {/* jacket - open silhouette: back shell */}
        <mesh position={[0, 0.62, -0.06]}>
          <cylinderGeometry args={[0.62, 0.72, 1.06, 12, 1, true, 0.62, Math.PI * 2 - 1.24]} />
          <meshStandardMaterial color={jacket} flatShading />
        </mesh>
        {/* jacket left panel */}
        <mesh position={[-0.32, 0.62, 0.24]} rotation={[0, 0.42, 0]}>
          <boxGeometry args={[0.34, 1.04, 0.3]} />
          <meshStandardMaterial color={jacket} flatShading />
        </mesh>
        {/* jacket right panel */}
        <mesh position={[0.32, 0.62, 0.24]} rotation={[0, -0.42, 0]}>
          <boxGeometry args={[0.34, 1.04, 0.3]} />
          <meshStandardMaterial color={jacket} flatShading />
        </mesh>
        {/* shoulders */}
        <mesh position={[-0.56, 0.88, -0.02]} scale={[0.92, 0.62, 0.95]}>
          <sphereGeometry args={[0.28, 8, 6]} />
          <meshStandardMaterial color={jacket} flatShading />
        </mesh>
        <mesh position={[0.56, 0.88, -0.02]} scale={[0.92, 0.62, 0.95]}>
          <sphereGeometry args={[0.28, 8, 6]} />
          <meshStandardMaterial color={jacket} flatShading />
        </mesh>
        {/* collar */}
        <mesh position={[0, 1.12, -0.02]}>
          <cylinderGeometry args={[0.24, 0.3, 0.14, 12]} />
          <meshStandardMaterial color={jacketDark} flatShading />
        </mesh>
        {/* brass chain */}
        <mesh position={[0, 1.02, 0.17]} rotation={[Math.PI / 2.35, 0, 0]}>
          <torusGeometry args={[0.21, 0.016, 6, 24, Math.PI * 1.15]} />
          <meshStandardMaterial color={brass} metalness={0.9} roughness={0.25} flatShading />
        </mesh>
      </group>

      {/* ---- head ---- */}
      <group ref={head} position={[0, 1.66, 0]} scale={1.12}>
        {/* cranium */}
        <mesh position={[0, 0.3, 0]} scale={[0.86, 1, 0.92]}>
          <sphereGeometry args={[0.34, 9, 8]} />
          <meshStandardMaterial color={skin} flatShading />
        </mesh>
        {/* jaw / lower face */}
        <mesh position={[0, -0.02, 0.03]} scale={[0.74, 0.9, 0.8]}>
          <sphereGeometry args={[0.3, 9, 8]} />
          <meshStandardMaterial color={skin} flatShading />
        </mesh>
        {/* chin hint */}
        <mesh position={[0, -0.22, 0.14]} scale={[0.55, 0.45, 0.6]}>
          <sphereGeometry args={[0.16, 7, 6]} />
          <meshStandardMaterial color={skinDeep} flatShading />
        </mesh>
        {/* nose */}
        <mesh position={[0, 0.06, 0.33]} rotation={[0.18, 0, 0]}>
          <coneGeometry args={[0.055, 0.17, 4]} />
          <meshStandardMaterial color={skinDeep} flatShading />
        </mesh>
        {/* brow ridge */}
        <mesh position={[0, 0.21, 0.27]} rotation={[0.12, 0, 0]}>
          <boxGeometry args={[0.36, 0.055, 0.09]} />
          <meshStandardMaterial color={skinDeep} flatShading />
        </mesh>
        {/* ears */}
        <mesh position={[-0.31, 0.1, 0]} rotation={[0, 0, 0.12]}>
          <boxGeometry args={[0.09, 0.2, 0.13]} />
          <meshStandardMaterial color={skin} flatShading />
        </mesh>
        <mesh position={[0.31, 0.1, 0]} rotation={[0, 0, -0.12]}>
          <boxGeometry args={[0.09, 0.2, 0.13]} />
          <meshStandardMaterial color={skin} flatShading />
        </mesh>
        {/* swept-back hair: crown */}
        <mesh position={[0, 0.46, -0.03]} scale={[0.95, 0.72, 1]} rotation={[0.16, 0, 0]}>
          <sphereGeometry args={[0.36, 9, 8]} />
          <meshStandardMaterial color={hair} flatShading />
        </mesh>
        {/* swept-back tail at nape */}
        <mesh position={[0, 0.2, -0.3]} rotation={[0.5, 0, 0]} scale={[0.8, 0.5, 1]}>
          <sphereGeometry args={[0.2, 7, 6]} />
          <meshStandardMaterial color={hair} flatShading />
        </mesh>
        {/* fringe swept left */}
        <mesh position={[-0.1, 0.4, 0.26]} rotation={[0.15, 0.25, 0.12]}>
          <boxGeometry args={[0.3, 0.14, 0.16]} />
          <meshStandardMaterial color={hair} flatShading />
        </mesh>
        {/* fringe piece right */}
        <mesh position={[0.16, 0.38, 0.25]} rotation={[0.18, -0.3, -0.06]}>
          <boxGeometry args={[0.2, 0.12, 0.14]} />
          <meshStandardMaterial color={hair} flatShading />
        </mesh>
        {/* sideburns */}
        <mesh position={[-0.28, 0.22, 0.08]}>
          <boxGeometry args={[0.09, 0.24, 0.2]} />
          <meshStandardMaterial color={hair} flatShading />
        </mesh>
        <mesh position={[0.28, 0.22, 0.08]}>
          <boxGeometry args={[0.09, 0.24, 0.2]} />
          <meshStandardMaterial color={hair} flatShading />
        </mesh>
      </group>
    </group>
  )
}

export default AyushFigure
