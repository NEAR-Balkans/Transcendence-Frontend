import { Contract, ContractInterface } from 'ethers'
import useSWR from 'swr'
import { AlchemistV2 } from 'src/abis'
import { useWallet } from './useWallet'
import { addresses } from 'src/libs/config/addresses'

export const useDebt = (contract: { address: string, abi: ContractInterface }) => {
  const { account, signer } = useWallet()
  const contractInstance = new Contract(
    contract.address,
    contract.abi,
    signer,
  )

  const fetcher = () => (...args: any) => {
    const [key, method, ...params] = args
    return contractInstance[method](...params)
  }

  const { data: accounts, mutate } = useSWR([contract.address, 'accounts', account], {
    fetcher: fetcher()
  })

  return { accounts }
}
