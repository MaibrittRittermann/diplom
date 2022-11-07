const { Storage } = require('@google-cloud/storage');
const config = require('config');
const project = config.get('GPC_PROJECT_ID');
const apiKey = config.get('GOOGLE_APPLICATION_CREDENTIALS');
const bucketName = config.get('GOOGLE_BUCKET_NAME')

const gc = new Storage({
    keyFilename: apiKey,
    projectId: project
})

async function generateSignedUrl(fileName) {
    // These options will allow temporary read access to the file
    const options = {
      version: 'v4', // defaults to 'v2' if missing.
      action: 'read',
      expires: Date.now() + 1000 * 60 * 60, // one hour
      
    };
console.log("Sign url for " + fileName);
    // Get a v4 signed URL for the file
    const [url] = await gc
      .bucket(bucketName)
      .file(fileName)
      .getSignedUrl(options);

    console.log(`The signed url for ${fileName} is ${url}.`);

    return url;
  }

  module.exports.generateSignedUrl = generateSignedUrl;