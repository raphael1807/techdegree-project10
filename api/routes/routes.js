// Load modules
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { User, Course } = require('../models');
const { authenticateUser } = require('../middleware/auth-user');
const auth = require('basic-auth');


// ------------------------------------------
// ↓↓↓↓↓↓↓↓↓↓ USERS ROUTES ↓↓↓↓↓↓↓↓↓↓
// ROUTE 1 : USERS GET /api/users 200
// Returns the currently authenticated user.
// ------------------------------------------
router.get('/users', authenticateUser, async (req, res) => {
    const user = req.currentUser;
    res.json({
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.emailAddress
    });
});

// ------------------------------------------
// ROUTE 2 : USERS POST /api/users 201 
// Creates a user, sets the Location header to "/", and returns no content.
// ------------------------------------------
router.post('/users', async (req, res) => {
    const user = req.body;
    const errors = [];

    if (!user.firstName) {
        errors.push('Please provide a value for "firstName"');
    }

    if (!user.lastName) {
        errors.push('Please provide a value for "lastName"');
    }

    if (!user.emailAddress) {
        errors.push('Please provide a value for "emailAddress"');
    }

    if (!user.password) {
        errors.push('Please provide a value for "password"');
    }

    if (errors.length > 0) {
        res.status(400).json({ errors });
    } else {
        try {
            const newUser = await User.create(user);
            res.location('/').status(201).end();
        } catch (error) {
            if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
                const errors = error.errors.map(err => err.message);
                res.status(400).json({ errors });
            } else {
                throw error;
            }
        }

    }
});


// ------------------------------------------
// ↓↓↓↓↓↓↓↓↓↓ COURSES ROUTE ↓↓↓↓↓↓↓↓↓↓
// ROUTE 1 : GET /api/courses 200
// Returns a list of courses (including the user that owns each course).
// ------------------------------------------
router.get('/courses', async (req, res) => {
    try {

        const courses = await Course.findAll({
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            include: {
                model: User,
                attributes: ['id', 'firstName', 'lastName', 'emailAddress']
            }
        });
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ------------------------------------------
// ROUTE 2 : GET /api/courses/:id 200
// Returns the course (including the user that owns the course) for the provided course ID.
// ------------------------------------------
router.get('/courses/:id', async (req, res) => {
    const course = await Course.findByPk(req.params.id, {
        include: [
            {
                model: User,
                as: 'User',
                attributes: [
                    'id',
                    'firstName',
                    'lastName',
                    'emailAddress'
                ]
            }
        ],
        attributes: [
            'id',
            'title',
            'description',
            'estimatedTime',
            'materialsNeeded'
        ]
    });
    res.status(200).json(course);
});


// ------------------------------------------
// ROUTE 3 : POST /api/courses 201
// Creates a course, sets the Location header to the URI for the course, and returns no content.
// ------------------------------------------
router.post('/courses', authenticateUser, async (req, res) => {
    console.log('Fuck you BITACdfdsfdsf');
    const course = req.body;
    const errors = [];

    if (!course.title) {
        errors.push('Please provide a value for "title"');
    }

    if (!course.description) {
        errors.push('Please provide a value for "description"');
    }

    if (errors.length > 0) {
        res.status(400).json({ errors });
    } else {
        const credentials = auth(req);
        const user = await User.findOne({
            where: {
                emailAddress: credentials.name
            }
        });
        const userId = user.id;
        req.body.userId = userId;

        const newCourse = await Course.create(req.body);
        res.location(`/courses/${newCourse.id}`).status(201).end();
    }
});

// ------------------------------------------
// ROUTE 4 : PUT /api/courses/:id 204
// Updates a course and returns no content.
// ------------------------------------------
router.put('/courses/:id', authenticateUser, async (req, res) => {
    const course = req.body;
    const errors = [];

    if (!course.title) {
        errors.push('Please provide a value for "title"');
    }

    if (!course.description) {
        errors.push('Please provide a value for "description"');
    }

    if (errors.length > 0) {
        res.status(400).json({ errors });
    } else {
        const course = await Course.findByPk(req.params.id);
        const credentials = auth(req);
        const user = await User.findOne({
            where: {
                emailAddress: credentials.name
            }
        });

        if (course.userId === user.id) {
            await course.update(req.body);
            res.location(`/courses/${req.params.id}`).status(204).end();
        } else {
            res.status(403).json({ error: 'Not the correct user' });
        }
    }
});

// ------------------------------------------
// ROUTE 5 : DELETE /api/courses/:id 204
// Deletes a course and returns no content.
// ------------------------------------------
router.delete('/courses/:id', authenticateUser, async (req, res) => {
    const user = req.currentUser;
    let course = await Course.findByPk(req.params.id, {
        include: User,
    });

    if (course) {
        // Delete only if auth. user === course user
        if (course.userId === user.id) {
            try {
                await course.destroy();
                res.status(204).end();
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        } else {
            // access not allowed.
            res.sendStatus(403);
        }
    } else {
        res.sendStatus(404);
    }

});

module.exports = router;