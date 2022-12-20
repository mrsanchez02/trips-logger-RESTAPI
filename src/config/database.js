const mongoose = require('mongoose');
require('dotenv').config();

const databaseName = process.env.DB_HOST

const database = () => {
  try {
    mongoose.connect(databaseName)
    console.log('Database connected')
  } catch (error) {
    console.log(error)
    process.exitCode(1)
  }
}

module.exports = database;