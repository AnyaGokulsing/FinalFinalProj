import React, {Fragment} from "react";
import './App.css';
import AdminView from "./components/AdminView";
import SpotifyTopTracks from "../../client4/src/components/SpotifyTracks";
function App() {
  return (
    <Fragment>
    <div className="container bg-dark text-white">
      <AdminView/>
      <br></br>
      <SpotifyTopTracks />
    </div>
    </Fragment>
  );
}

export default App;
