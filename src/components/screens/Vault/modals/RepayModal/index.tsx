import { useState, VFC } from 'react'
import { DefaultModalContent } from 'src/components/parts/Modal/base'
import { ModalContentProps, useModalDialog } from 'src/hooks/useModal'
import { css } from 'styled-components'
import { Header } from './Header'
import { Body } from './Body'
import { requireSupportedChain } from 'src/components/hoc/requireSupportedChain'
import { addresses } from 'src/libs/config/addresses'
import { useWallet } from 'src/hooks/useWallet'

export const Repay: VFC<ModalContentProps> = ({ close }) => {
  const { chainId } = useWallet()
  const [repayToken, setRepayToken] = useState<string[]>([
    addresses(chainId).AlchemicTokenV2,
    addresses(chainId).AlchemicTokenNEARV2,
  ])

  return (
    <DefaultModalContent
      headerNode={
        <Header
          value={repayToken}
          onChange={(value: string[]) => setRepayToken(value)}
        />
      }
      bodyNode={<Body repayToken={repayToken} />}
      headerStyle={headerStyle}
    />
  )
}

const headerStyle = css`
  display: flex;
  justify-content: space-between;
`

export const useRepayModal = () => useModalDialog(requireSupportedChain(Repay))
