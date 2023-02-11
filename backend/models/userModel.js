const mongoose = require("mongoose")
const bcrypt= require("bcryptjs")


const userSchema = mongoose.Schema({
    
    name:{
         type:String,
         required: [true, "Please add a name"]
    },

    email:{
        type:String,
        required: [true, "Please add a email"],
        unique:true,
        trim:true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please enter a valid email"
        ]
    },
    password:{
         type:String,
         required: [true, "Please add a password"],
         minLength:[4,"Password must be upto 4 characters"],
         maxLength:[10,"Passowrd not exceed 10 characters"]
    },
    photo:{
        type:String,
        required: [true, "Please add a photo"],
        default:"https://e7.pngegg.com/pngimages/84/165/png-clipart-united-states-avatar-organization-information-user-avatar-service-computer-wallpaper-thumbnail.png"
    },
    phone:{
        type:String,
        default:"+099"
    },
    bio:{
        type:String,
        maxLength:[20,"Bio should not exceed 20 characters"],
        default:"bio"
    }



}, {
    timestamps:true
})

//encrpt password
userSchema.pre("save",async function(next) {

    if(!this.isModified("password")){

        return next
    }

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password,salt);
    this.password = hashedPassword;
    next()
})

const User = mongoose.model("User",userSchema)
module.exports = User