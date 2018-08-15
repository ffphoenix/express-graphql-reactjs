import { users } from '../models';
import models from "../models";
import express from 'express';
import bcrypt from 'bcrypt';
let router = new express.Router();
const jwt = require('jsonwebtoken');
import { jwt_secret } from '../config/config'



router.post('/login', (req, res) => {
    let body = req.body;
    if (body.email && body.password) {
        users
            .findOne({where : {email : req.body.email}})
            .then((findedUser) => {
                if (findedUser) {
                    return bcrypt.compare(body.password, findedUser.password, function (err, result) {
                        if (result === true) {
                            var payload = {
                                id: findedUser.id,
                                username: findedUser.username,
                                create_date: findedUser.create_date,
                                email: findedUser.email
                            }
                            var token = jwt.sign(payload, jwt_secret, {
                                expiresIn: 86400 // expires in 24 hours
                            });

                            return res.json({
                                success: true,
                                token: token
                            });
                        }
                        return res.json({success: false, error : 'Password not valid for this Email'});
                    });
                }
                return res.json({success: false, error : 'Didn`t find Email'});
            }).catch( function (err) {
                return res.json({success: false, error : 'Bad input data'});
            });
    } else {
        return res.json({success: false, error : 'Bad input data'});
    }

    //
});

router.post('/refreshToken', (req, res) => {
    console(req.body.email, req.body.password);
});


export default router;