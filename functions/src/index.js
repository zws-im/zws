const functions = require("firebase-functions");

if (
  functions.config().sqreen &&
  functions.config().sqreen.app &&
  functions.config().sqreen.app.name &&
  functions.config().sqreen.token
) {
  process.env.SQREEN_APP_NAME = functions.config().sqreen.app.name;
  process.env.SQREEN_TOKEN = functions.config().sqreen.token;

  require("sqreen");
}

const admin = require("firebase-admin");
admin.initializeApp();

// Lots of Firebase stuff must be required after the app is initialized, including endpoints
const getURL = require("./endpoints/getURL");
const shortenURL = require("./endpoints/shortenURL");
const getURLStats = require("./endpoints/getURLStats");

module.exports = {
  getURL,
  shortenURL,
  getURLStats
};
