import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorhandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';

// SIGNUP
export const signup = async (req, res, next) => {
  const { username, email, password, avatar } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    avatar, // will use default if undefined
  });

  try {
    await newUser.save();
    const { password, ...rest } = newUser._doc;
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
    res
      .cookie('access_token', token, { httpOnly: true })
      .status(201)
      .json(rest);
  } catch (error) {
    next(errorhandler(550, 'Error from signup function'));
  }
};

// SIGNIN
export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorhandler(404, 'User not found'));

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorhandler(401, 'Wrong credentials'));

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc;

    res.cookie('access_token', token, { httpOnly: true }).status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

// GOOGLE OAUTH
export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;

      return res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

      const newUser = new User({
        username: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo, // use Google profile picture
      });

      await newUser.save();

      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;

      res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};
