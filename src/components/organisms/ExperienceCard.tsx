import React from 'react';
import styled from 'styled-components';
import { colors } from '../../styles/colors';
import StackTag from '../atoms/StackTag';

type ExperienceCardProps = {
  activeYear: string;
  company: string;
  role: string;
  employementType: string;
  stacks: string[];
  description: string;
};

const Card = styled.div`
  display: flex;
  gap: 1.5rem;
  width: 100%;
  padding: 1rem;
  border-radius: 0.5rem;
  transition: all 0.3s;
  cursor: pointer;

  &:hover {
    background-color: #26263a4e;
    box-shadow: 6px 7px 9px -8px rgba(0, 0, 0, 0.39);
    -webkit-box-shadow: 6px 7px 9px -8px rgba(0, 0, 0, 0.39);
    -moz-box-shadow: 6px 7px 9px -8px rgba(0, 0, 0, 0.39);

    p.company {
      color: ${colors.hoverGreen};
    }
  }
`;

const ActiveYear = styled.p`
  color: ${colors.secondaryText};
  font-size: 12px;
  width: 150px;
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  width: 100%;
`;

const Company = styled.p`
  font-weight: 600;
  font-size: 16px;
`;

const Role = styled.p`
  font-weight: 500;
  font-size: 14px;
  color: ${colors.secondaryText};
  opacity: 0.6;
`;

const Description = styled.p`
  font-weight: 400;
  font-size: 14px;
  color: ${colors.secondaryText};
  opacity: 0.9;
  line-height: 20px;
`;

const StacksWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 0.5rem;
  gap: 0.5rem;
`;

export default function ExperienceCard({
  activeYear,
  company,
  role,
  employementType,
  stacks,
  description,
}: ExperienceCardProps): React.ReactElement {
  return (
    <Card>
      <ActiveYear>{activeYear}</ActiveYear>
      <MainContent>
        <Company className='company'>{company}</Company>
        <Role>
          {role} . {employementType}
        </Role>
        <Description>{description}</Description>
        <StacksWrapper>
          {stacks.map((item, index) => (
            <StackTag key={index} name={item} />
          ))}
        </StacksWrapper>
      </MainContent>
    </Card>
  );
}
