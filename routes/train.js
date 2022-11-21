const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
var multer = require('multer');
const upload = multer({});
const createTrainingPipelineImageClassification = require('../services/trainModelService');
const { Photo } = require('../model/Photo');
const config = require('config');
const publicPath = config.get('GCP_PUBLIC_PATH');
const bucketName = config.get('GCP_BUCKET_NAME');

router.post('/', [upload.array(), auth], async(req, res) => { 
    try {
        const photoName = req.body.photo;
        const labels = (req.body.labels.split(',')).map(s => s.trim());

        if(!photoName || !labels) 
            return res.status(400).send("Udfyld søgeord for foto!");

        const exist = await Photo.findOne({name: { $regex : new RegExp(photoName, "i") }});
        if(exist)
            return res.status(400).send("Billedet er allerede registreret i databasen");
        
        const url = `${publicPath}${bucketName}/${photoName}`;    

        let photo = new Photo({
            name: photoName,
            photographer: req.body.photographer,
            photographerId: req.body.photographerId,
            url: url,
            date: new Date(),
            labels: labels,
            untrained: true
        });
        photo.save();
            
        labels.map(async(label) => {
            const selection = await Photo.find({labels:   { $regex : new RegExp(label, "i") }, untrained: true});

            if(selection.length > 15) {
                console.log("Train model with " + label);
                createTrainingPipelineImageClassification(label, selection);
                // Set selection untrained = false;
            }
        });

        res.json({
            photo: photoName,
            labeled: true
        });
    }catch(ex) {
        console.log(ex);
    }
});

module.exports = router;