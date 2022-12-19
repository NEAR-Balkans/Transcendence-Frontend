import { useState, FC, VFC, useEffect } from 'react'
import { TableContainer } from 'src/components/screens/Vault/parts/StrategiesTable'
import { asStyled } from 'src/components/hoc/asStyled'
import { secondary } from 'src/styles/colors'
import { fontWeightMedium } from 'src/styles/font'
import styled from 'styled-components'
import { useWallet } from 'src/hooks/useWallet'
import {
  TransmuterV2,
  TransmuterV2NEAR,
  TransmuterV2USDT,
} from 'src/abis'
import { addresses } from 'src/libs/config/addresses'
import { useWalletBalance } from 'src/hooks/useWalletBalance'
import { formatEther, formatUnits } from 'ethers/lib/utils'
import { useTransmuter } from 'src/hooks/useTransmuter'
import { BigNumber, ContractInterface } from 'ethers'

type transmuterType = {
  name: string
  contract: {
    address: string
    abi: ContractInterface
  }
  wrappedToken: string
  unwrappedToken: string
}

const FILTER_OPTIONS = ['All transmuter', 'mxUSD', 'mxNEAR']
const COLUMNS = ['', 'Transmuter', 'Deposited', 'Withdrawable', 'Claimable']

export const TransmuterTable = asStyled(({ className }) => {
  const { chainId } = useWallet()
  const [filter, setFilter] = useState(0)

  const transmuters: transmuterType[] = [
    {
      name: 'TransmuterV2USDC',
      contract: {
        address: addresses(chainId).TransmuterV2,
        abi: TransmuterV2.abi,
      },
      wrappedToken: addresses(chainId).AlchemicTokenV2,
      unwrappedToken: addresses(chainId).ERC20Mock
    },
    {
      name: 'TransmuterV2USDT',
      contract: {
        address: addresses(chainId).TransmuterV2USDT,
        abi: TransmuterV2USDT.abi,
      },
      wrappedToken: addresses(chainId).AlchemicTokenV2,
      unwrappedToken: addresses(chainId).ERC20MockUSDT
    },
    {
      name: 'TransmuterV2NEAR',
      contract: {
        address: addresses(chainId).TransmuterV2NEAR,
        abi: TransmuterV2NEAR.abi,
      },
      wrappedToken: addresses(chainId).AlchemicTokenNEARV2,
      unwrappedToken: addresses(chainId).ERC20MockNEAR
    },
  ]

  return (
    <section className={className}>
      <TableContainer>
        <FilterRibbon $activated={filter + 1}>
          {FILTER_OPTIONS.map((e, i) => (
            <span
              key={i}
              onClick={() => {
                setFilter(i)
              }}
            >
              {e}
            </span>
          ))}
        </FilterRibbon>
        <StyledTable>
          <thead>
            <tr>
              {COLUMNS.map((e, i) => (
                <th key={i}>{e}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transmuters.map((e, i) => (
              <Row key={i} {...e} />
            ))}
          </tbody>
        </StyledTable>
      </TableContainer>
    </section>
  )
})``

const Row: VFC<transmuterType> = ({ contract, name, unwrappedToken, wrappedToken }) => {
  const [expand, setExpand] = useState<boolean>(false)

  const { symbol: wrappedTokenSymbol } = useWalletBalance(wrappedToken)
  const { symbol: unwrappedTokenSymbol } = useWalletBalance(unwrappedToken)

  const { unexchangedBalance, claimableBalance, exchangedBalance } =
    useTransmuter(contract)

  const handleExpand = () => {
    setExpand((prevState) => !prevState)
  }

  return (
    <>
      <tr>
        <td>
          <Center>
            <ExpandButton onClick={handleExpand}>
              {expand ? '-' : '+'}
            </ExpandButton>
          </Center>
        </td>
        <td>
          <DetailsCell
            value={{
              main: name,
              sub: `${unwrappedTokenSymbol} ${wrappedTokenSymbol}`,
            }}
          />
        </td>
        <td>
          <DetailsCell
            value={{
              main: `0.0`,
              sub: '$0.00',
            }}
          />
        </td>
        <td>
          <DetailsCell
            value={{
              main: `${BalanceField(unexchangedBalance)} ${wrappedTokenSymbol}`,
              sub: '$0.00',
            }}
          />
        </td>
        <td>
          <DetailsCell
            value={{
              main: `${BalanceField(claimableBalance, 6)} ${unwrappedTokenSymbol}`,
              sub: '$0.00',
            }}
          />
        </td>
      </tr>
      <CollapseRow $expand={expand}>
        <td colSpan={5}>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <DepositCard contract={contract} wrappedToken={wrappedToken} />
            <WithdrawCard contract={contract} wrappedToken={wrappedToken} />
            <ClaimCard contract={contract} unwrappedToken={unwrappedToken} />
          </div>
        </td>
      </CollapseRow>
    </>
  )
}

const DepositCard: VFC<{ contract: { address: string, abi: ContractInterface }, wrappedToken: string }> = ({contract, wrappedToken}) => {
  const [value, setValue] = useState<string>('')

  const { balance, symbol } = useWalletBalance(wrappedToken)
  const { deposit } = useTransmuter(contract)

  return (
    <CardStyle>
      <h2>{`Available: ${BalanceField(balance)} ${symbol}`}</h2>
      <CardGrid>
        <input
          type="number"
          placeholder={`0.0 ${symbol}`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button>MAX</button>
        <button>CLEAR</button>
      </CardGrid>
      <Button $primary onClick={() => deposit(value, wrappedToken)}>
        Deposit
      </Button>
    </CardStyle>
  )
}

const WithdrawCard: VFC<{ contract: { address: string, abi: ContractInterface }, wrappedToken: string }> = ({contract, wrappedToken}) => {
  const [value, setValue] = useState<string>('')
  const { withdraw, unexchangedBalance } = useTransmuter(contract)

  const { symbol } = useWalletBalance(wrappedToken)

  return (
    <CardStyle>
      <h2>{`Withdrawable: ${BalanceField(unexchangedBalance)} ${symbol}`}</h2>
      <CardGrid>
        <input
          type="number"
          placeholder={`0.0 ${symbol}`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button>MAX</button>
        <button>CLEAR</button>
      </CardGrid>
      <Button $primary onClick={() => withdraw(value)}>
        Withdraw
      </Button>
    </CardStyle>
  )
}

const ClaimCard: VFC<{ contract: { address: string, abi: ContractInterface }, unwrappedToken: string }> = ({contract, unwrappedToken}) => {
  const [value, setValue] = useState<string>('')
  const { claim, claimableBalance } = useTransmuter(contract)

  const { symbol } = useWalletBalance(unwrappedToken)

  return (
    <CardStyle>
      <h2>{`Transmuted: ${BalanceField(claimableBalance, 6)} ${symbol}`}</h2>
      <CardGrid>
        <input
          type="number"
          placeholder={`0.0 ${symbol}`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button>MAX</button>
        <button>CLEAR</button>
      </CardGrid>
      <Button $primary onClick={() => claim(value)}>
        Claim
      </Button>
    </CardStyle>
  )
}

const BalanceField = (balance: BigNumber | undefined, unit?: number) =>
  balance ? parseFloat(formatUnits(balance, unit || 18)).toFixed(2) : 'Loading'

const DetailsCell = ({ value }: { value: { main: string; sub: string } }) => (
  <DetailsCellStyle>
    <p>{value.main}</p>
    <p>{value.sub}</p>
  </DetailsCellStyle>
)

const CollapseRow = styled.tr<{
  $expand: boolean
}>`
  display: ${({ $expand }) => ($expand ? '' : 'none')};
`

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-rows: repeat(2, 1fr);
  grid-column-gap: 0px;
  grid-row-gap: 0px;
  background-color: #302f2f;
  border-radius: 5px;
  text-align: center;
  font-size: 12px;
  & *:nth-child(1) {
    grid-area: 1 / 1 / 3 / 2;
    input {
      background-color: blue;
      width: min-content;
    }
    font-size: 18px;
    font-weight: bold;
    padding: 20px 0px;
  }
  & *:nth-child(2) {
    grid-area: 1 / 2 / 2 / 3;
    border-top-right-radius: 5px;
    :hover {
      background-color: gray;
    }
  }
  & *:nth-child(3) {
    grid-area: 2 / 2 / 3 / 3;
    border-bottom-right-radius: 5px;
    :hover {
      background-color: gray;
    }
  }
`

const CardStyle = styled.section`
  height: 180px;
  width: 300px;
  padding: 15px;
  background-color: #464141;
  border: 1px solid gray;
  border-radius: 5px;
  h2:first-child {
    font-size: 18px;
    font-weight: 300;
    margin-bottom: 15px;
  }
`

const FilterRibbon = styled.div<{
  $activated?: number
}>`
  padding: 20px;
  span {
    padding: 5px 10px;
    margin: 10px 5px;
    border-radius: 10px;
    color: grey;
    cursor: pointer;
  }
  span:nth-child(${({ $activated }) => $activated}) {
    color: white;
    background-color: #464646;
  }
`

const StyledTable = styled.table`
  table-layout: fixed;
  width: 100%;
  thead > tr {
    height: 56px;
  }
  th {
    color: ${secondary};
    font-size: 14px;
    font-weight: ${fontWeightMedium};
  }
  th,
  td {
    padding: 16px 0;
    vertical-align: middle;
    :first-child {
      padding-left: 32px;
    }
    :last-child {
      padding-right: 32px;
    }
    :nth-child(n + 2) {
      text-align: right;
      margin-left: auto;
    }
  }
`

const DetailsCellStyle = styled.div`
  p:first-child {
    font-size: 16px;
    font-weight: bold;
  }
  p:last-child {
    color: grey;
  }
`

const Center = styled.div`
  text-align: center;
`

const ExpandButton = styled.button`
  height: 30px;
  width: 30px;
  font-weight: bold;
  border: 1px solid white;
  border-radius: 5px;
`

const Button = styled.button<{
  $primary?: boolean
}>`
  width: 100%;
  text-align: center;
  margin: 10px 0px;
  padding: 10px 0px;
  border: 1px solid ${({ $primary }) => ($primary ? 'white' : 'black')};
  border-radius: 5px;
  &:hover {
    background-color: rgb(211, 211, 211, 0.2);
  }
`
