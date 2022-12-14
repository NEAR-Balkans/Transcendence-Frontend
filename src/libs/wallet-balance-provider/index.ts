import { WalletBalanceProvider } from '@starlay-finance/contract-helpers'
import { BigNumber } from '@starlay-finance/math-utils'
import { EthereumAddress } from 'src/types/web3'
import { getMarketConfig, getNetworkConfig, NetworkConfig } from '../config'
import { StaticRPCProvider } from '../pool-data-provider'

export const walletBalanceProviderContract = (
  provider: StaticRPCProvider,
): WalletBalanceProviderInterface => WalletBalanceProviderWrapper.new(provider)

export type WalletBalanceProviderInterface = {
  getBeforeNormalizedWalletBalance: (
    account: string,
  ) => Promise<{ [key in EthereumAddress]: BigNumber }>
}

class WalletBalanceProviderWrapper implements WalletBalanceProviderInterface {
  constructor(
    private proivder: WalletBalanceProvider,
    private lendingPoolAddressProvider: EthereumAddress,
    private baseAsset: NetworkConfig['baseAsset'],
  ) {}

  static new = ({ chainId, provider }: StaticRPCProvider) => {
    const {
      addresses: { walletBalanceProvider },
      baseAsset,
    } = getNetworkConfig(chainId)
    const {
      addresses: { LENDING_POOL_ADDRESS_PROVIDER },
    } = getMarketConfig(chainId)
    return new WalletBalanceProviderWrapper(
      new WalletBalanceProvider({
        walletBalanceProviderAddress: walletBalanceProvider,
        provider,
      }),
      LENDING_POOL_ADDRESS_PROVIDER,
      baseAsset,
    )
  }

  getBeforeNormalizedWalletBalance = async (account: string) => {
    const { proivder, lendingPoolAddressProvider, baseAsset } = this
    const { 0: underlyingAssets, 1: balances } =
      await proivder.getUserWalletBalancesForLendingPoolProvider(
        account,
        lendingPoolAddressProvider,
      )
    return underlyingAssets.reduce((prev, asset, idx) => {
      return {
        ...prev,
        [asset.toLowerCase()]: balances[idx],
      }
    }, {}) as { [key in EthereumAddress]: BigNumber }
  }
}
