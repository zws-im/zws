const functions = require("firebase-functions");

// The Firebase Admin SDK to access the Cloud Firestore.
const admin = require("firebase-admin");
admin.initializeApp();
const collection = admin.firestore().collection("urls");

const cors = require("cors")({
  origin: true
});

exports = functions.https.onRequest(async (req, res) => {
  // `req.params["0"]` is `/zero-width-space-characters`
  // Remove the `/` from the beginning of the message
  const short = req.params["0"].substring(1);

  if (short) {
    if (typeof short === "string") {
      const doc = await collection.doc(short).get();

      const entry = doc.data();

      return cors(req, res, () =>
        entry ? res.redirect(entry.url) : res.status(404).end()
      );
    } else {
      return cors(req, res, () =>
        res
          .status(400)
          .json({ error: "Short ID must be string type" })
          .end()
      );
    }
  } else {
    return cors(req, res, () =>
      res
        .status(400)
        .json({ error: "You must specify a short ID" })
        .end()
    );
  }
});
