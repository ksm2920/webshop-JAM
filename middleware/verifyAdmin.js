const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyAdmin = (req, res, next) => {
    const token = req.cookies.jwtToken;
    
    if(!token) {
        return res.render('login.ejs', {error:"You must log in!"});
    }
    
    const validUser = jwt.verify(token, process.env.SECRET_KEY)
    
    if(!validUser.user.role) {
        console.log("not authorized")
        return res.send({error:"You don't have authorization to do this."});
    }
    
    req.user = validUser;
    
    next();
}

module.exports = verifyAdmin;