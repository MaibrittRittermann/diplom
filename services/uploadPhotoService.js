const { Storage } = require('@google-cloud/storage');
const config = require('config');
const project = config.get('GPC_PROJECT_ID');
const apiKey = config.get('GOOGLE_APPLICATION_CREDENTIALS');
const bucketName = config.get('GOOGLE_BUCKET_NAME')

const gc = new Storage({
    keyFilename: apiKey,
    projectId: project
})

const upload  = (file) => new Promise((resolve, reject) => {
    const { originalname, buffer}= file;
    const blob = gc.bucket(bucketName).file(originalname.replace(/ /g, "_"));
    const blobStream = blob.createWriteStream({resumable: false});
    blobStream.on('finish', () => {
        const publicUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;
        resolve(publicUrl);
    }).on('error', () => {
        reject(`Kunne ikke uploade billede`)
    }).end(buffer);
});

module.exports.upload = upload;