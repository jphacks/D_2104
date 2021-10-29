import { BrowserRouter, Route, Switch } from "react-router-dom";
import './App.css';
import './pages/stylesheet.css';
import './pages/ResultPageStyle.css';

import Result from './pages/result.jsx';
import Serch from './pages/serch';
import Setting from './pages/setting';
import Tab from './pages/tab'


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
