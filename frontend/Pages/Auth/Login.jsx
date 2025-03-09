import React, { useState } from 'react'
import {useNavigate} from 'react-router-dom'
import PasswordInput from '../../src/components/input/PasswordInput';
import { validateEmail } from '../../src/utils/helper';
import axiosInstance from '../../src/utils/axiosInstance';


const Login = () => {
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [error,setError]=useState(null);

  const navigate=useNavigate(); // is a hook used to navigate to webpages
  const handleLogin=async (event)=>{
    event.preventDefault();
    if(!validateEmail(email)){
      setError("Please enter a valid Email");
      return;
    }
    if(!password){
      setError("Please enter the Password");
      return;
    }
    setError("");
    //Login API integration
    try{
      const response= await axiosInstance.post("/login",{
        email:email,
        password:password,
      });
      //as returned object is promise so eithe resolved() or rejected()
      //if login successfull i.e resolved() aka status 200
      if(response.data && response.data.accessToken){
        localStorage.setItem("token",response.data.accessToken);
        navigate("/dashboard");
      }
    }catch(error){
        //handle login error i.e rejected() aka status 400 or 500 series
        if(error.response && error.response.data && error.response.data.message){
          setError(error.response.data.message);
        }
        else{
          setError("An Unexpected error occured. Please try again later");
        }
    }
  };

  return (
    <div className='h-screen bg-background bg-dot-white/[0.1] relative overflow-hidden'>
      <div className="login-ui-box right-10 -top-40"/>
      <div className="login-ui-box bg-purple-200 right-1/2 -bottom-40"/>
      <div className='container h-screen px-20 mx-auto flex justify-center items-center'>
        <div className='w-2/4 h-[90vh] flex items-end bg-login-bg-img bg-cover bg-center p-10 rounded-lg z-50'>
          <div>
            <h1 className='font-semibold text-white text-5xl leading-[58px]'>Capture Your <br/>Journeys
            </h1>
            <p className='text-[15px] text-white leading-6 pr-7 mt-4'>
              Record your travel experiences and memories in you travel journal
            </p>
          </div>
        </div>
        <div className='w-2/4 bg-surface rounded-r-lg max-h-[75vh] p-16 relative shadow-[0px_4px_12px_rgba(255,255,255,0.1)]'>
          <form onSubmit={handleLogin}>
            <h4 className='text-2xl mb-7 font-semibold text-on-surface'>
              Login
            </h4>
            <input type="text" placeholder='Email' className='input-box'
            value={email}
            onChange={({target})=>{
              setEmail(target.value);
            }}
            />
            <PasswordInput
            value={password}
            onChange={({target})=>{
              setPassword(target.value);
            }}
            placeholder={"Password"}
            />

            {error && <p className='text-xs text-red-600 pl-4 pb-1 mt-2'>{error}</p>}

            <button className='btn-primary' type='submit'>
              LOGIN
            </button>
            <p className='text-sm text-on-surface/50 text-center my-4'>Or</p>
            <button className='btn-primary btn-secondary' type='button' onClick={()=>{
              navigate('/signup');  //use to navgate towards another page
            }}>
              CREATE ACCOUNT
            </button>

          </form>
        </div>
      </div>
    </div>
  )
}

export default Login