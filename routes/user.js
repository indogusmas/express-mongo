import express from 'express';
import {body, validationResult} from 'express-validator';
import  bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userSchema.js';
import {auth} from '../middleware/auth.js';


const router = express.Router();


router.post(
    "/signup",
    [
        body('username').notEmpty(),
        body('email').isEmail(),
        body('password').notEmpty()
    ],
    async (req, res) => {
        const error = validationResult(req);
        if(!error.isEmpty()){
            return res.status(400).json({
                errors: error.array()
            });
        }
        const {
            username,
            email,
            password
        } = req.body;

        try {
            let user = await User.findOne({
                email
            });
            if(user){
                return res.status(400).json({
                    message: "User already Exists"
                });
            }

            user = new User({
                username,email,password
            });

            console.log(user);
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password,salt);
            await user.save();
            const payload = {
                user:{
                    id: user.id
                }
            };

            jwt.sign(
                payload,
                "randowString",{
                    expiresIn: 100000
                },
                (error, token)=>{
                    if(error) throw error;
                    const result = {
                        token
                    }
                    res.status(200).json({
                        status: "success",
                        message: "User add successfully",
                        data: result,
                      });
                }
            
            )
           
            
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Error in saving');
        }
    }

);

router.post(
    "/login",
    [
        body("email").notEmpty().isEmail(),
        body("password").notEmpty()
    ],
    async (req, res) =>{
        const error = validationResult(req);
        console.log(error);
        if(!error.isEmpty()){
            return res.status(400).json({
                errors: error.array()
            });
        }

        const {email, password} = req.body;

        try {
            let user = await User.findOne({
                email
            });
            if(!user){
                return res.status(400).json({
                    message: "User email in corret"
                });
            }
            const isMacth = await bcrypt.compare(password,user.password);
            if(!isMacth){
                return res.status(400).json({
                    message: "User email in corret"
                });
            }
            const payload = {
                user: {
                    id: user.id
                }
            };

            jwt.sign(
                payload,
                "randomString",
                {
                    expiresIn: 3600
                },
                (error, token)=>{
                    if(error)throw error;
                    const result = {
                        token
                    }
                    res.status(200).json({
                        status: "success",
                        message: "Login Successfully",
                        data: result,
                      });
                }
            )
        } catch (error) {
            console.log(error.message);
            res.status(500).json({
                message: "Server Error"
            })
        }
    }
);

router.get("/me", auth, async (req, res) => {
    try {
        //request user id getting fetched from middleware auth
        const user = await User.findById(req.user.id);
        res.json(user);
    } catch (error) {
        res.send({
            message: "Error in fetching user"
        });
    }
});



export default router;
