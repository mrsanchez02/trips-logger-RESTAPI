const express = require('express');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(require('./routes/index.routes'));

module.exports = app;