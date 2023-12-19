import styled from 'styled-components'

export const ReportsMenu = styled.div`
  display: grid;
  column-gap: 20px;
  row-gap: 20px;
  grid-template-columns: repeat(3, 1fr);
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    column-gap: 20px;
    row-gap: 10px;
  }
  @media (max-width: 500px) {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(9, 1fr);
  }
  & .element-link {
    align-items: center;
    background-color: #bf1709;
    color: white;
    display: flex;
    font-weight: 600;
    height: 75px;
    justify-content: center;
    padding: 0 20px;
    text-align: center;
    text-decoration: none;
  }
`
