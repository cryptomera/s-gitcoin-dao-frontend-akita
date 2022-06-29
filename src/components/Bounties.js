import React, { useEffect, useState } from 'react';
import { bounty } from '../utils/ethers.util';

const Bounties = () => {
  const [bountyList, setBountyList] = useState([]);
  const [bountyCounts, setBountyCounts] = useState(0);
  useEffect(() => {
    async function getBounties() {
      const numBounties = await bounty.numBounties();
      setBountyCounts(bountyCounts);
      for(let i = 0; i < numBounties.toNumber(); i++) {
        const aBounty = await bounty.bounties(i);
        console.log(aBounty);
      }
    }
    getBounties();
  }, []);
  return (
    <div>Bounties</div>
  )
}

export default Bounties;