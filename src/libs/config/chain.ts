import { BigNumber } from 'ethers'
import { ChainId, CHAIN_ID, NETWORK_CONFIG } from './network'

export const getChainInfo = (chainId: number) =>
  CHAIN_INFO[chainId]

const toChainIdHex = (chainId: number) =>
  `0x${(+BigNumber.from(chainId)).toString(16)}`

const CHAIN_INFO: Record<ChainId, AddEthereumChainParameter> = {
  [CHAIN_ID.aurora]: {
    chainId: toChainIdHex(CHAIN_ID.aurora),
    chainName: NETWORK_CONFIG[CHAIN_ID.aurora].name,
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: [...NETWORK_CONFIG[CHAIN_ID.aurora].publicJsonRPCUrl],
    blockExplorerUrls: [...NETWORK_CONFIG[CHAIN_ID.aurora].explorerLinks],
  },
  [CHAIN_ID.aurora_testnet]: {
    chainId: toChainIdHex(CHAIN_ID.aurora_testnet),
    chainName: NETWORK_CONFIG[CHAIN_ID.aurora_testnet].name,
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: [...NETWORK_CONFIG[CHAIN_ID.aurora_testnet].publicJsonRPCUrl],
    blockExplorerUrls: [...NETWORK_CONFIG[CHAIN_ID.aurora_testnet].explorerLinks],
  },
}
