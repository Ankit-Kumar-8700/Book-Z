import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";


export const register=async(req,res)=>{
    try {
        let  {
            name,
            email,
            password
        }=req.body;
        const salt=await bcrypt.genSalt();
        const passwordHash=await bcrypt.hash(password,salt);

        const newUser=new User({
            name,
            email,
            password: passwordHash,
            favourite: []
        })
        const saveUser=await newUser.save();
        const token=jwt.sign({id:saveUser._id},process.env.JWT_SECRET);

        delete saveUser.password;
        res.status(201).json({token,user:saveUser});
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: error.message});
    }
};


export const login=async(req,res)=>{
    try {
        const {email,password}=req.body;

        const user=await User.findOne({email:email});
        if(!user) return res.status(400).json({message:"User does not exist!"})

        const isMatched=await bcrypt.compare(password,user.password);
        if(!isMatched) return res.status(400).json({message:"Kindly enter correct credentials."})

        const token=jwt.sign({id:user._id},process.env.JWT_SECRET);

        delete user.password;

        res.status(200).json({token,user})
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}