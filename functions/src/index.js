const functions = require("firebase-functions");
const debugAgent = require("@google-cloud/debug-agent");
const { version } = require("../package.json");

const serviceContext = {
  service: "functions",
  version
};

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

if (process.env.NODE_ENV === "development") {
  const serviceAccount = require("../../serviceAccount.json");
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://zero-width-shortener.firebaseio.com"
  });

  debugAgent.start({
    projectId: "zero-width-shortener",
    keyFilename: "../../serviceAccount.json",
    serviceContext
  });
} else {
  const profiler = require("@google-cloud/profiler");

  admin.initializeApp();

  profiler.start({
    serviceContext
  });

  debugAgent.start({ serviceContext });
}

// Lots of Firebase stuff must be required after the app is initialized, including endpoints
const getURL = require("./endpoints/getURL");
const shortenURL = require("./endpoints/shortenURL");
const getURLStats = require("./endpoints/getURLStats");

module.exports = {
  getURL,
  shortenURL,
  getURLStats
};
