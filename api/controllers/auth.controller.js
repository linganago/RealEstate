import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorhandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';

// SIGNUP
export const signup = async (req, res, next) => {
  try {
    const { username, email, password, avatar } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new User({ username, email, password: hashedPassword, avatar });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
    const { password: _, ...rest } = newUser._doc;

    res
      .cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax', // or 'None' if cross-origin
      })
      .status(200)
      .json({ success: true, ...rest }); // ✅ fixed this line
  } catch (error) {
    next(errorhandler(500, 'Signup failed'));
  }
};

// SIGNIN
export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const validUser = await User.findOne({ email });

    if (!validUser) return next(errorhandler(404, 'User not found'));

    const isValid = bcryptjs.compareSync(password, validUser.password);
    if (!isValid) return next(errorhandler(401, 'Wrong credentials'));

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: _, ...rest } = validUser._doc;

    res
      .cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
      })
      .status(200)
      .json({ success: true, ...rest });
  } catch (error) {
    next(errorhandler(500, 'Signin failed'));
  }
};

// GOOGLE OAUTH
export const google = async (req, res, next) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET);
      const { password: _, ...rest } = existingUser._doc;

      return res
        .cookie('access_token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'Lax',
        })
        .status(200)
        .json({ success: true, ...rest });
    }

    const randomPassword =
      Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
    const hashedPassword = bcryptjs.hashSync(randomPassword, 10);

    const newUser = new User({
      username: req.body.name.toLowerCase().replace(/\s+/g, '') + Math.floor(Math.random() * 10000),
      email: req.body.email,
      password: hashedPassword,
      avatar: req.body.photo,
    });

    await newUser.save();
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
    const { password: _, ...rest } = newUser._doc;

    res
      .cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
      })
      .status(200)
      .json({ success: true, ...rest });
  } catch (error) {
    next(errorhandler(500, 'Google sign-in failed'));
  }
};

// SIGNOUT
export const signout = (req, res) => {
  res.clearCookie('access_token');
  res.status(200).json({ success: true, message: 'User has been logged out' });
};
