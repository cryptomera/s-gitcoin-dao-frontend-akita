import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import { Box } from "@mui/system";
import Header from "./components/common/Header";
import Home from "./components/Home";
import DaoPage from "./components/DaoPage";
import Tutor from "./components/Tutor";
import Promotions from "./components/Promotions";
import Airdrop from "./components/Airdrop";
import IssueBounty from "./components/IssueBounty";
import { useEffect, useState } from "react";
import Bounties from "./components/Bounties";
import ContributeAndDrain from "./components/ContributeAndDrain";
import Treasury from "./components/Treasury";
function App() {
  const [walletAddress, setWalletAddress] = useState();
  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });  // connect wallet
      setWalletAddress(account);
    }
  }
  
  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        color: 'text.primary',
        minHeight: '100vh',
      }}
    >
      <BrowserRouter>
        <Header walletAddress={walletAddress} connectWallet={connectWallet} />
        <Box
          sx={{
            p: '20px'
          }}
        >
          <Routes>
            <Route path="/" element={<Navigate to="/airdrop"/>} />
            <Route path="/airdrop" element={<Airdrop walletAddress={walletAddress} />} />
            <Route path="/issue" element={<IssueBounty walletAddress={walletAddress} />} />
            <Route path="/bounties" element={<Bounties />}/>
            <Route path="/contributeanddrain" element={<ContributeAndDrain walletAddress={walletAddress} />} />
            <Route path="/treasury" element={<Treasury walletAddress={walletAddress}/>} />
          </Routes>
        </Box>
      </BrowserRouter>
    </Box>
  );
}

export default App;
