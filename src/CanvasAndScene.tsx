import React from "react";
import { Controls } from "react-three-gui";
import Scene from "./components/Scene/Scene";
import { useWindowSize } from "./utils/hooks";
import * as THREE from "three";
import { VRCanvas } from "@react-three/xr";
import { BREAKPOINT_TABLET } from "./utils/constants";

const INITIAL_CAMERA_POSITION = [0, 0, 15];
const CANVAS_PROPS = {
  onCreated: ({ gl }) => {
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = THREE.PCFShadowMap;
  },
  gl: { antialias: false, alpha: false },
};
const POSFIXED = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
};

export default function CanvasAndScene({ renderProteins = true }) {
  const windowSize = useWindowSize();
  //  // This one makes the camera move in and out
  //  useFrame(({ clock, camera }) => {
  //   camera.position.z = 50 + Math.sin(clock.getElapsedTime()) * 30
  // })
  const isTabletOrLarger = windowSize.width >= BREAKPOINT_TABLET;
  return (
    <>
      <Controls.Provider>
        <VRCanvas
          {...CANVAS_PROPS}
          style={{
            height: windowSize.height,
            width: windowSize.width,
            ...(POSFIXED as any),
          }}
          camera={{ fov: 75, position: INITIAL_CAMERA_POSITION as any }}
        >
          <Scene />
        </VRCanvas>
        {/* <Controls.Canvas
          {...CANVAS_PROPS}
          style={{
            height: windowSize.height,
            width: windowSize.width,
            ...POSFIXED,
            opacity: 0.1,
            pointerEvents: "none",
          }}
          camera={{ fov: 75, position: INITIAL_CAMERA_POSITION }}
        ></Controls.Canvas> */}
        {process.env.NODE_ENV === "development" && isTabletOrLarger ? (
          <Controls style={{ pointerEvents: "auto" }} />
        ) : null}
      </Controls.Provider>
      {/* <HideHpControls /> */}
    </>
  );
}

// function HideHpControls() {
//   const set = useStore((s) => s.set);
//   const showHp = useStore((s) => s.showHp);
//   return (
//     <div style={{ position: "fixed", top: 6, right: 16 }}>
//       <IconButton onClick={() => set({ showHp: !showHp })}>
//         {showHp ? <Visibility /> : <VisibilityOff />}
//       </IconButton>
//     </div>
//   );
// }
