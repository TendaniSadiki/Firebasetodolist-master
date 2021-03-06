import { useEffect, useState } from "react";
import {CgClose} from "react-icons/cg";
import {CgPen} from "react-icons/cg";
import {CgCheck} from "react-icons/cg";
import "./home.css";

import { auth, db } from "../../firebase-config";
import { uid } from "uid";
import { set, ref, onValue, remove, update } from "firebase/database";
import moment from "moment";


export default function Home(){ 

    const [todo, setTodo] = useState("");
    const [todos, setTodos] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [tempUidd, setTempUidd] = useState("");
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
        uidd: uidd,
        startDate: startDate,
        expireDate: expireDate
      });
  
      setTodo("");
    };
  
    // update
    const handleUpdate = (todo) => {
      setIsEdit(true);
      setTodo(todo.todo);
      setTempUidd(todo.uidd);
      setStartDate(todo.startDate)
      setExDate(todo.expireDate)
      
    };
  
    const handleEditConfirm = () => {
      update(ref(db, `/${auth.currentUser.uid}/${tempUidd}`), {
        todo: todo,
        tempUidd: tempUidd,
        startDate: startDate,
        expireDate: expireDate

      });
  
      setTodo("");
      setIsEdit(false);
    };
  
    // delete
    const handleDelete = (uid) => {
      remove(ref(db, `/${auth.currentUser.uid}/${uid}`));
    };
var today = new Date();
let dd = today.getDate();
let mm = today.getMonth()+1; //January is 0 so need to add 1 to make it 1!
let yyyy = today.getFullYear();
if(dd<10){
  dd='0'+dd
} 
if(mm<10){
  mm='0'+mm
} 
today = yyyy+'-'+mm+'-'+dd;


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
         {isEdit ? (
        
        <CgCheck onClick={handleEditConfirm} className="add-confirm-icon"/> 
        
      ) : (
        
          <button  value={todo}
        onChange={(e) => setTodo(e.target.value)}
        onClick={writeToDatabase}>Add To List</button>
     
      )}
            <br></br>
            <div className="dateWrapper">
            <div className="datesContent">
            <label>Start date</label>
            <input type="date" 
            min={today}
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
  <div>
      {todos.map((todo) => (
        <div className="todo">
          <ul>
            <li>
              <div className="left">
                <span>Todo: {todo.todo}</span>
                <span>Start date: {todo.startDate}</span>
                <span>Expire date: {todo.expireDate}</span>
                <div className="indicators">
                  <span className={moment(todo.expireDate).isBefore(today) ? "redbar" : "greenbar" }> </span>
                </div>
              </div>
              <div className="right">
                <span>
          <CgPen
            fontSize="large"
            onClick={() => handleUpdate(todo)}
            className="edit-button"
          />
          </span>
          <span>
          <CgClose
            fontSize="large"
            onClick={() => handleDelete(todo.uidd)}
            className="delete-button"
          />
          </span>
          </div>
            </li>
          </ul>
         
        </div>
      ))}
 <hr></hr>
     
      </div>
  ): <div className="emptyContent"><h1>Todo list is empty</h1></div>}                        
                </div>
            </ul>
        </div>
    </div>
    );
}


