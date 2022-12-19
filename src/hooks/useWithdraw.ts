import { useWallet } from './useWallet'
import { ethers, Contract, ContractInterface } from 'ethers'
import { AlchemistV2 } from 'src/abis'
import { addresses } from 'src/libs/config/addresses'

export const useWithdraw = () => {
  const { chainId, account, signer } = useWallet()
  const AlchemistContract = new Contract(
    addresses(chainId).AlchemistV2,
    AlchemistV2.abi,
    signer,
  )

  const withdrawUnderlying = async (
    yieldToken: string,
    value: string,
    contract: { address: string; abi: ContractInterface },
  ) => {
    const contractInstance = new Contract(
      contract.address,
      contract.abi,
      signer,
    )

    const tx = await contractInstance.withdrawUnderlying(
      yieldToken,
      ethers.utils.parseUnits(value, 6),
      account,
      1,
    )
  }

  return { withdrawUnderlying }
}
