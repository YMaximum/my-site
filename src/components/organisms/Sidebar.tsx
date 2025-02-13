import React from 'react';
import styled from 'styled-components';
import { colors } from '../../styles/colors';
import Typewriter from 'typewriter-effect';
import AccountCircleIcon from '../icons/AccountCircleIcon';
import StarIcon from '../icons/StarIcon';
import CodeIcon from '../icons/CodeIcon';
import MenuItem from '../molecules/MenuItem';

const Container = styled.aside`
  width: 100%;
  height: 100vh;
  position: sticky;
  top: 0;
  padding: 4rem 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Name = styled.h1`
  font-size: 48px;
  letter-spacing: 1px;
  font-weight: 700;
`;

const Role = styled.h2`
  font-size: 20px;
  letter-spacing: 1px;
  font-weight: 500;
`;

const About = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: ${colors.secondaryText};
`;

const ProfileMenuWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4rem;
`;

const ProfileWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MenuWrapper = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SocialMediaWrapper = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;
  align-self: flex-end;
`;

const MENU_ITEMS = [
  {
    name: 'About',
    icon: AccountCircleIcon,
  },
  {
    name: 'Experiences',
    icon: StarIcon,
  },
  {
    name: 'Projects',
    icon: CodeIcon,
  },
];

export default function Sidebar(): React.ReactElement {
  return (
    <Container>
      <ProfileMenuWrapper>
        <ProfileWrapper>
          <Name>Naufal Yassar</Name>
          <Role>Software Engineer</Role>
          <About>
            <Typewriter
              onInit={(typewriter) => {
                typewriter
                  .typeString('I wrote code')
                  .pauseFor(1500)
                  .deleteAll()
                  .typeString('Sometimes....')
                  .pauseFor(1500)
                  .start();
              }}
              options={{ loop: true }}
            />
          </About>
        </ProfileWrapper>
        <MenuWrapper>
          {MENU_ITEMS.map((item) => (
            <MenuItem key={item.name} name={item.name} icon={<item.icon />} />
          ))}
        </MenuWrapper>
      </ProfileMenuWrapper>
      <SocialMediaWrapper>
        <p>social media here</p>
      </SocialMediaWrapper>
    </Container>
  );
}
