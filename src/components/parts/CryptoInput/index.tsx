import styled from 'styled-components'

export const CryptoInput = ({placeholder, fontSize, value, onChange = () => {}}: {placeholder: string; fontSize?: number, value?: string, onChange?: (value: string) => void}) => {

  return (
    <CardGrid $fontSize={fontSize} >
      <input type="number" placeholder={placeholder} value={value} onChange={(e: any) => onChange(e.target.value)} />
      <button>MAX</button>
      <button>CLEAR</button>
    </CardGrid>
  )
}

const CardGrid = styled.div<{
  $fontSize?: number;
}>`
  display: grid;
  grid-template-columns: 3fr 1fr;
  grid-template-rows: repeat(2, 1fr);
  grid-column-gap: 0px;
  grid-row-gap: 0px;
  border-radius: 5px;
  background-color: lightgray;
  text-align: center;
  font-size: ${({$fontSize}) => ($fontSize ? (5 + $fontSize/3)+'px' : '12px')};
  margin: 1px;
  & *:nth-child(1) {
    grid-area: 1 / 1 / 3 / 2;
    font-size: ${({$fontSize}) => ($fontSize ? $fontSize+'px' : '18px')};
    font-weight: bold;
    padding: 20px 0px;
  }
  & *:nth-child(2) {
    grid-area: 1 / 2 / 2 / 3;
    border-top-right-radius: 5px;
    color: grey;
    width: auto;
    :hover {
      background-color: #bebebe;
    }
  }
  & *:nth-child(3) {
    grid-area: 2 / 2 / 3 / 3;
    border-bottom-right-radius: 5px;
    color: gray;
    width: auto;
    :hover {
      background-color: #bebebe;
    }
  }
`
