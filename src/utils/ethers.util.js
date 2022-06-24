import { ethers } from "ethers"
import { network } from "./network.util"
import GAkita from '../contracts/GAkita.sol/GAkita.json';
import Airdrop from '../contracts/AkitaAirdrop.sol/AkitaAirdrop.json';

export const address = {
  gtc: "0xafdC15eD96544f4Dc7bB3997f723A3F333eEE994",
  airdrop: "0xfeaB072417019a9b2Dc1c6940c31845354a3d0E7"
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