import React, { Fragment, useState } from "react";

const EditTodo = ({todo}) => {
  //allow page to access the db instances
  console.log(todo);
  //state setup for when the input field gets modified 
  //use the edit button to send the request
  const [descrip, setDescription] = useState(todo.descrip);
  //function to update the description
  const updateDescription = async(e) => {
    e.preventDefault();
    try{
        const body = {descrip};
        //need a PUT request since we are doing an update
        const response= await fetch(`http://localhost:5000/todos/${todo.todoid}`,{
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body : JSON.stringify(body)
        });
        console.log(response);
        //force refresh page to show latest entries in DB
        window.location="/";
    } catch (err){
        console.error(err.message);
    }
  };
  return (
    <Fragment>
<button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target={`#id${todo.todoid}`}>
  Edit
</button>
<div id={`id${todo.todoid}`} class="modal fade" role="dialog">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h4 class="modal-title text-black">Edit Entry&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</h4>
        <button type="button" class="close float-end" data-bs-dismiss="modal" onClick={() => setDescription(todo.descrip)}>          &times;</button>
      </div>
      <div class="modal-body">
        <input type="text text-black" class="form-control" value={descrip}
         onChange={ e => setDescription(e.target.value)}/>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-warning" data-bs-dismiss="modal" onClick={e => updateDescription(e)}>Edit</button>
        <button type="button" class="btn btn-danger" data-bs-dismiss="modal" onClick={() => setDescription(todo.descrip)}>Close</button>
      </div>
    </div>
  </div>
</div>

    </Fragment>
  );
};
export default EditTodo;
