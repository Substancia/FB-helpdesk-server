const express = require('express');
const accountsRoutes = express.Router();
const axios = require('axios');
const dbo = require('../db/conn');

const graphUrl = 'https://graph.facebook.com/v8.0';
var isLoggedIn = false;
// var accounts = [];


const unauthorized = () => {
  setTimeout(() => { return {
    status: 401,
    data: { message: 'Unauthorized' }
  }}, 500);
}

const generateJwtToken = account => {
  const tokenPayload = {
    exp: Math.round(new Date(Date.now() + 15*60*1000).getTime() / 1000),
    id: account.id
  }
  return `fake-jwt-token.${btoa(JSON.stringify(tokenPayload))}`;
}

const newUserRegister = async account => {
  await dbo.getDB().collection('accounts').insertOne(account, (err, res) => {
    if(err) throw err;
    console.log('1 user created');
    return res.insertedId;
  });
}


// accountsRoutes.get('/', (req, res) => {
//   if(!isLoggedIn) res.json(unauthorized());
//   res.json(accounts);
// });


accountsRoutes.post('/authenticate', (req, res) => {
  const { accessToken } = req.body;
  axios.get(graphUrl + '/me?access_token=' + accessToken)
    .then(response => {
      const { data } = response;
      if(data.error) return unauthorized(data.error.message);

      let account;
      dbo.getDB().collection('accounts')
        .findOne({ facebookId: data.id }, (err, result) => {
          if(err) throw err;
          if(result == null) {
            account = {
              facebookId: data.id,
              name: data.name,
              extraInfo: `This is some extra info about ${data.name} that is saved in the API`
            }
            newUserRegister(account).then(res => account.id = res);
          } else {
            var { _id, ...result } = result;
            account = { ...result, id: _id };
          }
      
          res.json({ ...account, token: generateJwtToken(account) });
          isLoggedIn = true;
        });
    });
});

module.exports = { accountsRoutes }