const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const predict = require('../services/predictService');

router.post('/', [auth], async (req, res) => {
    
    // Todo: validate imageURL and image
    const prediction = await predict(req.body.filename);
    if(!prediction) return res.status(404).send("Ingen forudsigelser om billedet");
    res.send(prediction);
});

module.exports = router;