import styled from 'styled-components'

export const MenuGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0px;
  & .item {
    border: 1px solid var(--bs-border-color);
    text-align: center;
    & a {
      display: block;
      height: 100%;
      padding: 20px 5px;
      width: 100%;
    }
    & img {
      height: 100px;
      max-width: 80%;
      width: auto;
    }
    & span {
      display: inline-block;
      color: var(--bs-body-color);
      padding: 10px 0 0 0;
      width: 100%;
    }
  }
  @media (max-width: 440px) {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    & .item {
      & img {
        max-width: 100px;
        height: 70px;
      }
    }
  }
`
