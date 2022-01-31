import styled from 'styled-components/macro'

export const  PositionIcon = styled.div`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.winterMainButton};
  cursor: pointer;
`

export const  PositionInfoModal = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2rem;
  width: 100%;
  color: #080064;
`

export const  PositionInfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`

export const  PositionInfoRowValue = styled.div`
  display: flex;
`

export const  PositionInfoRowTitle = styled.div`
  font-weight: 600;
`