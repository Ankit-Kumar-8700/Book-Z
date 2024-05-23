import User from "../models/user.js";
import Book from "../models/book.js";


export const getUser=async(req,res)=>{
    try {
        const {id}=req.params;
        const user=await User.findById(id);
        res.status(200).json(user)
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}

export const getUserFavourites=async(req,res)=>{
    try {
        const {id}=req.params;
        const user=await User.findById(id);

        const favourites=await Promise.all(
            user.favourite.map((id)=>Book.findById(id))
        );
        const formattedFav=favourites.map(
            ({_id,title,author,genre,picPath,yearPublished})=>{
                return {_id,title,author,genre,picPath,yearPublished};
            }
        )

        res.status(200).json({favourites:formattedFav})
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}


export const getUserBooks=async(req,res)=>{
    try {
        const {id}=req.params;

        const userBooks=await Book.find({userId:id});

        res.status(200).json(userBooks)
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}



export const addFavourite=async(req,res)=>{
    try {
        const {id,bookId}=req.params;
        const user=await User.findById(id);
        const fav=await Book.findById(bookId);

        if(!user){
            return res.status(404).json({message:"User does not exists."})
        }

        if(!fav){
            return res.status(404).json({message:"Book does not exists."})
        }

        if(user.favourite.includes(bookId)){
            return res.status(404).json({message:"This book is already in your favourites list."});
        }
        
        user.favourite.push(bookId);
        await user.save();
        
        const favourites=await Promise.all(
            user.favourite.map((id)=>Book.findById(id))
        );
        const formattedFav=favourites.map(
            ({_id,title,author,genre,picPath,yearPublished})=>{
                return {_id,title,author,genre,picPath,yearPublished};
            }
        )

        res.status(200).json({favourites:formattedFav})
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}

export const removeFavourite=async(req,res)=>{
    try {
        const {id,bookId}=req.params;
        const user=await User.findById(id);
        const fav=await Book.findById(bookId);

        if(!user){
            return res.status(404).json({message:"User does not exists."})
        }

        if(!fav){
            return res.status(404).json({message:"Book does not exists."})
        }

        if(!user.favourite.includes(bookId)){
            return res.status(404).json({message:"This book is not in your favourites list."});
        }
            user.favourite=user.favourite.filter((tempId)=>tempId!=bookId);
        
        await user.save();

        const favourites=await Promise.all(
            user.favourite.map((id)=>Book.findById(id))
        );
        const formattedFav=favourites.map(
            ({_id,title,author,genre,picPath,yearPublished})=>{
                return {_id,title,author,genre,picPath,yearPublished};
            }
        )

        res.status(200).json({favourites:formattedFav})
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}


export const updateUser=async(req,res)=>{
    try {
        const {id}=req.params;
        const { name }=req.body;


        const user=await User.findByIdAndUpdate(id, { $set: { name: name }});

        await user.save();
        const newUser=await User.findById(id);
        res.status(200).json(newUser);
    } catch (error) {
        console.log(error);
        res.status(404).json({message: error.message})
    }
}