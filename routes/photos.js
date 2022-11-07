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
// const CANONICAL_QUERY_STRING = `X-Goog-Algorithm: GOOG4-RSA-SHA256&X-Goog-Credential=1014748497178@cloudservices.gserviceaccount.com&X-Goog-Date=${(new Date()).toISOString()}&X-Goog
// -expires=36000&X-Goog-Signedheaders=host&X-Goog-Signature=`


// example%40example-project.iam.gserviceaccount.com%2F20181026%2Fus%2Fstorage%2Fgoog4_request

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
    const selection = await Photo.find({labels: req.params.label});
    const urls = [];
    // console.log(selection);
    selection.forEach(async (file) => {
        urls.push(await generateSignedUrl(file.name));
    })
    
    console.log("URL = " + urls);
    // res.send(selection.map(x => x.url));
    res.send(urls);
   
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