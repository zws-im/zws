const functions = require("firebase-functions");
const { characters, spacesRegex } = require("../constants");
const dataToResponse = require("../util/dataToResponse");
const admin = require("firebase-admin");

const firestore = admin.firestore();
const urls = firestore.collection("urls");

const cors = require("cors")({ origin: true });

module.exports = functions.https.onRequest(async (req, res) => {
  cors(req, res, () => {});

  const short = req.params["0"].split("/")[0] || req.query.short;
  const { url } = req.query;

  if (short) {
    if (typeof short === "string") {
      if (spacesRegex.test(short)) {
        const binary = short
          // Convert one type of space to zeroes
          .replace(new RegExp(characters[0], "g"), "0")
          // Convert the other type of space to ones
          .replace(new RegExp(characters[1], "g"), "1");

        const ref = urls.doc(binary);
        const doc = await ref.get();

        if (doc && doc.exists) {
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

      if (doc && doc.exists) {
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
