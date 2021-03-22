import React from "react";
import { useStore } from "../../store";
import { WORLD_RADIUS } from "../../utils/constants";
import { Plane } from "../Shapes/Plane";

// https://www.npmjs.com/package/nice-color-palettes
// https://raw.githubusercontent.com/Jam3/nice-color-palettes/HEAD/visualize/1000.png
// const palette = niceColors[6]; // e.g. => [ "#69d2e7", "#a7dbd8", "#e0e4cc", "#f38630", "#fa6900" ]

export function Walls() {
  const ceilingHeight = useStore((state) => state.ceilingHeight);
  const walls = [
    {
      name: "in front",
      width: WORLD_RADIUS * 2,
      height: ceilingHeight,
      rotation: [0 * Math.PI, 0, 0],
      position: [0, ceilingHeight / 2 - WORLD_RADIUS, -WORLD_RADIUS],
    },
    {
      reflect: true,
      name: "behind", // (camera-side)
      width: WORLD_RADIUS * 2,
      height: ceilingHeight,
      rotation: [0, -1 * Math.PI, 0],
      position: [0, ceilingHeight / 2 - WORLD_RADIUS, WORLD_RADIUS],
    },
    {
      name: "left",
      width: WORLD_RADIUS * 2,
      height: ceilingHeight,
      rotation: [0, 0.5 * Math.PI, 0],
      position: [-WORLD_RADIUS, ceilingHeight / 2 - WORLD_RADIUS, 0],
    },
    {
      name: "right",
      width: WORLD_RADIUS * 2,
      height: ceilingHeight,
      rotation: [0, -0.5 * Math.PI, 0],
      position: [WORLD_RADIUS, ceilingHeight / 2 - WORLD_RADIUS, 0],
    },
    {
      name: "floor",
      width: WORLD_RADIUS * 2,
      height: WORLD_RADIUS * 2,
      rotation: [-0.5 * Math.PI, 0, 0],
      position: [0, -WORLD_RADIUS, 0],
    },
    {
      name: "ceiling",
      width: WORLD_RADIUS * 2,
      height: WORLD_RADIUS * 2,
      rotation: [0.5 * Math.PI, 0, 0],
      position: [0, ceilingHeight - WORLD_RADIUS, 0],
    },
  ];

  return (
    <>
      {walls.map((props, idx) => (
        <Plane {...props} key={JSON.stringify(props.position)} />
      ))}
    </>
  );
}
