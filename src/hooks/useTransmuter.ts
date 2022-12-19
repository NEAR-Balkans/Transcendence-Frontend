import { ethers, Contract, ContractInterface } from 'ethers'
import { TransmuterV2, mxUSD, TransmuterV2NEAR, ERC20Mock } from 'src/abis'
import { useWallet } from 'src/hooks/useWallet'
import useSWR from 'swr'
import { addresses } from 'src/libs/config/addresses'

export const useTransmuter = (contract: { address: string, abi: ContractInterface }) => {
  const { chainId, account, signer } = useWallet()
  const transmuterContract = new Contract(
    contract.address,
    contract.abi,
    signer,
  )
  const mxUSDContract = new Contract(addresses(chainId).AlchemicTokenV2, mxUSD.abi, signer)


  const fetcher =
    () =>
    (...args: string[]) => {
      const [address, method, ...params] = args
      return transmuterContract[method](...params)
    }

  const { data: unexchangedBalance } = useSWR(
    [contract.address, 'getUnexchangedBalance', account],
    {
      fetcher: fetcher(),
    },
  )
  const { data: exchangedBalance } = useSWR([contract.address, 'getExchangedBalance', account], {
    fetcher: fetcher(),
  })
  const { data: claimableBalance } = useSWR([contract.address, 'getClaimableBalance', account], {
    fetcher: fetcher(),
  })

  const deposit = async (value: string, token: string) => {
    const contractInstance = new Contract(token, ERC20Mock.abi, signer)
    const tx1 = await contractInstance.approve(
      contract.address,
      ethers.utils.parseEther(value),
    )
    const tx2 = await transmuterContract.deposit(
      ethers.utils.parseEther(value),
      account,
    )
  }

  const withdraw = async (value: string) => {
    const tx = await transmuterContract.withdraw(
      ethers.utils.parseEther(value),
      account,
    )
  }

  const claim = async (value: string) => {
    const tx = await transmuterContract.claim(
      ethers.utils.parseUnits(value, 6),
      account,
    )
  }

  return {
    deposit,
    withdraw,
    claim,
    unexchangedBalance,
    exchangedBalance,
    claimableBalance,
  }
}
