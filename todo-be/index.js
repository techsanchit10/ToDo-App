require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');
const httpServer = http.createServer(app);
const cors = require('cors');
const api = require('./api');
const appSettings = require('./config/appSettings');
require('./api/db.connection');

// enable cross domain access
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, PUT, POST, DELETE, HEAD, OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-access-token, visitorid, language"
  );
  next();
});
app.use(cors());

// to parse the body
app.use(express.json());

// connect to api
app.use("/api", api);


httpServer.listen(appSettings.port, () => {
  console.log('Server is running at:', appSettings.port);
})