import { VFC, useState } from 'react'
import { DefaultModalContent } from 'src/components/parts/Modal/base'
import { ModalContentProps, useModalDialog } from 'src/hooks/useModal'
import { css } from 'styled-components'
import { Header } from './Header'
import { Body } from './Body'
import { requireSupportedChain } from 'src/components/hoc/requireSupportedChain'
import { useWallet } from 'src/hooks/useWallet'
import { addresses } from 'src/libs/config/addresses'

export const Borrow: VFC<ModalContentProps> = ({ close }) => {
  const { chainId } = useWallet()
  const [borrowToken, setBorrowToken] = useState<string>(
    addresses(chainId).AlchemicTokenV2,
  )
  return (
    <DefaultModalContent
      headerNode={
        <Header
          value={borrowToken}
          onChange={(value: string) => setBorrowToken(value)}
        />
      }
      bodyNode={<Body borrowToken={borrowToken} />}
      headerStyle={headerStyle}
    />
  )
}

const headerStyle = css`
  display: flex;
  justify-content: space-between;
`

export const useBorrowModal = () =>
  useModalDialog(requireSupportedChain(Borrow))
