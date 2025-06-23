import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorhandler } from '../utils/error.js';
import Listing from '../models/listing.model.js';

// TEST ROUTE
export const test = (req, res) => {
  res.send('User route is working');
};

// ✅ UPDATE USER
export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorhandler(403, 'You can only update your own account'));
  }

  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (err) {
    next(errorhandler(500, 'Error updating user'));
  }
};

// ✅ DELETE USER
export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorhandler(403, 'You can only delete your own account'));
  }

  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie('access_token');
    res.status(200).json('User has been deleted!');
  } catch (error) {
    next(errorhandler(500, 'Error deleting user'));
  }
};

// ✅ GET USER LISTINGS
export const getUserListing = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorhandler(403, 'You can only view your own listings'));
  }

  try {
    const listings = await Listing.find({ userRef: req.params.id });
    res.status(200).json(listings);
  } catch (error) {
    next(errorhandler(500, 'Error fetching listings'));
  }
};
