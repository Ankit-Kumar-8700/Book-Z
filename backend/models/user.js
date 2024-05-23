import mongoose from "mongoose";

const UserSchema=new mongoose.Schema(
    {
        name:{
            type: String,
            require: true,
            min: 2,
            max: 50
        },
        email:{
            type: String,
            require: true,
            unique: true,
            max: 50
        },
        password:{
            type: String,
            require: true,
            min: 8
        },
        favourite:{
            type: Array,
            default: []
        },
    },
    {timestamps: true}
);


const User =mongoose.model("User",UserSchema);

export default User;