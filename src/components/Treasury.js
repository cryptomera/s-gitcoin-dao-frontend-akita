import { Box, Button, Card, Grid, TextField, Typography } from '@mui/material';
import { formatEther, parseEther } from 'ethers/lib/utils';
import React, { useEffect, useState } from 'react';
import { address, gtc, treasury, treasuryWeb3 } from '../utils/ethers.util';
import moment from 'moment';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

const Treasury = ({ walletAddress }) => {
  const [recipient, setRecipient] = useState('');
  const [treasuryBalance, setTreasuryBalance] = useState('');
  const [beginDate, setBeginDate] = useState();
  const [cliffDate, setCliffDate] = useState();
  const [endDate, setEndDate] = useState();
  const [vestingAmount, setVestingAmount] = useState();
  const [amountVest, setAmountVest] = useState('0');
  const [newBegin, setNewBegin] = useState(new Date());
  const [newEnd, setNewEnd] = useState(new Date());

  const setAmountToVest = async () => {
    const tx = await treasuryWeb3.setVestingAmount(parseEther(amountVest));
    await tx.wait();
    window.alert("Vesting amount is changed.");
  }

  const setRecipientAddress = async () => {
    const tx = await treasuryWeb3.setRecipient(recipient);
    await tx.wait();
    window.alert("Recipient address is setted");
  }

  const claim = async () => {
    const tx = await treasuryWeb3.claim();
    await tx.wait();
    window.alert("Claimed");
  }

  const getDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return moment(date).format('MMMM DD, YYYY');
  }
  // get informations from treasury
  useEffect(() => {
    async function getInfos() {
      const balance = await gtc.balanceOf(address['treasury']);
      setTreasuryBalance(formatEther(balance));
      const vAmount = await treasury.vestingAmount();
      setVestingAmount(formatEther(vAmount));
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
    <Box>
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
                {treasuryBalance}
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
                Vesting Amount
              </Grid>
              <Grid item xs={8}>
                {vestingAmount}
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
                {beginDate}
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
                {endDate}
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
                {cliffDate}
              </Grid>
            </Grid>
          </Box>
          <Box
            sx={{ my: '10px' }}
          >
            <TextField value={recipient} onChange={e => setRecipient(e.target.value)} label="Input recipient address" fullWidth />
          </Box>
          <Box>
            <Button onClick={setRecipientAddress} fullWidth variant='contained'>set</Button>
          </Box>
          <Box
            sx={{
              my: '10px'
            }}
          >
            <Button onClick={claim} fullWidth variant='contained'>claim</Button>
          </Box>
        </Card>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          my: '20px'
        }}
      >
        <Card
          sx={{
            width: '50%',
            p: '30px',
          }}
        >
          <Box
            sx={{
              my: '10px'
            }}
          >
            <TextField value={amountVest} onChange={e=>setAmountVest(e.target.value)} label="Vesting Amount" fullWidth/>
          </Box>
          <Box
            sx={{
              my: '10px'
            }}
          >
            <Button onClick={setAmountToVest} fullWidth variant='contained'>set</Button>
          </Box>
          <Box
            sx={{
              my: '10px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Box sx={{mx: '10px'}}>from</Box>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
                label="Begin Date"
                value={newBegin}
                onChange={(newValue) => {
                  setNewBegin(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
            <Box sx={{mx: '10px'}}>to</Box>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
                label="End Date"
                value={newEnd}
                onChange={(newValue) => {
                  setNewEnd(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Box>
          <Box sx={{my: '10px'}}>
            <Button fullWidth variant='contained'>set</Button>
          </Box>
        </Card>
      </Box>
    </Box>
  );
}

export default Treasury;