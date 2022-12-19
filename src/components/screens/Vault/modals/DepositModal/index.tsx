import { VFC } from 'react'
import { DefaultModalContent } from 'src/components/parts/Modal/base'
import { useModalDialog } from 'src/hooks/useModal'
import { css } from 'styled-components'
import { Header } from './Header'
import { Body } from './Body'
import { requireSupportedChain } from 'src/components/hoc/requireSupportedChain'
import { ContractInterface } from 'ethers'

export const Deposit: VFC<{
  yieldToken: string,
  ERC20Contract: { address: string; abi: ContractInterface },
  contract: { address: string; abi: ContractInterface }
}> = (props) => (
  <DefaultModalContent
    headerNode={<Header />}
    bodyNode={<Body yieldToken={props.yieldToken} erc20Contract={props.ERC20Contract} contract={props.contract} />}
    headerStyle={headerStyle}
  />
)

const headerStyle = css`
  display: flex;
  justify-content: space-between;
`

export const useDepositModal = () =>
  useModalDialog(requireSupportedChain(Deposit))
