const express = require('express')
const router = express.Router();
const db = require('../../db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const rp = require('request-promise')
require('dotenv').config()


const etherscanURL = 'https://api.etherscan.io/api?'

const eScanApiKey = process.env.ETHSCAN_TOKEN

let priceOfEthUSD

function getBalanceMultiAddress(addressArr) {
  var options = {
    uri: `${etherscanURL}module=account&action=balancemulti&address=${addressArr}&tag=latest&apikey=${eScanApiKey}`,
    headers: {
        'User-Agent': 'Request-Promise'
    },
    json: true // Automatically parses the JSON string in the response
  };
  return rp(options)
}

function mapEthPriceToAddressData(addressData, ArrofBalances, priceOfEthUSD) {

  const turnWeiToEth = balance => balance / Math.pow(10,18)
  let totalCrypto = 0, totalUSD = 0
  addressData = addressData.map( ( addressChunk, i ) => {
      let amountofEth = turnWeiToEth(ArrofBalances[i].balance)


      addressChunk.amount_in_wallet = amountofEth
      addressChunk.amount_in_usd = Number((amountofEth * priceOfEthUSD).toFixed(2))
      totalCrypto += addressChunk.amount_in_wallet
      totalUSD += addressChunk.amount_in_usd
      return addressChunk
    })

  totalUSD = totalUSD.toFixed(2)

  return { totalCrypto, totalUSD, addressData }

}

function getEthPrice() {
  //comparer can be: ethusd or ethbtc
  var options = {
    uri: `${etherscanURL}module=stats&action=ethprice&apikey=${eScanApiKey}`,
    headers: {
        'User-Agent': 'Request-Promise'
    },
    json: true // Automatically parses the JSON string in the response
  };
  return rp(options)

}


module.exports = {
  getBalanceMultiAddress,
  mapEthPriceToAddressData,
  getEthPrice
}
