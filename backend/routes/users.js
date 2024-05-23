import express from "express";
import {
    addFavourite,
    getUser,
    getUserBooks,
    getUserFavourites,
    removeFavourite,
    updateUser
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router=express.Router();

router.get("/:id",verifyToken,getUser);
router.get("/:id/favourite",verifyToken,getUserFavourites);
router.get("/:id/books",verifyToken,getUserBooks);

router.patch("/:id",verifyToken,updateUser);
router.patch("/favourite/add/:id/:bookId",verifyToken,addFavourite);
router.patch("/favourite/remove/:id/:bookId",verifyToken,removeFavourite);

export default router;