const express = require('express');
const router = express.Router();
// Users model
const userModel = require('../models/users');

//===== Sign Up Route
router.post('/sign-up', async function(req,res,next){

  // Recherche d'un doublon
  let searchUser = await userModel.findOne({
    email: req.body.emailFromFront
  })
  
  if(!searchUser){
    let newUser = new userModel({
      username: req.body.usernameFromFront,
      email: req.body.emailFromFront,
      password: req.body.passwordFromFront,
    })
  
    let newUserSave = await newUser.save();
  
    req.session.user = {
      name: newUserSave.username,
      id: newUserSave._id,
    }
  
    console.log(req.session.user)
  
    res.redirect('/weather')
  } else {

    res.redirect('/')
  }
  
});

//===== Sign In Route
router.post('/sign-in', async function(req,res,next){

  let errorSignIn = [];

  let searchUser = await userModel.findOne({
    email: req.body.emailFromFront,
    password: req.body.passwordFromFront
  });

  console.log(searchUser)

  if(searchUser != null){
    req.session.user = {
      name: searchUser.username,
      id: searchUser._id
    }
    res.redirect('/weather')
  } else {
    console.log("User inconnu")

    errorSignIn.push("Veuillez-vous inscrire ! (Sign Up)");

    res.render('login', { errorSignIn, searchUser })
  }
});

//===== Deconnexion 
router.get('/logout', function(req,res,next){

  // req.session.user = null;

  // To destroy session you can use
  //       this function 
     req.session.destroy(function(error){
        console.log("Session Destroyed")
    })
    

  res.redirect('/')
});


module.exports = router;
