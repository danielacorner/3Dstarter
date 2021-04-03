import React, { Suspense, useState } from "react";
import { Physics } from "@react-three/cannon";
import { Box, OrbitControls, RoundedBox } from "@react-three/drei";
import { Lighting } from "./Lighting";
import { useAudioTrack } from "../music/useAudioTrack";
import { animated, useSpring } from "react-spring/three";
import { useControl } from "react-three-gui";

const Scene = () => {
  // useCameraWobble();
  useAudioTrack();

  return (
    <Suspense fallback={null}>
      <OrbitControls />
      <PhysicsScene />
      <Lighting />
    </Suspense>
  );
};

/** contains objects affected by physics */
function PhysicsScene() {
  const [sprung, setSprung] = useState(false);

  // https://codesandbox.io/s/react-spring-v9-rc-6hi1y?file=/src/index.js:983-1012
  // set up a spring to bounce from 0 to 1
  // set the stored value based on this progress %
  const { position } = useSpring({
    // progress: Number(sprung),
    position: sprung ? [0, 0, 2] : [0, 0, 0],
    config: { tension: 170, mass: 1, friction: 17 },
    // onChange({ progress }) {
    //   set({ [property]: firstValue + delta * progress });
    // },
  });

  return (
    <Physics>
      <BigRedButton
        onClick={() => setSprung((prev) => !prev)}
        position={[0, 1, 0]}
      />
      <animated.group position={position}>
        <Box
          args={[1, 1, 1]} // Width, Height and Depth of the box
        />
      </animated.group>
      <animated.mesh>
        <Box args={[2, 2, 2]} position={[-5, -5, -5]} />
      </animated.mesh>
    </Physics>
  );
}

function BigRedButton({ onClick, children = null, ...rest }) {
  const radius = useControl("radius", { type: "number" });

  return (
    <RoundedBox
      args={[1, 1, 1]} // Width, Height and Depth of the box
      radius={radius} // Border-Radius of the box
      smoothness={4} // Optional, number of subdivisions
      {...rest} // All THREE.Mesh props are valid
      onClick={onClick}
    >
      <meshBasicMaterial color="red" />
      {children}
    </RoundedBox>
  );
}

// PROTEINS.forEach(({ pathToGLTF }) => // useGLTF.preload(pathToGLTF));

export default Scene;
