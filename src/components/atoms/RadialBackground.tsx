import React from 'react';
import styled from 'styled-components';
import { colors } from '../../styles/colors';

type RadialBackgroundProps = {
  x: number;
  y: number;
};

const Background = styled.div`
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  transition: 0.3s;
  pointer-events: none;
`;

export default function RadialBackground({
  x,
  y,
}: RadialBackgroundProps): React.ReactElement {
  return (
    <Background
      style={{
        background: `radial-gradient(500px at ${x}px ${y}px, ${colors.radialBGColor}, transparent 80%)`,
      }}
    ></Background>
  );
}
