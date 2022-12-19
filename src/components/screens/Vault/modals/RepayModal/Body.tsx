import styled from 'styled-components'
import { useState } from 'react'
import { CryptoInput } from 'src/components/parts/CryptoInput'
import { formatUnits, formatEther } from 'ethers/lib/utils'
import { useDebt } from 'src/hooks/useDebt'
import { useRepay } from 'src/hooks/useRepay'
import { useWalletBalance } from 'src/hooks/useWalletBalance'
import { useWallet } from 'src/hooks/useWallet'
import { addresses } from 'src/libs/config/addresses'
import { AlchemistV2, AlchemistV2NEAR, ERC20Mock } from 'src/abis'

export const Body = ({ repayToken }: { repayToken: string[] }) => {
  const { chainId } = useWallet()
  const [value, setValue] = useState<string>('')

  const wrappedTokenToContract = {
    [addresses(chainId).AlchemicTokenV2]: addresses(chainId).AlchemistV2,
    [addresses(chainId).AlchemicTokenNEARV2]: addresses(chainId).AlchemistV2NEAR
  }

  const { balance, symbol, decimals } = useWalletBalance(repayToken[1])
  const { symbol: debtSymbol } = useWalletBalance(repayToken[0])
  const { accounts } = useDebt(
    {
      address: wrappedTokenToContract[repayToken[0]],
      abi: AlchemistV2.abi
    }
  )
  const { burn, repay } = useRepay()

  const repayHandler = (value: string) => {
    if (
      repayToken[1] === addresses(chainId).AlchemicTokenV2 ||
      repayToken[1] === addresses(chainId).AlchemicTokenNEARV2
    ) {
      if (repayToken[0] === addresses(chainId).AlchemicTokenV2) {
        burn(
          value,
          { address: repayToken[1], abi: ERC20Mock.abi },
          { address: addresses(chainId).AlchemistV2, abi: AlchemistV2.abi },
        )
      } else if (repayToken[0] === addresses(chainId).AlchemicTokenNEARV2) {
        burn(
          value,
          { address: repayToken[1], abi: ERC20Mock.abi },
          {
            address: addresses(chainId).AlchemistV2NEAR,
            abi: AlchemistV2NEAR.abi,
          },
        )
      }
    } else {
      if (repayToken[0] === addresses(chainId).AlchemicTokenV2) {
        repay(
          value,
          { address: repayToken[1], abi: ERC20Mock.abi },
          { address: addresses(chainId).AlchemistV2, abi: AlchemistV2.abi },
        )
      } else if (repayToken[0] === addresses(chainId).AlchemicTokenNEARV2) {
        repay(
          value,
          { address: repayToken[1], abi: ERC20Mock.abi },
          {
            address: addresses(chainId).AlchemistV2NEAR,
            abi: AlchemistV2NEAR.abi,
          },
        )
      }
    }
  }

  return (
    <Container>
      <div>
        {accounts && !accounts.debt.isZero() && (
          <h2>
            Current debt: {formatEther(accounts.debt)} {debtSymbol}
          </h2>
        )}
        <h2>
          Available: {balance ? formatUnits(balance, decimals) : '0.0'} {symbol}
        </h2>
      </div>
      <CryptoInput
        placeholder={`0.0 ${symbol}`}
        value={value}
        onChange={(value: string) => setValue(value)}
      />
      <Button onClick={() => repayHandler(value)}>Repay</Button>
    </Container>
  )
}

const Container = styled.section`
  padding: 20px 30px;
  div {
    margin-bottom: 20px;
  }
`

const Button = styled.button`
  width: 100%;
  text-align: center;
  margin: 10px 0px;
  padding: 10px 0px;
  color: black;
  border: 2px solid lightgray;
  border-radius: 5px;
  &:hover {
    background-color: rgb(211, 211, 211, 0.4);
  }
`
