import { useState, useEffect } from 'react'
import {
  StrategiesTable,
  TableContainer,
} from 'src/components/screens/Vault/parts/StrategiesTable'
import { asStyled } from 'src/components/hoc/asStyled'
import { darkRed, skyBlue } from 'src/styles/colors'
import styled from 'styled-components'
import { useWithdrawModal, useDepositModal } from './modals'
import { useDeposit } from 'src/hooks/useDeposit'
import { AlchemistV2, ERC20Mock, CTokenAdapter } from 'src/abis'
import { formatUnits, formatEther } from 'ethers/lib/utils'
import { addresses } from 'src/libs/config/addresses'
import { useWallet } from 'src/hooks/useWallet'
import { useWalletBalance } from 'src/hooks/useWalletBalance'
import { useInfo } from 'src/hooks/useInfo'

type vault = {
  id: string
  yieldToken: string
  underlyingToken: string
  tokenAdapter: string
  contract: {
    address: string
    abi: any
  }
}

const FILTER_OPTIONS = [
  'Your strategies',
  'All strategies',
  'Unused strategies',
]

const DETAILS_COLUMNS = [
  { id: 'strategy', name: 'Strategy', widthRatio: 1 },
  { id: 'deposited', name: 'Deposited', widthRatio: 1 },
  { id: 'debtlimit', name: 'Debt Limit', widthRatio: 1 },
  { id: 'tvl', name: 'TVL', widthRatio: 1 },
  { id: '_yield', name: 'Yield', widthRatio: 1 },
  { id: 'actions', name: 'Actions', widthRatio: 2 },
]

export const Strategies = asStyled(({ className }) => {
  const [filter, setFilter] = useState(0)
  const { chainId } = useWallet()

  const vaults = [
    {
      id: '0',
      yieldToken: addresses(chainId).MockYieldToken,
      underlyingToken: addresses(chainId).ERC20Mock,
      tokenAdapter: addresses(chainId).CTokenAdapterUSDC,
      contract: {
        address: addresses(chainId).AlchemistV2,
        abi: AlchemistV2.abi,
      },
    },
    {
      id: '1',
      yieldToken: addresses(chainId).MockYieldTokenUSDT,
      underlyingToken: addresses(chainId).ERC20MockUSDT,
      tokenAdapter: addresses(chainId).CTokenAdapterUSDT,
      contract: {
        address: addresses(chainId).AlchemistV2,
        abi: AlchemistV2.abi,
      },
    },
    {
      id: '2',
      yieldToken: addresses(chainId).MockYieldTokenNEAR,
      underlyingToken: addresses(chainId).ERC20MockNEAR,
      tokenAdapter: addresses(chainId).CTokenAdapterNEAR,
      contract: {
        address: addresses(chainId).AlchemistV2NEAR,
        abi: AlchemistV2.abi,
      },
    },
  ]

  return (
    <DetailsSection className={className}>
      <TableContainer>
        <FilterRibbon $activated={filter + 1}>
          {FILTER_OPTIONS.map((e, i) => (
            <span
              key={i}
              onClick={() => {
                setFilter(i)
              }}
            >
              {e} (0)
            </span>
          ))}
        </FilterRibbon>
        <StrategiesTable
          columns={DETAILS_COLUMNS}
          rows={vaults.map((e) => DetailsRow({ asset: e, onClick: () => {} }))}
          hoverGradients={[`${darkRed}3d`, `${skyBlue}3d`, `${darkRed}3d`]}
        />
      </TableContainer>
    </DetailsSection>
  )
})``

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
  span:nth-child(${($activated) => $activated.$activated}) {
    color: white;
    background-color: #464646;
  }
`

const DetailsRow = ({
  asset,
  onClick,
}: {
  asset: vault
  onClick: VoidFunction
}) => {
  const { open: withdrawModal } = useWithdrawModal()
  const { open: depositModal } = useDepositModal()
  const [debtLimit, setDebtLimit] = useState<number>(0)
  const [tvl, setTVL] = useState<number>(0)
  const [tvlPrice, setTVLPrice] = useState<number>(0)

  const { getDepositedPerYieldToken } = useDeposit()
  const {
    getYieldTokensPerShare,
    getUnderlyingTokensPerShare,
    getFIXED_POINT_SCALAR,
    getMinimumCollateralization,
    getTokenPrice,
    getTokenAdapterPrice
  } = useInfo()

  const { data: underlyingTokensPerShare } = getUnderlyingTokensPerShare(
    asset.yieldToken,
    asset.contract,
  )
  const { data: FIXED_POINT_SCALAR } = getFIXED_POINT_SCALAR(asset.contract)
  const { data: minimumCollateralization } = getMinimumCollateralization(
    asset.contract,
  )
  const { symbol: yieldTokenSymbol, decimals: yieldDecimals } =
    useWalletBalance(asset.yieldToken)
  const { symbol, decimals } = useWalletBalance(asset.underlyingToken)
  const { data: depositedData } = getDepositedPerYieldToken(
    asset.yieldToken,
    asset.contract,
  )
  const { data: yieldTokensPerShare } = getYieldTokensPerShare(
    asset.yieldToken,
    asset.contract,
  )

  const { balance: totalBalance } = useWalletBalance(asset.yieldToken, asset.contract.address)
  const { price } = getTokenAdapterPrice(asset.yieldToken, { address: asset.tokenAdapter, abi: CTokenAdapter.abi })

  useEffect(() => {
    updateTVL()
  }, [totalBalance])

  const updateTVL = () => {
    if(totalBalance) {
      setTVL(parseFloat(formatUnits(totalBalance, decimals)))
    }
    if(totalBalance && price) {
      setTVLPrice(parseFloat(formatUnits(totalBalance, decimals)) * parseFloat(formatUnits(price, yieldDecimals)))
    }
  }

  useEffect(() => {
    updateDebtLimit()
  }, [
    depositedData,
    underlyingTokensPerShare,
    FIXED_POINT_SCALAR,
    minimumCollateralization,
  ])

  const updateDebtLimit = () => {
    if (
      depositedData &&
      underlyingTokensPerShare &&
      FIXED_POINT_SCALAR &&
      minimumCollateralization
    ) {
      const shares = parseFloat(
        formatUnits(depositedData.shares, yieldDecimals),
      )
      const tokensPerShare = parseFloat(
        formatUnits(underlyingTokensPerShare, decimals),
      )
      const FIXED_POINT = parseFloat(formatEther(FIXED_POINT_SCALAR))
      const minimumCol = parseFloat(formatEther(minimumCollateralization))
      const value = (shares * tokensPerShare * FIXED_POINT) / minimumCol
      setDebtLimit(value)
    }
  }

  const { id } = asset
  return {
    id: id,
    onClick,
    data: {
      // asset: <AssetTd icon={icon} name={name} />,
      strategy: (
        <DetailsCell
          main={`Bastion ${symbol}`}
          sub={`${symbol} + ${yieldTokenSymbol}`}
        />
      ),
      deposited:
        depositedData && yieldTokensPerShare ? (
          <DetailsCell
            main={`${(
              parseFloat(formatUnits(depositedData.shares, yieldDecimals)) *
              parseFloat(formatUnits(yieldTokensPerShare, decimals))).toFixed(2)
            } ${yieldTokenSymbol}`}
            sub={`${parseFloat(formatUnits(depositedData.shares, decimals)).toFixed(2)} ${symbol}`}
          />
        ) : (
          <span>Loading</span>
        ),

      debtlimit: (
        <DetailsCell
          main={`${debtLimit.toFixed(2)} ${yieldTokenSymbol}`}
          sub={`+$${(debtLimit * getTokenPrice(asset.yieldToken)).toFixed(2)}`}
        />
      ),
      tvl: <DetailsCell main={`${tvl.toFixed(2)} ${symbol}`} sub={`$${tvlPrice.toFixed(2)}`} />,
      _yield: <DetailsCell main="TBD" sub="APY" />,
      actions: (
        <>
          <Button
            $primary
            onClick={() => {
              depositModal({
                yieldToken: asset.yieldToken,
                ERC20Contract: {
                  address: asset.underlyingToken,
                  abi: ERC20Mock.abi,
                },
                contract: asset.contract,
              })
            }}
          >
            Deposit
          </Button>
          <Button
            onClick={() => {
              withdrawModal({
                underlyingToken: asset.underlyingToken,
                yieldToken: asset.yieldToken,
                contract: asset.contract,
              })
            }}
          >
            Withdraw
          </Button>
        </>
      ),
    },
  }
}

const DetailsCell = ({ main, sub }: { main: string; sub: string }) => (
  <DetailsCellStyle>
    <p>{main}</p>
    <p>{sub}</p>
  </DetailsCellStyle>
)

const DetailsCellStyle = styled.div`
  p:first-child {
  }
  p:last-child {
    color: grey;
  }
`

const Button = styled.button<{
  $primary?: boolean
}>`
  margin: 0px 2px;
  padding: 5px 15px;
  border: 1px solid ${($primary) => ($primary.$primary ? 'white' : 'black')};
  border-radius: 5px;
  &:hover {
    background-color: rgb(211, 211, 211, 0.2);
  }
`

const DetailsSection = styled.section``
