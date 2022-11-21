const { Storage } = require('@google-cloud/storage');
const config = require('config');
const project = config.get('GCP_PROJECT_ID');
const apiKey = config.get('GCP_APPLICATION_CREDENTIALS');
const bucketName = config.get('GCP_BUCKET_NAME');

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
    try {

      const [url] = await gc
      .bucket(bucketName)
      .file(fileName)
      .getSignedUrl(options);
      
console.log(`The signed url for ${fileName} is ${url}.`);
      
      return url;
    } catch(ex) {
      console.log(ex);
    }
  }

  module.exports.generateSignedUrl = generateSignedUrl;