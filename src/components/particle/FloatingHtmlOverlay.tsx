import React, { useEffect, useState } from "react";
import { useMount } from "../../utils/utils";
import { Html } from "@react-three/drei";
import styled from "styled-components/macro";
import { useStore } from "../../store";
import { useScalePercent } from "../useScalePercent";
import { useSpring, animated } from "react-spring";

export function FloatingHtmlOverlay({
  name,
  lifespan,
  type,
  virusHpPct,
  iconIdx = null,
}) {
  const [mounted, setMounted] = useState(false);
  useMount(() => {
    setTimeout(() => {
      // timeout to ensure bar starts 100% width
      setMounted(true);
    }, 1);
  });
  const scalePct = useScalePercent();

  return (
    <Html>
      <HtmlOverlayStyles
        {...{
          mounted,
          lifespan,
          type,
          virusHpPct,
          scalePct,
        }}
      >
        <animated.div className="damageAnimation" />
        {/* <div className="name">{name}</div> */}
        <div className="hpBar">
          <div className="hp" />
        </div>
      </HtmlOverlayStyles>
    </Html>
  );
}

type HtmlOverlayProps = {
  virusHpPct: number;
  lifespan: number;
  mounted: boolean;
  isVirus: boolean;
  isAntibody: boolean;
  scalePct: number;
};

const HP_BAR_WIDTH = 50;
const HP_BAR_HEIGHT = 5;

const DAMAGE_ANIMATION_WIDTH = HP_BAR_WIDTH * 1.2;
const DAMAGE_ANIMATION_HEIGHT = DAMAGE_ANIMATION_WIDTH;

const SVG_TOP = -40;

const HtmlOverlayStyles = styled.div<HtmlOverlayProps>`
  .damageAnimation {
    position: absolute;
    width: ${DAMAGE_ANIMATION_WIDTH}px;
    height: ${DAMAGE_ANIMATION_HEIGHT}px;
    border-radius: 50%;
    top: ${-DAMAGE_ANIMATION_HEIGHT / 2 + HP_BAR_HEIGHT / 2 + SVG_TOP / 2}px;
    bottom: 0;
    left: ${-DAMAGE_ANIMATION_WIDTH / 2}px;
    right: 0;
    background: radial-gradient(
      circle,
      rgba(214, 7, 7, 1) 0%,
      rgba(209, 66, 66, 0.8) 25%,
      rgba(209, 66, 66, 0.5) 50%,
      rgba(209, 66, 66, 0.2) 75%,
      rgba(255, 21, 0, 0) 100%
    );
  }
  .icon {
    width: 100%;
    height: 100%;
    svg {
      position: absolute;
      top: ${SVG_TOP}px;
      right: -16px;
      width: 32px;
      height: 32px;
    }
    .blockIcon {
      opacity: 0.3;
      svg {
        transform: scale(1.6);
      }
      color: red;
    }
  }
  transform: translateY(16px)
    scale(
      ${(p) => (p.isAntibody ? 0.9 : p.isVirus ? 1.5 : 1) * p.scalePct ** 0.2}
    );
  pointer-events: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 0;
  .name {
    font-size: 8px;
    font-weight: bold;
    white-space: nowrap;
    text-shadow: 0px 0px 2px white, 0px 0px 6px white;
    padding-bottom: 0.5em;
    text-align: center;
  }
`;
