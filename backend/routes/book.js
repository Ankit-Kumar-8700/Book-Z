import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { deleteBook, getBook, getBooks, updateBook } from "../controllers/book.js";

const router=express.Router();

router.get("/get-all/:currGenre/:currPage",getBooks);
router.get("/get/:id",getBook);

router.delete("/delete/:id",verifyToken,deleteBook);
router.patch("/update/:id",verifyToken,updateBook);

export default router;