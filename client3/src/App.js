import React, {Fragment} from "react";
import './App.css';
import MemberView from "./components/MemberView";
import SpotifyTopTracks from "../../client3/src/components/SpotifyTracks.js";
function App() {
  return (
    <Fragment>
    <div className="container bg-dark text-white">
      <MemberView/>
    </div>
    <SpotifyTopTracks />
    </Fragment>
  );
}

export default App;
