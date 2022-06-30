import { Card, Grid, TextField, Typography, Button } from '@mui/material';
import { Box } from '@mui/system';
import { formatEther, parseEther } from 'ethers/lib/utils';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { address, bounty, bountyWeb3, gtcWeb3, tokenWeb3 } from '../utils/ethers.util';
import moment from 'moment';




const ContributeAndDrain = ({walletAddress}) => {
  const [bountyInfo, setBountyInfo] = useState();
  const [amoutIn, setAmountIn] = useState(0);
  const [amountOut, setAmountOut] = useState(0);
  const [bountyId, setBountyId] = useState();
  const [issuers, setIssuers] = useState([]);
  const [searchParams] = useSearchParams();
  useEffect(() => {
    async function getBounty() {
      const id = searchParams.get('id');
      setBountyId(id);
      const theBounty = await bounty.getBounty(id);
      const issuerList = await bounty.getIssuers(id);
      setIssuers(issuerList);
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

  const getIssuerId = () => {
    const index = issuers.findIndex(issuer => issuer.toLowerCase() === walletAddress.toLowerCase());
    return index;
  }

  const callContribute = async (value) => {
    await bountyWeb3.contribute(
      walletAddress,
      bountyId,
      parseEther(String(amoutIn), {value: parseEther(value)})
    );
  }

  const contribute = async () => {
    if(bountyInfo.tokenVersion === 20) {
      await gtcWeb3.approve(address['bounty'], parseEther(String(amoutIn)));
      gtcWeb3.once("Approval", () => {
        callContribute('0');
      })
    } else if (bountyInfo.tokenVersion === 10) {
      await tokenWeb3(bountyInfo.token2).approve(address['bounty'], parseEther(String(amoutIn / 2)));
      tokenWeb3(bountyInfo.token2).once("Approval", async() => {
        callContribute(String(amoutIn / 2));
      })
    } else if (bountyInfo.tokenVersion === 11) {
      await gtcWeb3.approve(address['bounty'], parseEther(String(amoutIn / 2)));
      gtcWeb3.once("Approval", async() => {
        await tokenWeb3(bountyInfo.token2).approve(address['bounty'], parseEther(String(amoutIn / 2)));
        tokenWeb3(bountyInfo.token2).once("Approval", () => {
          callContribute('0');
        })
      })
    } else {
      callContribute(String(amoutIn));
    }
  }

  const drain = async () => {
    const issuerId = getIssuerId();
    await bountyWeb3.drainBounty(
      walletAddress,
      bountyId,
      issuerId,
      [parseEther(String(amountOut))]
    );
  }


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
      <Grid item xs={6}>
        {
          !!bountyInfo && (
            <Card
              sx={{
                p: '20px'
              }}
            >
              <Box sx={{ mb: '20px' }}>
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
      <Grid item xs={6}>
        <Card sx={{p: '20px'}}>
          <Box sx={{ mb: '20px' }}>
            <Typography variant='h5' component='h5'>
              Contribute & Drain
            </Typography>
          </Box>
          <Box>
            <TextField value={amoutIn} onChange={e => setAmountIn(e.target.value)} label="Amount"  fullWidth/>
          </Box>
          <Box sx={{my: '10px'}}>
            <Button variant="contained" onClick={contribute} fullWidth>Contribute</Button>
          </Box>
          <Box>
            <TextField value={amountOut} onChange={e => setAmountOut(e.target.value)} label="Amount"  fullWidth/>
          </Box>
          <Box sx={{my: '10px'}}>
            <Button variant="contained" onClick={drain} fullWidth>Drain</Button>
          </Box>
        </Card>
      </Grid>
    </Grid>
  )
}


export default ContributeAndDrain;