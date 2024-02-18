const isAuthenticated = (req,res,next) =>{
    if(req.user){
        next();
    }else{
        res.send('Not Authenticated')
    }
}

module.exports = isAuthenticated;