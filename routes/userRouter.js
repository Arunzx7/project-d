// const express = require("express");
// const session = require("express-session");
// const user_router = express.Router();
// const path = require("path");
// const bodyparser = require("body-parser");
// const nocache = require("nocache");
// const { isUser, isLoggedUser } = require("../middleware/userAuth");




// user_router.set("views", "./views/user");
// user_router.set("view engine", "ejs")

// // to convert the incoming quest into url encoded format
// const loginController = require("../controllers/loginController");
// const productController = require("../controllers/productController");
// const categoryController = require("../controllers/categoryController");

// user_router.get("/home", loginController.loadHome);
// user_router.post("/register", isLoggedUser, loginController.insertUser);
// user_router.get("/get", isLoggedUser, loginController.loadOtp);
// user_router.post("/otp", isLoggedUser, loginController.verifyOTP);
// user_router.get("/checkemail", isLoggedUser, loginController.emailCheck);
// user_router.get("/loadOtp", isLoggedUser, loginController.loadOtp);
// user_router.get("/productDetail", isUser, productController.productDetails);

// user_router.get("/resendOtp", isLoggedUser, loginController.resendOtp);
// user_router.post("/login", isLoggedUser, loginController.verifyLogin);
// user_router.get("/", isLoggedUser, loginController.loginLoad);

// // forget password
// user_router.get(
//   "/forgetPasswordEmail",
//   loginController.forgetPassEmailVerifyLoad
// );
// user_router.post("/forgetPasswordEmail", loginController.verifyEmail);
// user_router.get("/ForgetPassVerifyOtp", loginController.forgetPassVerifyOtp);
// user_router.post("/ForgetPassVerifyOtp", loginController.verifyOtp);
// user_router.post("/changePassword", loginController.changePassword);

// module.exports = user_router;

const express = require("express");
const session = require("express-session");
const user_router = express.Router();
const path = require("path");
const bodyparser = require("body-parser");
  const nocache = require("nocache");
const { isUser, isLoggedUser } = require("../middleware/userAuth");

// to convert the incoming request into url encoded format
const loginController = require("../controllers/loginController");
const productController = require("../controllers/productController");
const categoryController = require("../controllers/categoryController");
const authController = require('../controllers/authController')
user_router.get("/", loginController.loadHome);
user_router.post("/register", isLoggedUser, loginController.insertUser);
user_router.get("/get", isLoggedUser, loginController.loadOtp);
user_router.post("/otp", isLoggedUser, loginController.verifyOTP);
user_router.get("/checkemail", isLoggedUser, loginController.emailCheck);
user_router.get("/loadOtp", isLoggedUser, loginController.loadOtp);
user_router.get("/productDetail", isUser,productController.productDetails);

user_router.get("/resendOtp", isLoggedUser, loginController.resendOtp);
user_router.post("/login", isLoggedUser, loginController.verifyLogin);
user_router.get("/login", isLoggedUser, loginController.loginLoad);
user_router.get('/logout', isLoggedUser, loginController.logoutUser);

// forget password
user_router.get(
  "/forgetPasswordEmail",
  loginController.forgetPassEmailVerifyLoad
);

/// google Auth

// user_router.get("/home", authController.GetGooglelogin);
 user_router.get("/home", loginController.loadHome);

user_router.get('/auth/google', authController.googleAuth);
user_router.get('/auth/google/callback', authController.googleAuthCallback);

user_router.post("/forgetPasswordEmail", loginController.verifyEmail);
user_router.get("/ForgetPassVerifyOtp", loginController.forgetPassVerifyOtp);
user_router.post("/ForgetPassVerifyOtp", loginController.verifyOtp);
user_router.post("/changePassword", loginController.changePassword);

module.exports = user_router;



