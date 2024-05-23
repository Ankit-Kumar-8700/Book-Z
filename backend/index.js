import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import bookRoutes from "./routes/book.js";
import { verifyToken } from "./middleware/auth.js";
import { createBook } from "./controllers/book.js";



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "100mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "assets")));





/* FILE STORAGE */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "assets");
    },
    filename: function (req, file, cb) {
      const preName=Math.floor(Math.random() * 1000000000);
      const temp=`${preName}${file.originalname}`;
      req.body.data=temp;
      cb(null, temp);
    },
  });
  const upload = multer({ storage });



  // Route to handle file upload
app.post('/books/create', verifyToken, upload.single('file'), (req, res, next) => {
  try {
      createBook(req, res);
  } catch (error) {
      next(error);
  }
});


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Something went wrong!'+ err.message });
});

  app.use("/auth",authRoutes);
  app.use("/user",userRoutes);
  app.use("/books",bookRoutes);


  const PORT = process.env.PORT || 6001;
  mongoose
    .connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      app.listen(PORT, () => console.log(`Server Port: ${PORT} connected`));
  
      /* ADD DATA ONE TIME */
      // User.insertMany(users);
      // Post.insertMany(posts);
    })
    .catch((error) => console.log(`${error} did not connect`));