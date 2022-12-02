import React,{useState} from 'react'
import { useNavigate } from "react-router-dom";
const Signup = (props) => {
  const [credentials, setcredentials] = useState({name:"",email:"",password:"",cpassword:""});
  let navigate = useNavigate();

  const handleSubmit=async(e)=>{

    e.preventDefault();
   const {name,email,password}=credentials;
    const response = await fetch("http://localhost:5000/api/auth/createuser", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({name,email,password})
      });
      const json=await response.json();
      console.log(json)
      if(json.success){
        //save the auth token and redirect
        localStorage.setItem('token',json.authToken);
        navigate('/');
        props.showAlert("Account Created Successfully","success")

      }
      else{
        props.showAlert("Invalid Credentials","danger")
      }
}
const onChange=(e)=>{
    setcredentials({...credentials, [e.target.name]: e.target.value})
  
  }
  return (
    
    <div className='container mt-3'>
      <h2>Sign Up to Create Account</h2>
      <form onSubmit={handleSubmit}>
    <div className="form-group">
      <label htmlFor="name"> Name</label>
      <input type="text" className="form-control" id="name" name='name' onChange={onChange}  aria-describedby="namelHelp" placeholder="Enter Name"/>
    </div>
    <div className="form-group">
      <label htmlFor="email">Email address</label>
      <input type="email" className="form-control" id="exampleInputEmail1"name='email' onChange={onChange} aria-describedby="emailHelp" placeholder="Enter email"/>
    </div>
    <div className="form-group">
      <label htmlFor="password">Password</label>
      <input type="password" className="form-control" id="password" name="password" onChange={onChange} minLength={5} required  placeholder="Password"/>
    </div>
    <div className="form-group">
      <label htmlFor="cpassword">Confirm Password</label>
      <input type="password" className="form-control" id="cpassword" name='cpassword' onChange={onChange} minLength={5} required  placeholder="Confirm Password"/>
    </div>
   
    <button type="submit" className="btn btn-primary my-2">Submit</button>
  </form></div>
  )
}

export default Signup;