/*
Module for connecting to MongoDB and returning database object.
*/

const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();
const URL = process.env.ATLAS_URI;
const dbname = 'Richpanel';

const client = new MongoClient(URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// for storing db object
let _db;

module.exports = {
  // connect function
  connectToServer: (callback) => {
    client.connect((err, db) => {
      if(db) {
        _db = db.db(dbname);
        console.log('Successfully connected to MongoDB!');
      }
      return callback(err);
    });
  },

  // getter function
  getDB: () => _db,
};