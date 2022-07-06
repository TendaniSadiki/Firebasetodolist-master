import { useEffect, useState } from "react";
import {CgClose} from "react-icons/cg";
import {CgPen} from "react-icons/cg";
import {CgMathPlus} from "react-icons/cg";
import {CgCheck} from "react-icons/cg";
import "./home.css";


import { auth, db } from "../../firebase-config";

import { uid } from "uid";
import { set, ref, onValue, remove, update } from "firebase/database";


export default function Home(){ 

    const [todo, setTodo] = useState("");
    const [todos, setTodos] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [tempUidd, setTempUidd] = useState("");
    const [buttonText, setButtonText] = useState("");
    const [selectedIndex, setSelectedIndex] =useState(null);
    const [startDate, setStartDate] = useState("");
const [expireDate, setExDate] = useState("");
    useEffect(() => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          // read
          onValue(ref(db, `/${auth.currentUser.uid}`), (snapshot) => {
            setTodos([]);
            const data = snapshot.val();
            if (data !== null) {
              Object.values(data).map((todo) => {
                setTodos((oldArray) => [...oldArray, todo]);
              });
            }
          });
        } else if (!user) {
            window.location="/Login";
        }
      });
    }, []);
    
  
    // add
    const writeToDatabase = () => {
      const uidd = uid();
      set(ref(db, `/${auth.currentUser.uid}/${uidd}`), {
        todo: todo,
        uidd: uidd
      });
  
      setTodo("");
    };
  
    // update
    const handleUpdate = (todo) => {
      setIsEdit(true);
      setTodo(todo.todo);
      setTempUidd(todo.uidd);
    };
  
    const handleEditConfirm = () => {
      update(ref(db, `/${auth.currentUser.uid}/${tempUidd}`), {
        todo: todo,
        tempUidd: tempUidd
      });
  
      setTodo("");
      setIsEdit(false);
    };
  
    // delete
    const handleDelete = (uid) => {
      remove(ref(db, `/${auth.currentUser.uid}/${uid}`));
    };

return(
    <div className="page">
    <br></br>
    <br></br>
    <br></br>
        <h1>
        To Do List
        </h1>
        <div id="todoContent">
            <br></br>
            <ul>
            <h3>My To Do List</h3>
                <div>
        <div>
            <input className="todo" type="text" placeholder="Enter inputs"
            value={todo}
            onChange={(text) => {
              setTodo(text.target.value);
            }}
            ></input>
            <button  value={todo}
        onChange={(e) => setTodo(e.target.value)}>Add To List</button>
            <br></br>
            <div className="dateWrapper">
            <div className="datesContent">
            <label>Start date</label>
            <input type="date" 
            min="2022-07-06"
            id="date"
            value={startDate}
            onChange={(text) => {
              setStartDate(text.target.value);
            }}
            >
            </input>
            </div>
            <br></br>
            <div className="datesContent">
            <label>Expiring date</label>
            <input type="date"  
            id="date"
            value={expireDate}
            onChange={(text) => {
              setExDate(text.target.value);
            }}
            >
            </input>
            </div>
            </div>
        </div>
  {todos.length > 0 ? ( 
  < div>
      {todos.map((todo) => (
        <div className="todo">
          <h1>{todo.todo}</h1>
          <CgPen
            fontSize="large"
            onClick={() => handleUpdate(todo)}
            className="edit-button"
          />
          <CgClose
            fontSize="large"
            onClick={() => handleDelete(todo.uidd)}
            className="delete-button"
          />
        </div>
      ))}

      {isEdit ? (
        <div>
        <CgCheck onClick={handleEditConfirm} className="add-confirm-icon"/>
        </div>
      ) : (
        <div>
          <CgMathPlus onClick={writeToDatabase} className="add-confirm-icon" />
        </div>
      )}
      </div>
  ): <div className="emptyContent"><h1>Todo list is empty</h1></div>}                        
                    
               
                </div>
               
                
            </ul>
            
        </div>
    </div>
    );
}


