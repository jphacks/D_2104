import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Link } from "react-router-dom";

import logo from './logo.svg';
import './App.css';
import PCA from 'pca-js';

import Result from './pages/result.jsx';
import Serch from './pages/serch';
import Setting from './pages/setting';


// import addon from './Visualize_Sounds_Core_addon.node'

function App() {

  const { addon } = window.require("bindings")("Visualize_Sounds_Core_addon");
  console.log(addon)
  console.log(addon.RegisterSource)
  const r = addon.RegisterSource("", "", "");
  r.then((resp) => {
    const data = resp
    console.log(data)
  });

  // const data = [[40,50,60],[50,70,60],[80,70,90],[50,60,80]];
  // const vectors = PCA.getEigenVectors(data);

  // const adData = PCA.computeAdjustedData(data,vectors[0]);

  // console.log(adData);

  return (
    <div>
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
