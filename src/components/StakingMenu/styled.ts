import styled from 'styled-components/macro'

export const  MenuList = styled.ul`
  padding: 0;
  margin: 0;
  list-style-type: none;
  ${({ theme }) => theme.mediaWidth.upToSmall`{
    min-width: 100%;
    display: flex;
  }`}
`
export const  MenuListItem = styled.li`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20%;
  padding: 10px 0;
  font-weight: 600;
  position: relative;
  color: white;
  text-decoration: none;
  border-radius: 0;

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