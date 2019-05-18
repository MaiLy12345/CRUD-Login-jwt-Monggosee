
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs')
const User = require('../models/user.js');

const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userDelete = await User.findOneAndDelete({_id: id}).lean().select('_id username');
        if (!userDelete) {
            return next(new Error('user_not_found'));
        }
        return res.status(200).json({
            message : 'delete user successful',
            data: userDelete
        });
    } catch (e) {
        return next(e);
    }
};

const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const salt  = bcrypt.genSaltSync('10');
        const hashPassword = bcrypt.hashSync(password, salt);
        const newUser = {
            username,
            password: hashPassword
        };
        const user = await User.findOne({
            username
        });
        if (!user) {
            return next(new Error('account_not_existed'));
        }
        const isValidatePassword = bcrypt.compareSync(password, user.password);
        if (!isValidatePassword) {
            return next(new Error('password_is_incorrect'));
        }
        var token = jwt.sign({ username }, 'shhhhh', { expiresIn: 5*60 } );
        return res.status(201).json({
            message: "login successfully",
            access_token: token
        });
    } catch (e) {
        return next(e);
    }
};
const createUser = async (req, res, next) => {
    try {
        const {
            username,
            password
        } = req.body;
        const salt = bcrypt.genSaltSync(2);
        const hashPassword = bcrypt.hashSync(password, salt);

        const newUser = new User({
            username,
            password : hashPassword
        });
        const creatUser = await newUser.save();
        return res.status(200).json({
            message: "create user  successfully",
            creatUser
        })
    } catch (e) {
        return next(e);
    };
}
const getListUser = async (req, res, next) => {
    try {     
        const users = await User.find().lean().select('username');
        if (!users) {
            return next(new Error('No_data'));
        }
        return res.status(200).json({
            message: 'List users',
            data: users
        });
    } catch (e) {
        return next(e);
    }
};

const getUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findOne({_id: id}).select('username').lean();        
        if (!user) {
            return next(new Error('User_not_found'));
        }
        return res.status(200).json({
            message: 'User',
            data: user
        });
    } catch (e) {
        return next(e);
    }
};

const updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const {
            username,
            password
        } = req.body;
        
        const salt = bcrypt.genSaltSync(2);
        const hashPassword = bcrypt.hashSync(password, salt);
        const newValues = {
            username,
            password: hashPassword
        }
        Object.keys(newValues).forEach(function(key) {
            if (newValues[key] === undefined) {
                delete newValues[key];
            }
        });
        const updateInfo = { $set: newValues };
        const userUpdate = await User.findOneAndUpdate({_id: id}, updateInfo, {
            new: true
        }).lean();
        if (!userUpdate) {
            return next(new Error('user_not_found'));
        }
        return res.status(200).json({
            message : 'update successful',
            data: userUpdate,
            data_update: newValues
        });
    } catch (e) {
        return next(e);
    }
};

module.exports = {
    deleteUser,
    createUser,
    login,
    getListUser,
    getUser,
    updateUser
};