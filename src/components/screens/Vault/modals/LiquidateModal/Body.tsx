import { useState } from 'react'
import styled from 'styled-components'
import { CryptoInput } from 'src/components/parts/CryptoInput'
import { useToggle } from 'src/hooks/useToggle'
import { useLiquidate } from 'src/hooks/useLiquidate'
import { useDeposit } from 'src/hooks/useDeposit'
import { useDebt } from 'src/hooks/useDebt'
import { addresses } from 'src/libs/config/addresses'
import { AlchemistV2, AlchemistV2NEAR } from 'src/abis'
import { useWallet } from 'src/hooks/useWallet'
import { formatEther, formatUnits } from 'ethers/lib/utils'
import { useWalletBalance } from 'src/hooks/useWalletBalance'

export const Body = ({ tokens }: { tokens: string[] }) => {
  const { chainId } = useWallet()
  const [value, setValue] = useState<string>('')
  const { toggle: customSlippage, handler: setCustomSlippage } =
    useToggle(false)
  const { toggle: ackn, handler: setAckn } = useToggle(false)

  const wrappedTokenToContract = {
    [addresses(chainId).AlchemicTokenV2]: addresses(chainId).AlchemistV2,
    [addresses(chainId).AlchemicTokenNEARV2]:
      addresses(chainId).AlchemistV2NEAR,
  }

  const { accounts } = useDebt({
    address: wrappedTokenToContract[tokens[0]],
    abi: AlchemistV2.abi,
  })
  const { liquidate } = useLiquidate()
  const { getDepositedPerYieldToken } = useDeposit()
  const { data, loading } = getDepositedPerYieldToken(tokens[1], {
    address: addresses(chainId).AlchemistV2,
    abi: AlchemistV2.abi,
  })

  const yieldToUnderlyingToken = {
    [addresses(chainId).MockYieldToken]: addresses(chainId).ERC20Mock,
    [addresses(chainId).MockYieldTokenUSDT]: addresses(chainId).ERC20MockUSDT,
    [addresses(chainId).MockYieldTokenNEAR]: addresses(chainId).ERC20MockNEAR,
  }

  const { symbol } = useWalletBalance(yieldToUnderlyingToken[tokens[1]])
  const { symbol: debtSymbol } = useWalletBalance(tokens[0])

  return (
    <Container>
      <div>
        {accounts && !accounts.debt.isZero() && (
          <h2>
            Current debt: {formatEther(accounts.debt)} {debtSymbol}
          </h2>
        )}
        <h2>
          Available: {loading ? 'Loading' : formatUnits(data.shares, 6)}{' '}
          {symbol}
        </h2>
      </div>
      <CryptoInput
        placeholder={`0.00 ${symbol}`}
        value={value}
        onChange={(value) => setValue(value)}
      />
      <FlexDiv>
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
      </FlexDiv>
      {customSlippage ? (
        <CryptoInput placeholder="0-100%" />
      ) : (
        <MaxSlippage>
          <span>0.3%</span>
          <span>0.5%</span>
          <span>1%</span>
        </MaxSlippage>
      )}
      <FlexDiv>
        <span>
          I understand that liquidating will use my deposited collateral to
          repay the outstanding debt
        </span>
        <CheckBoxWrapper>
          <CheckBox
            id="checkbox"
            type="checkbox"
            checked={ackn}
            onChange={(e) => setAckn(e.target.checked)}
          />
          <CheckBoxLabel htmlFor="checkbox" />
        </CheckBoxWrapper>
      </FlexDiv>

      <Button
        onClick={() => {
          switch (tokens[0]) {
            case addresses(chainId).AlchemicTokenV2:
              liquidate(
                value,
                {
                  address: addresses(chainId).AlchemistV2,
                  abi: AlchemistV2.abi,
                },
                tokens[1],
              )
              break
            case addresses(chainId).AlchemicTokenNEARV2:
              liquidate(
                value,
                {
                  address: addresses(chainId).AlchemistV2NEAR,
                  abi: AlchemistV2NEAR.abi,
                },
                tokens[1],
              )
              break
            default:
              alert('unrecognized yield token address')
              break
          }
        }}
      >
        Liquidate
      </Button>
    </Container>
  )
}

const Container = styled.section`
  padding: 20px 30px;
  & > div {
    margin-bottom: 20px;
  }
`

const FlexDiv = styled.div`
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
