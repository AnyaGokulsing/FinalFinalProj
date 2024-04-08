import React, {Fragment} from "react";
import './App.css';

//page comps
import InputTodo from "./components/InputTodo";
import ListTodo from "./components/ListTodo";
//testing
import DateTimePicker from "./components/DateTimePicker";
import Bookings from "./components/Bookings";

function App() {
  return (
    <Fragment>
    <div className="container bg-dark text-white">
      <InputTodo/>
      <ListTodo/> 
      <Bookings/>   
      <DateTimePicker/>
      
      <br></br>
    </div>
    </Fragment>
  );
}

export default App;
