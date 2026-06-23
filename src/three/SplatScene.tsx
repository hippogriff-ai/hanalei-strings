import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { Box3 } from "three";
import { SparkRenderer, SplatMesh } from "@sparkjsdev/spark";
import { CATALOG } from "../catalog";
import { useStore } from "../store";

/**
 * Full-quality Marble (World Labs) splat, rendered with World Labs' own Spark.
 * Native .spz, all 2.4M gaussians, no downsampling. Spark is a THREE.Object3D, so
 * it lives in the same R3F scene as the drei <Html> hotspots and FlyNav controls.
 */
export function SplatScene({ src }: { src: string }) {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);

  const meshRef = useRef<any>(null);
  const cameraRef = useRef(camera);
  cameraRef.current = camera;

  const flip = useStore((s) => s.splatFlip);
  const yaw = useStore((s) => s.splatYaw);

  useEffect(() => {
    const spark = new SparkRenderer({ renderer: gl as any });
    scene.add(spark);

    const { splatFlip, splatYaw } = useStore.getState();
    const mesh: any = new SplatMesh({ url: src });
    mesh.rotation.set(splatFlip ? Math.PI : 0, (splatYaw * Math.PI) / 2, 0);
    meshRef.current = mesh;
    scene.add(mesh);

    let framed = false;
    const tryFrame = () => {
      if (framed) return;
      const box = new Box3().setFromObject(mesh);
      if (box.isEmpty() || !isFinite(box.min.x) || !isFinite(box.max.x)) return;
      framed = true;
      const cam = cameraRef.current as any;
      // stand INSIDE the room at eye level, looking horizontally across it
      const cx = (box.min.x + box.max.x) / 2;
      const cz = (box.min.z + box.max.z) / 2;
      // bias the eye height UP — Marble scans have floaters below the floor that
      // drag the bounding box down, so mid-box lands on the carpet.
      const eyeY = box.min.y + (box.max.y - box.min.y) * 0.72;
      const span = Math.max(box.max.x - box.min.x, box.max.z - box.min.z) || 4;
      cam.position.set(cx, eyeY, cz + span * 0.32);
      cam.lookAt(cx, eyeY, cz); // level / horizontal
      useStore.getState().setSplatSpan(span);

      // seed hotspots in a ring at eye level so they're visible before fine-tuning
      const st = useStore.getState();
      if (Object.keys(st.hotspotPos).length === 0) {
        CATALOG.forEach((p, i) => {
          const a = (i / CATALOG.length) * Math.PI * 2;
          st.setHotspotPos(p.id, [cx + Math.cos(a) * span * 0.28, eyeY, cz + Math.sin(a) * span * 0.28]);
        });
      }
    };
    const onInit = mesh.initialized;
    if (onInit && typeof onInit.then === "function") onInit.then(tryFrame).catch(() => {});
    const id = setInterval(tryFrame, 300);
    const stop = setTimeout(() => clearInterval(id), 9000);

    return () => {
      clearInterval(id);
      clearTimeout(stop);
      scene.remove(mesh);
      scene.remove(spark);
      mesh.dispose?.();
      spark.dispose?.();
    };
  }, [gl, scene, src]);

  // live orientation fixes from the edit panel
  useEffect(() => {
    if (meshRef.current) meshRef.current.rotation.set(flip ? Math.PI : 0, (yaw * Math.PI) / 2, 0);
  }, [flip, yaw]);

  return null;
}
