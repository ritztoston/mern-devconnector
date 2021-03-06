const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

// Load input Validation
const validateRegisterInput = require('../../validations/register');
const validateLoginInput = require('../../validations/login');


// Load user model
const User = require('../../models/User');

router.get('/test', (req, res) => res.json({
  msg: "Users Works!"
}));

// @route :  GET api/users/register
// @desc  :  Register User
// @access:  Public
router.post('/register', (req, res) => {
  // Validation
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({email: req.body.email})
     .then(user => {
       if (user) {
         errors.email = 'Email already exists';
         return res.status(400).json({email: 'Email already exists'});
       }
       else {
         const avatar = gravatar.url(req.body.email, {
           s: '200', //SIZE
           r: 'pg', //RATING
           d: 'mm'  //DEFAULT ICON
         });

         const rawHandle = req.body.name.trim().split(' ');
         const handle = rawHandle.join("");

         const newUser = new User({
           name: req.body.name,
           email: req.body.email,
           avatar,
           password: req.body.password,
           handle: handle.toLowerCase()
         });

         bcrypt.genSalt(10, (err, salt) => {
           bcrypt.hash(newUser.password, salt, (err, hash) => {
             if (err) throw err;
             newUser.password = hash;
             newUser.save()
                .then(user => res.json(user))
                .catch(err => console.log(err))
           })
         })
       }
     })
});

// @route :  GET api/posts/login
// @desc  :  Login User / Returning JWT Token
// @access:  Public
router.post('/login', (req, res) => {
  // Validation
  const { errors, isValid } = validateLoginInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  //Find the user by email
  User.findOne({email})
     .then(user => {
       // Check for user
       if (!user) {
         errors.email = 'User not found!';
         return res.status(404).json(errors);
       }

       // Check password
       bcrypt.compare(password, user.password)
          .then(isMatch => {
            if (isMatch) {
              // User Matched!

              // JWT Payload
              const payload = {
                id: user.id,
                name: user.name,
                avatar: user.avatar,
                handle: user.handle
              };

              // Sign Token
              jwt.sign(
                 payload,
                 keys.secretOrKey,
                 {expiresIn: 3600},
                 (err, token) => {
                   res.json({
                     success: true,
                     token: 'Bearer ' + token
                   });
              });
            }
            else {
              errors.password = 'Password incorrect';
              return res.status(400).json(errors);
            }
          })
     })
});

// @route :  GET api/posts/current
// @desc  :  Return current user
// @access:  Private
router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email
  });
});

// @route :  GET api/posts/user/:userId
// @desc  :  Return current user
// @access:  Private
router.get('/:userId', (req, res) => {
  User.findById(req.params.userId)
     .then(user => res.json(user))
     .catch(err => res.status(404).json({nouserfound: 'No user found with that ID'}));
});




module.exports = router;