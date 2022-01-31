import styled from 'styled-components/macro'
import WoodenSlob from '../../assets/svg/wooden-slob.svg'
import WoodenRope from '../../assets/svg/wooden-rope.svg'

export const  MenuList = styled.ul`
  padding: 0 1rem;
  margin: 0;
  list-style-type: none;
  display: flex;
  width: 300px;
  justify-content: center;

  background-color: #b38280;
  border: 4px solid #713937;
  border-radius: 16px;
  background-image: url(${WoodenSlob});
  background-repeat: repeat;
  background-size: 27px 40px;
  position: relative;

  &::before,
  &::after {
    content: '';
    // background-image: url(${WoodenRope});
    width: 5px;
    height: 51px;
    position: absolute;
    top: -55px;
  }

  &::before {
    left: 30%;
  }

  &::after {
    right: 30%;
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`{
    min-width: 100%;
    display: flex;
  }`}

  ${({ theme }) => theme.mediaWidth.upToLarge`

  &::before,
  &::after {
    display: none;
  }
`}
`
export const  MenuListItem = styled.li`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 50%;
  padding: 10px 0;
  color: white;
  text-decoration: none;
  border-radius: 0;
  &:first-of-type {
    // border-radius: 8px 0 0 8px;
  }
  &:last-of-type {
    // border-radius: 0 8px 8px 0;
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`{
    white-space: nowrap;
    width: unset;
    padding: 10px 16px;
    &:first-of-type {
      border-radius: unset;
    }
    &:last-of-type {
      border-radius: unset;
    }
  }`}
`
export const  MenuListItemIcon = styled.span`
  margin-right: 6px;
  & > svg {
    display: block;
  }
`
export const  MenuListItemTitle = styled.span`
  font-family: Montserrat, sans-serif;
  line-height: 24px;
`