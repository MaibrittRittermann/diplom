const express = require('express');
const router = express.Router();

const {DatasetServiceClient} = require('@google-cloud/aiplatform');
const client = new DatasetServiceClient();

router.get('/', async(req, res) => {
    console.log(client);
    res.send(client.testIamPermissions);
});

module.exports = router;