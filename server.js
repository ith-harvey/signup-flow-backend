
const express = require('express')
const app = express()
const port = 3000
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser')


const auth = require('./routes/auth.js')

app.use(bodyParser.json());


// Allow Coors
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", 'https://mysterious-beyond-57369.herokuapp.com/'); //<-- you can change this with a specific url like http://localhost:4200
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});

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



app.listen(process.env.PORT || 5000, function(error) {
  if (error) {
    console.error(error)
  } else {
    console.info("==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port)
  }
})
