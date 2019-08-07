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

const hostnames = [
  "zws.im",
  "zero-width-shortener.firebaseapp.com",
  "zero-width-shortener.web.app",
  "zws.jonahsnider.ninja",
  "zerowidthshortener.netlify.com"
];

const admin = require("firebase-admin");
admin.initializeApp();

const firestore = admin.firestore();
const urls = firestore.collection("urls");

const cors = require("cors")({ origin: true });

// Space characters that are used in shortened URLs
const spaces = ["\u200C", "\u200b"];
const regexForSpaces = /^(\u180e|\u200b|\u200c)+$/;

/**
 * Convert binary numbers to zero-width spaces
 * @param {number} binary Binary values to convert
 */
const binaryToSpaces = binary =>
  Number(binary)
    // Convert to string
    .toString()
    // Replace zeroes with spaces
    .replace(/0/g, spaces[0])
    // Replace ones with spaces
    .replace(/1/g, spaces[1]);

/**
 * Helper function for URL stats.
 * @param {Object} data
 */
const dataToResponse = data => ({ shorten: data.stats.shorten, get: data.stats.get, usage: data.usage });

exports.getURL = functions.https.onRequest(async (req, res) => {
  cors(req, res, () => {});

  // Remove any trailing slashes
  const short = req.params["0"].replace(/\//g, "");

  if (short) {
    if (typeof short === "string") {
      if (regexForSpaces.test(short)) {
        const binary = short
          // Convert one type of space to zeros or use the legacy \u180e character (caused problems on iOS)
          .replace(new RegExp(`${spaces[0]}|\u180e`, "g"), "0")
          // Convert the other type of space to ones
          .replace(new RegExp(spaces[1], "g"), "1");

        const ref = urls.doc(binary);
        const doc = await ref.get();
        const data = doc.data();

        if (doc.exists) {
          // Increment the counter for this URL and record the timestamp in the background
          ref.update({
            "stats.get": admin.firestore.FieldValue.increment(1),
            "usage.get": admin.firestore.FieldValue.arrayUnion(new Date())
          });

          return res.redirect(301, data.url);
        } else {
          return res.status(404).end();
        }
      } else {
        return res
          .status(400)
          .json({ error: "Short ID contained invalid characters" })
          .end();
      }
    } else {
      return res
        .status(400)
        .json({ error: "Short ID must be string type" })
        .end();
    }
  } else {
    return res
      .status(400)
      .json({ error: "You must specify a short ID" })
      .end();
  }
});

exports.shortenURL = functions.https.onRequest(async (req, res) => {
  cors(req, res, () => {});

  const { url } = req.query;

  if (url) {
    let urlInstance;
    if (typeof url === "string") {
      try {
        urlInstance = new URL(url);
      } catch (error) {
        return res
          .status(400)
          .json({ error: "Not a valid URL" })
          .end();
      }

      if (hostnames.includes(urlInstance.hostname)) {
        return res.status(400).json({
          error: "Shortening a URL containing the URL shortener's hostname is disallowed"
        });
      }

      if (url.length > 500) {
        return res
          .status(413)
          .json({ error: "URL can not exceed 500 characters" })
          .end();
      }

      // Find documents that have the same long URL (duplicates)
      const query = urls.where("url", "==", url);
      const snapshot = await query.get();
      const { docs } = snapshot;
      const [doc] = docs;

      if (doc) {
        // Someone already shortened this URL so give the old one to them

        // Increment the counter for this URL by one and record the timestamp in the background
        doc.ref.update({
          "stats.shorten": admin.firestore.FieldValue.increment(1),
          "usage.shorten": admin.firestore.FieldValue.arrayUnion(new Date())
        });

        return res
          .status(200)
          .json({ short: `${binaryToSpaces(doc.id)}/` })
          .end();
      } else {
        // This is a new URL so enter it into the database

        // Count is a number used for generating the short ID
        const countRef = firestore.collection("settings").doc("short");
        const countDoc = await countRef.get();
        const { count } = countDoc.data();

        // The math here converts the number to binary (decimal => binary string => binary number)
        const short = binaryToSpaces(parseInt(Number(count).toString(2), 10));

        await Promise.all([
          // Set the shortened URL document
          urls
            .doc(Number(count).toString(2))
            .set({ url, stats: { get: 0, shorten: 1 }, usage: { get: [], shorten: [new Date()] } }),
          // Set the count to be one higher
          countRef.update({ count: admin.firestore.FieldValue.increment(1) })
        ]);

        return res
          .status(201)
          .json({ short })
          .end();
      }
    } else {
      return res
        .status(400)
        .json({ error: "URL must be string type" })
        .end();
    }
  } else {
    return res
      .status(400)
      .json({ error: "You must specify a URL" })
      .end();
  }
});

exports.getURLStats = functions.https.onRequest(async (req, res) => {
  cors(req, res, () => {});

  const short = req.params["0"].split("/")[0] || req.query.short;
  const { url } = req.query;

  if (short) {
    if (typeof short === "string") {
      if (regexForSpaces.test(short)) {
        const binary = short
          // Convert one type of space to zeroes
          .replace(new RegExp(spaces[0], "g"), "0")
          // Convert the other type of space to ones
          .replace(new RegExp(spaces[1], "g"), "1");

        const ref = urls.doc(binary);
        const doc = await ref.get();

        if (doc.exists) {
          return res
            .status(200)
            .json(dataToResponse(doc.data()))
            .end();
        } else {
          return res.status(404).end();
        }
      } else {
        return res
          .status(400)
          .json({ error: "Short ID contained invalid characters" })
          .end();
      }
    } else {
      return res
        .status(400)
        .json({ error: "Short ID must be string type" })
        .end();
    }
  } else if (url) {
    if (typeof url === "string") {
      try {
        new URL(url);
      } catch (error) {
        return res
          .status(400)
          .json({ error: "Not a valid URL" })
          .end();
      }

      if (url.length > 500) {
        return res
          .status(413)
          .json({ error: "URL can not exceed 500 characters" })
          .end();
      }

      // Find documents that have the same long URL (duplicates)
      const query = urls.where("url", "==", url);
      const snapshot = await query.get();
      const { docs } = snapshot;
      const [doc] = docs;
      const data = doc.data();

      if (doc.exists) {
        return res
          .status(200)
          .json(dataToResponse(data))
          .end();
      } else {
        return res.status(404).end();
      }
    } else {
      return res
        .status(400)
        .json({ error: "URL must be string type" })
        .end();
    }
  } else {
    return res
      .status(400)
      .json({ error: "You must specify a short ID or a URL" })
      .end();
  }
});
