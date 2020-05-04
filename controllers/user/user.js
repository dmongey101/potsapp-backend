const User = require('../../models/user');

exports.signup = (req, res) => {
    let user = new User({
        username: req.body.username,
        email: req.body.email
    })

    user.save()
        .then(user => {
            console.log(user.username + ' saved in database')
        })
        .catch(err => {
            console.log(err)
        })
}