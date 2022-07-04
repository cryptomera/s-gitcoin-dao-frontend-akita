import { Box, Button, Card, Grid, TextField, Typography } from '@mui/material';
import { formatEther } from 'ethers/lib/utils';
import React, { useEffect, useState } from 'react';
import { address, gtc, treasury } from '../utils/ethers.util';
import moment from 'moment';

const Treasury = ({walletAddress}) => {
  const [ recipient, setRecipient] = useState('');
  const [ treasuryBalance, setTreasuryBalance ] = useState('');
  const [beginDate, setBeginDate] = useState();
  const [cliffDate, setCliffDate] = useState();
  const [endDate, setEndDate] = useState(); 

  const getDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return moment(date).format('MMMM DD, YYYY');
  }
  // get informations from treasury
  useEffect(() => {
    async function getInfos () {
      const balance = await gtc.balanceOf(address['treasury']);
      setTreasuryBalance(formatEther(balance));
      const begin = await treasury.vestingBegin();
      setBeginDate(getDate(begin.toNumber()));
      const cliff = await treasury.vestingCliff();
      setCliffDate(getDate(cliff.toNumber()));
      const end = await treasury.vestingEnd();
      setEndDate(getDate(end.toNumber()));
    }
    getInfos();
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <Card
        sx={{
          width: '50%',
          p: '30px',
        }}
      >
        <Box>
          <Typography variant='h6' component='h6'>
            Set Recipient
          </Typography>
        </Box>
        <Box
          sx={{
            my: '10px'
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={4}>
              Treasury balance
            </Grid>
            <Grid item xs={8}>
              { treasuryBalance }
            </Grid>
          </Grid>
        </Box>
        <Box
          sx={{
            my: '10px'
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={4}>
              Begin Date
            </Grid>
            <Grid item xs={8}>
              { beginDate }
            </Grid>
          </Grid>
        </Box>
        <Box
          sx={{
            my: '10px'
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={4}>
              End Date
            </Grid>
            <Grid item xs={8}>
              { endDate }
            </Grid>
          </Grid>
        </Box>
        <Box
          sx={{
            my: '10px'
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={4}>
              Cliff Date
            </Grid>
            <Grid item xs={8}>
              { cliffDate }
            </Grid>
          </Grid>
        </Box>
        <Box
          sx={{my: '10px'}}
        >
          <TextField value={recipient} onChange={e => setRecipient(e.target.value)} label="Input recipient address" fullWidth/>
        </Box>
        <Box>
          <Button fullWidth variant='contained'>set</Button>
        </Box>
        <Box
          sx={{
            my: '10px'
          }}
        >
          <Button fullWidth variant='contained'>unlock</Button>
        </Box>
      </Card>
    </Box>
  );
}

export default Treasury;