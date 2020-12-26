import express from 'express';
import mongoose from 'mongoose';
import productRoute from './routes/product.js';
import  userRoute from './routes/user.js';
import dotenv from 'dotenv';
import cors from 'cors';
import multer from 'multer'; // for image
import GridFsStorage  from 'multer-gridfs-storage';
import Grid from 'gridfs-stream';
const app = express();



dotenv.config({path:"./config.env"});

mongoose
  .connect(process.env.DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Connection successful"))
  .catch((error) => console.log(`${error} did not connect`));
app.listen(process.env.PORT || 6000, () => {
  console.log("server running", process.env.PORT);
});


let conn = mongoose.connection
let gfs = conn.once('open', () => {
    //initialize our stream
    gfs = Grid(conn.db, mongoose.mongo)
    gfs.collection('imageUpload')
})



/**
 * Create  storage engine
 */
 let storage = new GridFsStorage({
   url: process.env.DB,
   file: (req, file) => {
     return new Promise(
       (resolve, reject) =>{
         const fileIndfo = {
           filename: file.originalname,
           bucketName: "imageUpload"
         }
         resolve(fileIndfo)
       }
     )
   }
 })

const upload = multer({storage})




/**
 * Start End Point
 */

app.use(express.json({limit: "10kb"}));
app.use(cors());
app.use(express.urlencoded({extended:true}))

app.use('/api/v1/product',productRoute);
app.use('/api/v1/user',userRoute);

app.post('/api/v1/uploadfile',upload.single('myFile'),(req,res)=>{
  res.json({
    file: req.file
  })
});

app.get('/api/v1/files',(req, res) => {
  gfs.files.find().toArray((err,files)=>{
    //Check if file exist
    if(!files || files.length == 0){
      return res.status(404).json({
        err: "No files exist"
      });
    }
    return res.json(files);
  })
})

