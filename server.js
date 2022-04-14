const express = require('express');
const sequelize = require('./config/connection');
const app = express();
const PORT = process.env.PORT || 3006;

// turn on connection to db and server
sequelize.sync({ force: true }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});