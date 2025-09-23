const { where } = require('sequelize');
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

const get_particular_user = async (req,res) => {
    try {
        const userid = req.params.id;
        const user = await User.findOne({
            where:{
                id: userid
            }
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({
            error:error.message
        });
    }
}

module.exports = {get_all_user, get_particular_user};