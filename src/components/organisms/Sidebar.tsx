import React from 'react';
import styled from 'styled-components';
import { colors } from '../../styles/colors';
import Typewriter from 'typewriter-effect';
import AccountCircleIcon from '../icons/AccountCircleIcon';
import StarIcon from '../icons/StarIcon';
import CodeIcon from '../icons/CodeIcon';
import MenuItem from '../molecules/MenuItem';
import githubSvg from '../../assets/github.svg';
import linkedinSvg from '../../assets/linkedin.svg';
import EmailIcon from '../icons/EmailIcon';

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

const EndContentWrapper = styled.div`
  width: 100%;
  align-self: flex-end;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SocialMediaWrapper = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;
  align-items: center;

  a {
    all: unset;
    text-decoration: none;
    color: inherit;
    cursor: pointer;
  }

  img,
  svg {
    width: 25px;
    height: 25px;
  }
`;

const CopyrightText = styled.p`
  span {
    color: ${colors.secondaryText};

    a {
      text-decoration: none;
      color: ${colors.secondaryText};

      &:hover {
        text-decoration: underline;
      }
    }
  }
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
      <EndContentWrapper>
        <SocialMediaWrapper>
          <a href='https://github.com/YMaximum' target='blank'>
            <img src={githubSvg} alt='github-logo' />
          </a>
          <a href='https://www.linkedin.com/in/nyassar/' target='blank'>
            <img src={linkedinSvg} alt='linkedin-logo' />
          </a>
          <a href='mailto:yassarnaufal@gmail.com'>
            <EmailIcon />
          </a>
        </SocialMediaWrapper>
        <CopyrightText>
          <span>© 2025 /</span> Naufal Yassar{' '}
          <span>
            /{' '}
            <a href='https://github.com/YMaximum/my-site' target='blank'>
              Source Code Here
            </a>
          </span>
        </CopyrightText>
      </EndContentWrapper>
    </Container>
  );
}
