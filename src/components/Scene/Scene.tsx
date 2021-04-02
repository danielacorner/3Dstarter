import React, { Suspense, useState } from "react";
import { Physics } from "@react-three/cannon";
import { Box, OrbitControls } from "@react-three/drei";
import { Lighting } from "./Lighting";
import { useAudioTrack } from "../music/useAudioTrack";
import {
  DefaultXRControllers,
  Hands,
  Interactive,
  useInteraction,
  useXR,
  useXREvent,
} from "@react-three/xr";
import { useResource } from "react-three-fiber";

const Scene = () => {
  // useCameraWobble();
  useAudioTrack();

  return (
    <Suspense fallback={null}>
      <OrbitControls />
      <InteractivePhysicsScene />
      <Lighting />
    </Suspense>
  );
};

function InteractivePhysicsScene() {
  const [isHovered, setIsHovered] = useState(false);
  console.log("🌟🚨 ~ InteractivePhysicsScene ~ isHovered", isHovered);

  const ref = useResource();
  useInteraction(ref, "onSelect", () => console.log("selected!"));
  const { controllers, player, isPresenting } = useXR();

  // Every controller emits following events: select, selectstart, selectend, squeeze, squeezestart, squeezeend.
  useXREvent("squeeze", (e) => console.log("squeeze event has been triggered"));

  // useXRFrame((time, xrFrame) => {
  // do something on each frame of an active XR session
  // })

  return (
    <>
      <DefaultXRControllers />
      <Hands />
      <Physics>
        <mesh>
          <Interactive
            onSelect={() => console.log("clicked!")}
            onHover={() => setIsHovered(true)}
            onBlur={() => setIsHovered(false)}
          >
            <Box />
          </Interactive>

          <Box ref={ref} />
        </mesh>
      </Physics>
    </>
  );
}

// PROTEINS.forEach(({ pathToGLTF }) => // useGLTF.preload(pathToGLTF));

export default Scene;
