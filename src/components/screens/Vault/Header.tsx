// TODO : REFACTOR
import { asStyled } from 'src/components/hoc/asStyled'
import styled from 'styled-components'
import { fontWeightBold, fontWeightHeavy } from 'src/styles/font'
import { flexCenter } from 'src/styles/mixins'
import { Color } from 'src/styles/types'
import { useRepayModal } from './modals/RepayModal'
import { useLiquidateModal, useBorrowModal } from './modals'
import { useDeposit } from 'src/hooks/useDeposit'
import { useInfo } from 'src/hooks/useInfo'
import { addresses } from 'src/libs/config/addresses'
import { useWallet } from 'src/hooks/useWallet'
import { useEffect, useState } from 'react'
import { formatUnits, formatEther } from 'ethers/lib/utils'
import { AlchemistV2, AlchemistV2NEAR, CTokenAdapter } from 'src/abis'
import { useWalletBalance } from 'src/hooks/useWalletBalance'

export const Header = asStyled(({ className }) => {
  const { chainId } = useWallet()
  const { open: openRepayModal } = useRepayModal()
  const { open: openLiquidateModal } = useLiquidateModal()
  const { open: openBorrowModal } = useBorrowModal()

  const [totalDeposited, setTotalDeposited] = useState<number>(0)
  const [currentDebt, setCurrentDebt] = useState<number>(0)
  const [availableCredit, setAvailableCredit] = useState<number>(0)
  const [globalTVL, setGlobalTVL] = useState<number>(0)

  const { getDepositedPerYieldToken } = useDeposit()
  const {
    getUnderlyingTokensPerShare,
    getTokenPrice,
    accounts,
    getFIXED_POINT_SCALAR,
    getMinimumCollateralization,
    getTokenAdapterPrice,
  } = useInfo()

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

  const { data: underlyingTokensPerShareUSDC } = getUnderlyingTokensPerShare(
    addresses(chainId).MockYieldToken,
    { address: addresses(chainId).AlchemistV2, abi: AlchemistV2.abi },
  )
  const { data: underlyingTokensPerShareUSDT } = getUnderlyingTokensPerShare(
    addresses(chainId).MockYieldTokenUSDT,
    { address: addresses(chainId).AlchemistV2, abi: AlchemistV2.abi },
  )
  const { data: underlyingTokensPerShareNEAR } = getUnderlyingTokensPerShare(
    addresses(chainId).MockYieldTokenNEAR,
    { address: addresses(chainId).AlchemistV2NEAR, abi: AlchemistV2NEAR.abi },
  )

  const { data: alchemistV2Debt } = accounts({
    address: addresses(chainId).AlchemistV2,
    abi: AlchemistV2.abi,
  })
  const { data: alchemistV2NEARDebt } = accounts({
    address: addresses(chainId).AlchemistV2NEAR,
    abi: AlchemistV2NEAR.abi,
  })

  const { data: FIXED_POINT_SCALAR_ALCH } = getFIXED_POINT_SCALAR({
    address: addresses(chainId).AlchemistV2,
    abi: AlchemistV2.abi,
  })
  const { data: FIXED_POINT_SCALAR_NEAR } = getFIXED_POINT_SCALAR({
    address: addresses(chainId).AlchemistV2NEAR,
    abi: AlchemistV2NEAR.abi,
  })

  const { data: minimumCollateralization_ALCH } = getMinimumCollateralization({
    address: addresses(chainId).AlchemistV2,
    abi: AlchemistV2.abi,
  })
  const { data: minimumCollateralization_NEAR } = getMinimumCollateralization({
    address: addresses(chainId).AlchemistV2NEAR,
    abi: AlchemistV2NEAR.abi,
  })

  const { balance: totalBalanceUSDC } = useWalletBalance(
    addresses(chainId).MockYieldToken,
    addresses(chainId).AlchemistV2,
  )
  const { balance: totalBalanceUSDT } = useWalletBalance(
    addresses(chainId).MockYieldTokenUSDT,
    addresses(chainId).AlchemistV2,
  )
  const { balance: totalBalanceNEAR } = useWalletBalance(
    addresses(chainId).MockYieldTokenNEAR,
    addresses(chainId).AlchemistV2NEAR,
  )

  const { price: priceYieldToken_USDC } = getTokenAdapterPrice(
    addresses(chainId).ERC20Mock,
    { address: addresses(chainId).CTokenAdapterUSDC, abi: CTokenAdapter.abi },
  )
  const { price: priceYieldToken_USDT } = getTokenAdapterPrice(
    addresses(chainId).ERC20MockUSDT,
    { address: addresses(chainId).CTokenAdapterUSDT, abi: CTokenAdapter.abi },
  )
  const { price: priceYieldToken_NEAR } = getTokenAdapterPrice(
    addresses(chainId).ERC20MockNEAR,
    { address: addresses(chainId).CTokenAdapterNEAR, abi: CTokenAdapter.abi },
  )

  useEffect(() => {
    updateGlobalTVL()
  }, [
    totalBalanceUSDC,
    totalBalanceUSDT,
    totalBalanceNEAR,
    priceYieldToken_USDC,
    priceYieldToken_USDT,
    priceYieldToken_NEAR,
  ])

  useEffect(() => {
    updateAvailableCredit()
  }, [
    depositedUSDC,
    underlyingTokensPerShareUSDC,
    alchemistV2Debt,
    FIXED_POINT_SCALAR_ALCH,
    minimumCollateralization_ALCH,
  ])

  useEffect(() => {
    updateCurrentDebt()
  }, [alchemistV2NEARDebt, alchemistV2Debt])

  useEffect(() => {
    updateTotalDeposit()
  }, [
    depositedUSDC,
    depositedUSDT,
    depositedNEAR,
    underlyingTokensPerShareUSDC,
    underlyingTokensPerShareUSDT,
    underlyingTokensPerShareNEAR,
  ])

  const updateTotalDeposit = () => {
    if (
      depositedUSDC &&
      depositedUSDT &&
      depositedNEAR &&
      underlyingTokensPerShareUSDC &&
      underlyingTokensPerShareUSDT &&
      underlyingTokensPerShareNEAR
    ) {
      const usdc =
        parseFloat(formatUnits(depositedUSDC.shares, 8)) *
        parseFloat(formatUnits(underlyingTokensPerShareUSDC, 6)) *
        getTokenPrice(addresses(chainId).ERC20Mock)
      const usdt =
        parseFloat(formatUnits(depositedUSDT.shares, 8)) *
        parseFloat(formatUnits(underlyingTokensPerShareUSDT, 6)) *
        getTokenPrice(addresses(chainId).ERC20Mock)
      const near =
        parseFloat(formatUnits(depositedNEAR.shares, 8)) *
        parseFloat(formatUnits(underlyingTokensPerShareNEAR, 24)) *
        getTokenPrice(addresses(chainId).ERC20Mock)

      const value = usdc + usdt + near
      setTotalDeposited(value)
    }
  }

  const updateCurrentDebt = () => {
    if (alchemistV2Debt && alchemistV2NEARDebt) {
      const usdc_t =
        parseFloat(formatEther(alchemistV2Debt.debt)) *
        getTokenPrice(addresses(chainId).ERC20Mock)
      const wNear =
        parseFloat(formatEther(alchemistV2NEARDebt.debt)) *
        getTokenPrice(addresses(chainId).ERC20Mock)

      const value = usdc_t + wNear
      setCurrentDebt(value)
    }
  }

  const updateAvailableCredit = () => {
    if (
      depositedUSDC &&
      depositedUSDT &&
      depositedNEAR &&
      underlyingTokensPerShareUSDC &&
      underlyingTokensPerShareUSDT &&
      underlyingTokensPerShareNEAR &&
      alchemistV2Debt &&
      alchemistV2NEARDebt &&
      FIXED_POINT_SCALAR_ALCH &&
      FIXED_POINT_SCALAR_NEAR &&
      minimumCollateralization_ALCH &&
      minimumCollateralization_NEAR
    ) {
      const sharesUSDC = parseFloat(formatUnits(depositedUSDC.shares, 8))
      const sharesUSDT = parseFloat(formatUnits(depositedUSDT.shares, 8))
      const sharesNEAR = parseFloat(formatUnits(depositedNEAR.shares, 8))
      const tokensPerShareUSDC = parseFloat(
        formatUnits(underlyingTokensPerShareUSDC, 6),
      )
      const tokensPerShareUSDT = parseFloat(
        formatUnits(underlyingTokensPerShareUSDT, 6),
      )
      const tokensPerShareNEAR = parseFloat(
        formatUnits(underlyingTokensPerShareNEAR, 24),
      )
      const FIXED_POINT_ALCH = parseFloat(formatEther(FIXED_POINT_SCALAR_ALCH))
      const FIXED_POINT_NEAR = parseFloat(formatEther(FIXED_POINT_SCALAR_NEAR))

      const minimumColAlch = parseFloat(
        formatEther(minimumCollateralization_ALCH),
      )
      const minimumColNEAR = parseFloat(
        formatEther(minimumCollateralization_NEAR),
      )

      const debt_ALCH = parseFloat(formatEther(alchemistV2Debt.debt))
      const debt_NEAR = parseFloat(formatUnits(alchemistV2NEARDebt.debt, 24))

      const value_ALCH =
        (sharesUSDC * tokensPerShareUSDC +
          sharesUSDT * tokensPerShareUSDT * FIXED_POINT_ALCH) /
          minimumColAlch -
        debt_ALCH
      const value_NEAR =
        (sharesNEAR * tokensPerShareNEAR * FIXED_POINT_NEAR) / minimumColNEAR -
        debt_NEAR

      const value = value_ALCH + value_NEAR
      setAvailableCredit(value)
    }
  }

  const updateGlobalTVL = () => {
    if (
      totalBalanceUSDC &&
      totalBalanceUSDT &&
      totalBalanceNEAR &&
      priceYieldToken_NEAR &&
      priceYieldToken_USDC &&
      priceYieldToken_USDT
    ) {
      const usdc =
        parseFloat(formatUnits(totalBalanceUSDC, 6)) *
        parseFloat(formatUnits(priceYieldToken_USDC, 8))
      const usdt =
        parseFloat(formatUnits(totalBalanceUSDT, 6)) *
        parseFloat(formatUnits(priceYieldToken_USDT, 8))
      const near =
        parseFloat(formatUnits(totalBalanceNEAR, 24)) *
        parseFloat(formatUnits(priceYieldToken_NEAR, 8))
      setGlobalTVL(usdc + usdt + near)
    }
  }

  return (
    <Container>
      <HeaderDiv>
        <Button onClick={() => openBorrowModal()}>Borrow</Button>
        <Button onClick={() => openRepayModal()}>Repay</Button>
        <Button onClick={() => openLiquidateModal()}>Liquidate</Button>
      </HeaderDiv>
      <DashMeter>
        <BalanceItemDiv color={`#758BFD`}>
          <span>Total deposit</span>
          <span>${totalDeposited.toFixed(2)}</span>
        </BalanceItemDiv>
        <BalanceItemDiv color={`#758BFD`}>
          <span>Current debt</span>
          <span>${currentDebt.toFixed(2)}</span>
        </BalanceItemDiv>
        <BalanceItemDiv color={`#758BFD`}>
          <span>Available credit</span>
          <span>${availableCredit.toFixed(2)}</span>
        </BalanceItemDiv>
        <BalanceItemDiv color={`#758BFD`}>
          <span>Global TVL</span>
          <span>${globalTVL.toFixed(2)}</span>
        </BalanceItemDiv>
      </DashMeter>
    </Container>
  )
})``

const Container = styled.div`
  margin: 20px 0px;
`

const HeaderDiv = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-end;
`

const Button = styled.button`
  padding: 10px 16px;
  margin-left: 15px;
  border-radius: 4px;
  border: 1px solid white;
  background-color: rgba(255, 255, 255, 0.16);
  backdrop-filter: blur(16px) brightness(1.16);
  text-align: center;
  &:hover {
    background-color: rgb(255, 255, 255, 0.3);
  }
  :disabled {
    opacity: 0.32;
  }
`
const DashMeter = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
  padding: 16px;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.16);
`

const BalanceItemDiv = styled.div<{ color: Color }>`
  ${flexCenter};
  flex-direction: column;
  row-gap: 10px;
  span:first-child {
    font-size: 20px;
    font-weight: ${fontWeightHeavy};
    color: ${({ color }) => color};
  }
  span:last-child {
    font-size: 40px;
    font-weight: ${fontWeightBold};
  }
`
