import { Card, Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { formatEther } from 'ethers/lib/utils';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { bounty } from '../utils/ethers.util';
import moment from 'moment';


const ContributeAndDrain = () => {
  const [bountyInfo, setBountyInfo] = useState();
  const [searchParams] = useSearchParams();
  useEffect(() => {
    async function getBounty() {
      const id = searchParams.get('id');
      const theBounty = await bounty.bounties(id);
      setBountyInfo({
        tokenVersion: theBounty.tokenVersion.toNumber(),
        deadBlock: theBounty.deadline.toNumber(),
        token1: theBounty.token,
        token2: theBounty.token1,
        balance1: formatEther(theBounty.balance),
        balance2: formatEther(theBounty.balance1),
        hasPaidout: theBounty.hasPaidOut
      });
    }
    getBounty();
  }, []);

  const getBountyType = (version) => {
    if (version === 0) {
      return 'BNB'
    } else if (version === 20) {
      return 'AKITA'
    } else if (version === 10) {
      return 'BNB & TOKEN'
    } else {
      return 'AKITA & TOKEN'
    }
  }

  const getDeadline = (deadBlock) => {
    const date = new Date(deadBlock * 1000);
    return moment(date).format('MMMM d, YYYY');
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={4}>
        {
          !!bountyInfo && (
            <Card
              sx={{
                p: '20px'
              }}
            >
              <Box sx={{mb: '20px'}}>
                <Typography variant='h5' component='h5'>
                  Bounty Information
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  Type
                </Grid>
                <Grid item xs={8}>
                  {getBountyType(bountyInfo.tokenVersion)}
                </Grid>
                {
                  (bountyInfo.tokenVersion !== 0 && bountyInfo.tokenVersion !== 20) && (
                    <>
                      <Grid item xs={4}>
                        Token
                      </Grid>
                      <Grid item xs={8}>
                        {bountyInfo.token2}
                      </Grid>
                    </>
                  )
                }
                {
                  (bountyInfo.tokenVersion === 10 || bountyInfo.tokenVersion === 0) ? (
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
                  {bountyInfo.balance1}
                </Grid>
                {
                  (bountyInfo.tokenVersion === 10 || bountyInfo.tokenVersion === 11) && (
                    <>
                      <Grid item xs={4}>
                        Token Balance
                      </Grid>
                      <Grid item xs={8}>
                        {bountyInfo.balance2}
                      </Grid>
                    </>
                  )
                }
                <Grid item xs={4}>
                  Deadline
                </Grid>
                <Grid item xs={8}>
                  {getDeadline(bountyInfo.deadBlock)}
                </Grid>
                <Grid item xs={4}>
                  Paid Out
                </Grid>
                <Grid item xs={8}>
                  {bountyInfo.hasPaidout}
                </Grid>
              </Grid>
            </Card>
          )
        }
      </Grid>
    </Grid>
  )
}


export default ContributeAndDrain;