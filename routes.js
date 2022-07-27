'use strict';

const express = require('express');
const bcrypt = require('bcrypt');
const { restart } = require('nodemon');
const router = express.Router();
const { authenticateUser } = require('./auth-user');
const { Courses, Users } = require('./models');
const { useInRouterContext } = require('react-router-dom');

const middleware = express();
middleware.use(express.json());

function asyncHandler(cb){
    return async (req, res, next)=>{
      try {
        await cb(req,res, next);
      } catch(err){
        next(err);
      }
    };
}

// Get Users
router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
        const user = req.currentUser;
        res.json({
            name: user.firstName,
            username: user.emailAddress
        })
        res.status(200).end();
}));

// Add Users
router.post('/users', asyncHandler(async (req, res) => {
        let firstName = req.body.firstName;
        let lastName = req.body.lastName;
        let emailAddress = req.body.emailAddress;
        let password = req.body.password;
    
        let errors = [];
    
        // Validate new user has firstName field populated
        if(!firstName) {
            errors.push('Please Provide a value for "first name"')
        }

        // Validate new user has lastName field populated
        if(!lastName) {
            errors.push('Please Provide a value for "last name"')
        }

        // Validate new user has email address field populated
        if(!emailAddress) {
            errors.push('Please Provide a value for "email address"')
        }

        // Validate new user has password field populated
        if(!password) {
            errors.push('Please Provide a value for "password"')
        } else {
            password = bcrypt.hashSync(password, 10);
        }

        if(errors.length > 0) {
            res.status(400).json({ errors });
        } else {
            await Users.create({
                firstName: firstName,
                lastName: lastName,
                emailAddress: emailAddress,
                password: password
            });
            res.status(201);
            res.redirect('/');
        }
}));

// Get All Courses
router.get('/courses', asyncHandler( async (req, res) => {
        const allCourses = await Courses.findAll();
        res.json(allCourses);
        res.status(200).end();
}));

// Get A Course
router.get('/courses/:id', asyncHandler( async (req, res) => {
        const course = await Courses.findByPk(req.params.id);
        if(course) {
            res.json(course);
            res.status(200).end();
        } else {
            res.status(404).json({message: 'Course Not Found'});
        }
}));

// Add A New Course
router.post('/courses', authenticateUser, asyncHandler(async (req, res) => {
        const user = req.currentUser;
        let title = req.body.title;
        let description = req.body.description;
        let estimatedTime = req.body.estimatedTime;
        let materialsNeeded = req.body.materialsNeeded;
    
        let errors = [];
        
        // Validate new course has title field populated
        if(!title) {
            errors.push('Please Provide a value for "title"')
        }
    
        // Validate new course has description field populated
        if(!description) {
            errors.push('Please Provide a value for "description"')
        }
    
        if(errors.length < 0) {
            res.status(400).json({ errors });
        } else {
            const newCourse = await Courses.create({
                title: title,
                description: description,
                estimatedTime: estimatedTime,
                materialsNeeded: materialsNeeded
            });
            res.status(201);
            res.redirect(`/courses/${newCourse.id}`);
        } 
}));

// Update A Course
router.put('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
        const user = req.currentUser;
        const courseToEdit = await Courses.findByPk(req.params.id);
        if(courseToEdit) {
            let errors = [];

            courseToEdit.title = req.body.title;
            courseToEdit.description = req.body.description;
            courseToEdit.estimatedTime = req.body.estimatedTime;
            courseToEdit.materialsNeeded = req.body.materialsNeeded;
    
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
            //update course
            courseToEdit.update({
                title: courseToEdit.title,
                description: courseToEdit.description,
                estimatedTime: courseToEdit.estimatedTime,
                materialsNeeded: courseToEdit.materialsNeeded
            });
            courseToEdit.save();
            res.status(204).end();
            } 
        } else {
            res.status(404).json({message: 'Course Not Found'});
        }
}));

// Delete A Course
router.delete('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
        const user = req.currentUser;
        const courseToDelete = await Courses.findByPk(req.params.id);
        if(req.params.id) {
            await courseToDelete.destroy();
            res.status(204).end();
        } else {
            res.status(404).json({message: 'Course Not Found'});
        }
}));

module.exports = router;