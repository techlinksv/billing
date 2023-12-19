import styled from 'styled-components'

export const ChangeAddress = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 320px;
  padding: 5px 15px;
  width: 90%;
  & .address-text {
    display: inline-block;
    max-width: 250px;
  }
  & .text-secondary {
    padding: 0 0 0 20px;
  }
  @media (max-width: 1100px) {
    max-width: 240px;
    & .text-secondary {
      display: inline-block;
      padding: 0 0 0 37px;
    }
  }
  @media (max-width: 767px) {
    max-width: 300px;
    width: 90%;
  }
  @media (max-width: 575px) {
    margin-bottom: 10px;
    max-width: 90%;
    width: 90%;
  }
`
