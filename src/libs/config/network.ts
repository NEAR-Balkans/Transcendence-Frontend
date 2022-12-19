import { AssetSymbol } from 'src/types/models'
import { EthereumAddress } from 'src/types/web3'
import { ValueOf } from 'type-fest'

const ENABLE_TESTNET = process.env.NEXT_PUBLIC_ENABLE_TESTNET === 'true'

export const CHAIN_ID = {
  localhost: 31337,
  aurora: 1313161554,
  aurora_testnet: ENABLE_TESTNET ? 1313161555 : 0,
}

export type ChainId = ValueOf<typeof CHAIN_ID>

export const isSupportedChain = (arg: any): arg is ChainId =>
  Object.values(CHAIN_ID).includes(arg)

export type NetworkConfig = {
  name: string
  privateJsonRPCUrl?: string
  privateJsonRPCWSUrl?: string
  publicJsonRPCUrl: string[]
  publicJsonRPCWSUrl?: string
  addresses: {
    walletBalanceProvider: EthereumAddress
    uiPoolDataProvider: EthereumAddress
    uiIncentiveDataProvider: EthereumAddress
    stakeUiHelper: EthereumAddress
    priceAggregatorAdapterAddress: EthereumAddress
  }
  protocolDataUrl?: string
  cachingServerUrl?: string
  cachingWSServerUrl?: string
  baseAsset: {
    symbol: AssetSymbol
    wrapperAddress: EthereumAddress
  }
  rewardToken: {
    symbol: string
    address: EthereumAddress
    underlyingAsset: EthereumAddress
    decimals: number
  }
  snapshotProvider?: {
    endpoint: string
    apiKey?: string
  }
  arthswapDataProvider?: {
    endpoint: string
  }
  explorerLinks: string[]
  rpcOnly?: boolean
  isTestnet?: boolean
}

export const NETWORK_CONFIG: Record<ChainId, NetworkConfig> = {
  [CHAIN_ID.aurora]: {
    name: 'Aurora Mainnet',
    publicJsonRPCUrl: ['https://mainnet.aurora.dev'],
    explorerLinks: ['https://aurorascan.dev'],

    // ! Unused fields that are kept to ensure successful build process
    // * Will be deleted once the unused files that depend on it are inspected and then refactored or deleted
    /* Start */
    addresses: {
      walletBalanceProvider: '0x449b5A2c9c75d77283253625C03aE6336c957a0c',
      uiPoolDataProvider: '0x97Fc9e6aFB9d7A9C9898a2b6F97Da43EB5f56331',
      uiIncentiveDataProvider: '0x08ba69145938dD3CB0EE94c0D59EF6364059956B',
      stakeUiHelper: '0xa6FAB9Dfd104a6582c049266E7eCCB0b908c55E4',
      priceAggregatorAdapterAddress:
        '0xbB5893E0f744b3d6305D49B1da6bc04fE922AC15',
    },
    baseAsset: {
      symbol: 'ASTR',
      wrapperAddress: '0xAeaaf0e2c81Af264101B9129C00F4440cCF0F720',
    },
    rewardToken: {
      symbol: 'stkLAY',
      address: '0x6FD65f71B3FB5Aa9d794f010AFc65F174012994F',
      underlyingAsset: '0xc4335B1b76fA6d52877b3046ECA68F6E708a27dd',
      decimals: 18,
    },
    /* End */
  },
  [CHAIN_ID.aurora_testnet]: {
    name: 'Aurora Testnet',
    publicJsonRPCUrl: ['https://testnet.aurora.dev'],
    explorerLinks: ['https://aurorascan.dev'],

    // ! Unused fields that are kept to ensure successful build process
    // * Will be deleted once the unused files that depend on it are inspected and then refactored or deleted
    /* Start */
    addresses: {
      walletBalanceProvider: '0x449b5A2c9c75d77283253625C03aE6336c957a0c',
      uiPoolDataProvider: '0x97Fc9e6aFB9d7A9C9898a2b6F97Da43EB5f56331',
      uiIncentiveDataProvider: '0x08ba69145938dD3CB0EE94c0D59EF6364059956B',
      stakeUiHelper: '0xa6FAB9Dfd104a6582c049266E7eCCB0b908c55E4',
      priceAggregatorAdapterAddress:
        '0xbB5893E0f744b3d6305D49B1da6bc04fE922AC15',
    },
    baseAsset: {
      symbol: 'ASTR',
      wrapperAddress: '0xAeaaf0e2c81Af264101B9129C00F4440cCF0F720',
    },
    rewardToken: {
      symbol: 'stkLAY',
      address: '0x6FD65f71B3FB5Aa9d794f010AFc65F174012994F',
      underlyingAsset: '0xc4335B1b76fA6d52877b3046ECA68F6E708a27dd',
      decimals: 18,
    },
    /* End */
  },
}
