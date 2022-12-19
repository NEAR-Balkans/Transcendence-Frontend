import { VFC } from 'react'
import { DefaultModalContent } from 'src/components/parts/Modal/base'
import { ModalContentProps, useModalDialog } from 'src/hooks/useModal'
import { css } from 'styled-components'
import { Header } from './Header'
import { Body } from './Body'
import { requireSupportedChain } from 'src/components/hoc/requireSupportedChain'
import { ContractInterface } from 'ethers'

export const Withdraw: VFC<{
  underlyingToken: string
  yieldToken: string
  contract: { address: string; abi: ContractInterface }
}> = ({ underlyingToken, yieldToken, contract }) => (
  <DefaultModalContent
    headerNode={<Header />}
    bodyNode={<Body underlyingToken={underlyingToken} yieldToken={yieldToken} contract={contract} />}
    headerStyle={headerStyle}
  />
)

const headerStyle = css`
  display: flex;
  justify-content: space-between;
`

export const useWithdrawModal = () =>
  useModalDialog(requireSupportedChain(Withdraw))
