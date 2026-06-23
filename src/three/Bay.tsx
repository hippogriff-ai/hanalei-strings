import { Sky } from "@react-three/drei";

/**
 * Hanalei Bay (stand-in, stylized but accurate to the real geography):
 * bird's-eye turquoise crescent, the 340-ft concrete finger pier with its iconic
 * roofed pavilion at the seaward end, golden beach, and the three green peaks
 * (Nāmolokama / Hīhīmanu / Māmalahoa) behind the town.
 */
export function Bay({ night = false }: { night?: boolean }) {
  return (
    <group>
      {!night && <Sky sunPosition={[6, 7, 10]} turbidity={7} rayleigh={0.9} mieCoefficient={0.02} inclination={0.52} />}
      {night && (
        <group>
          <mesh position={[-7, 9, -10]}>
            <sphereGeometry args={[0.7, 20, 20]} />
            <meshStandardMaterial color="#f4f0e0" emissive="#e8e2c8" emissiveIntensity={1.4} />
          </mesh>
          {[[-12, 11, -12], [9, 12, -14], [4, 10, -10], [-5, 13, -16], [13, 9, -11]].map((p, i) => (
            <mesh key={i} position={p as [number, number, number]}>
              <sphereGeometry args={[0.06, 6, 6]} />
              <meshStandardMaterial color="#fff" emissive="#cfe0ff" emissiveIntensity={1.2} />
            </mesh>
          ))}
        </group>
      )}

      {/* deep ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <planeGeometry args={[220, 220]} />
        <meshStandardMaterial color="#11201a" />
      </mesh>

      {/* the bay — turquoise water seaward */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.0, 60]}>
        <planeGeometry args={[200, 120]} />
        <meshStandardMaterial color="#1fc3b3" roughness={0.1} metalness={0.5} emissive="#0a4a48" emissiveIntensity={0.35} />
      </mesh>
      {/* brighter shallows near shore */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 11]}>
        <planeGeometry args={[120, 8]} />
        <meshStandardMaterial color="#6fd0c4" roughness={0.2} metalness={0.3} transparent opacity={0.85} />
      </mesh>
      {/* foam line */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 7.4]}>
        <planeGeometry args={[120, 1.4]} />
        <meshStandardMaterial color="#eaf6f1" transparent opacity={0.8} />
      </mesh>

      {/* golden crescent beach */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 5.4]}>
        <planeGeometry args={[120, 4]} />
        <meshStandardMaterial color="#e3cd9c" roughness={0.95} />
      </mesh>

      <Pier />

      {/* the three peaks behind town */}
      <Peak position={[0, 5.0, -24]} h={12} r={9} color="#274d2f" />
      <Peak position={[-15, 3.6, -21]} h={8} r={7} color="#2d5436" />
      <Peak position={[14, 4.2, -20]} h={9} r={7.4} color="#22452c" />
      {[-2, 0.4, 2].map((x, i) => (
        <mesh key={i} position={[x, 5.2, -18.6]}>
          <planeGeometry args={[0.18, 6]} />
          <meshStandardMaterial color="#dff2ec" transparent opacity={0.5} />
        </mesh>
      ))}

      {/* palms flanking the beach */}
      {[[-9, 7], [9, 7.6], [-12, 8.5], [11.5, 9]].map(([x, z], i) => (
        <Palm key={i} position={[x, 0, z]} />
      ))}
    </group>
  );
}

function Pier() {
  const deckY = 1.35;
  const segs = [];
  for (let z = 10; z <= 31; z += 3) segs.push(z);
  return (
    <group>
      {/* concrete deck */}
      <mesh position={[0, deckY, 20.5]}>
        <boxGeometry args={[3, 0.22, 23]} />
        <meshStandardMaterial color="#bcbdb4" roughness={0.85} />
      </mesh>
      {/* pilings */}
      {segs.map((z) =>
        [-1.3, 1.3].map((x) => (
          <mesh key={`${z}-${x}`} position={[x, deckY / 2, z]}>
            <cylinderGeometry args={[0.16, 0.16, deckY, 8]} />
            <meshStandardMaterial color="#9a9a92" roughness={0.9} />
          </mesh>
        ))
      )}
      {/* side rails */}
      {[-1.45, 1.45].map((x) => (
        <mesh key={x} position={[x, deckY + 0.55, 20.5]}>
          <boxGeometry args={[0.06, 0.06, 23]} />
          <meshStandardMaterial color="#d8d8d2" />
        </mesh>
      ))}
      {segs.map((z) =>
        [-1.45, 1.45].map((x) => (
          <mesh key={`r${z}-${x}`} position={[x, deckY + 0.3, z]}>
            <boxGeometry args={[0.05, 0.55, 0.05]} />
            <meshStandardMaterial color="#d8d8d2" />
          </mesh>
        ))
      )}

      {/* end pavilion */}
      <group position={[0, 0, 32]}>
        <mesh position={[0, deckY + 0.02, 0]}>
          <boxGeometry args={[3.6, 0.24, 3.6]} />
          <meshStandardMaterial color="#b6b7ae" roughness={0.85} />
        </mesh>
        {[-1.5, 1.5].map((x) =>
          [-1.5, 1.5].map((z) => (
            <mesh key={`${x}-${z}`} position={[x, deckY + 1.4, z]}>
              <cylinderGeometry args={[0.1, 0.1, 2.8, 8]} />
              <meshStandardMaterial color="#7a6a4e" />
            </mesh>
          ))
        )}
        {/* hip roof */}
        <mesh position={[0, deckY + 3.4, 0]} rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[3.1, 1.9, 4]} />
          <meshStandardMaterial color="#586b58" roughness={0.9} flatShading />
        </mesh>
      </group>
    </group>
  );
}

function Peak({ position, h, r, color }: { position: [number, number, number]; h: number; r: number; color: string }) {
  return (
    <mesh position={position}>
      <coneGeometry args={[r, h, 6]} />
      <meshStandardMaterial color={color} roughness={1} flatShading />
    </mesh>
  );
}

function Palm({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.5, 0]} rotation={[0, 0, 0.08]}>
        <cylinderGeometry args={[0.08, 0.14, 3, 6]} />
        <meshStandardMaterial color="#6b5836" />
      </mesh>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh key={i} position={[0, 3, 0]} rotation={[0.5, (i / 6) * Math.PI * 2, 0]}>
          <coneGeometry args={[0.2, 1.7, 4]} />
          <meshStandardMaterial color="#3f6b3a" flatShading />
        </mesh>
      ))}
    </group>
  );
}
