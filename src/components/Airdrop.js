import { Box, Grid, Card, Typography, TextField, Button } from '@mui/material';
import React, { useState } from 'react';

const Airdrop = () => {
  const [newAddress, setNewAddress] = useState('');

  const addToWhiteList = async () => {

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
            <Box sx={{mt: '20px'}}>
              <TextField value={newAddress} onChange={e => setNewAddress(e.target.value)} variant='outlined' label='Input address' fullWidth/>
            </Box>
            <Box sx={{mt: '20px'}}>
              <Button onClick={addToWhiteList} variant='contained' fullWidth>Add</Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Airdrop;