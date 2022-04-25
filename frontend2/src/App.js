import logo from './logo.svg';
import './App.css';
import {useState} from 'react';
import Axios from 'axios';

function App() {
  const [user,setuser]=useState("");
  const [pass, setpass] = useState("");
  const [isLogged, setisLogged]=useState(false);
  const url="http://localhost:5000/api/login";

   const onHandleSubmit=(e)=>{
   e.preventDefault();
    Axios.post(url,{username:user,password:pass}).then((response)=>{
     
     if(!response.data){
       setisLogged(false);
       console.log("user or password wrong");
     }else{
      console.log(response.data);
      setisLogged(true);
      localStorage.setItem("token", response.data.accessToken);
     }
    })
  }



  return (
    <div className="App">
      <header className="App-header">
       <form>
         <input 
          placeholder="Usuario"
          className='input'
          onChange={(e)=>setuser(e.target.value)}
          />
         <input 
          placeholder="Contraseña"
          className='input'
          onChange={(e)=>setpass(e.target.value)}
          />
         <button onClick={(e)=>onHandleSubmit(e)} className='btn'>Enviar</button>
       </form>
      </header>
    </div>
  );
}

export default App;
