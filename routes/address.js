const express = require('express')
const router = express.Router();
const db = require('../db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const utils = require('./utils')
const ethscan = require('./utilfolder/etherscan.js')

// effectivley a GET request to get all addresses
router.post('/user', function (req, res, next) {
  let token = utils.parseToken(req.body.token)
  const id = token.id.toString()
  db('addresses').where('user_id', id).then( response => {
    response.reverse() // reverse order - most recent address is last
    res.send(response)
  })
})


router.get('/ethprice', function (req, res, next) {
  ethscan.getEthPrice().then( response => {
  res.send(response.result.ethusd)
  })
})

// Get balance of and return all addresses
router.post('/balance/user', function (req, res, next) {
  const id =  utils.parseToken(req.body.token).id.toString()
  db('addresses').where('user_id', id).then( response => {

    if(response) {
      let addressData = response

      //pull out addresses
      const addressArr = response.map( obj => obj.address)

      Promise.all([
        ethscan.getEthPrice(),
        ethscan.getBalanceMultiAddress(addressArr)])

        .then(values => {
        let ethPriceinUSD = Number(values[0].result.ethusd)

        res.send(ethscan.mapEthPriceToAddressData(addressData,  values[1].result, ethPriceinUSD))
        })
        .catch(function (err) {
          console.log('API call failed:', err) // API call failed...
        });

    }
  })
})


// add an address and return success message
router.post('/', function(req, res, next) {
  let token = utils.parseToken(req.body.token)

  const data = {
    address: req.body.address,
    user_id: token.id.toString()
  }

  db('addresses').insert(data).then( response => {
    if(response) {
      res.send('address was successfully added!')
    }
  })
})

// delete an address return success mssg
router.delete('/:id', function(req, res, next) {
  const id = req.params.id
  db('addresses').where('id', id).del().then( response => {
    if(response) {
        res.send('addresses was removed successfully')
    }
  })
})

module.exports = router
