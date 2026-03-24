const mongoose= require("mongoose");

const userSchema=new mongoose.Schema({  
    username:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:["user","admin","superadmin"],
        default:"user",
    },
    resetPasswordToken:String,
    resetPasswordExpires:Date,
});
const userModel=mongoose.model("User",userSchema);
module.exports=userModel;