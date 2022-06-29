import { Grid, TextField, Typography, Card, Box, FormControl, InputLabel, Select, MenuItem, Button, IconButton } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import DeleteIcon from '@mui/icons-material/Delete';
import { bounty, bountyWeb3 } from '../utils/ethers.util';
import { address } from '../utils/ethers.util';
const IssueBounty = ({ walletAddress }) => {
  const [deadline, setDeadline] = useState('');
  const [tokenVersion, setTokenVersion] = useState(0);
  const [issuers, setIssures] = useState(['']);
  const [approvers, setApprovers] = useState(['']);
  const [token, setToken] = useState('');
  const [bounties, setBounties] = useState('');

  useEffect(() => {
    async function getBounties() {
      const numBounties = await bounty.numBounties();
      for(let i = 0; i < numBounties.toNumber(); i++) {
        const aBounty = await bounty.bounties(i);
        console.log(aBounty);
      }
    }
    getBounties();
  }, []);

  const addNewIssuer = () => {
    setIssures([...issuers, '']);
  }

  const addNewApprover = () => {
    setApprovers([...approvers, '']);
  }

  const removeIssuer = (index) => {
    if (issuers.length > 1) {
      let array = [...issuers];
      array.splice(index, 1);
      setIssures(array);
    }
  }

  const removeApprover = (index) => {
    if (approvers.length > 1) {
      let array = [...approvers];
      array.splice(index, 1);
      setApprovers(array);
    }
  }


  const issuerHandler = (e, i) => {
    let array = [...issuers];
    array[i] = e.target.value;
    setIssures(array);
  }

  const approverHandler = (e, i) => {
    let array = [...approvers];
    array[i] = e.target.value;
    setApprovers(array);
  }

  const issueBounty = async () => {
    const deadBlock = new Date(deadline).getTime() / 1000;
    let token1, token2;
    if (tokenVersion === 0) {
      token1 = '';
      token2 = '';
    } else if (tokenVersion === 20) {
      token1 = address['gtc'];
      token2 = '';
    } else if (tokenVersion === 10) {
      token2 = token;
      token1 = '';
    } else {
      token1 = address['gtc'];
      token2 = token;
    }
    await bountyWeb3.issueBounty(
      walletAddress,
      issuers,
      approvers,
      deadBlock,
      token1,
      token2,
      tokenVersion
    );
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={3}>
      </Grid>
      <Grid item xs={6}>
        <Card
          sx={{
            p: '30px'
          }}
        >
          <Box
            sx={{
              mb: '30px',
              display: 'flex'
            }}
          >
            <Typography variant='h6' component='h6'>
              Issue Bounty
            </Typography>
            <Box sx={{ flexGrow: 1 }}></Box>
            <Button onClick={issueBounty} variant='contained'>Issue Bounty</Button>
          </Box>
          <Box>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
                label="Deadline"
                value={deadline}
                onChange={(newValue) => {
                  setDeadline(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Box>
          <Box
            sx={{ mt: '10px' }}
          >
            <FormControl fullWidth>
              <InputLabel>Mode</InputLabel>
              <Select
                value={tokenVersion}
                onChange={e => setTokenVersion(e.target.value)}
              >
                <MenuItem value={0}>BNB</MenuItem>
                <MenuItem value={20}>TOKEN</MenuItem>
                <MenuItem value={10}>BNB & TOKEN</MenuItem>
                <MenuItem value={11}>AKITA & TOKEN</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box
            sx={{
              mt: '10px'
            }}
          >
            {
              tokenVersion !== 0 && (
                <TextField value={token} onChange={e => setToken(e.target.value)} label="token address" fullWidth />
              )
            }
          </Box>
          {/* issuers */}
          <Box
            sx={{ my: '10px' }}
          >
            {
              issuers.map((issuer, i) => (
                <Grid sx={{ mb: '10px' }} key={i} container spacing={2}>
                  <Grid item xs={10}>
                    <TextField onChange={e => issuerHandler(e, i)} label="Issure address" value={issuer} fullWidth />
                  </Grid>
                  <Grid item xs={2}>
                    <IconButton onClick={() => removeIssuer(i)}>
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ))
            }
          </Box>
          <Box>
            <Button fullWidth variant='contained' onClick={addNewIssuer}>add</Button>
          </Box>
          {/* approvers */}
          <Box
            sx={{ my: '10px' }}
          >
            {
              approvers.map((approver, i) => (
                <Grid sx={{ mb: '10px' }} key={i} container spacing={2}>
                  <Grid item xs={10}>
                    <TextField onChange={e => approverHandler(e, i)} label="Approver address" value={approver} fullWidth />
                  </Grid>
                  <Grid item xs={2}>
                    <IconButton onClick={() => removeApprover(i)}>
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ))
            }
          </Box>
          <Box>
            <Button fullWidth variant='contained' onClick={addNewApprover}>add</Button>
          </Box>
        </Card>
      </Grid>
    </Grid >
  );
}

export default IssueBounty;