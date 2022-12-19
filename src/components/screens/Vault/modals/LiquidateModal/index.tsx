import { VFC, useState } from 'react'
import { DefaultModalContent } from 'src/components/parts/Modal/base'
import { ModalContentProps, useModalDialog } from 'src/hooks/useModal'
import { css } from 'styled-components'
import { Header } from './Header'
import { Body } from './Body'
import { requireSupportedChain } from 'src/components/hoc/requireSupportedChain'
import { useWallet } from 'src/hooks/useWallet'
import { addresses } from 'src/libs/config/addresses'

export const Liquidate: VFC<ModalContentProps> = ({ close }) => {
  const { chainId } = useWallet()
  const [liquidateToken, setLiquidateToken] = useState<string[]>([
    addresses(chainId).AlchemicTokenV2,
    addresses(chainId).ERC20Mock,
  ])

  return (
    <DefaultModalContent
      headerNode={
        <Header
          value={liquidateToken}
          onChange={(value: string[]) => setLiquidateToken(value)}
        />
      }
      bodyNode={<Body tokens={liquidateToken}/>}
      headerStyle={headerStyle}
    />
  )
}

const headerStyle = css`
  display: flex;
  justify-content: space-between;
`

export const useLiquidateModal = () =>
  useModalDialog(requireSupportedChain(Liquidate))
