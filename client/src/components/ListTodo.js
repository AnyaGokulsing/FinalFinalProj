import React, {Fragment, useEffect, useState} from "react";
//import the edit button to send the sql query to edit an entry
import EditTodo from "./EditTodo";
const ListTodo = () => {
    //state setup
    const [todos,setTodos] = useState([]);
    //delete function for delete button
    const deleteTodo = async(id) => {
        try {
            //make delete req to RESTful API
            const deleteTodo= await fetch(`http://localhost:5000/todos/${id}`,
            {
                method: "DELETE"
            });
            console.log("Deleted "+ id);
            setTodos(todos.filter(todo => todo.todoid !== id));
        }catch (err){
            console.log(err.message);
        }
    };

    //getting db data for table
    const getTodos = async() => {
        try {
            //get the page
            const response = await fetch("http://localhost:5000/todos")
            const data = await response.json();
            //get the db data
            console.log(data);
            setTodos(data);
        }catch (err){
            console.error(err.message);
        }
    };

    useEffect(() => {
        getTodos();
    }, []);
    
    return (<Fragment>
        <h1>List Todos</h1>
        <div class="container mt-5">
        <table class="table table-dark table-hover">
            <thead>
            <tr>
                <th>Description</th>
                <th>Edit</th>
                <th>Delete</th>
            </tr>
            </thead>
            <tbody>
                {todos.map(todo => (
                    <tr key={todo.todoid}>
                        <td>{todo.descrip}</td>
                        <td><EditTodo todo={todo}/></td>
                        <td><button className="btn btn-danger" onClick={() => deleteTodo(todo.todoid)}>Delete</button></td>
                    </tr>
                ))}
            </tbody>
        </table>
        </div>
        </Fragment>);
};
export default ListTodo;