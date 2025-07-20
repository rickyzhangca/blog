'use client';

import {
  CameraControls,
  GizmoHelper,
  GizmoViewport,
  Stats,
} from '@react-three/drei';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { useAtom } from 'jotai';
import { Suspense, useMemo, useRef } from 'react';
import type { Mesh } from 'three';
import { DoubleSide, ShaderMaterial, TextureLoader, Vector3 } from 'three';
import { cn } from '@/lib/utils';
import { isDevModeAtom } from '../atoms';
import shadowPng from './shadow.png';
import texturePng from './texture.png';

const PointerSphere = ({
  displacementRef,
}: {
  displacementRef: React.MutableRefObject<Vector3>;
}) => {
  const sphereRef = useRef<Mesh | null>(null);

  useFrame(() => {
    const sphere = sphereRef.current;
    if (sphere) {
      sphere.position.copy(displacementRef.current);
    }
  });

  return (
    <mesh ref={sphereRef}>
      <sphereGeometry args={[0.25, 32, 16]} />
      <meshBasicMaterial depthWrite={false} opacity={0} transparent />
    </mesh>
  );
};

type HitPlaneProps = {
  onPoint: (p: Vector3) => void;
};
const HitPlane = ({ onPoint }: HitPlaneProps) => {
  const planeRef = useRef<Mesh | null>(null);

  return (
    <mesh onPointerMove={(e) => onPoint(e.point)} ref={planeRef}>
      <planeGeometry args={[500, 500, 1, 1]} />
      <meshBasicMaterial depthWrite={false} opacity={0} transparent />
    </mesh>
  );
};

interface RipplePlaneProps {
  textureUrl: string;
  displacementRef: React.MutableRefObject<Vector3>;
  isShadow?: boolean;
}

const RipplePlane = ({
  textureUrl,
  displacementRef,
  isShadow = false,
}: RipplePlaneProps) => {
  const tex = useLoader(TextureLoader, textureUrl);

  const material = useMemo(() => {
    const uniforms: Record<string, { value: unknown }> = {
      uTexture: { value: tex },
      uDisplacement: { value: new Vector3() },
    };

    const vertex = isShadow
      ? `
        varying vec2 vUv;
        varying float dist;
        uniform vec3 uDisplacement;

        void main() {
          vUv = uv;
          vec4 localPosition = vec4(position, 1.0);
          vec4 worldPosition = modelMatrix * localPosition;
          dist = length(uDisplacement - worldPosition.rgb);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `
      : `
        varying vec2 vUv;
        uniform vec3 uDisplacement;

        float easeInOutCubic(float x) {
          return x < 0.5 ? 4.0 * x * x * x : 1.0 - pow(-2.0 * x + 2.0, 3.0) / 2.0;
        }

        float map(float value, float min1, float max1, float min2, float max2) {
          return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
        }

        void main() {
          vUv = uv;
          vec3 new_position = position;
          vec4 localPosition = vec4(position, 1.0);
          vec4 worldPosition = modelMatrix * localPosition;
          float dist = length(uDisplacement - worldPosition.rgb);
          float min_distance = 3.0;
          if (dist < min_distance) {
            float distance_mapped = map(dist, 0.0, min_distance, 1.0, 0.0);
            float val = easeInOutCubic(distance_mapped) * 1.0;
            new_position.z += val;
          }
          gl_Position = projectionMatrix * modelViewMatrix * vec4(new_position, 1.0);
        }
      `;

    const fragment = isShadow
      ? `
        varying vec2 vUv;
        varying float dist;
        uniform sampler2D uTexture;

        float map(float value, float min1, float max1, float min2, float max2) {
          return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
        }

        void main() {
          vec4 color = texture2D(uTexture, vUv);
          float min_distance = 3.0;
          if (dist < min_distance) {
            float alpha = map(dist, min_distance, 0.0, color.a, 0.0);
            color.a = alpha;
          }
          gl_FragColor = color;
        }
      `
      : `
        varying vec2 vUv;
        uniform sampler2D uTexture;
        void main() {
          vec4 color = texture2D(uTexture, vUv);
          gl_FragColor = color;
        }
      `;

    const mat = new ShaderMaterial({
      uniforms,
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      depthWrite: false,
      side: DoubleSide,
    }) as ShaderMaterial & { uniforms: { uDisplacement: { value: Vector3 } } };

    return mat;
  }, [tex, isShadow]);

  useFrame(() => {
    material.uniforms.uDisplacement.value.copy(displacementRef.current);
  });

  return (
    <mesh rotation-z={Math.PI / 5}>
      <planeGeometry args={[15, 15, 100, 100]} />
      <primitive attach="material" object={material} />
    </mesh>
  );
};

export default function SceneR3f() {
  const [isDevMode] = useAtom(isDevModeAtom);
  const displacementRef = useRef<Vector3>(new Vector3(10, 10, 0));
  const cameraControlsRef = useRef<CameraControls>(null);
  const lastChangeRef = useRef(0);
  const perfContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative">
      {isDevMode && (
        <button
          className={cn(
            'absolute bottom-4 left-4 z-10 cursor-pointer rounded-full bg-black/3 px-4 py-2 font-medium text-foreground/70 text-sm transition hover:bg-black/5'
          )}
          onClick={() => {
            cameraControlsRef.current?.setLookAt(0, -8, 6, 0, 0, 0, true);
          }}
          type="button"
        >
          Reset
        </button>
      )}

      {isDevMode && (
        <div
          className="pointer-events-none absolute top-2 left-2 flex gap-1"
          ref={perfContainerRef}
        >
          <Stats
            className="!relative"
            parent={perfContainerRef as unknown as React.RefObject<HTMLElement>}
            showPanel={0}
          />
          <Stats
            className="!relative"
            parent={perfContainerRef as unknown as React.RefObject<HTMLElement>}
            showPanel={1}
          />
          <Stats
            className="!relative"
            parent={perfContainerRef as unknown as React.RefObject<HTMLElement>}
            showPanel={2}
          />
        </div>
      )}

      <Canvas
        camera={{ position: [0, -8, 6], zoom: 40 }}
        className="!h-[480px]"
        orthographic
      >
        {isDevMode && (
          <CameraControls
            makeDefault
            maxZoom={40}
            minZoom={40}
            onChange={() => {
              const now = performance.now();
              lastChangeRef.current = now;
            }}
            ref={cameraControlsRef}
          />
        )}
        {isDevMode && (
          <GizmoHelper alignment="bottom-right" margin={[64, 64]}>
            <GizmoViewport
              axisColors={['#9d4b4b', '#2f7f4f', '#3b5b9d']}
              labelColor="white"
            />
          </GizmoHelper>
        )}

        <color args={[0xff_ff_ff]} attach="background" />

        <Suspense fallback={null}>
          <group position={[0.7233, 2, -0.6764]}>
            <PointerSphere displacementRef={displacementRef} />
            <RipplePlane
              displacementRef={displacementRef}
              textureUrl={texturePng.src}
            />
            <RipplePlane
              displacementRef={displacementRef}
              isShadow
              textureUrl={shadowPng.src}
            />
          </group>
          <HitPlane onPoint={(p) => displacementRef.current.copy(p)} />
        </Suspense>
      </Canvas>
    </div>
  );
}
