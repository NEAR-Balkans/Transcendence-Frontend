import { Contract, ContractInterface } from 'ethers'
import { addresses } from 'src/libs/config/addresses'
import { AlchemistV2 } from 'src/abis'
import { useWallet } from 'src/hooks/useWallet'
import useSWR from 'swr'

export const useInfo = () => {
  const { account, chainId, signer } = useWallet()
  const contract = new Contract(
    addresses(chainId).AlchemistV2,
    AlchemistV2.abi,
    signer,
  )

  const fetcher =
    () =>
    (...args: any) => {
      const [method, ...params] = args
      return contract[method](...params)
    }

  const fetcher2 =
    (contract: Contract) =>
    (...args: any) => {
      const [key, method, ...params] = args
      return contract[method](...params)
    }

  const getUnderlyingTokensPerShare = (
    yieldToken: string,
    contract: { address: string; abi: ContractInterface },
  ) => {
    const { data, error } = useSWR(
      [contract.address, 'getUnderlyingTokensPerShare', yieldToken],
      {
        fetcher: fetcher2(new Contract(contract.address, contract.abi, signer)),
      },
    )
    return {
      data: data,
      loading: data === undefined,
    }
  }

  const getYieldTokensPerShare = (
    yieldToken: string,
    contract: { address: string; abi: ContractInterface },
  ) => {
    const { data, error } = useSWR(
      [contract.address, 'getYieldTokensPerShare', yieldToken],
      {
        fetcher: fetcher2(new Contract(contract.address, contract.abi, signer)),
      },
    )
    return {
      data: data,
      loading: data === undefined,
    }
  }

  const accounts = (contract: { address: string; abi: ContractInterface }) => {
    const { data, error } = useSWR([contract.address, 'accounts', account], {
      fetcher: fetcher2(new Contract(contract.address, contract.abi, signer)),
    })
    return {
      data: data,
      loading: data === undefined,
    }
  }

  const getFIXED_POINT_SCALAR = (contract: {
    address: string
    abi: ContractInterface
  }) => {
    const { data, error } = useSWR([contract.address, 'FIXED_POINT_SCALAR'], {
      fetcher: fetcher2(new Contract(contract.address, contract.abi, signer)),
    })
    return {
      data: data,
      loading: data === undefined,
    }
  }

  const getMinimumCollateralization = (contract: {
    address: string
    abi: ContractInterface
  }) => {
    const { data, error } = useSWR(
      [contract.address, 'minimumCollateralization'],
      {
        fetcher: fetcher2(new Contract(contract.address, contract.abi, signer)),
      },
    )
    return {
      data: data,
      loading: data === undefined,
    }
  }

  const getTokenPrice = (token: string) => {
    return 1
  }

  const getTokenAdapterPrice = (
    token: string,
    contract: { address: string; abi: ContractInterface },
  ) => {
    const { data } = useSWR([contract.address, 'price'], {
      fetcher: fetcher2(new Contract(contract.address, contract.abi, signer)),
    })
    return {
      price: data,
      loading: data === undefined,
    }
  }

  return {
    getUnderlyingTokensPerShare,
    getYieldTokensPerShare,
    getTokenPrice,
    accounts,
    getFIXED_POINT_SCALAR,
    getMinimumCollateralization,
    getTokenAdapterPrice,
  }
}
