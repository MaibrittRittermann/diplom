const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../middleware/auth');
const {uploadPhotos} = require('../services/uploadPhotoService');
const predict = require('../services/predictService');
const { Storage } = require('@google-cloud/storage');
const { Photo } = require('../model/Photo');
const { Royalty } = require('../model/Royalty');
const { generateSignedUrl } = require('../services/signedUrlService');
const config = require('config');
const project = config.get('GCP_PROJECT_ID');
const apiKey = config.get('GCP_APPLICATION_CREDENTIALS');
const bucketName = config.get('GCP_BUCKET_NAME');
const publicPath = config.get('GCP_PUBLIC_PATH');

/** Begræns upload af filer til kun billeder af typerne jpg og png */
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

/** Return Photo stream */
router.get('/:photo', auth,  async(req, res) => {  
    try {
        const file = req.params.photo;
        let contetType = `image/${file.split('.').pop()}`;
        
        res.writeHead(200, {
            'Content-Type': `${contetType}`,
            'Content-Disposition': `attachment;filename=${file}`
        });
        const filestream = gc.bucket(bucketName).file(file).createReadStream();
        filestream.pipe(res);

    } catch (ex) {
        console.log(ex);
    }
});

/** Get by Searchterm */
router.get('/label/:label', auth, async(req, res) => {
    const keyword = req.params.label.replace(/[^a-zA-Z_0-9-]/g,'');
    const selection = await Photo.find({labels:   { $regex : new RegExp(keyword, "i") }});
    res.send(selection);
});

/** Upload photos */
router.post('/', [upload.array('files', 50), auth], async(req, res) => {
    try {
        const images = req.files;

        if(!images) 
            return res.status(400).send("Der skal vedhæftes billedet før upload");
        
        let predicted = [];
        let unPredicted = [];
        let existing = [];

        for( let image of images) {  
            let url = '';
            const { originalname } = image;

            try {
                url = await uploadPhotos(image);
            } catch (ex) {
                existing.push(image.originalname);
                continue;
            }
            
            try {
                const prediction = await predict(originalname);
                if(!prediction) {
                    unPredicted.push({name: originalname, url: url});
                } else {
                    let labels = [];
                    prediction.Predictions.map(label => {
                        labels.push(label.label);
                    })
                    
                    let photo = new Photo({
                        name: originalname,
                        photographer: req.body.photographer,
                        photographerId: req.body.photographerId,
                        url: url,
                        date: new Date(),
                        labels: labels
                    });
                    photo.save();
                    predicted.push({name: originalname, predicts: labels, url: url});
                }          
            } catch (ex) {
                console.log(ex);
            }
        }
        res.json({
            predicted: predicted,
            unPredicted: unPredicted,
            existing: existing
        });
    }catch(ex) {
        console.log(ex);
        res.status(400).send(ex);
    }
});

/** Download Photo and provide royalty */
// TODO: validatedata and split function royalty to separate function
router.post('/download', [upload.array(), auth], async(req, res) => {

    const file = req.body.photo;

    try {

        const royalty = new Royalty({ 
            photo: file,
            photographerId: req.body.photographerId,
            userId: req.body.userId,
            channel: req.body.channel,
            mediaType: req.body.mediaType,
            useDate: req.body.date
        });

        await royalty.save();

        let contetType = `image/${file.split('.').pop()}`;
        
        res.writeHead(200, {
            'Content-Type': `${contetType}`,
            'Content-Disposition': `attachment;filename=${file}`
        });

        const filestream = gc.bucket(bucketName).file(file).createReadStream();
        filestream.pipe(res);

    } catch (ex) {
        console.log(ex);
        res.status(400).send(ex);
    }
});

module.exports = router;