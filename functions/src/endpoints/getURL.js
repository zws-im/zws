const spacesToBinary = require("../util/spacesToBinary");
const { spacesRegex } = require("../constants");
const functions = require("firebase-functions");
const admin = require("firebase-admin");

const firestore = admin.firestore();
const urls = firestore.collection("urls");

const cors = require("cors")({ origin: true });

module.exports = functions.https.onRequest(async (req, res) => {
  cors(req, res, () => {});

  // Remove any trailing slashes
  const short = req.params["0"].replace(/\//g, "");

  if (short) {
    if (typeof short === "string") {
      if (spacesRegex.test(short)) {
        const binary = spacesToBinary(short);

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
