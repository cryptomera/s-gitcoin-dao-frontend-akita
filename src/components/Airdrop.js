import { Box, Grid, Card, Typography, TextField, Button, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { formatEther, parseEther } from 'ethers/lib/utils';
import React, { useState } from 'react';
import { airdrop, airdropWeb3 } from '../utils/ethers.util';


const emptyAirdrop = {
  address: '',
  amount: '0'
}

const Airdrop = () => {
  const [newAddress, setNewAddress] = useState('');
  const [airdropList, setAirdropList] = useState([
    emptyAirdrop
  ]);
  const [amount, setAmount] = useState('0');

  const buyGit = async () => {
    const price = await airdrop.price();
    await airdropWeb3.purchaseTokens(parseEther(amount), {value: amount * Number(formatEther(price))});
  }

  const removeAirdrop = (index) => {
    if (airdropList.length > 1) {
      let array = [...airdropList];
      array.splice(index, 1);
      setAirdropList(array);
    }
  }

  const dropTokens = async () => {
    let addresses = [];
    let amounts = [];
    airdropList.map(airdrop => {
      addresses.push(airdrop.address);
      amounts.push(parseEther(String(airdrop.amount)));
    });
    await airdropWeb3.dropTokens(
      addresses,
      amounts
    );
  }

  const airdropAddressHandler = (index, e) => {
    let array = [...airdropList];
    airdropList[index].address = e.target.value;
    setAirdropList(array);
  }

  const amountHandler = (index, e) => {
    let array = [...airdropList];
    airdropList[index].amount = e.target.value;
    setAirdropList(array);
  }

  const addToWhiteList = async () => {
    await airdropWeb3.addWhitelist(newAddress);
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
                    <Grid item xs={5}>
                      <TextField label="address" value={airdrop.address} onChange={e => airdropAddressHandler(i, e)} fullWidth />
                    </Grid>
                    <Grid item xs={5}>
                      <TextField label="amount" value={airdrop.amount} onChange={e => amountHandler(i, e)} fullWidth />
                    </Grid>
                    <Grid sx={{ p: '10px' }} item xs={2}>
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
      </Grid>
    </Box>
  );
}

export default Airdrop;