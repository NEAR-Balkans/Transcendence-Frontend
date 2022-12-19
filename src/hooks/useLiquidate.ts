import { ethers, Contract, ContractInterface } from 'ethers'
import { AlchemistV2, MockYieldToken } from 'src/abis'
import { useWallet } from 'src/hooks/useWallet'
import { addresses } from 'src/libs/config/addresses'

export const useLiquidate = () => {

  const { chainId, signer } = useWallet()
  const contract = new Contract(addresses(chainId).AlchemistV2, AlchemistV2.abi, signer)

  const liquidate = async (value: string, contract: { address: string, abi: ContractInterface }, yieldToken: string) => {
    const contractInstance = new Contract(contract.address, contract.abi, signer)
    const amount = parseFloat(value) * (10**6)
    const limit = 1 * (10**6)
    const tx = await contractInstance.liquidate(yieldToken, amount, limit)
  }

  return { liquidate }
}
