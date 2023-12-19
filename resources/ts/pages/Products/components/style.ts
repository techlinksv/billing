import styled from 'styled-components'

export const AttachFile = styled.form`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  & > div {
    width: calc(100% - 110px);
  }
  & > button {
    width: 100px;
  }
`
