import styled from 'styled-components';
import { colors } from '../../styles/colors';
import React from 'react';

type MenuItemProps = {
  name: string;
  icon: React.ReactElement;
};

const Container = styled.div`
  transition: all 0.4s;
  color: ${colors.primaryText};
  cursor: pointer;
  font-size: 20px;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    fill: ${colors.primaryText};
    width: 22px;
    height: 22px;
    transition: all 0.4s;
  }

  &:hover {
    font-size: 26px;
    font-weight: bold;
    color: ${colors.hoverGreen};

    svg {
      width: 28px;
      height: 28px;
      fill: #359b79cf;
    }
  }
`;

export default function MenuItem({
  name,
  icon,
}: MenuItemProps): React.ReactElement {
  return (
    <Container>
      {icon}
      <p>{name}</p>
    </Container>
  );
}
