import { ethers } from "ethers"
import { network } from "./network.util"
import GAkita from '../contracts/GAkita.sol/GAkita.json';
import Airdrop from '../contracts/AkitaAirdrop.sol/AkitaAirdrop.json';
import Bounty from '../contracts/AkitaBounty.sol/AkitaBounty.json';
import Treasury from '../contracts/TreasuryVester.sol/TreasuryVester.json';
import Timelock from '../contracts/AkitaTimelock.sol/AkitaTimelock.json';
import Governor from '../contracts/AkitaGovernor.sol/AkitaGovernor.json';

export const address = {
  gtc: "0x9DC70bdD573e96fCbb600D116Fba5039B5a38058",
  airdrop: "0x74db6aD0826C52875D2E203E5D83CF79870A3E9E",
  bounty: "0xAaACC11af307933C9F74215fD6C6Ce875515C3C6",
  treasury: "0x0e4247B740f3Ba76E50C9e397F14a24E2d6d1ECF",
  governor: "0xA680cEd90A0b96DDf5D963c3EcB4B2605040B86D"
}
// providers
const provider = new ethers.providers.JsonRpcProvider(network.rpcUrls[0]);
const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
export const signer = web3Provider.getSigner();
// contracts
export const gtc = new ethers.Contract(address['gtc'], GAkita.abi, provider);
export const gtcWeb3 = new ethers.Contract(address['gtc'], GAkita.abi, signer);
export const bountyWeb3 = new ethers.Contract(address['bounty'], Bounty.abi, signer);
export const tokenWeb3 = (tokenAddress) => {
  const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, signer);
  return tokenContract;
}
export const treasuryWeb3 = new ethers.Contract(address['treasury'], Treasury.abi, signer);
export const governorWeb3 = new ethers.Contract(address['governor'], Governor.abi, signer); 

export const airdrop = new ethers.Contract(address['airdrop'], Airdrop.abi, provider);
export const airdropWeb3 = new ethers.Contract(address['airdrop'], Airdrop.abi, signer);
export const bounty = new ethers.Contract(address['bounty'], Bounty.abi, provider);
export const treasury = new ethers.Contract(address['treasury'], Treasury.abi, provider);
export const governor = new ethers.Contract(address['governor'], Governor.abi, provider); 

export const erc20Abi = [
  {
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_spender",
        "type": "address"
      },
      {
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_from",
        "type": "address"
      },
      {
        "name": "_to",
        "type": "address"
      },
      {
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {
        "name": "",
        "type": "uint8"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "name": "balance",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_to",
        "type": "address"
      },
      {
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_owner",
        "type": "address"
      },
      {
        "name": "_spender",
        "type": "address"
      }
    ],
    "name": "allowance",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "payable": true,
    "stateMutability": "payable",
    "type": "fallback"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "spender",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  }
]