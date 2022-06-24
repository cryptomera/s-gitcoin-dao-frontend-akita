import { Box, Grid, Card, Typography, TextField, Button } from '@mui/material';
import React from 'react';

const Airdrop = () => {
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
              <TextField variant='outlined' label='Input address' fullWidth/>
            </Box>
            <Box sx={{mt: '20px'}}>
              <Button variant='contained' fullWidth>Add</Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Airdrop;