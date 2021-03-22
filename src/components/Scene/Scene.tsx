import React, { Suspense } from "react";
import { Physics } from "@react-three/cannon";
import { OrbitControls } from "@react-three/drei";
import { Lighting } from "./Lighting";
import { useAudioTrack } from "../music/useAudioTrack";
import { a } from "react-spring/three";

const Scene = () => {
  // useCameraWobble();
  return (
    <Suspense fallback={null}>
      <AudioTrack />
      <OrbitControls />
      <PhysicsSceneMovable />
      <Lighting />
    </Suspense>
  );
};

function PhysicsSceneMovable() {
  return (
    <a.group>
      <Physics>
        <mesh />
      </Physics>
    </a.group>
  );
}

function AudioTrack() {
  // audio track
  useAudioTrack();
  return null;
}

// PROTEINS.forEach(({ pathToGLTF }) => // useGLTF.preload(pathToGLTF));

export default Scene;
