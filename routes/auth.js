const express = require('express')
const router = express.Router();
const db = require('../db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
require('dotenv').config()
const dbQueryandUtilandUtil = require('./queriesAndUtil')


router.post('/signup', function(req, res, next) {
  // essentially a GET request
  //check the token's ID pull the record in the system and return to user
  jwt.verify(req.body.token, process.env.JWT_SECRET, (err,decoded) => {

    dbQueryandUtil.getUserById(decoded.id).then( user => {
      user = user[0]

      if (!user) {
        res.status(401).json({
          error: true,
          message: 'name or Password is Wrong'
        });
      }
      const cliResp = dbQueryandUtil.buildUserPlusToken(user)
      res.json(cliResp);
    });

  })
})


router.put('/signupsave', function (req, res, next) {
  // check if user exists -> if they do perform a PUT
  // if they don't:
    // ----> check if the info is already in db
    // ---> if not insert

  // const hash = bcrypt.hashSync(req.body.password.trim(), 10);

  if (req.body.token) {
    // user already has information in DB (they have a token)
    jwt.verify(req.body.token, process.env.JWT_SECRET, function(err, decoded) {

    dbQueryandUtil.getUserById(decoded.id).then( user => {
        user = user[0]
        const reInsertUser = {
          id: decoded.id,
          name: req.body.name.trim(),
          email: req.body.email,
          hash_pass: req.body.password.trim(),
        };

        if(req.body.subscription){
          reInsertUser.subscription = req.body.subscription
        }

        db('users').update(reInsertUser).where('id',reInsertUser.id).returning('id').then( response => {

          const cliResp = dbQueryandUtil.buildUserPlusToken(reInsertUser)

          res.json(cliResp);
        })
      })
    })
  } else {
    // don't have a token (haven't inserted || cleared browser)
      // if user enters in a name already in DB
      //  --> return 'user already exists'
      // else
      // --> insert

  db('users').where('name',req.body.name).select('*').then( user => {
    user = user[0]
    if (user) {
      res.status(401).json({
        error: true,
        message: 'User already exists in system. Please try registering with a different name'
      });
    } else {
        const user = {
         name: req.body.name.trim(),
         email: req.body.email,
         hash_pass: req.body.password.trim()
        }

        db('users').insert(user).returning('id').then( response => {
          user.id = response[0]
          const cliResp = dbQueryandUtil.buildUserPlusToken(user)
          res.json(cliResp);
        })
    }
  }).catch( err => {
  console.log(err);
  })
}
})


router.get('/', function (req,res,next) {
  console.log('hitting Route!!!')
  res.send('Welcome to auth!')
})


module.exports = router
