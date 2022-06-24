import { Box } from '@mui/system';
import React from 'react';
import i18n from '../../i18n';

const Header = () => {
  const changeLanguageHandler = (e) => {
    const languageValue = e.target.value;
    i18n.changeLanguage(languageValue);
  }
  return (
    <Box
      sx={{
        display: 'flex',
        px: '40px',
        py: '20px'
      }}
    >
      <Box>
        This header
      </Box>
      <Box sx={{flexGrow: 1}}></Box>
      <select onChange={changeLanguageHandler}>
        <option value="en">English</option>
        <option value="ch">Chinese</option>
      </select>
    </Box>
  )
}

export default Header;