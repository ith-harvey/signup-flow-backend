
const jwt = require('jsonwebtoken');
const db = require('../db')
require('dotenv').config()



function getUserById(id) {
  return db('users').where('id', id).select('*')
}

function buildUserPlusToken(user){
  delete user.created_at
  delete user.updated_at

  let data = { id: user.id, name: user.name }
  const token = jwt.sign(data, process.env.JWT_SECRET);

  return { user, token: token }
}

module.exports = {
  getUserById,
  buildUserPlusToken
}
