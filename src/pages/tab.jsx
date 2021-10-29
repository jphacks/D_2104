import { React, useState } from 'react';
import useReactRouter from 'use-react-router';

import './stylesheet.css'

import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import { Box, ThemeProvider, createTheme } from '@mui/system';

const theme = createTheme({
  palette: {
    background: {
      paper: '#fff',
    },
    text: {
      primary: '#173A5E',
      secondary: '#46505A',
    },
    action: {
      active: '#001E3C',
    },
    success: {
      dark: '#009688',
    },
  },
});


function TabPanel(props) {
  const { children, value, index, ...other } = props;
  
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

export default function VerticalTabs(props) {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const { history } = useReactRouter();
  const handleClick = (pathNum) => {
    const dict = [ "/", "serch"];
    history.push({pathname:`${dict[pathNum]}`});
    console.log('クリックされたよ！')
    console.log(history.location.pathname);
  }
  // sx={{ flexGrow: 1, bgcolor: '#292929', display: 'flex', height: '100%' }}
  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#292929', display: 'flex', height: '100%' ,bgcolor: 'primary.main'}}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        onClick={() => {handleClick(value)}}
        aria-label="機能選択バー"
        sx={{ borderRight: 1, borderColor: 'divider' , color:'white'}}
        textcolor="#FFFFFF"

        TabIndicatorProps={{
          style: {
            backgroundColor: '#5500bb',
            color: "#FFFFFF"
          }}}
      >
        <Tab label="設定" {...a11yProps(0)} />
        <Tab label="検索" {...a11yProps(1)} />
      </Tabs>
      {props.children}
    </Box>
  );
}
