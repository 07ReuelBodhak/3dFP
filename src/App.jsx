import { OrbitControls, Stars, useHelper } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useState } from "react";
import { DirectionalLightHelper, Vector3 } from "three";
import * as THREE from "three";

const Sphere = () => {
  const [dragged, setIsDragged] = useState(false);
  const ref = useRef();
  useFrame((state, delta) => {
    dragged
      ? (ref.current.position.x = Math.sin(state.clock.elapsedTime) * 8)
      : ref.current.position.set(0, 0, 0);
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[10, 32, 32]} />
      <meshStandardMaterial color={"#ffcc00"} />
      <OrbitControls
        onPointerMove={(e) => {
          e.stopPropagation();
          setIsDragged(true);
          console.log("hii");
        }}
        onPointerLeave={(e) => {
          e.stopPropagation();
          console.log("bye");
          setIsDragged(false);
        }}
        enableZoom={true}
      />
    </mesh>
  );
};

const particlesGeometry = new THREE.BufferGeometry();
const particlesCnt = 90000;

const posArray = new Float32Array(particlesCnt * 3);

for (let i = 0; i < particlesCnt * 3; i += 3) {
  const u = Math.random();
  const v = Math.random();

  const theta = u * Math.PI * 2;
  const phi = v * Math.PI * 2;

  const radius = 15 + Math.random() * 344;
  const x = radius * Math.cos(phi) * Math.sin(theta);
  const y = radius * Math.sin(phi) * Math.sin(theta);
  const z = radius * Math.cos(theta);

  posArray[i] = x;
  posArray[i + 1] = y;
  posArray[i + 2] = z;
}

particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(posArray, 3)
);

const material = new THREE.PointsMaterial({
  size: 0.01,
  color: "#ff9900",
});

const particlesMesh = new THREE.Points(particlesGeometry, material);

const Particle = () => {
  const ref = useRef();
  useFrame((state, delta) => {
    ref.current.rotation.y += delta * 0.2;
  });
  return (
    <mesh position={[0, 0, 0]} ref={ref}>
      <primitive object={particlesMesh} />
    </mesh>
  );
};

const Scene = () => {
  const pointLightHelper = useRef();
  useHelper(pointLightHelper, THREE.PointLightHelper);

  return (
    <>
      <directionalLight position={[1, 0, 100]} intensity={1.8} />
      <Sphere />
      <Particle />
    </>
  );
};

function App() {
  return (
    <Canvas
      camera={{ position: [10, 50, 4] }}
      style={{ width: "100vw", height: "100vh" }}
    >
      <Scene />
    </Canvas>
  );
}

export default App;
