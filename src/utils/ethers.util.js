import { ethers } from "ethers"
import { network } from "./network.util"
import GAkita from '../contracts/GAkita.sol/GAkita.json';
import Airdrop from '../contracts/AkitaAirdrop.sol/AkitaAirdrop.json';

export const address = {
  gtc: "0xD0132ed340E8eB47A984EF9d69c292F7414eC8f2",
  airdrop: "0x0100e4D763bA57C0DCAa5E3D4cBb5A51f65e2846"
}
// providers
const provider = new ethers.providers.JsonRpcProvider(network.rpcUrls[0]);
const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = web3Provider.getSigner();
// contracts
export const gtc = new ethers.Contract(address['gtc'], GAkita.abi, provider);
export const getWeb3 = new ethers.Contract(address['gtc'], GAkita.abi, signer);

export const airdrop = new ethers.Contract(address['airdrop'], Airdrop.abi, provider);
export const airdropWeb3 = new ethers.Contract(address['airdrop'], Airdrop.abi, signer);