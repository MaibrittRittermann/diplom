const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../middleware/auth');
const {uploadPhotos} = require('../services/uploadPhotoService');
const download = require('../services/downloadPhotoService');
const predict = require('../services/predictService');
const {validateImage} = require('image-validator');
const { Storage } = require('@google-cloud/storage');
const { Photo } = require('../model/Photo');
// const { generateSignedUrl } = require('../services/signedUrlService');
const config = require('config');
const project = config.get('GCP_PROJECT_ID');
const apiKey = config.get('GCP_APPLICATION_CREDENTIALS');
const bucketName = config.get('GCP_BUCKET_NAME')

const upload = multer({
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Kun .png, .jpg and .jpeg format er tilladt!'));
        }
    }, 
});

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

router.post('/', upload.array('files', 50), async(req, res) => {
    try {
        const images = req.files;

        if(!images) 
            return res.status(400).send("Please upload files");
        
        let unPredicted = [];

        for( let image of images) {
            const url = await uploadPhotos(image);
            const { originalname } = image;
            const prediction = await predict(originalname);

            if(!prediction)
                unPredicted.push(originalname);
            else {

                let labels = [];
                prediction.Predictions.map(label => {
                    labels.push(label.label);
                })

                let photo = new Photo({
                    name: originalname,
                    url: url,
                    photographer: req.body.photographer,
                    photographerId: req.body.photographerId,
                    labels: labels
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