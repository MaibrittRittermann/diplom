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
const project = config.get('GPC_PROJECT_ID');
const apiKey = config.get('GOOGLE_APPLICATION_CREDENTIALS');
const bucketName = config.get('GOOGLE_BUCKET_NAME')

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
    console.log(`Find billeder om ${req.params.label}`);
    const selection = await Photo.find({labels:   { $regex : new RegExp(req.params.label, "i") }});
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
        const image = req.file;
        const imageUrl = await upload(image);
        res.json({
            message: `Billedet er overført`,
            url: imageUrl
        });
    }catch(ex) {
        console.log(ex);
    }
});

module.exports = router;