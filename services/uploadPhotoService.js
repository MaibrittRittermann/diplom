const { Storage } = require('@google-cloud/storage');
const config = require('config');
const project = config.get('GCP_PROJECT_ID');
const apiKey = config.get('GCP_APPLICATION_CREDENTIALS');
const bucketName = config.get('GCP_BUCKET_NAME');
const publicPath = config.get('GCP_PUBLIC_PATH');

const gc = new Storage({
    keyFilename: apiKey,
    projectId: project
})

const uploadPhotos  = (file) => new Promise((resolve, reject) => {

    const { originalname, buffer}= file;

    // Upload kun nye fotos
    gc.bucket(bucketName).file(originalname).exists().then(([res]) => {

        if(res)
            reject(`Der eksisterer allerede et billede med navnet ${originalname}`);

        else {
            const blob = gc.bucket(bucketName).file(originalname.replace(/ /g, "_"));
            const blobStream = blob.createWriteStream({resumable: false});
            blobStream.on('finish', () => {
                const publicUrl = `${publicPath}${bucketName}/${blob.name}`;
                resolve(publicUrl);
            }).on('error', () => {
                reject(`Kunne ikke uploade billede`)
            }).end(buffer);
        }
    }, (ex) => {     
        console.log('Not in archive ' + ex);
    });
});

module.exports.uploadPhotos = uploadPhotos;