const express = require('express')
const router = express.Router();
const db = require('../db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const utils = require('./utils')

router.post('/signin', function(req, res, next) {
  console.log('body', req.body);
  db('users').where('username',req.body.username).select('*').then( user => {
    console.log('user',user);
    user = user[0]
    if (!user) {
      console.log('in bad if');
      res.status(401).json({
        error: true,
        message: 'Username or Password is Wrong'
      });
    }
    console.log('pass from db', user.hash_pass);
    console.log('pass from user', req.body.password);
    bcrypt.compare(req.body.password, user.hash_pass, function (err, valid) {
      if (!valid) {
       return res.status(404).json({
               error: true,
               message: 'Username or Password is Wrong'
         });
      }
      delete user.hash_pass
      delete user.created_at
      delete user.updated_at
      console.log('users',user)
      let data = {
        id: user.id,
        username: user.username
      }
      const token = jwt.sign(data, 'AKJOISDNFLKHALKNDSFIOHSLKJDSFLKHSDIOES');
      res.json({
         user: user,
         token: token
       });
     })
  }).catch( err => {
    console.log(err);
  })
});


router.post('/signup', function (req, res, next) {
  const body = req.body;
  console.log('body',req.body);
  const hash = bcrypt.hashSync(body.password.trim(), 10);
  const user = {
    username: body.username.trim(),
    hash_pass: hash,
  };

  db('users').insert(user).then( response => {
    delete user.hash_pass
    const token = jwt.sign(user, 'AKJOISDNFLKHALKNDSFIOHSLKJDSFLKHSDIOES');
    console.log(token)
    res.json({
       user: user,
       token: token
    });
  })
});

// router.delete('/logout', funciton (req,res,next) {
//
// })

router.get('/', function (req,res,next) {
  res.send('Welcome to auth!')
})


module.exports = router
