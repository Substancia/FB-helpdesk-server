const express = require('express');
const cors = require('cors');
const { accountsRoutes } = require('./routes/accounts');
const dotenv = require('dotenv');
dotenv.config();

const App = express();
App.use(express.json());
App.use(cors());
const dbo = require('./db/conn');
const PORT = process.env.PORT || 8080;

App.use('/accounts', accountsRoutes);

App.listen(PORT, () => {
  dbo.connectToServer(err => {
    if(err) throw err;
  });
  console.log('Server running at', PORT);
});