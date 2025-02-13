import React, { useState } from 'react';
import styled from 'styled-components';
import Sidebar from '../organisms/Sidebar';
import RadialBackground from '../atoms/RadialBackground';
import ExperienceCard from '../organisms/ExperienceCard';
import { experiences } from '../../data/experiences';
import { colors } from '../../styles/colors';

interface Position {
  x: number;
  y: number;
}

const BodyContainer = styled.div`
  height: 100vh;
  width: 100vw;
  position: relative;
  overflow-y: auto;
`;

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
`;

const HomeContentWrapper = styled.main`
  width: 100%;
  padding: 4rem 0;
`;

const AboutSection = styled.section`
  width: 100%;
  margin-bottom: 4rem;

  p.text {
    color: ${colors.primaryText};
  }
`;

const ExperiencesSection = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export default function HomePage(): React.ReactElement {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });

  const handleMouseMove = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    setPosition({ x: event.clientX, y: event.clientY });
  };

  return (
    <BodyContainer onMouseMove={handleMouseMove}>
      <RadialBackground x={position.x} y={position.y} />
      <Container>
        <Sidebar />
        <HomeContentWrapper>
          <AboutSection>
            <p className='text'>
              I craft solutions, squash bugs, and occasionally Google my own
              errors. AI is my teacher, documentation is my mentor, and trial
              and error is my best friend.
            </p>
          </AboutSection>
          <ExperiencesSection>
            {experiences.data.map((item, index) => (
              <ExperienceCard
                key={index}
                activeYear={item.active_year}
                company={item.company}
                role={item.role}
                employementType={item.employement_type}
                stacks={item.stacks}
                description={item.description}
              />
            ))}
          </ExperiencesSection>
        </HomeContentWrapper>
      </Container>
    </BodyContainer>
  );
}
