import React, {Fragment} from "react";
import './App.css';
import SpotifyTopTracks from "./components/SpotifyTracks";
import TrainerView from "./components/TrainerView"
function App() {
  return (
    <Fragment>
    <div className="container bg-dark text-white">
      <TrainerView/>
      <br></br>
      <SpotifyTopTracks />
    </div>
    </Fragment>
  );
}

export default App;
