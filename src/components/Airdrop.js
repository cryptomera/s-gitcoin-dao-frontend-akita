import { Box, Grid, Card, Typography, TextField, Button, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { formatEther, parseEther } from 'ethers/lib/utils';
import React, { useEffect, useState } from 'react';
import { airdrop, airdropWeb3, signer } from '../utils/ethers.util';
import moment from 'moment';
import { airdropService, uploadSerivce } from '../services/api.service';
import { BigNumber, ethers } from 'ethers';


const emptyAirdrop = {
  address: '',
  amount: '0',
  numOfVest: 1,
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
  const [price, setPrice] = useState('');
  const [excelPath, setExcelPath] = useState();

  const excelRef = React.createRef();

  const getDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return moment(date).format('MMMM DD, YYYY');
  }

  const bulkAirdrop = async () => {
    const nonce = Math.ceil(Math.random() * 1000000);
    const hash = await airdrop.getMessageHash(
      walletAddress,
      nonce
    );
    const sig = await signer.signMessage(ethers.utils.arrayify(hash));
    await airdropService.airdrop({nonce: nonce, signature: sig});
  }

  const saveUsers = async () => {
    const formData = new FormData();
    formData.append('file', excelPath);
    const response = await uploadSerivce.upload(formData);
    const fileName = response.data;
    const res = await airdropService.createUser({filename: fileName});
    console.log(res.data);
  }

  const handleExcleUpload = async (file) => {
    setExcelPath(file);
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

  const setGitCoinPrice = async () => {
    const tx = await airdropWeb3.setPrice(parseEther(price));
    await tx.wait();
    window.alert("Price is changend.");
  }

  const buyGit = async () => {
    const price = await airdrop.price();
    const value = price.toNumber() * Number(amount);
    await airdropWeb3.purchaseTokens(parseEther(amount), { value: value });
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
        {/* <Grid item xs={6}>
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
        </Grid> */}
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
            <TextField value={unlockAmount} onChange={e => setUnlockAmount(e.target.value)} label="Unlock Amount" fullWidth />
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
        <Grid item xs={6}>
          <Card
            sx={{
              p: '30px'
            }}
          >
            <Box>
              <Typography variant='h6' component='h6'>
                Set GitCoin Price
              </Typography>
            </Box>
            <Box
              sx={{
                my: '20px'
              }}
            >
              <TextField value={price} onChange={e => setPrice(e.target.value)} label="price" fullWidth />
            </Box>
            <Box>
              <Button onClick={setGitCoinPrice} fullWidth variant='contained'>set</Button>
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
              <input
                type="file"
                ref={excelRef}
                onChange={() =>
                  handleExcleUpload(excelRef.current.files[0])
                }
                accept=".xlsx"
              />
            </Box>
            <Box
              sx={{
                my: '10px'
              }}
            >
              <Button onClick={saveUsers} variant='contained' fullWidth>save addresses</Button>
            </Box>
            <Box
              sx={{
                my: '10px'
              }}
            >
              <Button onClick={bulkAirdrop} variant='contained' fullWidth>airdrop</Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Airdrop;