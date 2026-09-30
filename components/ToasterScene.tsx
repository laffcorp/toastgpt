'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, Float } from '@react-three/drei';
import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

type Crumb = {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  rot: THREE.Euler;
  spin: THREE.Vector3;
};

function PhysicsRig({ popped }: { popped: boolean }) {
  const toaster = useRef<THREE.Group>(null);
  const toastA = useRef<THREE.Mesh>(null);
  const toastB = useRef<THREE.Mesh>(null);
  const crumbs = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const crumbState = useMemo<Crumb[]>(
    () =>
      Array.from({ length: 42 }, () => ({
        pos: new THREE.Vector3((Math.random() - 0.5) * 0.6, 0.2 + Math.random() * 0.2, (Math.random() - 0.5) * 0.3),
        vel: new THREE.Vector3((Math.random() - 0.5) * 0.8, 1.2 + Math.random() * 1.4, (Math.random() - 0.5) * 0.8),
        rot: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, 0),
        spin: new THREE.Vector3(Math.random() * 4, Math.random() * 4, Math.random() * 4)
      })),
    []
  );

  const toastVel = useRef({ a: 0, b: 0 });
  const toastY = useRef({ a: 0.42, b: 0.42 });

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (toaster.current) {
      toaster.current.rotation.y = Math.sin(t * 0.35) * 0.18;
      toaster.current.position.y = Math.sin(t * 1.4) * 0.03;
      toaster.current.rotation.z = popped ? Math.sin(t * 18) * 0.02 : 0;
    }

    const gravity = 6.4;
    if (popped) {
      toastVel.current.a -= gravity * delta;
      toastVel.current.b -= gravity * delta * 0.96;
      toastY.current.a += toastVel.current.a * delta;
      toastY.current.b += toastVel.current.b * delta;
      if (toastY.current.a < 0.42) {
        toastY.current.a = 0.42;
        toastVel.current.a *= -0.28;
      }
      if (toastY.current.b < 0.42) {
        toastY.current.b = 0.42;
        toastVel.current.b *= -0.32;
      }
    } else {
      toastY.current.a = THREE.MathUtils.lerp(toastY.current.a, 0.22, 0.08);
      toastY.current.b = THREE.MathUtils.lerp(toastY.current.b, 0.22, 0.08);
      toastVel.current.a = 3.6;
      toastVel.current.b = 3.9;
    }

    if (toastA.current) {
      toastA.current.position.y = toastY.current.a;
      toastA.current.rotation.z = popped ? Math.sin(t * 6) * 0.12 : 0.02;
    }
    if (toastB.current) {
      toastB.current.position.y = toastY.current.b;
      toastB.current.rotation.z = popped ? Math.sin(t * 5.4 + 1) * -0.14 : -0.02;
    }

    crumbState.forEach((c, i) => {
      if (popped) {
        c.vel.y -= gravity * delta;
        c.pos.addScaledVector(c.vel, delta);
        c.rot.x += c.spin.x * delta;
        c.rot.y += c.spin.y * delta;
        if (c.pos.y < 0.02) {
          c.pos.y = 0.02;
          c.vel.y *= -0.35;
          c.vel.x *= 0.86;
          c.vel.z *= 0.86;
        }
      }
      dummy.position.copy(c.pos);
      dummy.rotation.copy(c.rot);
      dummy.scale.setScalar(popped ? 1 : 0.001);
      dummy.updateMatrix();
      crumbs.current?.setMatrixAt(i, dummy.matrix);
    });
    if (crumbs.current) crumbs.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      <group ref={toaster} position={[0, 0.15, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.7, 0.95, 0.82]} />
          <meshStandardMaterial color="#d7dee6" metalness={1} roughness={0.18} />
        </mesh>
        <mesh position={[0, 0.08, 0.42]}>
          <boxGeometry args={[0.72, 0.38, 0.04]} />
          <meshStandardMaterial color="#04140c" emissive="#7cffb2" emissiveIntensity={0.55} />
        </mesh>
        <mesh position={[-0.28, 0.52, 0]}>
          <boxGeometry args={[0.46, 0.18, 0.52]} />
          <meshStandardMaterial color="#111118" />
        </mesh>
        <mesh position={[0.28, 0.52, 0]}>
          <boxGeometry args={[0.46, 0.18, 0.52]} />
          <meshStandardMaterial color="#111118" />
        </mesh>
        <mesh position={[-0.28, 0.18, 0]}>
          <boxGeometry args={[0.38, 0.42, 0.08]} />
          <meshStandardMaterial color="#ff6a1a" emissive="#ff6a1a" emissiveIntensity={1.8} />
        </mesh>
        <mesh position={[0.28, 0.18, 0]}>
          <boxGeometry args={[0.38, 0.42, 0.08]} />
          <meshStandardMaterial color="#ff6a1a" emissive="#ff6a1a" emissiveIntensity={1.8} />
        </mesh>
        <mesh position={[0.92, 0.12, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.035, 0.035, 0.28, 16]} />
          <meshStandardMaterial color="#9aa3ad" metalness={1} roughness={0.2} />
        </mesh>
        <mesh ref={toastA} position={[-0.28, 0.42, 0]} castShadow>
          <boxGeometry args={[0.4, 0.52, 0.08]} />
          <meshStandardMaterial color={popped ? '#c47a3a' : '#f3d7a3'} roughness={0.8} />
        </mesh>
        <mesh ref={toastB} position={[0.28, 0.42, 0]} castShadow>
          <boxGeometry args={[0.4, 0.52, 0.08]} />
          <meshStandardMaterial color={popped ? '#5a2a12' : '#f0d09a'} roughness={0.8} />
        </mesh>
      </group>
      <instancedMesh ref={crumbs} args={[undefined, undefined, 42]}>
        <boxGeometry args={[0.04, 0.025, 0.03]} />
        <meshStandardMaterial color="#c08948" />
      </instancedMesh>
    </group>
  );
}

export default function ToasterScene({
  popped,
  onToggle
}: {
  popped: boolean;
  onToggle: () => void;
}) {
  const [hover, setHover] = useState(false);
  return (
    <div className="relative h-[520px] w-full overflow-hidden rounded-[28px] border border-white/10 bg-[#07070c] shadow-coil">
      <Canvas camera={{ position: [2.4, 1.6, 3.2], fov: 38 }} shadows>
        <color attach="background" args={['#07070c']} />
        <fog attach="fog" args={['#07070c', 6, 14]} />
        <ambientLight intensity={0.35} />
        <spotLight position={[4, 6, 3]} intensity={80} angle={0.35} penumbra={0.6} color="#ffb089" castShadow />
        <pointLight position={[-2, 1, 2]} intensity={18} color="#7cffb2" />
        <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.2}>
          <PhysicsRig popped={popped} />
        </Float>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
          <planeGeometry args={[18, 18]} />
          <meshStandardMaterial color="#0b0b12" metalness={0.7} roughness={0.35} />
        </mesh>
        <ContactShadows position={[0, 0, 0]} opacity={0.55} scale={8} blur={2.4} />
        <Environment preset="city" />
      </Canvas>
      <div className="pointer-events-none absolute inset-0 scanlines opacity-40" />
      <button
        onClick={onToggle}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="absolute bottom-5 left-5 rounded-full border border-coil/40 bg-black/50 px-4 py-2 font-mono text-xs uppercase tracking-[0.24em] text-coil"
      >
        {hover ? 'INITIATE HANDSHAKE' : popped ? 'LOCK LEVER / COOLING' : 'POP / INTERROGATE'}
      </button>
    </div>
  );
}
