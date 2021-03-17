const logout = (req, res) => {
    res.clearCookie('jwtToken').redirect('/');
}

module.exports = {logout};