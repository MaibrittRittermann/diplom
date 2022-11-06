const { Storage } = require('@google-cloud/storage');
const config = require('config');
const project = config.get('GPC_PROJECT_ID');
const apiKey = config.get('GOOGLE_APPLICATION_CREDENTIALS');
const bucketName = config.get('GOOGLE_BUCKET_NAME')

const gc = new Storage({
    keyFilename: apiKey,
    projectId: project
})

module.exports = async function downloadFile(fileName) {
    const options = {
        destination:  process.env.USERPROFILE + "/Downloads/" + fileName 
    };

    await gc.bucket(bucketName).file(fileName).download(options);
}