import { Card, Grid, Box, Typography, TextField, Button, Select, FormControl, InputLabel, MenuItem } from '@mui/material';
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import { address, governor, governorWeb3, gtcWeb3, treasury } from '../utils/ethers.util';

const Governor = ({ walletAddress }) => {
  // const [ newAddress, setNewAddress] = useState('');
  const [voteType, setVoteType] = useState(0);

  // const proposeSetRecipient = async () => {
  //   const callDatas = [];
  //   callDatas.push(
  //     treasury.interface.encodeFunctionData("setRecipient", [newAddress])
  //   );
  //   const tx = await governorWeb3.propose([address['treasury']], [0], callDatas, "set recipient");
  //   await tx.wait();
  //   window.alert("Proposed");
  // }

  const execute = async () => {
    const callDatas = [];
    callDatas.push(
      treasury.interface.encodeFunctionData("claim", [])
    );
    const descriptionHash = ethers.utils.id("claim");
    const tx = await governorWeb3.execute(
      address['treasury'],
      [0],
      callDatas,
      descriptionHash
    );
    await tx.wait();
    window.alert("executed");
  }

  const voteClaim = async () => {
    const callDatas = [];
    callDatas.push(
      treasury.interface.encodeFunctionData("claim", [])
    );
    const descriptionHash = ethers.utils.id("claim");
    const proposalHash = await governor.hashProposal(
      [address['treasury']],
      [0],
      callDatas,
      descriptionHash
    );
    const tx = await governorWeb3.castVote(proposalHash, voteType);
    await tx.wait();
    window.alert("voted");
  }
  

  const proposeClaim = async () => {
    await gtcWeb3.delegate(walletAddress);
    const callDatas = [];
    callDatas.push(
      treasury.interface.encodeFunctionData("claim", [])
    );
    const tx = await governorWeb3.propose([address['treasury']], [0], callDatas, "claim");
    await tx.wait();
    window.alert("Proposed");
  }

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Box
            sx={{
              m: '20px'
            }}
          >
            <Typography variant='h6' component='h6'>
              Proposals
            </Typography>
          </Box>
          {/* <Box>
            <Card
              sx={{
                p: '20px'
              }}
            >
              <Box>
                Set Recipient Address
              </Box>
              <Box
                sx={{
                  my: '10px'
                }}
              >
                <TextField value={newAddress} onChange={e => setNewAddress(e.target.value)} label="recipient address" fullWidth />
              </Box>
              <Box>
                <Button onClick={proposeSetRecipient} variant='contained'>Propose</Button>
              </Box>
            </Card>
          </Box> */}
          <Box
            sx={{
              my: '10px'
            }}
          >
            <Card
              sx={{
                p: '20px'
              }}
            >
              <Box
                sx={{
                  my: '10px'
                }}
              >
                Claim Treasury
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'end'
                }}
              >
                <Button onClick={proposeClaim} variant='contained'>Propose</Button>
              </Box>
              <Box
                sx={{
                  my: '10px'
                }}
              >
                <FormControl fullWidth>
                  <InputLabel>Vote Type</InputLabel>
                  <Select value={voteType} onChange={e => setVoteType(e.target.value)}>
                    <MenuItem value={0}>Against</MenuItem>
                    <MenuItem value={1}>For</MenuItem>
                    <MenuItem value={2}>Abstain</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box
                sx={{
                  my:'10px',
                  display: 'flex',
                  justifyContent: 'end'
                }}
              >
                <Button onClick={voteClaim} variant='contained'>Vote</Button>
              </Box>
              <Box
                sx={{
                  my: '10px',
                  display: 'flex',
                  justifyContent: 'end'
                }}
              >
                <Button onClick={execute} variant='contained'>execute</Button>
              </Box>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Governor;