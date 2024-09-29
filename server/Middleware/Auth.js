const isLoggedIn = (req,res,next)=>{
    // if(req.isAuthenticated()){
    //     return next();
    // } else{
    //     res.status(401).send({message: "You aren't logged in!"});
    // }
    return next();
}

const isAuthorized = (req,res,next)=>{
    // const {user_id} = req.params;
    // if(req.user._id.equals(user_id)){
    //     return next();
    // } 
    // res.status(401).send({message: "You aren't authorized to perform this action"});
    return next();
}

module.exports = {isLoggedIn, isAuthorized};