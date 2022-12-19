import { ethers, Contract, ContractInterface } from 'ethers'
import { AlchemistV2, ERC20Mock, mxUSD } from 'src/abis'
import { useWallet } from './useWallet'
import { addresses } from 'src/libs/config/addresses'

export const useRepay = () => {
  const { chainId, account, signer } = useWallet()
  const alchemistContract = new Contract(
    addresses(chainId).AlchemistV2,
    AlchemistV2.abi,
    signer,
  )
  const mDaiContract = new Contract(
    addresses(chainId).ERC20Mock,
    ERC20Mock.abi,
    signer,
  )
  const mxUSDContract = new Contract(
    addresses(chainId).AlchemicTokenV2,
    mxUSD.abi,
    signer,
  )

  const burn = async (
    value: string,
    erc20contract: { address: string; abi: ContractInterface },
    contract: { address: string; abi: ContractInterface },
  ) => {

    const erc20contractInstance = new Contract(
      erc20contract.address,
      erc20contract.abi,
      signer,
    )
    const contractInstance = new Contract(
      contract.address,
      contract.abi,
      signer,
    )

    const tx1 = await erc20contractInstance.approve(
      contract.address,
      ethers.utils.parseEther(value),
    )
    const tx2 = await contractInstance.burn(
      ethers.utils.parseEther(value),
      account,
    )
  }

  const repay = async (
    value: string,
    erc20contract: { address: string; abi: ContractInterface },
    contract: { address: string; abi: ContractInterface },
  ) => {
    const erc20contractInstance = new Contract(
      erc20contract.address,
      erc20contract.abi,
      signer,
    )
    const contractInstance = new Contract(
      contract.address,
      contract.abi,
      signer,
    )

    const tx1 = await erc20contractInstance.approve(
      contract.address,
      ethers.utils.parseUnits(value, 6),
    )
    const tx2 = await contractInstance.repay(
      erc20contract.address,
      ethers.utils.parseUnits(value, 6),
      account,
    )
  }

  return { burn, repay }
}
