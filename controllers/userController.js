const {User} = require('../models');

const get_all_user = async (req,res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({
            error:error.message
        });
    }
}


module.exports = {get_all_user};