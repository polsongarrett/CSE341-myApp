const express = require('express');
const { check, body } = require('express-validator/check');
const router = express.Router();
const authController = require('../controllers/auth');
const User = require('../models/user');

router.get('/login', authController.getLogin);
router.get('/signup', authController.getSignup);
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Email input must not be empty').normalizeEmail(),
    body('password', 'Password input must not be empty').isLength({ min: 1 }).isAlphanumeric().trim()
  ],
  authController.postLogin
);
router.post(
  '/signup', 
  [
    check('email').isEmail().withMessage('Please enter a valid email').custom( (value, { req }) => {
      return User.findOne({ email: value })
      .then(userDoc => {
        if (userDoc){
          return Promise.reject('Email already exists');
        }
      });
    }).normalizeEmail(),
    body('password', 'Please enter an alphanumeric password at least 6 characters long').isLength({min: 6}).isAlphanumeric().trim(),
    body('confirmPassword').trim().custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords must match'); 
      }
      return true;
    })
  ], authController.postSignup);
router.post('/logout', authController.postLogout);
router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);
router.get('/reset/:token', authController.getNewPassword);
router.post('/new-password', authController.postNewPassword);

module.exports = router;  