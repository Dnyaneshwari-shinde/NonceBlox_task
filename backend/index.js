import express from "express";
const app = express();

import bodyParser from "body-parser";
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

import cors from "cors";
app.use(cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT");
  next();
});


app.get("/", (req, res) => {
    res.send("Backend is running!");
});

app.listen(3000, () => {
    console.log("Backend is running on port 3000");
});
