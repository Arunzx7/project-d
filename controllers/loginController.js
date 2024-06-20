
    const User = require("../models/userModel");
    const session = require("express-session");
    const bcrypt = require("bcrypt");
    const nodemailer = require("nodemailer");
    const otpGenerator = require("otp-generator");
    const Products = require("../models/productModel");
    require("dotenv").config();
    const path =require('path');

    

    const securePassword = async (password) => {
      try {
        return await bcrypt.hash(password, 10);
      } catch (error) {
        console.error(error.message);
        throw new Error("Password encryption failed");
      }
    };

    const loginForm = async (req, res) => {
      try {
        return res.render("login", { message: " ", errMessage: "" });
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
      }
    };

    const loadOtp = async (req, res) => {
      try {
        return res.render("user/otp", { errMessage: "" });
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
      }
    };

    const emailCheck = async (req, res) => {
      try {
        const { email } = req.query;
        const existEmail = await User.findOne({ email });
        if (!existEmail) {
          return res.json({ success: true, message: "Email Already Exists..." });
        }
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
      }
    };

    const insertUser = async (req, res) => {
      try {
        const { username, email, password } = req.body;
        const existName = await User.findOne({ username });
        const existEmail = await User.findOne({ email });

        if (!existName && !existEmail) {
          req.session.tempUser = { username, email, password };
          await emailVerification(req, email);
          return res.json({ email, success: true });
        } else {
          return res.json({
            message: existName ? "Username already exists" : "Email already exists",
            success: false,
          });
        }
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
      }
    };

    const emailVerification = async (req, email) => {
      try {
        const otpVal = otpGenerator.generate(6, {
          digits: true,
          lowerCaseAlphabets: false,
          upperCaseAlphabets: false,
          specialChars: false,
        });
        console.log(otpVal);
        req.session.otp = otpVal;
        setTimeout(() => {
          req.session.otp = null;
        }, 30000);

        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
          },
        });

        await transporter.sendMail({
          from: process.env.MAIL_USER,
          to: email,
          subject: "Your Email Verification Code",
          text: otpVal,
        });
      } catch (error) {
        console.error(error);
        throw new Error("Email verification failed");
      }
    };

    const verifyOTP = async (req, res) => {
      try {
        const { otp: enteredOtp } = req.body;
        const otpVal = req.session.otp;

        if (otpVal === enteredOtp) {
          const { username, email, password } = req.session.tempUser;
          const hashedPassword = await securePassword(password);
          const newUser = new User({ email, username, password: hashedPassword, is_admin: false });

          const userData = await newUser.save();
          if (userData) {
            req.session.user_id = userData._id;
            return res.redirect("home");
          } else {
            return res.render("registration", { message: "Failed to create user" });
          }
        } else {
          return res.render("user/otp", { message: "Incorrect OTP provided", errMessage: "" });
        }
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
      }
    };

    const verifyLogin = async (req, res) => {
      try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
          return res.json({ message: "Invalid email or password", success: false });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return res.status(400).json({ message: "Invalid password.", success: false });
        }

        req.session.user_id = user._id;
        req.session.user_email = user.email;
        return res.json({ success: true });
      } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Internal Server Error" });
      }
    };

    const resendOtp = async (req, res) => {
      try {
        const email = req.session.tempUser.email;
        const otpVal = otpGenerator.generate(6, {
          digits: true,
          lowerCaseAlphabets: false,
          upperCaseAlphabets: false,
          specialChars: false,
        });
        req.session.otp = otpVal;

        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
          },
        });

        await transporter.sendMail({
          from: process.env.MAIL_USER,
          to: email,
          subject: "Your New Email Verification Code",
          text: otpVal,
        });

        return res.render("user/otp", { message: "New OTP has been sent to your email.", errMessage: "" });
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
      }
    };

    const loginLoad = async (req, res) => {
      try {
        return res.render("user/registration", { message: " ", errMessage: "" });
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
      }
    };

    const loadLogin = async (req, res) => {
      try {
        return res.render("registration", { message: "Successfully signed in", errMessage: "" });
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
      }
    };

    const loadHome = async (req, res) => {
      try {
        
        const products = await Products.find();
        return res.render("user/home", { message: "", errMessage: "", products });
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
      }
    };
    //forgetpassword

    const forgetPassEmailVerifyLoad = async (req, res) => {
      try {
        const loggedIn = req.session.user_id ? true : false;
        res.render("user/forgetPassEmailVerify", { loggedIn });
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
      }
    };

    const verifyEmail = async (req, res) => {
      try {
        const loggedIn = req.session.user_id ? true : false;
        const { email } = req.body;
        const userData = await User.findOne({ email });

        if (!userData) {
          res.render("user/forgetPassEmailVerify", { loggedIn, message: "Email not found" });
        } else {
          req.session.user_email = email;
          await emailVerification(req, email);
          res.redirect("/forgetPassVerifyOtp");
        }
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
      }
    };

    const forgetPassVerifyOtp = async (req, res) => {
      try {
        const loggedIn = req.session.user_id ? true : false;
        res.render("user/forgetPassOtpPage", {
          loggedIn,
        });
      } catch (error) {
        res.status(500).send("invalid server error");
      }
    };

    const verifyOtp = async (req, res) => {
      try {
        const loggedIn = req.session.user_id ? true : false;
        const { otpCode } = req.body;

        if (req.session.otp === otpCode) {
          res.render("user/changepassword", { loggedIn });
        } else {
          res.render("user/forgetPassOtpPage", { loggedIn, message: "OTP is incorrect" });
        }
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
      }
    };

    const changePassword = async (req, res) => {
      try {
        const newPassword = req.body.newPassword;
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        const email = req.session.user_email;
        const userData = await User.findOne({ email });

        userData.password = hashedNewPassword;
        await userData.save();

        res.redirect("/home");
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
      }
    };

   


      module.exports = {
      loginForm,
      insertUser,
      loginLoad,
      emailVerification,
      verifyOTP,
      loadOtp,
      emailCheck,
      resendOtp,
      loadLogin,
      verifyLogin,
      loadHome,
      forgetPassEmailVerifyLoad,
      verifyEmail,
      forgetPassVerifyOtp,
      verifyOtp,
      changePassword,
  

    }     
