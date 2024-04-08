import React, {Fragment} from "react";
import './App.css';

import TrainerView from "./components/TrainerView"
function App() {
  return (
    <Fragment>
    <div className="container bg-dark text-white">
      <TrainerView/>
      <br></br>
    </div>
    </Fragment>
  );
}

export default App;
