const asyncHandler =  require("express-async-handler")
const errorHandler = require("../middleWare/errorMiddleware")
const User = require("../models/userModel")
const jwt = require("jsonwebtoken")
const bcrypt= require("bcryptjs")


const generateToken = (id) => {

    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:"1d"
    })
}

const registerUser = asyncHandler(async(req,res) => {
  
    const {name,email,password} = req.body

    if(!name || !email || !password){
        res.status(400)
        throw new Error("Please fill in all required")
    }
    if(password.length < 4){
        res.status(400)
        throw new Error("Password must be 4 characters")
    }

    const userExists = await User.findOne({email})
    if(userExists){
        res.status(400)
        throw new Error("Email has been already used")
    }
   
    
    
    const user = await User.create({
        name,
        email,
        password
    })

    //generate token
    const token = generateToken(user._id)

    //send HTTP only
    res.cookie("token",token,{
        path:"/",
        httpOnly:true,
        expires:new Date(Date.now() + 1000 * 86400),
        sameSite:"none",
        secure:true

    })

    if(user){
        const {_id,name,email,photo,phone,bio} = user

        res.status(201).json({
            
            _id,name,email,photo,phone,bio,token

        })

    } else{
        res.status(400)
        throw new Error("Invalid user data")
    }   

})



//login user
const loginUser = asyncHandler(async(req,res) => {
      
    const {email,password} = req.body

    //validate user
    if(!email || !password){
        res.status(400)
        throw new Error("Please enter valid email password")
    }

    //check if user exits
    const user = await  User.findOne({email})

    if(!user){
        res.status(400)
        throw new Error("User not found please signup")
    }

    const passwordIsCorrect = await bcrypt.compare(password,user.password)

        //generate token
        const token = generateToken(user._id)

        //send HTTP only
        res.cookie("token",token,{
            path:"/",
            httpOnly:true,
            expires:new Date(Date.now() + 1000 * 86400),
            sameSite:"none",
            secure:true
    
        })

    if(user && passwordIsCorrect){

        const {_id,name,email,photo,phone,bio} = user
        res.status(200).json({    
            _id,name,email,photo,phone,bio,token
        })

    }else{
        res.status(400)
        throw new Error("Invalid email or password")
    }

})



module.exports = {registerUser,loginUser}