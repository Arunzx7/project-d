

const User = require('../models/userModel');
require('dotenv').config();

const adminLogin = (req, res, next) => {
    try {
        res.render('admin/adminLogin');
    } catch (error) {
        next(error);
    }
};

const adminValidation = (req, res, next) => {
    try {
        if (process.env.ADMIN_MAIL !== req.body.email || process.env.ADMIN_PASS !== req.body.password) {
            res.render('admin/adminLogin', { alert: 'Email or password is invalid' });
        } else {
            req.session.admin = req.body.email;
            req.session.isLoggedAdmin = true;
            res.redirect('/adminPanel');
        }
    } catch (error) {
        next(error);
    }
};

const adminPanel = async (req, res, next) => {
    try {
        const users = await User.find();
        res.render('admin/adminPanel', { users });
    } catch (error) {
        next(error);
    }
};

const adminLogout = (req, res, next) => {
    try {
        req.session.admin = null;
        req.session.isLoggedAdmin = false;
        res.redirect('adminLogin');
    } catch (error) {
        next(error);
    }
};

const users = async (req, res, next) => {
    const page = parseInt(req.query.page) || 1; // Default to page 1 if no page is specified
    const limit = 10; // Number of users to display per page
    const skip = (page - 1) * limit;

    try {
        const totalUsers = await User.countDocuments(); // Total number of users
        const users = await User.find().skip(skip).limit(limit);
        const totalPages = Math.ceil(totalUsers / limit);

        res.render('admin/users', { users, currentPage: page, totalPages });
    } catch (error) {
        next(error);
    }
};


const blockOrUnblock = async (req, res, status,id) => {
    try {   
       
        await User.findByIdAndUpdate(id, { is_blocked: status });
        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};

const blockUser = (req, res) => {

    return blockOrUnblock(req, res, true, req.query.id);
};

const unBlockUser = (req, res) => {
    return blockOrUnblock(req, res, false, req.query.id);
};

module.exports = {
    adminLogin,
    adminValidation,
    adminPanel,
    adminLogout,
    users,
    blockUser,
    unBlockUser
};

