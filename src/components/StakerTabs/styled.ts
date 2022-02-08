import styled from 'styled-components/macro'

export const Tabs = styled.div`
  display: flex;
`
export const Tab = styled.div<{ active: boolean }>`
  display: inline-flex;
  align-items: center;
  padding: 0 8px 12px;
  border-bottom: 1px solid ${({ active }) => (active ? '#4588ED' : '#202635')};
  white-space: nowrap;
  cursor: pointer;
`
export const TabSpacer = styled.div`
  display: inline-block;
  width: 40px;
  height: 37px;
  border-bottom: 1px solid #202635;
  &:last-of-type {
    width: 100%;
  }
`
export const TabIcon = styled.span`
  margin-right: 10px;
  & > svg {
    display: block;
  }
`
