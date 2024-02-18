const express = require('express');
const router = express.Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require('../models/user');
const mongoose = require('mongoose');

passport.use(new GoogleStrategy({
    clientID:process.env.clientID,
    clientSecret:process.env.clientSecret,
    callbackURL:process.env.callback
    },
    async function(accessToken,refreshToken,profile,done){
        try {
            let user = await User.findOne({googleId:profile.id});
            if(user){
                console.log(profile);
                console.log("logging in");
                done(null,user);
            }else{
                console.log("Signing up");
                const newUser = new User({
                    googleId:profile.id,
                    displayName:profile.displayName,
                    firstName:profile.name.givenName,
                    lastName:profile.name.familyName,
                    profileImage:profile.photos[0].value,
                    email:profile.emails[0].value
                })
                const saveUser = await newUser.save();
                done(null,saveUser);
            }
        } catch (error) {
            console.log("Error is occured while verifying the User");
            console.log(error.message);
        }
    })
)

router.get(
    "/auth/google",
    passport.authenticate("google",{
        scope:["email","profile"]
    })
)

router.get('/login-failure',(req,res)=>{
    res.send("CAn't Handle");
})

router.get('/auth/google/callback',passport.authenticate("google",{
    failureRedirect:'/login-failure',
    successRedirect:'/dashboard',
}))

//Serialize User
passport.serializeUser(function (user, done) {
    // console.log("Serialize"+user);
    done(null, user.id);
});


//deserialize User
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null,user);
    }catch (err) {
        done(err,null);
    }
});

router.get('/logout',(req,res)=>{
    req.session.destroy((err)=>{
        if(err){
            res.send('logged out');
        }else{
            // res.send("Something went wrong");
            res.redirect('/');
        }
    })
})
module.exports = router;