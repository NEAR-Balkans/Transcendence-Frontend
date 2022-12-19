import styled from 'styled-components'
import { useWalletBalance } from 'src/hooks/useWalletBalance'
import { useWallet } from 'src/hooks/useWallet'
import { addresses } from 'src/libs/config/addresses'

export const Header = ({value, onChange}: {value: string, onChange: (value: string) => void}) => {
  const { chainId } = useWallet()
  const alchemistToken = addresses(chainId).AlchemicTokenV2
  const alchemistTokenNEAR = addresses(chainId).AlchemicTokenNEARV2
  const { symbol: alchemistTokenSymbol } = useWalletBalance(alchemistToken)
  const { symbol: alchemistTokenNEARSymbol } =
    useWalletBalance(alchemistTokenNEAR)

  return (
    <>
      <h1>Borrow</h1>
      <div>
        <Select value={value} onChange={(e) => onChange(e.target.value)}>
          <option value={alchemistToken}>{alchemistTokenSymbol}</option>
          <option value={alchemistTokenNEAR}>{alchemistTokenNEARSymbol}</option>
        </Select>
      </div>
    </>
  )
}

const Select = styled.select`
  background-color: #fff;
  padding: 5px 10px;
  margin: 0px 5px;
  font-size: 14px;
`
