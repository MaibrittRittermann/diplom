const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const predict = require('../services/predictService');
const isImageURL = require('image-url-validator').default;

router.post('/', [auth], async (req, res) => {
    
    const imageURL = await isImageURL(req.body.filename);
    const prediction = await predict(imageURL);
    if(!prediction) return res.status(404).send("Ingen forudsigelser om billedet");
    res.send(prediction);
});

module.exports = router;