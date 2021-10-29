import { BrowserRouter, Route, Switch } from "react-router-dom";
import './App.css';
import './pages/stylesheet.css';
import './pages/ResultPageStyle.css';
import { Grid } from "@mui/material";

import Result from './pages/result.jsx';
import Serch from './pages/serch';
import Setting from './pages/setting';
import Tab from './components/tab'


const App = () => {
  return (
    <div>
      <div className="top-bar"></div>

      <BrowserRouter>
        <Grid container>
          <Grid style={{height: "100vh"}} item sm={2}>
            <Tab></Tab>
          </Grid>
          <Grid item sm={10}>
            <Switch>
                <Route exact path="/" component={Setting} />
                <Route exact path="/serch" component={Serch} />
                <Route exact path="/result" component={Result} />
              </Switch>
          </Grid>
        </Grid>
      </BrowserRouter>
      
    </div>



  );
}

export default App;
