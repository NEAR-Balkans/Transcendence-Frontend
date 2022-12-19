const { ethers } = require('ethers')

const provider = new ethers.providers.JsonRpcBatchProvider(
  `http://localhost:8545`,
)

const myAccountAddress = process.argv.slice(2)[0]
const privateKey = 'ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'

const amount = process.argv.slice(2)[1]
const contractAddress = '0x3887f0555399FfB97EC62B7f8F99290d5007e769'

const contractAbi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_recipient',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '_owner',
        type: 'address',
      },
      {
        name: '_spender',
        type: 'address',
      },
    ],
    name: 'allowance',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
]

const wallet = new ethers.Wallet(privateKey, provider)
const contract = new ethers.Contract(contractAddress, contractAbi, provider)

const mint = async () => {
  const contractWithWallet = contract.connect(wallet)
  const tx = await contractWithWallet.mint(
    myAccountAddress,
    ethers.utils.parseUnits(amount, 6),
  )
  tx.wait()
}

const allowance = async () => {
  const tx = await contract.allowance(myAccountAddress, contractAddress)
  console.log(ethers.utils.formatEther(tx))
}

mint()
