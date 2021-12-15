import React from 'react'
import styled from 'styled-components/macro'
import IcicleFirst from '../assets/svg/icicle-first.svg'
import IcicleSecond from '../assets/svg/icicle-second.svg'

export const BodyWrapper = styled.div<{ margin?: string; maxWidth?: string }>`
  position: relative;
  margin: auto;
  max-width: ${({ maxWidth }) => maxWidth ?? '610px'};
  width: 100%;
  background: ${({ theme }) => theme.winterBackground};
  border-radius: 50px;
  margin-top: 5rem;

  &::before,
  &::after {
    display: block;
    content: '';
    position: absolute;
  }

  &::after {
    // background-image: url(${IcicleSecond});
    right: 0;
    width: 51px;
    height: 90px;
    bottom: -45px;
  }

  &::before {
    bottom: -94px;
    // background-image: url(${IcicleFirst});
    width: 62px;
    height: 140px;
  }
`

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({ children, ...rest }: { children: React.ReactNode }) {
  return <BodyWrapper {...rest}>{children}</BodyWrapper>
}
