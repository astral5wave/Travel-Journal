import axios from 'axios';

// {Axios Instance → A reusable Axios object with predefined settings (base URL, headers, timeout).
// Interceptors → Middleware for modifying requests/responses before they are processed.
// Types of Interceptors:
// Request Interceptor (request.use())
// Runs before request is sent.
// Modifies config (headers, tokens, etc.).
// Response Interceptor (response.use())
// Runs after response is received.
// Handles success (modify response) & errors (retry, refresh token).
// Interceptor Uses Two Functions:
// First function → Success Callback (modifies request/response).
// Second function → Error Callback (handles request/response errors).
// Why config in Request Interceptor?
// Request isn’t created yet, Axios only has a config blueprint.
// Why response in Response Interceptor?
// The request has been executed, and Axios now has a full response object.
// Analogy: Like Express middleware →
// request.use() = app.use((req, res, next) => { modify req; next(); })
// response.use() = app.use((req, res) => { modify res before sending })
// 🚀 Interceptors = Global Middleware for Axios Requests & Responses.}


const axiosInstance= axios.create({
    baseURL:import.meta.env.VITE_BACKEND_URL || "http://localhost:8000",
    timeout:10000,//used to send response time error if response not recieved within 10s
    headers:{
        "Content-Type":"application/json"
    },
});
//send request by attaching token if available
axiosInstance.interceptors.request.use(
    (config)=>{
        const accessToken=localStorage.getItem("token");
        if(accessToken){
            config.headers.Authorization=`Bearer ${accessToken}`;
        } // if token, add to request config and send
        return config; //else directly send the config
    },
    (error)=>{
        return Promise.reject(error);// it is because axios request and response are async use Promises so if promise failed then it go to catch block , Hence returning and Failed Promise error rather than normal error
    }
);
//acts as middleware to handle request before it's sent

export default axiosInstance;
