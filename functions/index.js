const functions = require("firebase-functions");

// The Firebase Admin SDK to access the Cloud Firestore.
const admin = require("firebase-admin");
admin.initializeApp();

const cors = require("cors")({
  origin: true
});

exports.getURL = functions.https.onRequest(async (req, res) => {
  const { short } = req.query;

  const result = await admin
    .firestore()
    .collection("urls")
    .doc(short)
    .get();

  const okok = result.data();

  if (okok) {
    return cors(req, res, () => res.redirect(okok.url));
  } else {
    return cors(req, res, () => res.status(404).end());
  }
});

exports.shortenURL = functions.https.onRequest(async (req, res) => {
  const { url } = req.query;
  const spaces = ["\u180e", "\u200b"];
  const short = new Array(24)
    .fill(0)
    .map(() => (Math.random() > 0.5 ? spaces[0] : spaces[1]))
    .join("");

  await admin
    .firestore()
    .collection("urls")
    .doc(short)
    .set({ url });

  return cors(req, res, () => res.status(201).json({ url }));
});
