'use strict';

const express = require('express');
const bcrypt = require('bcrypt');
const { restart } = require('nodemon');
const router = express.Router();
const Users = require('./models/Users');
const Courses = require('./models/Courses');
const { authenticateUser } = require('./auth-user');

// Get Users
router.get('/users', authenticateUser, async (req, res) => {
    try {
        const user = req.currentUser;
        const allUsers = await Users.findAll();
        res.json(allUsers);
        res.status(200);
    } catch (err) {
        console.log(err.message);
    }
});

// Add Users
router.post('/users', async (req, res) => {
    try{
        const newUser = await Users.create(req.body)
    
        let errors = [];
    
        // Validate new user has firstName field populated
        if(!newUser.firstName) {
            errors.push('Please Provide a value for "first name"')
        }

        // Validate new user has lastName field populated
        if(!newUser.lastName) {
            errors.push('Please Provide a value for "last name"')
        }

        // Validate new user has email address field populated
        if(!newUser.emailAddress) {
            errors.push('Please Provide a value for "email address"')
        }

        // Validate new user has password field populated
        if(!newUser.password) {
            errors.push('Please Provide a value for "password"')
        } else {
            newUser.password = bcrypt.hashSync(user.password, 10);
        }

        if(errors.length > 0) {
            res.status(400).json({ errors });
        } else {
            res.status(201);
            res.redirect('/api');
        } 
    } catch (err) {
        console.log(err.message)
    }
});

// Get Courses
router.get('/courses', async (req, res) => {
    try {
        const allCourses = await Courses.findAll();
        res.json(allCourses);
        res.status(200);
    } catch (err) {
        console.log(err.message);
    }  
});

// Get A Course
router.get('/courses/:id', async (req, res) => {
    try {
        const course = await Courses.findByPk(req.param.id);
        res.json(course);
        res.status(200);
    } catch (err) {
        console.log(err.message);
    }
});

// Add A New Course
router.post('/courses', authenticateUser, async (req, res) => {
    try {
        const user = req.currentUser;
        const newCourse = await Courses.create(req.body);
    
        let errors = [];
        
        // Validate new course has title field populated
        if(!newCourse.title) {
            errors.push('Please Provide a value for "title"')
        }
    
        // Validate new course has description field populated
        if(!newCourse.description) {
            errors.push('Please Provide a value for "description"')
        }
    
        if(errors.length < 0) {
            res.status(400).json({ errors });
        } else {
            res.status(201);
            res.redirect(`/courses/${newCourse.id}`);
        }   
    } catch (err) {
        console.log(err.message);
    }
});

// Update A Course
router.put('/courses/:id', authenticateUser, async (req, res) => {
    try {
        const user = req.currentUser;
        const courseToEdit = await Courses.findByPk(req.params.id);
    
        let errors = [];
    
        // Validate course has required field 'title' populated
        if(!courseToEdit.title) {
            errors.push('Please Provide a value for "title"');
        }
    
        // Validate course has required field 'description' populated
        if(!courseToEdit.description) {
            errors.push('Please Provide a value for "description"');
        }
    
        if(errors.length > 0) {
            res.status(400).json({ errors });
        } else {
            courseToEdit.set({
                title: req.params.title,
                description: req.params.description,
                estimatedTime: req.params.estimatedTime,
                materialsNeeded: req.params.materialsNeeded
            });
            courseToEdit.save();
            res.status(204).end();
        } 
    } catch (err) {
        console.log(err.message);
    }
});

// Delete A Course
router.delete('/courses/:id', authenticateUser, async (req, res) => {
    try {
        const user = req.currentUser;
        const courseToDelete = await Courses.findByPk(req.params.id);
        await courseToDelete.destroy();
        res.status(204);
    } catch (err) {
        console.log(err.message);
    }
});

module.exports = router;