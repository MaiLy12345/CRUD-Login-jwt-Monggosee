const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
exports.authentication  = (req, res, next) => {
    try {
        const token = req.query.token || req.body.token;
        if (!token) {
            return next(new Error('Not found token'));
        }
        jwt.verify(token, 'shhhhh');
        return next();
    } catch (e) {
        return next(e);
    }
};