import styled from 'styled-components'
import { useState, useEffect } from 'react'
import { useDeposit } from 'src/hooks/useDeposit'
import { useBorrow } from 'src/hooks/useBorrow'
import { formatUnits, formatEther } from 'ethers/lib/utils'
import { CryptoInput } from 'src/components/parts/CryptoInput'
import { addresses } from 'src/libs/config/addresses'
import { AlchemistV2, AlchemistV2NEAR } from 'src/abis'
import { useWallet } from 'src/hooks/useWallet'
import { useWalletBalance } from 'src/hooks/useWalletBalance'
import { useInfo } from 'src/hooks/useInfo'

export const Body = ({ borrowToken }: { borrowToken: string }) => {
  const { chainId } = useWallet()
  const { mint } = useBorrow()

  const { getDepositedPerYieldToken } = useDeposit()
  const [value, setValue] = useState<string>('')
  const [availableCredit, setAvailableCredit] = useState<number>(0)
  const [anotherWallet, setAnotherWallet] = useState<boolean>(false)
  const [confirmRecipient, setConfirmRecipient] = useState<boolean>(false)
  const { symbol: yieldTokenSymbol } = useWalletBalance(
    addresses(chainId).MockYieldToken,
  )
  const { symbol: symbol } = useWalletBalance(borrowToken)

  const {
    getUnderlyingTokensPerShare,
    getTokenPrice,
    accounts,
    getFIXED_POINT_SCALAR,
    getMinimumCollateralization,
  } = useInfo()

  const wrappedToYieldToken = {
    [addresses(chainId).AlchemicTokenV2]: addresses(chainId).MockYieldToken,
    [addresses(chainId).AlchemicTokenNEARV2]:
      addresses(chainId).MockYieldTokenNEAR,
  }

  const wrappedTokenToContract = {
    [addresses(chainId).AlchemicTokenV2]: addresses(chainId).AlchemistV2,
    [addresses(chainId).AlchemicTokenNEARV2]:
      addresses(chainId).AlchemistV2NEAR,
  }

  // TODO - Refactor to better design
  const { data: depositedUSDC } = getDepositedPerYieldToken(
    addresses(chainId).MockYieldToken,
    { address: addresses(chainId).AlchemistV2, abi: AlchemistV2.abi },
  )

  const { data: depositedUSDT } = getDepositedPerYieldToken(
    addresses(chainId).MockYieldTokenUSDT,
    { address: addresses(chainId).AlchemistV2, abi: AlchemistV2.abi },
  )

  const { data: depositedNEAR } = getDepositedPerYieldToken(
    addresses(chainId).MockYieldTokenNEAR,
    { address: addresses(chainId).AlchemistV2NEAR, abi: AlchemistV2NEAR.abi },
  )

  const { data: underlyingTokensPerShare } = getUnderlyingTokensPerShare(
    wrappedToYieldToken[borrowToken],
    { address: wrappedTokenToContract[borrowToken], abi: AlchemistV2.abi }
  )
  const { data: accountDetails } = accounts({
    address: wrappedTokenToContract[borrowToken],
    abi: AlchemistV2.abi,
  })
  const { data: FIXED_POINT_SCALAR } = getFIXED_POINT_SCALAR({
    address: wrappedTokenToContract[borrowToken],
    abi: AlchemistV2.abi,
  })
  const { data: minimumCollateralization } = getMinimumCollateralization({
    address: wrappedTokenToContract[borrowToken],
    abi: AlchemistV2.abi,
  })
  
  useEffect(() => {
    updateAvailableCredit()
  }, [
    borrowToken,
    depositedNEAR,
    depositedUSDT,
    depositedUSDC,
    underlyingTokensPerShare,
    accountDetails,
    FIXED_POINT_SCALAR,
  ])

  const updateAvailableCredit = () => {
    if (
      depositedNEAR &&
      depositedUSDT &&
      depositedUSDC &&
      underlyingTokensPerShare &&
      accountDetails &&
      FIXED_POINT_SCALAR
    ) {      
      let shares = 0
      let minimumCol = 0
      let tokensPerShare = 0
      if(borrowToken === addresses(chainId).AlchemicTokenV2) {
        shares = parseFloat(formatUnits(depositedUSDC.shares, 8)) + parseFloat(formatUnits(depositedUSDT.shares, 8))
        minimumCol = parseFloat(minimumCollateralization) / 10 ** 18
        tokensPerShare = parseFloat(
          formatUnits(underlyingTokensPerShare, 6),
        )
      }
      else {
        shares = parseFloat(formatUnits(depositedNEAR.shares, 8))
        minimumCol = parseFloat(minimumCollateralization) / 10 ** 24
        tokensPerShare = parseFloat(
          formatUnits(underlyingTokensPerShare, 24),
        )
      }
      const FIXED_POINT = parseFloat(formatEther(FIXED_POINT_SCALAR))
      const debt = parseFloat(formatEther(accountDetails.debt))

      const value = (shares * tokensPerShare * FIXED_POINT) / minimumCol - debt
      setAvailableCredit(value)
    }
  }

  return (
    <Container>
      {availableCredit !== 0 ? (
        <>
          <h2>Available credit: ${availableCredit}</h2>
          <CryptoInput
            placeholder={`0.00 ${symbol}`}
            value={value}
            onChange={(value: string) => setValue(value)}
          />
          <FlexDiv>
            <label>Transfer loans to another wallet</label>
            <CheckBoxWrapper>
              <CheckBox
                id="anotherWalletCheckbox"
                type="checkbox"
                checked={anotherWallet}
                onChange={(e) => setAnotherWallet(e.target.checked)}
              />
              <CheckBoxLabel htmlFor="anotherWalletCheckbox" />
            </CheckBoxWrapper>
          </FlexDiv>
          {anotherWallet && (
            <>
              <AddressInput placeholder="0x00000" />
              <FlexDiv>
                <label>
                  I have verified the above address to be the correct recipient
                  of my new loan
                </label>
                <CheckBoxWrapper>
                  <CheckBox
                    id="confirmCheckbox"
                    type="checkbox"
                    checked={confirmRecipient}
                    onChange={(e) => setConfirmRecipient(e.target.checked)}
                  />
                  <CheckBoxLabel htmlFor="confirmCheckbox" />
                </CheckBoxWrapper>
              </FlexDiv>
            </>
          )}
          <Button
            onClick={() => {
              switch (borrowToken) {
                case addresses(chainId).AlchemicTokenV2:
                  mint(
                    value,
                    {
                      address: addresses(chainId).AlchemistV2,
                      abi: AlchemistV2.abi,
                    },
                    borrowToken,
                  )
                  break
                case addresses(chainId).AlchemicTokenNEARV2:
                  mint(
                    value,
                    {
                      address: addresses(chainId).AlchemistV2NEAR,
                      abi: AlchemistV2NEAR.abi,
                    },
                    borrowToken,
                  )
                  break
                default:
                  alert('unrecognized borrow token')
                  break
              }
            }}
          >
            Borrow
          </Button>
        </>
      ) : (
        <h2>You have no deposits</h2>
      )}
    </Container>
  )
}

const Container = styled.section`
  padding: 20px 30px;
  h2 {
    margin-bottom: 20px;
    b {
      color: #7c7c7c;
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

const FlexDiv = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin: 15px 0px;
  label {
    margin-right: 10px;
    text-align: right;
    font-size: 14px;
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

const AddressInput = ({
  placeholder,
  fontSize,
  value,
  onChange = () => {},
}: {
  placeholder: string
  fontSize?: number
  value?: string
  onChange?: (value: string) => void
}) => {
  return (
    <CardGrid $fontSize={fontSize}>
      <input
        type="number"
        placeholder={placeholder}
        value={value}
        onChange={(e: any) => onChange(e.target.value)}
      />
      <button>PASTE</button>
      <button>CLEAR</button>
    </CardGrid>
  )
}

const CardGrid = styled.div<{
  $fontSize?: number
}>`
  display: grid;
  grid-template-columns: 3fr 1fr;
  grid-template-rows: repeat(2, 1fr);
  grid-column-gap: 0px;
  grid-row-gap: 0px;
  border-radius: 5px;
  background-color: lightgray;
  text-align: center;
  font-size: ${({ $fontSize }) =>
    $fontSize ? 5 + $fontSize / 3 + 'px' : '12px'};
  margin: 1px;
  & *:nth-child(1) {
    grid-area: 1 / 1 / 3 / 2;
    font-size: ${({ $fontSize }) => ($fontSize ? $fontSize + 'px' : '18px')};
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
