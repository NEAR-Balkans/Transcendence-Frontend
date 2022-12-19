import { useState } from 'react'
import styled from 'styled-components'
import { CryptoInput } from 'src/components/parts/CryptoInput'
import { useToggle } from 'src/hooks/useToggle'
import { useWithdraw } from 'src/hooks/useWithdraw'
import { useDeposit } from 'src/hooks/useDeposit'
import { AlchemistV2 } from 'src/abis'
import { addresses } from 'src/libs/config/addresses'
import { useWallet } from 'src/hooks/useWallet'
import { formatUnits } from 'ethers/lib/utils'
import { useWalletBalance } from 'src/hooks/useWalletBalance'
import { ContractInterface } from 'ethers'

export const Body = ({
  underlyingToken,
  yieldToken,
  contract,
}: {
  underlyingToken: string
  yieldToken: string
  contract: { address: string; abi: ContractInterface }
}) => {
  const { toggle: customSlippage, handler: setCustomSlippage } =
    useToggle(false)
  const [amount, setAmount] = useState<string>('')
  const { chainId } = useWallet()
  const { getDepositedPerYieldToken } = useDeposit()
  const { data: depositedData, loading } = getDepositedPerYieldToken(
    yieldToken,
    contract,
  )
  const { symbol: yieldTokenSymbol } = useWalletBalance(yieldToken)
  const { symbol, decimals } = useWalletBalance(underlyingToken)
  const { withdrawUnderlying } = useWithdraw()

  return (
    <Container>
      {!loading && (
        <FlexDiv>
          <div>
            <h2>
              Available:{' '}
              {`${formatUnits(depositedData.shares, 6)} ${yieldTokenSymbol}`}
            </h2>
            <CryptoInput
              placeholder={`~0.00 ${yieldTokenSymbol}`}
              fontSize={15}
            />
          </div>
          <div>
            <h2>
              Available:{' '}
              {`${formatUnits(depositedData.shares, decimals)} ${symbol}`}
            </h2>
            <CryptoInput
              placeholder={`~0.00 ${symbol}`}
              fontSize={15}
              value={amount}
              onChange={(value) => setAmount(value)}
            />
          </div>
        </FlexDiv>
      )}
      <FlexLine>
        <label>Maximum slippage</label>
        <div>
          <label>Custom amount</label>
          <CheckBoxWrapper>
            <CheckBox
              id="checkbox"
              type="checkbox"
              checked={customSlippage}
              onChange={(e) => setCustomSlippage(e.target.checked)}
            />
            <CheckBoxLabel htmlFor="checkbox" />
          </CheckBoxWrapper>
        </div>
      </FlexLine>
      {customSlippage ? (
        <CryptoInput placeholder="0-100%" />
      ) : (
        <MaxSlippage>
          <span>0.3%</span>
          <span>0.5%</span>
          <span>1%</span>
        </MaxSlippage>
      )}
      <Button onClick={() => withdrawUnderlying(yieldToken, amount, contract)}>
        Withdraw
      </Button>
    </Container>
  )
}

const Container = styled.section`
  padding: 20px 30px;
  h2 {
    margin-bottom: 10px;
  }
`

const FlexDiv = styled.div`
  display: flex;
`

const FlexLine = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 15px 0px;
  div {
    display: flex;
    label {
      margin-right: 10px;
    }
  }
`

const MaxSlippage = styled.div`
  display: flex;
  span {
    background-color: lightgray;
    width: 100%;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    :hover {
      background-color: #cacaca;
    }
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

const CheckBoxWrapper = styled.div`
  position: relative;
`
const CheckBoxLabel = styled.label`
  position: absolute;
  top: 0;
  left: 0;
  width: 42px;
  height: 26px;
  border-radius: 15px;
  background: #bebebe;
  cursor: pointer;
  &::after {
    content: '';
    display: block;
    border-radius: 50%;
    width: 18px;
    height: 18px;
    margin: 3px;
    background: #ffffff;
    box-shadow: 1px 3px 3px 1px rgba(0, 0, 0, 0.2);
    transition: 0.2s;
  }
`
const CheckBox = styled.input`
  opacity: 0;
  z-index: 1;
  border-radius: 15px;
  width: 42px;
  height: 26px;
  &:checked + ${CheckBoxLabel} {
    background: #4fbe79;
    &::after {
      content: '';
      display: block;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      margin-left: 21px;
      transition: 0.2s;
    }
  }
`
