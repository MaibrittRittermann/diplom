const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {upload} = require('../services/uploadPhotoService');
const download = require('../services/downloadPhotoService');
const {validateImage} = require('image-validator');
const { Storage } = require('@google-cloud/storage');
const { Photo } = require('../model/Photo');
const { generateSignedUrl } = require('../services/signedUrlService');
const config = require('config');
const project = config.get('GCP_PROJECT_ID');
const apiKey = config.get('GCP_APPLICATION_CREDENTIALS');
const bucketName = config.get('GCP_BUCKET_NAME')

const gc = new Storage({
    keyFilename: apiKey,
    projectId: project
})

router.get('/', auth,  async(req, res) => {  
    gc.bucket(bucketName).getFiles().then(([files])=>{
        let fileNames = [];
        files.forEach(file => {
            fileNames.push({file: file.name, url: file.metadata.mediaLink});
        });
        res.send(fileNames);
    }).catch((err) => console.log(err));
});

router.get('/label/:label', async(req, res) => {
    const selection = await Photo.find({labels:   { $regex : new RegExp(req.params.label, "i") }});
// TODO: Get Signed URL or stream images instead

    // const urls = [];
    // selection.forEach(async (file) => {
    //     urls.push(await generateSignedUrl(file.name));
    // })
    res.send(selection);
});

router.get('/:image', auth, async(req, res) => {    
    const imageName = req.params.image;
    if(validateImage(imageName))
        res.send(await download(imageName));
});

router.post('/', auth, async(req, res) => {
    try {
        const images = req.body.files;
    console.log(images); // Empty object
        let unPredicted = [];

        for( let image of images) {
console.log(image);            
            await upload(image);

            const prediction = await predict(blobStream.publicUrl);
            console.log(prediction);        
            if(!prediction)
                unPredicted.push(fileName);
            else {
                let photo = new Photo({
                    name: image.name,
                    url: blobStream.publicUrl,
                    photographer: req.body.photographer,
                    photographerId: req.body.photographerId,
                    labels: prediction
                });
                photo.save();
            }
        }
        res.json({
            uploaded: images,
            nonLabeled: unPredicted
        });
    }catch(ex) {
        console.log(ex);
    }
});

module.exports = router;