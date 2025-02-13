import React from 'react';
import styled from 'styled-components';

type StackTagProps = {
  name: string;
};

const Tag = styled.div<{ $color?: string }>`
  background-color: #82f7ff53;
  width: fit-content;
  padding: 0.2rem 0.5rem;
  border-radius: 0.2rem;
  font-size: 14px;
`;

export default function StackTag({ name }: StackTagProps): React.ReactElement {
  return <Tag>{name}</Tag>;
}
