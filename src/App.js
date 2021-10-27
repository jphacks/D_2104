import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Link } from "react-router-dom";

import logo from './logo.svg';
import './App.css';
import './pages/stylesheet.css';

import Result from './pages/result.jsx';
import Serch from './pages/serch';
import Setting from './pages/setting';

function App() {
  return (
    <div>
      <div className="top-bar"></div>
      <BrowserRouter>

      <Switch>
        <Route exact path="/" component={Setting} />
        <Route exact path="/serch" component={Serch} />
        <Route exact path="/result" component={Result} />

      </Switch>

      </BrowserRouter>
    </div>
    

    
  );
}

export default App;
