import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, useTexture } from "@react-three/drei"
import * as THREE from "three"
import { useEffect, useRef, useState } from "react"

function PicnicTable() {
  const texture = useTexture("/textures/gingham_red2.png")
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(10, 10)

  return (
    <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <boxGeometry args={[100, 50, 0.1]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  )
}

function Plate({ position }) {
  return (
    <mesh position={position}>
      <cylinderGeometry args={[1.2, 1.2, 0.1, 32]} />
      <meshStandardMaterial color="#ffffff" roughness={0.8} />
    </mesh>
  )
}

function ChocolateSprinkles({ count = 100 }) {
  const instancedMesh = useRef(undefined)
  const temp = new THREE.Object3D()

  useEffect(() => {
    if (instancedMesh.current) {
      for (let i = 0; i < count; i++) {
        const x = (Math.random() - 0.5) * 1.4
        const z = (Math.random() - 0.5) * 0.9
        const y = 0.38

        temp.position.set(x, y, z)
        temp.rotation.set(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        )
        temp.updateMatrix()

        instancedMesh?.current?.setMatrixAt(i, temp.matrix)
      }
    }
  }, [instancedMesh.current])

  return (
    <instancedMesh ref={instancedMesh} args={[undefined, undefined, count]}>
      <cylinderGeometry args={[0.02, 0.02, 0.1, 8]} />
      <meshStandardMaterial color="white" roughness={0} metalness={0} />
    </instancedMesh>
  )
}

function RainbowCookie({ position }) {
  return (
    <group position={position}>
      {[
        { color: "#ff6666", positionY: 0.2 },
        { color: "#eeee66", positionY: 0 },
        { color: "#66aa66", positionY: -0.2 },
      ].map((layer, index) => (
        <mesh key={index} position={[0, layer.positionY, 0]}>
          <boxGeometry args={[1.5, 0.2, 1]} />
          <meshStandardMaterial color={layer.color} />
        </mesh>
      ))}
      <mesh position={[0, 0.325, 0]}>
        <boxGeometry args={[1.5, 0.05, 1]} />
        <meshStandardMaterial color="#442211" roughness={0.3} metalness={0.2} />
      </mesh>
      <mesh position={[0, -0.325, 0]}>
        <boxGeometry args={[1.5, 0.05, 1]} />
        <meshStandardMaterial color="#442211" roughness={0.3} metalness={0.2} />
      </mesh>
      <mesh position={[0.775, 0, 0]}>
        <boxGeometry args={[0.05, 0.7, 1]} />
        <meshStandardMaterial color="#442211" roughness={0.3} metalness={0.2} />
      </mesh>
      <ChocolateSprinkles count={100} />
    </group>
  )
}

function CameraController({ fov, targetPosition, targetLookAt }) {
  const { camera } = useThree()
  const cameraRef = useRef(new THREE.Vector3(...camera.position))
  const lookAtRef = useRef(new THREE.Vector3(0, 0, 0))

  useEffect(() => {
    camera.fov = fov
    camera.updateProjectionMatrix()
  }, [fov, camera])

  useFrame(() => {
    // Interpolate the camera position
    cameraRef.current.lerp(targetPosition, 0.1)
    camera.position.copy(cameraRef.current)

    // Interpolate the camera's look-at target
    lookAtRef.current.lerp(targetLookAt, 0.1)
    camera.lookAt(lookAtRef.current)
  })

  return null
}

export default function CookieScene() {
  const [fov, setFov] = useState(45)
  const [targetPosition, setTargetPosition] = useState(
    new THREE.Vector3(0, 2, 6)
  )
  const [targetLookAt, setTargetLookAt] = useState(new THREE.Vector3(0, 0, 0))

  const plateData = [
    {
      label: "Left",
      position: new THREE.Vector3(-4, 2, 6),
      lookAt: new THREE.Vector3(-4, 0, 0),
    },
    {
      label: "Center",
      position: new THREE.Vector3(0, 2, 6),
      lookAt: new THREE.Vector3(0, 0, 0),
    },
    {
      label: "Right",
      position: new THREE.Vector3(4, 2, 6),
      lookAt: new THREE.Vector3(4, 0, 0),
    },
  ]

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 100,
        }}
      >
        <input
          type="range"
          min="20"
          max="90"
          value={fov}
          onChange={(e) => setFov(Number(e.target.value))}
        />
        <br />
        {plateData.map((plate, index) => (
          <button
            key={index}
            onClick={() => {
              setTargetPosition(plate.position)
              setTargetLookAt(plate.lookAt)
            }}
            style={{ margin: "5px" }}
          >
            View {plate.label} Plate
          </button>
        ))}
      </div>

      <Canvas camera={{ position: [0, 3, 6], fov }}>
        <CameraController
          fov={fov}
          targetPosition={targetPosition}
          targetLookAt={targetLookAt}
        />
        <ambientLight intensity={1} />
        <pointLight position={[2, 2, 2]} intensity={3} />
        <PicnicTable />
        <OrbitControls />
        {[
          [-4, -0.4, 0],
          [0, -0.4, 0],
          [4, -0.4, 0],
        ].map((pos, i) => (
          <group key={i}>
            <Plate position={pos} />
            <RainbowCookie position={[pos[0], 0.15, pos[2]]} />
          </group>
        ))}
      </Canvas>
    </>
  )
}
