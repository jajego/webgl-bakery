import { useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function ChocolateSprinkles({ count = 100 }) {
  const instancedMesh = useRef(undefined);
  const temp = new THREE.Object3D();

  useEffect(() => {
    if (instancedMesh.current) {
      for (let i = 0; i < count; i++) {
        const x = (Math.random() - 0.5) * 1.4;
        const z = (Math.random() - 0.5) * 0.9;
        const y = 0.38;
    
        // Random rotation
        temp.position.set(x, y, z);
        temp.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        temp.updateMatrix();
    
        instancedMesh?.current?.setMatrixAt(i, temp.matrix);
      }
    }
  }, [instancedMesh.current])

  return (
    <instancedMesh ref={instancedMesh} args={[undefined, undefined, count]}>
      <cylinderGeometry args={[0.02, 0.02, 0.1, 8]} />
      <meshStandardMaterial color="#553c3f" roughness={0} metalness={0} />
    </instancedMesh>
  );
}

function RainbowCookie() {
  const cookieRef = useRef<HTMLDivElement | undefined>(undefined);

  const layers = [
    { color: "#ff6666", positionY: 0.2 },
    { color: "#eeee66", positionY: 0 },
    { color: "#66aa66", positionY: -0.2 }
  ];

  return (
    <group ref={cookieRef}>
      {/* Cake Layers */}
      {layers.map((layer, index) => (
        <mesh key={index} position={[0, layer.positionY, 0]}>
          <boxGeometry args={[1.5, 0.2, 1]} />
          <meshStandardMaterial color={layer.color} />
        </mesh>
      ))}

      {/* Chocolate Layers (Top & Bottom) */}
      <mesh position={[0, 0.325, 0]}>
        <boxGeometry args={[1.5, 0.05, 1]} />
        <meshStandardMaterial color="#442211" roughness={0.3} metalness={0.2} />
      </mesh>

      <mesh position={[0, -0.325, 0]}>
        <boxGeometry args={[1.5, 0.05, 1]} />
        <meshStandardMaterial color="#442211" roughness={0.3} metalness={0.2} />
      </mesh>


      <mesh position={[0.775, 0, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.05, 0.7, 1]} />
        <meshStandardMaterial color="#442211" roughness={0.3} metalness={0.2} />
      </mesh>

      <ChocolateSprinkles count={100} />
      
    </group>
  );
}

export default function CookieScene() {
  return (
    <Canvas camera={{ position: [0, 1.5, 3] }}>
      <ambientLight intensity={0.95} />
      <pointLight position={[2, 2, 2]} intensity={10} />
      <OrbitControls enableDamping />
      <RainbowCookie />
    </Canvas>
  );
}
