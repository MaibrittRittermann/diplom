const { Storage } = require('@google-cloud/storage');
const config = require('config');
const project = config.get('GCP_PROJECT_ID');
const apiKey = config.get('GCP_APPLICATION_CREDENTIALS');
const bucketName = config.get('GCP_BUCKET_NAME')

const gc = new Storage({
    keyFilename: apiKey,
    projectId: project
})

const uploadPhotos  = (file) => new Promise((resolve, reject) => {

// TODO: check if filename allready exist

    const { originalname, buffer}= file;
    const blob = gc.bucket(bucketName).file(originalname.replace(/ /g, "_"));
    const blobStream = blob.createWriteStream({resumable: false});
    blobStream.on('finish', () => {
        const publicUrl = `https://storage.cloud.google.com/${bucketName}/${blob.name}`;
        resolve(publicUrl);
    }).on('error', () => {
        reject(`Kunne ikke uploade billede`)
    }).end(buffer);
});

module.exports.uploadPhotos = uploadPhotos;