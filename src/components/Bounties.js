import { Grid, Card } from '@mui/material';
import { formatEther } from 'ethers/lib/utils';
import React, { useEffect, useState } from 'react';
import { bounty } from '../utils/ethers.util';
import { Link } from 'react-router-dom';

const Bounties = () => {
  const [bountyList, setBountyList] = useState([]);
  const [bountyCounts, setBountyCounts] = useState(0);
  useEffect(() => {
    async function getBounties() {
      const numBounties = await bounty.numBounties();
      setBountyCounts(bountyCounts);
      let array = [];
      for (let i = 0; i < numBounties.toNumber(); i++) {
        const aBounty = await bounty.bounties(i);
        array.push({
          tokenVersion: aBounty.tokenVersion.toNumber(),
          deadBlock: aBounty.deadline.toNumber(),
          token1: aBounty.token,
          token2: aBounty.token1,
          balance1: formatEther(aBounty.balance),
          balance2: formatEther(aBounty.balance1),
          hasPaidout: aBounty.hasPaidOut
        });
        setBountyList(array);
      }
    }
    getBounties();
  }, []);
  return (
    <Grid container spacing={2}>
      {
        bountyList.map((aBounty, i) => (
          <Grid key={i} item xs={4}>
            <Link to={`/contributeanddrain?id=${i}`}>
              <Card sx={{ p: '20px', cursor: 'pointer' }}>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    Type
                  </Grid>
                  <Grid item xs={8}>
                    {aBounty.tokenVersion}
                  </Grid>
                  {
                    (aBounty.tokenVersion !== 0 && aBounty.tokenVersion !== 20) && (
                      <>
                        <Grid item xs={4}>
                          Token
                        </Grid>
                        <Grid item xs={8}>
                          {aBounty.token2}
                        </Grid>
                      </>
                    )
                  }
                  {
                    (aBounty.tokenVersion === 10 || aBounty.tokenVersion === 0) ? (
                      <Grid item xs={4}>
                        BNB Balance
                      </Grid>
                    ) : (
                      <Grid item xs={4}>
                        AKITA Balance
                      </Grid>
                    )
                  }
                  <Grid item xs={8}>
                    {aBounty.balance1}
                  </Grid>
                  {
                    (aBounty.tokenVersion === 10 || aBounty.tokenVersion === 11) && (
                      <>
                        <Grid item xs={4}>
                          Token Balance
                        </Grid>
                        <Grid item xs={8}>
                          {aBounty.balance2}
                        </Grid>
                      </>
                    )
                  }
                  <Grid item xs={4}>
                    Deadline
                  </Grid>
                  <Grid item xs={8}>
                    {aBounty.deadBlock}
                  </Grid>
                  <Grid item xs={4}>
                    Paid Out
                  </Grid>
                  <Grid item xs={8}>
                    {aBounty.hasPaidout}
                  </Grid>
                </Grid>
              </Card>
            </Link>
          </Grid>
        ))
      }

    </Grid>
  )
}

export default Bounties;