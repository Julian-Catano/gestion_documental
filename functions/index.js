const {onCall} = require("firebase-functions/v2/https");
const {Storage} = require("@google-cloud/storage");

const storage = new Storage();
const bucketName = "tu-bucket.appspot.com";

exports.getSignedUrl = onCall(async (request) => {
  const filePath = request.data.filePath;
  if (!filePath) {
    throw new Error("Debe enviar el filePath");
  }

  const options = {
    version: "v4",
    action: "read",
    expires: Date.now() + 15 * 60 * 1000, // 15 minutos
  };

  try {
    const [url] = await storage
        .bucket(bucketName)
        .file(filePath)
        .getSignedUrl(options);
    return {url};
  } catch (error) {
    throw new Error("Error al generar URL firmada: " + error.message);
  }
});
