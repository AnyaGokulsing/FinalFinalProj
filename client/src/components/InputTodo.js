import React, { Fragment, useState } from "react";
const InputTodo = () => {
  //set the preliminary State of the form for the onCHnage
  const [descrip, setDescription] = useState("");
  //create the onSubmit event handler
  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const body = { descrip };
      const response = await fetch("http://localhost:5000/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      window.location = "/";
    } catch (err) {
      console.error(err.message);
    }
  };
  return (
    <Fragment>
      <h1 className="text-left mt-5">
        <span class="badge rounded-pill bg-info">'</span>&nbsp;User Profile
      </h1>
      <form className="d-flex mt-5" onSubmit={onSubmitForm}>
        <input
          type="text"
          className="form-control"
          value={descrip}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button className="btn btn-outline-secondary ">	&#x1F50E;&#xFE0E;</button>
      </form>
      <br></br>
      <ul class="nav nav-pills">
        <li class="nav-item">
          <a class="nav-link active" data-bs-toggle="pill" href="#home">
            Home
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" data-bs-toggle="pill" href="#menu1">
            Menu 1
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" data-bs-toggle="pill" href="#menu2">
            Menu 2
          </a>
        </li>
      </ul>
      <div class="tab-content">
        <div class="tab-pane container active" id="home">
          page 1 0
        </div>
        <div class="tab-pane container fade" id="menu1">
          page 2 0
        </div>
        <div class="tab-pane container fade" id="menu2">
          page 3 0
        </div>
      </div>
      <br></br>
    </Fragment>
  );
};

export default InputTodo;
