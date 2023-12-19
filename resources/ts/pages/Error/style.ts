import styled from 'styled-components'

export const Error404 = styled.section`
  align-items: center;
  align-content: center;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  justify-items: center;
  height: 100vh;
  margin: 0 auto;
  max-height: 600px;
  max-width: 800px;
  padding: 0 1rem;
  text-align: center;
  width: 100%;
  & h1 span {
    border-radius: 10px;
    display: inline-block;
    height: 80px;
    position: relative;
    top: 13px;
    width: 6px;
  }
  @media (max-width: 800px) {
    & h1 span {
      height: 50px;
      top: 5px;
    }
  }
  @media (max-width: 450px) {
    & h1 span {
      height: 40px;
      top: 4px;
    }
  }
`

export const GeneralError = styled.section`
  align-items: center;
  align-content: center;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  justify-items: center;
  height: 100vh;
  margin: 0 auto;
  max-height: 600px;
  max-width: 1000px;
  padding: 0 1rem;
  text-align: center;
  width: 100%;
`
