const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

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
     .then(profile => {
       if (!profile) {
         errors.noprofile = 'There is no profile for this user';
         return res.status(404).json(errors);
       }
       res.json(profile);
     })
     .catch(err => res.status(404).json(err));
});

// @route :  POST api/profile
// @desc  :  Create user profile
// @access:  Private
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
  // Get fields
  const profileFields = {};
  profileFields.user = req.user.id;
  if (req.body.handle) profileFields.handle = req.body.handle;
  if (req.body.company) profileFields.company = req.body.company;
  if (req.body.website) profileFields.website = req.body.website;
  if (req.body.location) profileFields.location = req.body.location;
  if (req.body.status) profileFields.status = req.body.status;
  if (req.body.bio) profileFields.bio = req.body.bio;

  // Skills
  if (typeof req.body.skills !== 'undefined') {
    profileFields.skills = req.body.skills.split(',');
  }

  //Social
  profileFields.social = {};
  if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
  if (req.body.twitter) profileFields.social.twitter = req.body.twitter;

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