import express from 'express';
import mongoose from 'mongoose';
import productRoute from './routes/product.js';
import dotenv from 'dotenv';
import cors from 'cors';
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

app.use(express.json({limit: "10kb"}));
app.use(cors());

app.use('/api/v1/product',productRoute);