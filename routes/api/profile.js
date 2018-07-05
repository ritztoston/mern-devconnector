const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load Validation
const validateProfileInput = require('../../validations/profile');

// Load Model
const Profile = require('../../models/Profile');
// Load User Model
const User = require('../../models/User');

// @route :  GET api/profile
// @desc  :  Get current user's profile
// @access:  Private
router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
  const errors = {};

  Profile.findOne({user: req.user.id})
     .populate('user', ['name', 'avatar'])
     .then(profile => {
       if (!profile) {
         errors.noprofile = 'There is no profile for this user';
         return res.status(404).json(errors);
       }
       res.json(profile);
     })
     .catch(err => res.status(404).json(err));
});

// @route :  GET api/profile/user/:user_id
// @desc  :  Get profile by user ID
// @access:  Public
router.get('/user/:user_id', (req, res) => {
  const errors = {};
  Profile.findOne({user: req.params.user_id})
     .populate('user', ['name', 'avatar'])
     .then(profile => {
       if (!profile) {
         errors.noprofile = 'There is no profile for this user';
         res.status(404).json(errors);
       }
       res.json(profile);
     })
     .catch(err => res.status(404).json({profile: 'There is no profile for this user'}));
});

// @route :  GET api/profile/all
// @desc  :  Get all profiles
// @access:  Public
router.get('/all', (req, res) => {
  const errors = {};
  Profile.find()
     .populate('user', ['name', 'avatar'])
     .then(profiles => {
       if (!profiles) {
         errors.noprofile = 'There is no profiles';
         return res.status(404).json(errors);
       }

       res.json(profiles);
     })
     .catch(err => res.status(404).json({profile: 'There is no profiles'}));
});

// @route :  GET api/profile/handle/:handle
// @desc  :  Get profile by handle
// @access:  Public
router.get('/handle/:handle', (req, res) => {
  const errors = {};
  Profile.findOne({handle: req.params.handle})
     .populate('user', ['name', 'avatar'])
     .then(profile => {
       if (!profile) {
         errors.noprofile = 'There is no profile for this user';
         res.status(404).json(errors);
       }
       res.json(profile);
     })
     .catch(err => res.status(404).json({profile: 'There is no profile for this user'}));
});


// @route :  POST api/profile
// @desc  :  Create user profile
// @access:  Private
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
  const { errors, isValid } = validateProfileInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  // Get fields
  const profileFields = {};
  profileFields.user = req.user.id;
  if (req.body.handle) profileFields.handle = req.body.handle;
  profileFields.company = req.body.company;
  profileFields.website = req.body.website;
  profileFields.location = req.body.location;
  profileFields.status = req.body.status;
  profileFields.bio = req.body.bio;

  // Skills
  if (typeof req.body.skills !== 'undefined') {
    profileFields.skills = req.body.skills.split(',');
  }

  //Social
  profileFields.social = {};
  profileFields.social.facebook = req.body.facebook;
  profileFields.social.twitter = req.body.twitter;

  Profile.findOne({user: req.user.id})
     .then(profile => {
       if (profile) {
         // Update
         Profile.findOneAndUpdate(
            {user: req.user.id},
            {$set: profileFields},
            {new: true}
            )
            .then(profile => res.json(profile))
       }
       else {
         // Create
         Profile.findOne({handle: profileFields.handle})
            .then(profile => {
              if (profile) {
                errors.handle = 'That handle already exists';
                return res.status(400).json(errors);
              }

              new Profile(profileFields).save()
                 .then(profile => res.json(profile))
            })
       }
     });
});

module.exports = router;