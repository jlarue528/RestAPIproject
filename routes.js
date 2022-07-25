'use strict';

const express = require('express');
const { restart } = require('nodemon');
const router = express.Router();
const User = require('./models/Users')

// setup a friendly greeting for the root route
router.get('/', async (req, res) => {
    res.json({
      message: 'Welcome to the REST API project!',
    });
});

// get users
router.get('/users', async (req, res) => {
    const allUsers = await User.findAll();
    res.json(allUsers);
    res.status(200);
});

router.post('/users', async (req, res) => {
    await User.create(req.body)
    res.redirect('/api');
    res.status(201);
});

module.exports = router;