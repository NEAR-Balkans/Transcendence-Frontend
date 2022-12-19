import { useMemo } from 'react'
import { t } from '@lingui/macro'
import { useRouter } from 'next/router'
import { SymbolLay } from 'src/assets/images'
import { LogoProtocol } from 'src/assets/svgs'
import { Image } from 'src/components/elements/Image'
import { Link } from 'src/components/elements/Link'
import { IconLink } from 'src/components/parts/Link'
import { useRewardModal } from 'src/components/parts/Modal/RewardModal'
import { useWalletModal } from 'src/components/parts/Modal/WalletModal'
import { Reel } from 'src/components/parts/Number/Reel'
import { useUserData } from 'src/hooks/useUserData'
import { useWallet } from 'src/hooks/useWallet'
import { useWalletBalance } from 'src/hooks/useWalletBalance'
import { purple, trueWhite } from 'src/styles/colors'
import { fontWeightHeavy } from 'src/styles/font'
import { flexCenter } from 'src/styles/mixins'
import { shortenAddress } from 'src/utils/address'
import { BN_ZERO, formatAmt } from 'src/utils/number'
import { APP, VAULT, TRANSMUTER } from 'src/utils/routes'
import styled, { css } from 'styled-components'
import { HeaderWrapper } from './common'
import { isSupportedChain } from 'src/libs/config'

export const AppHeader = () => {
  const { pathname } = useRouter()
  const { account } = useWallet()
  const { data: user } = useUserData()
  const { balance } = useWalletBalance()
  const { open: openRewardModal } = useRewardModal()
  const { open: openWalletModal } = useWalletModal()
  const { chainId, switchChain } = useWallet()
  const layInWallet = balance?.LAY || BN_ZERO

  const isUnsupportedChain = useMemo(
    () => chainId && !isSupportedChain(chainId),
    [chainId],
  )

  return (
    <AppHeaderWrapper>
      <div></div>
      <Nav>
        <Tab $active={pathname === VAULT}>
          <Link href={VAULT}>Vault</Link>
        </Tab>
        <Tab $active={pathname === TRANSMUTER}>
          <Link href={TRANSMUTER}>Transmuter</Link>
        </Tab>
      </Nav>
      <Menu>
        {isUnsupportedChain && <h1>Network is not supported</h1>}
        <MenuButton onClick={() => openWalletModal()} disabled={!!account}>
          {account ? shortenAddress(account) : t`Connect`}
        </MenuButton>
      </Menu>
    </AppHeaderWrapper>
  )
}

const MenuButton = styled.button`
  ${flexCenter};
  padding: 12px 20px;
  border-radius: 4px;
  backdrop-filter: blur(16px) brightness(1.16);
  background-color: rgba(255, 255, 255, 0.16);
  column-gap: 8px;
`

const Menu = styled.div`
  display: flex;
  column-gap: 16px;
`

const activeStyle = css`
  color: ${purple};
  pointer-events: none;
  :after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: -4px;
    height: 1px;
    border-bottom: 1px solid;
  }
`
const Tab = styled.div<{ $active?: boolean }>`
  position: relative;
  font-size: 16px;
  font-weight: ${fontWeightHeavy};
  ${({ $active }) => $active && activeStyle}
`

const Nav = styled.nav`
  ${flexCenter};
  column-gap: 32px;
`

const LogoLink = styled(IconLink)`
  display: block;
  height: 32px;
  :hover {
    color: ${trueWhite};
  }
  svg {
    height: 32px;
    width: 100px;
  }
`

const AppHeaderWrapper = styled(HeaderWrapper)`
  > {
    :first-child {
      flex: 1;
      > :last-child {
        margin-right: auto;
      }
    }
    :last-child {
      flex: 1;
      > :first-child {
        margin-left: auto;
      }
    }
  }
`
