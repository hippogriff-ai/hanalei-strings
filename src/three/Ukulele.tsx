import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";

/**
 * A stylized stand-in ukulele built from primitives.
 * Honest placeholder: in production the buyable hero is a clean glTF scan,
 * deliberately separate from the splat (glossy koa is the splat worst-case).
 */
export function Ukulele({
  tint = "#97572a",
  spin = false,
  scale = 1,
  rotation = [0.05, 0.5, 0],
}: {
  tint?: string;
  spin?: boolean;
  scale?: number;
  rotation?: [number, number, number];
}) {
  const g = useRef<Group>(null);
  useFrame((_, dt) => {
    if (spin && g.current) g.current.rotation.y += dt * 0.6;
  });

  const wood = { roughness: 0.34, metalness: 0.04 };

  return (
    <group ref={g} scale={scale} rotation={rotation}>
      {/* lower bout */}
      <mesh position={[0, -0.18, 0]} scale={[0.46, 0.5, 0.17]}>
        <sphereGeometry args={[1, 32, 24]} />
        <meshStandardMaterial color={tint} {...wood} />
      </mesh>
      {/* upper bout (figure-eight) */}
      <mesh position={[0, 0.34, 0]} scale={[0.34, 0.38, 0.15]}>
        <sphereGeometry args={[1, 32, 24]} />
        <meshStandardMaterial color={tint} {...wood} />
      </mesh>
      {/* soundboard sheen ring */}
      <mesh position={[0, 0.02, 0.16]}>
        <torusGeometry args={[0.13, 0.012, 12, 32]} />
        <meshStandardMaterial color="#1c120a" roughness={0.6} />
      </mesh>
      {/* soundhole */}
      <mesh position={[0, 0.02, 0.165]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.02, 24]} />
        <meshStandardMaterial color="#0a0603" />
      </mesh>
      {/* neck */}
      <mesh position={[0, 0.95, 0.02]}>
        <boxGeometry args={[0.12, 0.95, 0.1]} />
        <meshStandardMaterial color={tint} roughness={0.5} />
      </mesh>
      {/* fretboard */}
      <mesh position={[0, 0.95, 0.075]}>
        <boxGeometry args={[0.11, 0.95, 0.02]} />
        <meshStandardMaterial color="#2a1a0e" roughness={0.6} />
      </mesh>
      {/* headstock */}
      <mesh position={[0, 1.5, -0.02]} rotation={[-0.18, 0, 0]}>
        <boxGeometry args={[0.16, 0.26, 0.07]} />
        <meshStandardMaterial color="#3a2210" roughness={0.5} />
      </mesh>
      {/* tuning pegs */}
      {[-0.05, 0.05].map((x) =>
        [1.42, 1.55].map((y) => (
          <mesh key={`${x}-${y}`} position={[x, y, 0.06]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.12, 8]} />
            <meshStandardMaterial color="#d9d2c4" metalness={0.7} roughness={0.3} />
          </mesh>
        ))
      )}
      {/* bridge */}
      <mesh position={[0, -0.34, 0.16]}>
        <boxGeometry args={[0.18, 0.04, 0.03]} />
        <meshStandardMaterial color="#2a1a0e" />
      </mesh>
    </group>
  );
}
