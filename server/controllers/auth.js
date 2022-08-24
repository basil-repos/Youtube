import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import { createError } from '../error.js'
import jwt from 'jsonwebtoken'

export const signup = async (req, res, next) => {
    try {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        const newUser = new User({ ...req.body, password: hash });

        const user = await newUser.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT);
        const { password, ...details } = user._doc;

        res.cookie("access_token", token, {
            httpOnly: true
        }).status(200).json(details);
    } catch (error) {
        next(error);
    }
}

export const signin = async (req, res, next) => {
    try {
        const user = await User.findOne({ name: req.body.name });
        if(!user) return next(createError(404, "User not found"));

        const passwordCheck = await bcrypt.compare(req.body.password, user.password);
        if(!passwordCheck) return next(createError(400, "Wrong Credentials!"));

        const token = jwt.sign({ id: user._id }, process.env.JWT);
        const { password, ...details } = user._doc;

        res.cookie("access_token", token, {
            withCredentials: true, 
            credentials: 'include'
        }).status(200).json(details);
    } catch (error) {
        next(error);
    }
}

export const googleAuth = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if(user){
            const token = jwt.sign({ id: user._id }, process.env.JWT);
            res.cookie("access_token", token, {
                httpOnly: true
            }).status(200).json(user._doc);
        }else{
            const newUser = new User({
                ...req.body,
                fromGoogle: true
            });
            const savedUser = await newUser.save();

            const token = jwt.sign({ id: savedUser._id }, process.env.JWT);
            res.cookie("access_token", token, {
                httpOnly: true
            }).status(200).json(savedUser._doc);
        }
    } catch (error) {
        next(error);
    }
}

export const logout = (req, res) => {
    res.clearCookie("access_token").status(200).json("logout successfully");
}