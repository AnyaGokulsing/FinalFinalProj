import React, {Fragment} from "react";
import './App.css';
import AdminView from "./components/AdminView";
function App() {
  return (
    <Fragment>
    <div className="container bg-dark text-white">
      <AdminView/>
    </div>
    </Fragment>
  );
}

export default App;
