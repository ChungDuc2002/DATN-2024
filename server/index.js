import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { InitRouters } from './routers/index.js';
import cookieParser from 'cookie-parser';
import { sendData } from './utils/data.js';
const app = express();
const port = 5000;

dotenv.config();

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

InitRouters(app);

mongoose
  .connect('mongodb://127.0.0.1:27017/DoAnTotNghiep')
  .then(() => {
    console.log('Connect database successfully !');
    sendData();
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
