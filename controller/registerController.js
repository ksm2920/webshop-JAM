const {User, validateRegisterForm} = require('../model/user');
const bcrypt = require('bcrypt');

const registerRender = (req, res) => {
    res.render('register.ejs', {error:""});
}

const registerSubmit = async (req,res) => {
    const {error} = validateRegisterForm(req.body);

    if(error) {
        return res.render('register.ejs',{error: error.details[0].message})
        
    }
    const {name, email, password } = req.body;

    const existingEmail = await User.findOne({email:email});
    
    if(existingEmail) {
        return res.render('login.ejs', {error: "You already have an account with this email, please sign in."})
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const newUser = new User({
        name: name,
        email: email,
        password: hashedPassword
    });
    console.log(newUser);
    
    newUser.save();

    res.redirect('/login')
}

module.exports = {
    registerRender, 
    registerSubmit
};