const express=require('express');
const router=express.Router();  
const User=require('../models/User');
const { body, validationResult } = require('express-validator');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');
// const { findById } = require('../models/User');

const JWT_SECRET="Salmank$han"


//Route:1  Create a user using: POST "/api/auth/createuser" No login require

router.post('/createuser', [
    body('name',"Enter a valid name").isLength({ min: 3 }),
    body('password',"Password must be atleast 4 character").isLength({ min: 5 }),
    body('email',"Enter a valid email").isEmail(),

] ,async(req,res)=>{
  let success = false;

  // if there are errors, return bad request and the error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }    
    //check wheter user with this email exists already
    try {
    let user=await User.findOne({email:req.body.email});
  
 
  if(user){
    return res.status(400).json({success,error:"Sorry a user with this email address already exist"})
  }
  const salt=await bcrypt.genSalt(10);
  const secPass=await bcrypt.hash(req.body.password,salt); 

  // Create new user
    user=await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      })
      
    //   .then(user => res.json(user))
    //   .catch(err=>{console.log(err)
    // res.json({error:'Please enter a unique value for email',message:err.message})})

    const data={
      user:{
        id:user.id
      }
    }
    
    const authToken=jwt.sign(data,JWT_SECRET);

    // res.json(user);
    success=true;
    res.json({success,authToken})
   }
    catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
    }
});

//Route:2  Authenticate a user using: POST "/api/auth/login" No login require

router.post('/login', [
  body('email',"Enter a valid email").isEmail(),
  body('password',"Password can not be blank").exists(),

] ,async(req,res)=>{
  let success = false;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  } 
const {email,password}=req.body;
try {
  let user=await User.findOne({email});
  if(!user){
    success = false
    return res.status(400).json({error:"Please try to login with correct email or password"});

  }
  const passwordCompare=await bcrypt.compare(password,user.password)
if (!passwordCompare){
  success = false
  return res.status(400).json({success,error:"Please try to login with correct email or password"});}

  const data={
    user:{
      id:user.id
    }
  }
  
  const authToken=jwt.sign(data,JWT_SECRET);
  success = true;

  res.json({ success, authToken })
}

catch (error) {
  console.log(error.message);
  res.status(500).send("Internal Server Error");
  }
})


//Route:3   Get loggedin user data using: POST "/api/auth/getuser"  login require
router.post('/getuser',fetchuser,async(req,res)=>{
try {
 const userId=req.user.id;
  const user=await User.findById(userId).select("-password");
  res.send(user);
} catch (error) {
  console.log(error.message);
  res.status(500).send("Internal Server Error");
  }
})

module.exports=router