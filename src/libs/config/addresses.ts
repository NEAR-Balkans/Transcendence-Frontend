import { CHAIN_ID } from './network'

const TESTNET_ADDRESSES = {
  AlchemistV2: '',
  AlchemistV2NEAR: '',
  AlchemicTokenV2: '',
  AlchemicTokenNEARV2: '',
  ERC20Mock: '',
  ERC20MockNEAR: '',
  ERC20MockUSDT: '',
  MockYieldToken: '',
  MockYieldTokenNEAR: '',
  MockYieldTokenUSDT: '',
  TransmuterV2: '',
  TransmuterV2NEAR: '',
  TransmuterV2USDT: '',
  CTokenAdapterUSDC: '',
  CTokenAdapterUSDT: '',
  CTokenAdapterNEAR: '',
}

const LOCALHOST_ADDRESSES = {
  AlchemistV2: '0x119B5Da42b11b064EAB4117D11fbcbFF16EDb900',
  AlchemistV2NEAR: '0xE063a388aDAc130661c6a13d0EB27fdddB97Cc4A',
  AlchemicTokenV2: '0x92F04D478Ea99D8dcF564aAb6444DD347de1766e',
  AlchemicTokenNEARV2: '0x561D39042B6FC0D5fA78DaE730468e2C339B5eD3',
  ERC20Mock: '0x0677591DD9d1A85e6596Bf2ee9c36B4A3fF8AaF4',
  ERC20MockNEAR: '0x554D0292CD1E740123b360DD6D10037De00a0Bd7',
  ERC20MockUSDT: '0x8e32b3a6D82DdD3a5d9E327eBAe8FE1e8a5Ba61e',
  MockYieldToken: '0x4C5E52efC85134BB973904e5a3A4EF04693F2525',
  MockYieldTokenNEAR: '0x413b5B07557A0e80bfDe84b1D9283cC163a3F3E9',
  MockYieldTokenUSDT: '0xB5D6528752d60E23137fe088380dA24BDe347eb3',
  TransmuterV2: '0x029018E31007D326D93c5535AA0F8A1F68214160',
  TransmuterV2NEAR: '0x76Ad73bDe207f23960f10418E9A8a9Fe99648d90',
  TransmuterV2USDT: '0xdB52E4853b6A40D2972E6797E0BDBDb3eB761966',
  CTokenAdapterUSDC: '0x40C33C25C90FE65BEf7a378feBA0588c88A29Bee',
  CTokenAdapterUSDT: '0xd3aAA70197b22116c6732a964edC09C853AaC941',
  CTokenAdapterNEAR: '0x946908A7860f614861DD334A3F0A3f691e3a6d9E',
}

export const addresses = (chainId: number | undefined) => {
  switch (chainId) {
    case CHAIN_ID.localhost:
      return LOCALHOST_ADDRESSES
    case CHAIN_ID.aurora_testnet:
      return TESTNET_ADDRESSES
    default:
      return TESTNET_ADDRESSES
  }
}
