import { Box, Grid, Card, Typography, TextField, Button, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { formatEther, parseEther } from 'ethers/lib/utils';
import React, { useEffect, useState } from 'react';
import { airdrop, airdropWeb3 } from '../utils/ethers.util';
import moment from 'moment';


const emptyAirdrop = {
  address: '',
  amount: '0',
  numOfVest: 0,
}

const Airdrop = ({ walletAddress }) => {
  const [newAddress, setNewAddress] = useState('');
  const [airdropList, setAirdropList] = useState([
    emptyAirdrop
  ]);
  const [amount, setAmount] = useState('0');
  const [userLocks, setUserLocks] = useState([]);
  const [indexList, setIndexList] = useState([]);
  const [unlockAmount, setUnlockAmount] = useState('0');

  const getDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return moment(date).format('MMMM DD, YYYY');
  }

  useEffect(() => {
    async function getLocks() {
      const locksIndexes = await airdrop.getUserLocks(walletAddress);
      let indexes = [];
      locksIndexes.map(index => {
        indexes.push(index.toNumber());
      });
      setIndexList(locksIndexes);
      let locks = [];
      for (let i = 0; i < indexes.length; i++) {
        const lock = await airdrop.tokenLocks(indexes[i]);
        locks.push({
          lockDate: getDate(lock.lockDate),
          amount: formatEther(lock.amount),
          unlockDate: getDate(lock.unlockDate)
        });
      }
      setUserLocks(locks);
    }
    if (!!walletAddress) {
      getLocks();
    }
  }, [walletAddress])

  const buyGit = async () => {
    const price = await airdrop.price();
    await airdropWeb3.purchaseTokens(parseEther(amount), { value: amount * Number(formatEther(price)) });
  }

  const removeAirdrop = (index) => {
    if (airdropList.length > 1) {
      let array = [...airdropList];
      array.splice(index, 1);
      setAirdropList(array);
    }
  }

  const unlockToken = async (index) => {
    const tx = await airdropWeb3.unlockToken(index, indexList[index], parseEther(unlockAmount));
    await tx.wait();
    window.alert("unlocked");
  }

  const dropTokens = async () => {
    let addresses = [];
    let amounts = [];
    let numsOfbest = [];
    airdropList.map(airdrop => {
      addresses.push(airdrop.address);
      amounts.push(parseEther(String(airdrop.amount)));
      numsOfbest.push(airdrop.numOfVest);
    });
    const tx = await airdropWeb3.dropTokens(
      addresses,
      amounts,
      numsOfbest
    );
    await tx.wait();
    window.alert("You get Tokens from airdrop.");
  }

  const airdropAddressHandler = (index, e) => {
    let array = [...airdropList];
    array[index].address = e.target.value;
    setAirdropList(array);
  }

  const amountHandler = (index, e) => {
    let array = [...airdropList];
    array[index].amount = e.target.value;
    setAirdropList(array);
  }

  const numOfVestHandler = (index, e) => {
    let array = [...airdropList];
    array[index].numOfVest = e.target.value;
    setAirdropList(array);
  }

  const addToWhiteList = async () => {
    const tx = await airdropWeb3.addWhitelist(newAddress);
    await tx.wait();
    window.alert("Your address is registered.");
  }
  return (
    <Box
      sx={{
        p: '20px'
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Card
            sx={{
              p: '30px'
            }}
            variant='outlined'
          >
            <Box>
              <Typography variant="h6" component="h6">
                Add User address to airdrop
              </Typography>
            </Box>
            <Box sx={{ mt: '20px' }}>
              <TextField value={newAddress} onChange={e => setNewAddress(e.target.value)} variant='outlined' label='Input address' fullWidth />
            </Box>
            <Box sx={{ mt: '20px' }}>
              <Button onClick={addToWhiteList} variant='contained' fullWidth>Add</Button>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card
            sx={{
              p: '30px'
            }}
            variant='outlined'
          >
            <Box
              sx={{
                display: 'flex'
              }}
            >
              <Typography variant='h6' component="h6">
                Airdrop
              </Typography>
              <Box sx={{ flexGrow: 1 }}></Box>
              <Box>
                <Button onClick={dropTokens} variant='contained'>airdrop</Button>
              </Box>
            </Box>
            <Box>
              {
                airdropList.map((airdrop, i) => (
                  <Grid sx={{ my: '10px' }} key={i} container spacing={2}>
                    <Grid item xs={4}>
                      <TextField label="address" value={airdrop.address} onChange={e => airdropAddressHandler(i, e)} fullWidth />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField label="amount" value={airdrop.amount} onChange={e => amountHandler(i, e)} fullWidth />
                    </Grid>
                    <Grid item xs={3}>
                      <TextField label="Num Of Vest" value={airdrop.numOfVest} onChange={e => numOfVestHandler(i, e)} fullWidth />
                    </Grid>
                    <Grid sx={{ p: '10px' }} item xs={1}>
                      <IconButton onClick={() => removeAirdrop(i)} aria-label="delete">
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                ))
              }
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mt: '30px'
              }}
            >
              <Button onClick={() => setAirdropList([...airdropList, { ...emptyAirdrop }])} fullWidth variant='contained'>add</Button>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card
            sx={{
              p: '30px'
            }}
          >
            <Box>
              <Typography variant='h6' component="h6">
                Buy GitCoin
              </Typography>
            </Box>
            <Box sx={{ mt: '20px' }}>
              <TextField value={amount} onChange={e => setAmount(e.target.value)} variant='outlined' label='Input Amount' fullWidth />
            </Box>
            <Box sx={{ mt: '20px' }}>
              <Button onClick={buyGit} variant='contained' fullWidth>buy</Button>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Box>
            <TextField value={unlockAmount} onChange={e => setUnlockAmount(e.target.value)} label="Unlock Amount" fullWidth/>
          </Box>
          {
            userLocks.map((lock, i) => (
              <Card sx={{ p: '20px', my: '10px' }} key={i}>
                <Grid container spacing={2}>
                  <Grid item xs={2}>
                    Lock Date
                  </Grid>
                  <Grid item xs={2}>
                    {lock.lockDate}
                  </Grid>
                  <Grid item xs={2}>
                    Unlock Date
                  </Grid>
                  <Grid item xs={2}>
                    {lock.unlockDate}
                  </Grid>
                  <Grid item xs={2}>
                    Amount
                  </Grid>
                  <Grid item xs={2}>
                    {lock.amount}
                  </Grid>
                  {
                    (new Date(lock.unlockDate) <= new Date()) && (
                      <Grid item xs={12}>
                        <Button onClick={() => unlockToken(i)} fullWidth variant='contained'>Unlock</Button>
                      </Grid>
                    )
                  }
                </Grid>
              </Card>
            ))
          }
        </Grid>
      </Grid>
    </Box>
  );
}

export default Airdrop;