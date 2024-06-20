const express = require("express");
const app = express();
const session = require("express-session");
require("dotenv").config();
const nocache = require("nocache"); 

const userRouter = require("./routes/userRouter");
const adminRouter = require("./routes/adminRouter");

const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const port = process.env.PORT

app.use(nocache());
////





// Setting view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/upload", express.static(path.join(__dirname, "upload")));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret:process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);



app.post("/forgotPassword", (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Email is  required" });
  }
  res.json({ success: true, message: "OTP has been sent your email" });
});

//parsing data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//setting paths
app.use(
  "/assets",
  express.static(path.join(__dirname, "public", "assets", "css"))
);
app.use(express.static(path.join(__dirname, "upload")));
app.use(express.static(path.join(__dirname, "public")));

//to handel route
app.use("/", userRouter);
app.use("/", adminRouter);
// Import userRouter

//connecting  data base
mongoose.connect(process.env.MONGODB);
const db = mongoose.connection;
db.on("error", (error) => {
  console.log(error);
}).once("open", () => {
  console.log("Mongodb  server is connected");
});

app.listen(port, () => {
  console.log(`server on  http://localhost:${port}`);
});
