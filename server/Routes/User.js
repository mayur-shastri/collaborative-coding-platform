const router = require('express').Router();
const {isLoggedIn} = require('../Middleware/Auth');
const User = require('../Models/User');
const catchAsync = require('../Utilities/catchAsync');

router.route(':id/userdata')
    .get(isLoggedIn, catchAsync(async (req,res)=>{
        // const id = req.user._id;
        const {id} = req.params;
        // const user = await User.findById(id).populate('quizzes');
        const user = await User.findById(id).populate({
            path: 'quizzes',
            populate: {
                path: 'slides',
                model: 'slide'
            }
        });
        if(user){
            res.status(200).send({ user: user});
        } else{
            res.status(401).send({ message: 'Not logged in!' });
        }
    }));

router.route('/user-quiz-sessions')
    .get(isLoggedIn, catchAsync(async (req,res)=>{
        const id = req.user._id;
        const user = await User.findById(id).populate('participations');
        if(user){
            res.status(200).send({ user_id: id ,participations: user.participations});
        } else{
            res.status(401).send({ message: 'Not logged in!' });
        }
    }));

router.route('/username')
    .get(isLoggedIn, catchAsync(async (req,res)=>{
        const id = req.user._id;
        const user = await User.findById(id);
        if(user){
            res.status(200).send({ username: user.username, userId: user._id});
        } else{
            res.status(401).send({ message: 'Not logged in!' });
        }
    }));

module.exports = router;