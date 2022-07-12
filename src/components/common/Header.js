import { Button } from '@mui/material';
import { Box } from '@mui/system';
import { Typography } from '@mui/material';
import React from 'react';
import i18n from '../../i18n';
import { Link } from 'react-router-dom';

const Header = ({ walletAddress, connectWallet }) => {
  // const changeLanguageHandler = (e) => {
  //   const languageValue = e.target.value;
  //   i18n.changeLanguage(languageValue);
  // }
  const optimizeAddress = (address) => {
    return `${walletAddress.substring(0, 5)}..${walletAddress.substring(walletAddress.length - 5)}`
  }
  return (
    <Box
      sx={{
        display: 'flex',
        px: '40px',
        py: '20px'
      }}
    >
      <Typography variant="h6" component="h6">
        Git Coin
      </Typography>
      <Box sx={{ flexGrow: 1 }}></Box>
      {/* <select onChange={changeLanguageHandler}>
        <option value="en">English</option>
        <option value="ch">Chinese</option>
      </select> */}
      <Box>
        <Button>
          <Link style={{color: 'white', textDecoration: 'none'}} to="/airdrop">Airdrop</Link>
        </Button>
        <Button>
          <Link style={{color: 'white', textDecoration: 'none'}} to="/treasury">Treasury</Link>
        </Button>
        <Button>
          <Link style={{color: 'white', textDecoration: 'none'}} to="/governor">Governor</Link>
        </Button>
      </Box>
      <Box sx={{ flexGrow: 1 }}></Box>
      <Button onClick={connectWallet} sx={{ width: '200px' }} variant='contained'>
        {
          !walletAddress ? (
            <div>connect wallet</div>
          ) : (
            <div>{optimizeAddress(walletAddress)}</div>
          )
        }
      </Button>
    </Box>
  )
}

export default Header;