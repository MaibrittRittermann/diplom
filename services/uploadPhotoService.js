const { Storage } = require('@google-cloud/storage');
const config = require('config');
const project = config.get('GCP_PROJECT_ID');
const apiKey = config.get('GCP_APPLICATION_CREDENTIALS');
const bucketName = config.get('GCP_BUCKET_NAME')

const gc = new Storage({
    keyFilename: apiKey,
    projectId: project
})

const upload  = (file) => new Promise((resolve, reject) => {
console.log(file);
    const { name, buffer}= file;
console.log("name: " + name);
    const blob = gc.bucket(bucketName).file(name.replace(/ /g, "_"));
    const blobStream = blob.createWriteStream({resumable: false});
    blobStream.on('finish', () => {
        const publicUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;
        resolve(publicUrl);
    }).on('error', () => {
        reject(`Kunne ikke uploade billede`)
    }).end(buffer);
});

module.exports.upload = upload;