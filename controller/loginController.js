const {User, validateLoginForm} = require('../model/user');
const bcrypt = require('bcrypt');

const loginRender = (req, res) => {
    res.render('login.ejs', {error:""})
}

const loginSubmit = async (req, res) => {
    const {error} = validateLoginForm(req.body);

    if(error) {
        return res.render('login.ejs',{error: error.details[0].message})  
    }

    const {email, password} = req.body;

    const user = await User.findOne({email:email});
    
    if(!user) {
        return res.render('register.ejs', {error:"You don't have an account. Please sign up"});
    }

    const validUser = await bcrypt.compare(password, user.password);

    if(!validUser) {
        return res.render('login.ejs', {error: "Wrong password"})
    }

    console.log(validUser);

    //redirect to shopping cart
    res.redirect('/');
}

module.exports = {
    loginRender,
    loginSubmit
}
