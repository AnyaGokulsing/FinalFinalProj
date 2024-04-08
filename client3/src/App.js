import React, {Fragment} from "react";
import './App.css';
import MemberView from "./components/MemberView";
function App() {
  return (
    <Fragment>
    <div className="container bg-dark text-white">
      <MemberView/>
    </div>
    </Fragment>
  );
}

export default App;
