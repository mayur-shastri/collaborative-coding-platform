const router = require('express').Router();
const User = require('../Models/User');
const passport = require('passport');
const catchAsync = require('../Utilities/catchAsync');

router.route('/register')
    .post(catchAsync(async (req, res) => {
        const { username, password, email } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).send({ message: 'This email is already being used by another account!', flashType: 'danger'});
        }
        const newUser = new User({ username, email });
        await User.register(newUser, password, (err, user) => {
            if (err) {
                return res.status(500).send({ message: err.message, flashType: 'danger'});
            }
            req.login(user, function (err) {
                if (err) {
                    return res.status(500).send({ message: err.message, flashType: 'danger'});
                }
                res.cookie('session', req.sessionID, setCookieOptions);
                return res.status(200).send({ message: 'Registered Successfully!', flashType: 'success'});
            });
        });
    }));

router.route('/login')
    .post((req, res, next) => {
        passport.authenticate('local', (err, user, info) => {
            if (err) {
                return res.status(500).send({ message: 'Username/Password is incorrect', flashType: 'danger'});
            }
            if (!user) {
                return res.status(401).send({ message: 'Username/Password is incorrect', flashType: 'danger'});
            }
            req.logIn(user, function(err) {
                if (err) {
                    return res.status(500).send({ message: err.message, flashType: 'danger'});
                }
                res.cookie('session', req.sessionID, setCookieOptions);
                return res.status(200).send({ message: 'Login successful!', flashType: 'success' });
            });
        })(req, res, next);
    });

router.route('/logout')
    .get((req, res) => {
            req.logout(req.user, (err)=>{
                if(err){
                    return res.status(500).send({ message: err.message, flashType: 'danger'});
                }
            });
            res.clearCookie('session'); // Clear the cookie on logout
            res.status(200).send({ message: 'Logged out!', flashType: 'success'});
    });

module.exports = router;