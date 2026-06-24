import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { SplatScene } from "./SplatScene";
import { Hotspots } from "./Hotspots";
import { Placer } from "./Placer";
import { FlyNav } from "./FlyNav";
import { IS_TOUCH } from "../isTouch";

export function Experience() {
  // hidden override: /#splat=/your.spz swaps the asset without a rebuild.
  // default resolves against the Vite base so it works at github.io/<repo>/ too.
  const src =
    (typeof window !== "undefined" && window.location.hash.match(/splat=([^&\s]+)/)?.[1]) ||
    import.meta.env.BASE_URL + "shop.spz";

  return (
    <Canvas
      dpr={IS_TOUCH ? [1, 2] : [1, 1.5]}
      camera={{ fov: 65, near: 0.01, far: 1000, position: [0, 0, 3] }}
      gl={{ antialias: false }}
    >
      <color attach="background" args={["#0b0b0e"]} />
      <ambientLight intensity={1} />
      <Suspense fallback={null}>
        <SplatScene src={src} />
        <Hotspots />
      </Suspense>
      <FlyNav />
      <Placer />
    </Canvas>
  );
}
