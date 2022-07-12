import { Card, Grid, Box, Typography, TextField, Button, Select, FormControl, InputLabel, MenuItem } from '@mui/material';
import { ethers } from 'ethers';
import { formatEther } from 'ethers/lib/utils';
import React, { useEffect, useState } from 'react';
import { address, governor, governorWeb3, gtc, gtcWeb3, treasury } from '../utils/ethers.util';

const Governor = ({ walletAddress }) => {
  const [voteType, setVoteType] = useState(0);
  const [quorum, setQuorum] = useState();
  const [votePower, setVotePower] = useState();
  const [newQuorum, setNewQuorum] = useState(0);
  const [period, setPeriod] = useState();
  const [newPeriod, setNewPeriod] = useState(0);

  useEffect(() => {
    async function getInfos() {
      const quorumNumerator = await governor.quorumNumerator();
      setQuorum(quorumNumerator.toNumber());
      const votePeriod = await governor.votingPeriod();
      setPeriod(Math.ceil(votePeriod.toNumber() * 13.12 / 3600));
    }
    getInfos();
  }, []);

  useEffect(() => {
    async function getPower() {
      const balance = await gtc.balanceOf(walletAddress);
      const supply = await gtc.totalSupply();
      const power = Number(formatEther(balance)) / Number(formatEther(supply)) * 100;
      setVotePower(power / 4 * 100);
    }
    getPower();
  }, [walletAddress]);


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

  const executeQuorum = async () => {
    const callDatas = [];
    callDatas.push(
      governor.interface.encodeFunctionData("updateQuorumNumerator", [newQuorum])
    );
    const descriptionHash = ethers.utils.id("update quorum");
    const tx = await governorWeb3.execute(
      address['governor'],
      [0],
      callDatas,
      descriptionHash
    );
    await tx.wait();
    window.alert("executed");
  }

  const executePeriod = async () => {
    const votingPeriod = Math.ceil(13.2 * newPeriod);
    const callDatas = [];
    callDatas.push(
      governor.interface.encodeFunctionData("setVotingPeriod", [votingPeriod])
    );
    const descriptionHash = ethers.utils.id("update period");
    const tx = await governorWeb3.execute(
      address['governor'],
      [0],
      callDatas,
      descriptionHash
    );
    await tx.wait();
    window.alert("executed");
  }

  const voteClaim = async () => {
    await gtcWeb3.delegate(walletAddress);
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

  const voteQuorum = async () => {
    await gtcWeb3.delegate(walletAddress);
    const callDatas = [];
    callDatas.push(
      governor.interface.encodeFunctionData("updateQuorumNumerator", [newQuorum])
    );
    const descriptionHash = ethers.utils.id("update quorum");
    const proposalHash = await governor.hashProposal(
      [address['governor']],
      [0],
      callDatas,
      descriptionHash
    );
    const tx = await governorWeb3.castVote(proposalHash, voteType);
    await tx.wait();
    window.alert("voted");
  }

  const voteNewPeriod = async () => {
    const votingPeriod = Math.ceil(13.2 * newPeriod);
    await gtcWeb3.delegate(walletAddress);
    const callDatas = [];
    callDatas.push(
      governor.interface.encodeFunctionData("setVotingPeriod", [votingPeriod])
    );
    const descriptionHash = ethers.utils.id("update period");
    const proposalHash = await governor.hashProposal(
      [address['governor']],
      [0],
      callDatas,
      descriptionHash
    );
    const tx = await governorWeb3.castVote(proposalHash, voteType);
    await tx.wait();
    window.alert("Voted");
  }


  const proposeClaim = async () => {
    const callDatas = [];
    callDatas.push(
      treasury.interface.encodeFunctionData("claim", [])
    );
    const tx = await governorWeb3.propose([address['treasury']], [0], callDatas, "claim");
    await tx.wait();
    window.alert("Proposed");
  }

  const proposeQuorum = async () => {
    const callDatas = [];
    callDatas.push(
      governor.interface.encodeFunctionData("updateQuorumNumerator", [newQuorum])
    );
    const tx = await governorWeb3.propose([address['governor']], [0], callDatas, "update quorum");
    await tx.wait();
    window.alert("Proposed");
  }

  const proposePeriod = async () => {
    const votingPeriod = Math.ceil(13.2 * newPeriod);
    const callDatas = [];
    callDatas.push(
      governor.interface.encodeFunctionData("setVotingPeriod", [votingPeriod])
    );
    const tx = await governorWeb3.propose([address['governor']], [0], callDatas, "update period");
    await tx.wait();
    window.alert("Proposed");
  }

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Box>
            <Typography sx={{ m: '20px' }} variant='h6' component='h6'>
              Governor Settings
            </Typography>
            <Card
              sx={{
                p: '20px'
              }}
            >
              <Box sx={{ my: '10px' }}>
                {quorum && `The quorum of governor is ${quorum}% of the total supply.`}
              </Box>
              <Box sx={{ my: '10px' }}>
                {votePower && `Your voting power is ${votePower}%.`}
              </Box>
              <Box sx={{ my: '10px'}}>
                { period && `Vote period is ${period} hours`}
              </Box>
            </Card>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box
                sx={{
                  m: '20px'
                }}
              >
                <Typography variant='h6' component='h6'>
                  Proposals
                </Typography>
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
                      my: '10px',
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
                <Card
                  sx={{
                    my: '10px',
                    p: '20px'
                  }}
                >
                  <Box
                    sx={{
                      my: '10px'
                    }}
                  >
                    Set Quorum of Governor
                  </Box>
                  <Box
                    sx={{
                      my: '10px'
                    }}
                  >
                    <TextField label="Quorum" value={newQuorum} onChange={e => setNewQuorum(e.target.value)} fullWidth />
                  </Box>
                  <Box
                    sx={{
                      my: '10px',
                      display: 'flex',
                      justifyContent: 'right'
                    }}
                  >
                    <Button onClick={proposeQuorum} variant='contained' >propose</Button>
                  </Box>
                  <Box
                    sx={{
                      my: '10px',
                      display: 'flex',
                      justifyContent: 'right'
                    }}
                  >
                    <Button variant='contained' onClick={voteQuorum}>Vote</Button>
                  </Box>
                  <Box
                    sx={{
                      my: '10px',
                      display: 'flex',
                      justifyContent: 'right'
                    }}
                  >
                    <Button variant='contained' onClick={executeQuorum}>execute</Button>
                  </Box>
                </Card>
                <Card
                  sx={{
                    my: '10px',
                    p: '20px'
                  }}
                >
                  <Box
                    sx={{
                      my: '10px'
                    }}
                  >
                    Set Quorum of Governor
                  </Box>
                  <Box
                    sx={{
                      my: '10px'
                    }}
                  >
                    <TextField label="Input voting period as hour" value={newPeriod} onChange={e => setNewPeriod(e.target.value)} fullWidth />
                  </Box>
                  <Box
                    sx={{
                      my: '10px',
                      display: 'flex',
                      justifyContent: 'right'
                    }}
                  >
                    <Button onClick={proposePeriod} variant='contained' >propose</Button>
                  </Box>
                  <Box
                    sx={{
                      my: '10px',
                      display: 'flex',
                      justifyContent: 'right'
                    }}
                  >
                    <Button variant='contained' onClick={voteNewPeriod}>Vote</Button>
                  </Box>
                  <Box
                    sx={{
                      my: '10px',
                      display: 'flex',
                      justifyContent: 'right'
                    }}
                  >
                    <Button variant='contained' onClick={executePeriod}>execute</Button>
                  </Box>
                </Card>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

    </Box>
  );
}

export default Governor;