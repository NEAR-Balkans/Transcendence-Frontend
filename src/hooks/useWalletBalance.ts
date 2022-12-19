import { useWallet } from './useWallet'
import useSWR from 'swr'
import { ERC20Mock } from 'src/abis'
import { Contract } from 'ethers'
import { addresses } from 'src/libs/config/addresses'

/** 
 * @note : in case no address or abi is provided, it default to ERC20Mock
 */

export const useWalletBalance = (address?: string, account?: string) => {
  const { chainId, account: defaultAccount, signer } = useWallet()
  const contract = new Contract(
    address || addresses(chainId).ERC20Mock,
    ERC20Mock.abi,
    signer,
  )
  const fetcher =
    () =>
    (...args: any) => {
      const [key, method, ...params] = args
      return contract[method](...params)
    }
  const { data: balance, mutate } = useSWR([address || addresses(chainId).ERC20Mock, 'balanceOf', account ||  defaultAccount], {
    fetcher: fetcher(),
  })

  const { data: symbol } = useSWR([address || addresses(chainId).ERC20Mock, 'symbol'], {
    fetcher: fetcher(),
  })

  const { data: decimals } = useSWR([address || addresses(chainId).ERC20Mock, 'decimals'], {
    fetcher: fetcher()
  })

  return { balance, symbol, decimals, mutate }
}
