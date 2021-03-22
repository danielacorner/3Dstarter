import React, { useEffect, useState } from "react";
import { useControl } from "react-three-gui";
import { SingleParticle, useShouldRenderParticle } from "./SingleParticle";
import { getRandStartPosition } from "../Shapes/particleUtils";
import { WORLD_RADIUS } from "../../utils/constants";

/** a set of proteins of the same species (i.e. 3d model) -- each species of protein can be rendered multiple times */
const ParticleGroup = (props) => {
  const numParticlesFloat: number = useControl(props.name, {
    group: `Particles - ${props.type}`,
    type: "number",
    min: 0,
    max: 100,
    value: 1,
  });
  const numParticles = Math.ceil(numParticlesFloat);

  const [positionsArray, setPositionsArray] = useState(() =>
    [...new Array(numParticles)].map(() => getRandStartPosition(WORLD_RADIUS))
  );

  useRenderOnlyNewParticlesWhenCreated(
    numParticles,
    positionsArray,
    setPositionsArray
  );

  return (
    <>
      {positionsArray.map((position) => (
        <SingleParticleIfVisibleAtScale
          key={JSON.stringify(position)}
          {...props}
          position={position}
        />
      ))}
    </>
  );
};

function SingleParticleIfVisibleAtScale(props) {
  const shouldRender = useShouldRenderParticle(props.radius);

  return shouldRender ? <SingleParticle {...props} /> : null;
}

export default ParticleGroup;

/** change the positions array when numParticles changes;
 * do this manually so that existing particles don't re-render & maintain their positions
 */
function useRenderOnlyNewParticlesWhenCreated(
  numParticles: number,
  positionsArray: [number, number, number][],
  setPositionsArray: React.Dispatch<
    React.SetStateAction<[number, number, number][]>
  >
) {
  useEffect(() => {
    const numNewParticles = numParticles - positionsArray.length;

    if (numNewParticles < 0) {
      // slice off any excess,
      const newPositionsArray = positionsArray
        .slice(0, numParticles)
        .filter(Boolean);
      setPositionsArray(newPositionsArray);
    } else if (numNewParticles > 0) {
      // or populate any missing
      const newPositionsArray = [...new Array(numNewParticles)].map(() =>
        getRandStartPosition(WORLD_RADIUS)
      );
      setPositionsArray((prev) => [...prev, ...newPositionsArray]);
    }
  }, [numParticles, positionsArray, setPositionsArray]);
}
