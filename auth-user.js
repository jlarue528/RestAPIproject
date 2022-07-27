'use strict';

const auth = require('basic-auth');
const { restart } = require('nodemon');
const { Users } = require('./models')

exports.authenticateUser = async (req, res, next) => {
    let message;
    const credentials = auth(req);

    if(credentials) {
        const user = await Users.findOne({ where: {emailAddress: credentials.emailAddress} })
        if(user) {
            const authenticated = bcrypt
                .compareSync(credentials.pass, user.password);
            if(authenticated) {
                console.log(`Authentication Successful for username: ${user.emailAddress}`)
                
                req.currentUser = user;
            } else {
                message = `Authentication failure for username ${user.emailAddress}`;
            }
        } else {
            message = `User not found for username: ${credentials.emailAddress}`
        }
    } else {
        message = 'Auth header not found'
    }

    if(message) {
        console.warn(message);
        res.status(401).json( { message: 'Access Denied'} )
    } else {
        next();
    }
}