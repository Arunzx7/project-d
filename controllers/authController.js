const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const mongoose = require('mongoose');
const User = require('../models/userModel'); // Adjust the path as needed

require('dotenv').config();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

mongoose.connect(process.env.MONGODB, { useNewUrlParser: true, useUnifiedTopology: true });

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/callback",
  passReqToCallback: true,
},
async function(request, accessToken, refreshToken, profile, done) {
  try {
    // Check if the user already exists in the database
    let user = await User.findOne({ googleId: profile.id });
    if (user) {
      // If user exists, return the user
      return done(null, user);
    } else {
      
      user = new User({
        googleId: profile.id,
        displayName: profile.displayName,
        email: profile.emails[0].value,
        profilePhoto: profile.photos[0].value,
        is_admin: false,
        is_blocked: false 
      });
      await user.save();
      return done(null, user);
    }
  } catch (error) {
    return done(error, false);
  }
}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function(id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

const isLoggedIn = (req, res, next) => {
  req.user ? next() : res.sendStatus(401);
};

const GetGooglelogin = async (req, res) => {
  res.send('<a href="/auth/google">Login with Google</a>');
}

const googleAuth = passport.authenticate('google', { scope: ['email', 'profile'] });

const googleAuthCallback = passport.authenticate('google', {
  successRedirect: '/home',
  failureRedirect: '/auth/google/failure'
});

module.exports = {
  googleAuth,
  GetGooglelogin,
  isLoggedIn,
  googleAuthCallback,
};