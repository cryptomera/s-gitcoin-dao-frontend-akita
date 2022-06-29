import { Grid, TextField, Typography, Card, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import React, { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
const Bounty = () => {
  const [deadline, setDeadline] = useState('');
  return (
    <Grid container spacing={2}>
      <Grid item xs={4}>
        <Card
          sx={{
            p: '30px'
          }}
        >
          <Box
            sx={{ mb: '30px' }}
          >
            <Typography variant='h6' component='h6'>
              Issue Bounty
            </Typography>
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
            sx={{mt: '10px'}}
          >
            <FormControl fullWidth>
              <InputLabel>Mode</InputLabel>
              <Select>
                <MenuItem></MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box
            sx={{
              mt: '10px'
            }}
          >
            <TextField label="token address" fullWidth />
          </Box>
          <Box
            sx={{
              mt: '10px'
            }}
          >
            <TextField label="token address" fullWidth />
          </Box>
          <Box>

          </Box>
        </Card>
      </Grid>
    </Grid >
  );
}

export default Bounty;