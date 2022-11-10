const { Storage } = require('@google-cloud/storage');
const config = require('config');
const project = config.get('GCP_PROJECT_ID');
const apiKey = config.get('GCP_APPLICATION_CREDENTIALS');
const bucketName = config.get('GCP_BUCKET_NAME')

const gc = new Storage({
    keyFilename: apiKey,
    projectId: project
})

const upload  = (files) => new Promise((resolve, reject) => {

    let fileNames = [];

    for( let file of files) {
        const { originalname, buffer}= file;
        const fileName = originalname.replace(/ /g, "_");
        fileNames.push(fileName);
        const blob = gc.bucket(bucketName).file(fileName);
        const blobStream = blob.createWriteStream({resumable: false});
        blobStream.on('finish', () => {
            const publicUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;
            resolve(publicUrl);
        }).on('error', () => {
            reject(`Kunne ikke uploade billede`)
        }).end(buffer);
    }

    // TODO: predictService()

// TODO: If no predictions do trainModelService()

// const prediction = await predict(imageURL);
// console.log(prediction);        
//         if(!prediction) { // return res.status(404).send("Ingen forudsigelser om billedet");
            // trainModel
        // }
        // "Predictions" : forudsigelser

        //TODO: save labels and filenames in DB
});

module.exports.upload = upload;