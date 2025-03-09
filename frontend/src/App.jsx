import {BrowserRouter,Routes,Route,Navigate} from "react-router-dom";
import React from 'react'
import Login from "../Pages/Auth/Login"
import SignUp from "../Pages/Auth/SignUp"
import Home from "../Pages/Home/Home"

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" exact element={<Root/>}/>
          <Route path="/dashboard" exact element={<Home/>}/>
          <Route path="/login" exact element={<Login/>}/>
          <Route path="/signup" exact element={<SignUp/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

// use to redirect automatically based on token
const Root=()=>{
  const isAuthenticated= !!localStorage.getItem("token");  // Double negation used to make value truthy or falsy
  return isAuthenticated?(
    <Navigate to="/dashboard"/>):
    (
    <Navigate to="/login"/>
    )
}

export default App