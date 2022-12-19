import { useWallet } from './useWallet'
import { ethers, Contract, ContractInterface } from 'ethers'
import { ERC20Mock, AlchemistV2, MockYieldToken } from 'src/abis'
import { addresses } from 'src/libs/config/addresses'
import useSWR from 'swr'

export const useDeposit = () => {
  const { chainId, signer, account } = useWallet()
  const mDaiContract = new Contract(
    addresses(chainId).ERC20Mock,
    ERC20Mock.abi,
    signer,
  )
  const contract = new Contract(
    addresses(chainId).AlchemistV2,
    AlchemistV2.abi,
    signer,
  )

  const fetcher =
    (contract: Contract) =>
    (...args: any) => {
      const [method, ...params] = args
      return contract[method](...params)
    }

  const depositHandler = async (
    yieldToken: string,
    value: string,
    ERC20Contract: { address: string; abi: ContractInterface },
    contract: { address: string; abi: ContractInterface },
  ) => {
    const ERC20ContractInstance = new Contract(
      ERC20Contract.address,
      ERC20Contract.abi,
      signer,
    )
    const contractInstance = new Contract(
      contract.address,
      contract.abi,
      signer,
    )

    const decimals = await ERC20ContractInstance.decimals()

    const tx = await ERC20ContractInstance.approve(
      contract.address,
      ethers.utils.parseUnits(value, decimals),
    )
    const tx2 = await contractInstance.depositUnderlying(
      yieldToken,
      ethers.utils.parseUnits(value, decimals),
      account,
      0,
    )
  }

  const getDepositedPerYieldToken = (
    yieldToken: string,
    contract: { address: string; abi: ContractInterface },
  ) => {
    const { data, error } = useSWR(['positions', account, yieldToken], {
      fetcher: fetcher(new Contract(contract.address, contract.abi, signer)),
    })
    return {
      data: data,
      loading: data === undefined,
    }
  }

  return { depositHandler, getDepositedPerYieldToken }
}
