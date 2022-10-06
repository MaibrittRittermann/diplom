const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');
const { validate, User } = require('../model/User');


router.get('/', [auth, admin], async(req, res) => {
    res.send(await User.find().sort('name'));
});

router.get('/:id', [auth, admin, validateObjectId], async (req, res) => {
    const user = await User.findById(req.params.id);
    if(!user) return res.status(404).send("Den søgte bruger eksisterer ikke");
    res.send(user);
});

router.post('/', async(req, res) => {
    const {error} = validate(req.body);
    // file deepcode ignore XSS: Validated through Joi
    if(error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email: req.body.email});
    if(user) return res.status(400).send('User allready registered');

    const salt = await bcrypt.genSalt(10);
    const pwd = await bcrypt.hash(req.body.password, salt);

    user = new User({
        name: req.body.name,
        email: req.body.email,
        password: pwd,
        isAdmin: req.body.isAdmin
    });
        
    try {
        await user.save();
        const token = user.generateAuthToken();
        res
            .header('x-auth-token', token)
            .header("access-control-expose-headers", "x-auth-token")
            .send({
                name: req.body.name,
                email: req.body.email,
                password: pwd,
                isAdmin: req.body.isAdmin
            });
    } catch (e) {
        console.log(e.message);
    }
})

router.put('/:id', [auth, admin, validateObjectId], async (req, res) => {

    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);

    const user = await User.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        email: req.body.email,
        password: password,
        isAdmin: req.body.isAdmin
    }, {new : true});

    if(!user) return res.status(404).send('The user with the given ID does not exist');

    res.send(user);
});

router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {

    const user = await User.findByIdAndDelete(req.params.id);
    
    if(!user) return res.status(404).send('The user with the given ID does not exist');

    res.send(user);
});

module.exports = router;