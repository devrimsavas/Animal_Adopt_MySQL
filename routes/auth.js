const express = require('express');
const passport = require('passport');
const router = express.Router();
const bcrypt = require('bcrypt'); //maybe hash later 
const db = require('../models'); 

// Import and initialize passport configuration
const initializePassport = require('../passport-config');
initializePassport(
  passport,
  username => db.User.findOne({ where: { username: username } }), // getUserByUsername implementation
  id => db.User.findByPk(id) // getUserById implementation
);

router.post('/password', passport.authenticate('local', {
  successRedirect: '/', // Redirect to the home page on successful login
  failureRedirect: '/login', // Redirect back to login page on failure
  //failureFlash: true // Allow flash messages maybe later for furter development
}));


router.get('/login', (req, res) => {
    
    const messages = req.flash('error');
    res.render('login', { messages: messages, user: req.user }); // Ensure  pass `user` 
    console.log(req.session);
    console.log(req.user);
  });







module.exports = router;
