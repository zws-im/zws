const { hostnames } = require("../constants");
const binaryToSpaces = require("../util/binaryToSpaces");
const functions = require("firebase-functions");
const admin = require("firebase-admin");

const firestore = admin.firestore();
const urls = firestore.collection("urls");

const cors = require("cors")({ origin: true });

module.exports = functions.https.onRequest(async (req, res) => {
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
          .json({ short: binaryToSpaces(doc.id) })
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
