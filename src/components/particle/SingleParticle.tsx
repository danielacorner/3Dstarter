import React, { useRef, useState } from "react";
import { useConvexPolyhedron } from "@react-three/cannon";
import { useJitterParticle } from "../Physics/useJitterParticle";
import { useStore } from "../../store";
import * as THREE from "three";
import { useChangeVelocityWhenTemperatureChanges } from "../Physics/useChangeVelocityWhenTemperatureChanges";
import { useMount } from "../../utils/utils";
import { useSpring, a } from "react-spring/three";
import { WORLD_RADIUS } from "../../utils/constants";

export type ParticleProps = {
  position: [number, number, number];
  Component: any;
  mass: number;
  numIcosahedronFaces: number;
  radius: number;
  interactive: boolean;
  unmount: Function;
  iconIdx?: number;
  lifespan?: number | null;
};
/** Particle which can interact with others, or not (passes right through them) */
export function SingleParticle(props: ParticleProps) {
  const Particle = props.interactive
    ? InteractiveParticle
    : NonInteractiveParticle;
  return <Particle {...props} />;
}
/** interacts with other particles using @react-three/cannon */
function InteractiveParticle({
  position,
  Component,
  mass,
  lifespan = null,
  unmount = () => null,
  iconIdx = null,
}: ParticleProps) {
  const scale = useStore((s) => s.scale);

  const [isDecaying, setIsDecaying] = useState(false);

  // decay the virus when hp runs out
  // useEffect(() => {
  //   if (isVirus && virusHp <= 0 && !isDecaying) {
  //     window.setTimeout(() => {
  //       setIsDecaying(true);
  //     }, 0);
  //   }
  // }, [virusHp, isVirus, isDecaying]);

  const [ref, api] = useConvexPolyhedron(() => ({
    // TODO: accurate mass data from PDB --> need to multiply by number of residues or something else? doesn't seem right
    mass: 10, // approximate mass using volume of a sphere equation
    position,
    onCollide: handleCollide(unmount, () => {}),
    // https://threejs.org/docs/scenes/geometry-browser.html#IcosahedronBufferGeometry
    args: new THREE.IcosahedronGeometry(1, 2),
  }));

  const unmountOnDecaySpring = useSpringUnmountAfterDecay(
    lifespan,
    setIsDecaying,
    scale,
    isDecaying,
    unmount
  );

  // when temperature changes, change particle velocity
  useChangeVelocityWhenTemperatureChanges({ mass, api });

  return (
    <a.mesh ref={ref} scale={unmountOnDecaySpring.scale}>
      <meshStandardMaterial opacity={0.1} transparent={true} />
      <Component />
    </a.mesh>
  );
}

/**
 * start decaying after lifespan elapses,
 * then unmount after lifespan+decay time
 */
function useSpringUnmountAfterDecay(
  lifespan: number,
  setIsDecaying: React.Dispatch<React.SetStateAction<boolean>>,
  scale: number,
  isDecaying: boolean,
  unmount: Function
) {
  useMount(() => {
    let timer;
    if (lifespan) {
      timer = window.setTimeout(() => {
        setIsDecaying(true);
      }, lifespan);
    }
    return () => {
      if (timer) {
        window.clearTimeout(timer);
      }
    };
  });

  const springProps = useSpring({
    scale: [
      scale * (isDecaying ? 0 : 1),
      scale * (isDecaying ? 0 : 1),
      scale * (isDecaying ? 0 : 1),
    ],
    config: {
      mass: 20,
      tension: 30,
      friction: 20,
      clamp: true,
    },
    // unmount the particle when it's fully decayed
    onRest: (spring) => {
      const isDecayed = spring.scale[0] === 0;
      if (isDecayed) {
        unmount();
      }
    },
  });
  return springProps;
}

function handleCollide(unmount: Function, doSomethingElse: Function) {
  return (event) => {
    const { body, target } = event;

    // ignore water
    if (!body || !target || body.name === "Water" || target.name === "Water") {
      return;
    }

    const didSomethingHappen = false;
    // if something happens...
    if (didSomethingHappen) {
      // e.g. unmount the particle
      unmount();
    } else if (false) {
      doSomethingElse();
    }
  };
}

/** hide particle if too big or too small */
export function useShouldRenderParticle(radius: number) {
  const scale = useStore((s) => s.scale);

  return getShouldRenderParticle(scale, radius);
}

const MIN_RADIUS = 5;
const MAX_RADIUS = 20;
export function getShouldRenderParticle(scale: number, radius: number) {
  const particleSize = scale * radius;
  const tooBigToRender = particleSize > WORLD_RADIUS / MIN_RADIUS;
  const tooSmallToRender = particleSize < WORLD_RADIUS / MAX_RADIUS;
  return !(tooBigToRender || tooSmallToRender);
}

/** doesn't interact with other particles (passes through them) */
function NonInteractiveParticle({
  mass,
  position,
  Component = () => null,
  numIcosahedronFaces,
}: ParticleProps) {
  const ref = useRef();
  useJitterParticle({
    mass,
    ref,
  });
  const scale = useStore((state) => state.scale);

  return (
    <mesh
      frustumCulled={true}
      renderOrder={3}
      ref={ref}
      scale={[scale, scale, scale]}
      position={position}
    >
      <Component />
    </mesh>
  );
}
