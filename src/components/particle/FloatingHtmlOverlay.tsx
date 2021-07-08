import React, { useState } from "react";
import { Html } from "@react-three/drei";
import styled from "styled-components/macro";

export function FloatingHtmlOverlay({ children = null }) {
  const [opacity, setOpacity] = useState(1);
  return (
    <Html>
      <HtmlOverlayStyles
        onClick={() => setOpacity((prev) => Number(!prev))}
        {...{ opacity }}
      >
        {children}
      </HtmlOverlayStyles>
    </Html>
  );
}

type HtmlOverlayProps = {
  opacity: number;
};

const HtmlOverlayStyles = styled.div<HtmlOverlayProps>`
  pointer-events: none;
  opacity: ${({ opacity }) => opacity};
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
