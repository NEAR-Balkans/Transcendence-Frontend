import { useWallet } from './useWallet'
import { ethers, Contract, ContractInterface } from 'ethers'
import { AlchemistV2, ERC20Mock } from 'src/abis'
import { addresses } from 'src/libs/config/addresses'

export const useBorrow = () => {
  const { chainId, signer, account } = useWallet()
  const alchemistContract = new Contract(
    addresses(chainId).AlchemistV2,
    AlchemistV2.abi,
    signer,
  )

  const mint = async (
    value: string,
    contract: { address: string; abi: ContractInterface },
    borrowToken: string,
    address = account,
  ) => {
    const tokenContract = new Contract(borrowToken, ERC20Mock.abi, signer)
    const contractInstance = new Contract(contract.address, contract.abi, signer)
    const decimals = await tokenContract.decimals()

    const tx = await contractInstance.mint(
      ethers.utils.parseUnits(value, decimals),
      address,
    )
  }

  return { mint }
}
