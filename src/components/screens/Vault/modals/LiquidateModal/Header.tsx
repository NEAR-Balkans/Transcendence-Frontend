import styled from 'styled-components'
import { useWalletBalance } from 'src/hooks/useWalletBalance'
import { useWallet } from 'src/hooks/useWallet'
import { addresses } from 'src/libs/config/addresses'

export const Header = ({
  value,
  onChange,
}: {
  value: string[]
  onChange: (value: string[]) => void
}) => {
  const { chainId } = useWallet()

  const yieldToUnderlyingToken = {
    [addresses(chainId).MockYieldToken]: addresses(chainId).ERC20Mock,
    [addresses(chainId).MockYieldTokenUSDT]: addresses(chainId).ERC20MockUSDT,
    [addresses(chainId).MockYieldTokenNEAR]: addresses(chainId).ERC20MockNEAR
  }

  const alchemicToken = addresses(chainId).AlchemicTokenV2
  const alchemicTokenNEAR = addresses(chainId).AlchemicTokenNEARV2
  const usdc = addresses(chainId).MockYieldToken
  const usdt = addresses(chainId).MockYieldTokenUSDT
  const near = addresses(chainId).MockYieldTokenNEAR

  const { symbol: alchemicTokenSymbol } = useWalletBalance(alchemicToken)
  const { symbol: alchemicTokenNEARSymbol } =
    useWalletBalance(alchemicTokenNEAR)
  const { symbol: usdcSymbol } = useWalletBalance(yieldToUnderlyingToken[usdc])
  const { symbol: usdtSymbol } = useWalletBalance(yieldToUnderlyingToken[usdt])
  const { symbol: nearSymbol } = useWalletBalance(yieldToUnderlyingToken[near])

  return (
    <>
      <h1>Liquidate your debt</h1>
      <div>
        <Select
          value={value[0]}
          onChange={(e) => onChange([e.target.value, value[1]])}
        >
          <option value={alchemicToken}>{alchemicTokenSymbol}</option>
          <option value={alchemicTokenNEAR}>{alchemicTokenNEARSymbol}</option>
        </Select>
        <Select
          value={value[1]}
          onChange={(e) => onChange([value[0], e.target.value])}
        >
          <option value={usdc}>{usdcSymbol}</option>
          <option value={usdt}>{usdtSymbol}</option>
          <option value={near}>{nearSymbol}</option>
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
