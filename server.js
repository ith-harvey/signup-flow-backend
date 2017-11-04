
const express = require('express')
const app = express()
const port = 3000
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser')


const auth = require('./routes/auth.js')

app.use(bodyParser.json());

app.use(allowCrossDomain)

// Cross
function allowCrossDomain(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, Content-Length, X-Requested-With'
  );

  if ('OPTIONS' == req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
}


// routes
app.use('/auth', auth)

app.get("/", function(req, res) {
  console.log('hitting and SHOULD ABKLAJF:LKASJ FL:KJSF :LAKFJS ')
  res.send('Welcome to root!')
})



app.listen(port, function(error) {
  if (error) {
    console.error(error)
  } else {
    console.info("==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port)
  }
})
