import { CHAIN_ID } from 'src/libs/config/network'

const DEFAULT_NETWORK: boolean =
  process.env.NEXT_PUBLIC_ENABLE_TESTNET === 'true' &&
  process.env.NEXT_PUBLIC_DEFAULT_TESTNET === 'true'

export const DEFAULT_CHAIN_ID = DEFAULT_NETWORK
  ? CHAIN_ID.aurora_testnet
  : CHAIN_ID.aurora

export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID
