import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Link } from "react-router-dom";

import logo from './logo.svg';
import './App.css';
import './pages/stylesheet.css';

import Result from './pages/result.jsx';
import Serch from './pages/serch';
import Setting from './pages/setting';
import Tab from './pages/tab'

import ListItem from '@mui/material/ListItem';
import Box from '@mui/material/Box';
import { grid } from '@mui/system';


const App = () => {
  return (
    <div>
      <div className="top-bar"></div>
        <BrowserRouter>
        <Tab>
        <Switch>
          <Route exact path="/" component={Setting} />
          <Route exact path="/serch" component={Serch} />
          <Route exact path="/result" component={Result} />
        </Switch>
        </Tab>
        </BrowserRouter>
      
    </div>
    

    
  );
}

export default App;
