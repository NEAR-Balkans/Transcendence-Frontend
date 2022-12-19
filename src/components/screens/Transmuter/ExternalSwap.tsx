import styled from 'styled-components'
import { asStyled } from 'src/components/hoc/asStyled'
import { fontWeightHeavy } from 'src/styles/font'

export const ExternalSwap = asStyled(({}) => {
  return (
    <CaptionContainer>
      <div>
        <h4>External Swap Providers</h4>
      </div>
      <div>
        <Button>Curve</Button>
        <Button>Zepper</Button>
        <Button>Paraswap</Button>
      </div>
    </CaptionContainer>
  )
})``

const CaptionContainer = styled.div`
  margin: 20px 0px;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.16);
  padding: 20px;
  & div:first-child {
    margin-bottom: 20px;
    font-weight: ${fontWeightHeavy};
  }
`

const Button = styled.button`
  padding: 10px 16px;
  margin-right: 15px;
  border-radius: 4px;
  border: 1px solid white;
  background-color: rgba(255, 255, 255, 0.16);
  backdrop-filter: blur(16px) brightness(1.16);
  text-align: center;
  &:hover {
    background-color: rgb(255,255,255, 0.3);
  }
  :disabled {
    opacity: 0.32;
  }
`
