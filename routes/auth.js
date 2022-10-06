const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Joi = require('joi');

const { User } = require('../model/User');

router.post('/', async(req, res) => {
    const {error} = validate(req.body);
    // file deepcode ignore XSS: Input validated through Joi
    if(error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Ugyldig email eller adgangskode');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send('Ugyldig email eller adgangskode');

    res.send(user.generateAuthToken());
});

function validate (req) {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).email().required(),
        password: Joi.string().min(8).max(255).required()
    });
    return schema.validate(req);
}

module.exports = router;