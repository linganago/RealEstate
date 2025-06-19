import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorhandler } from '../utils/error.js';

// TEST ROUTE
export const test = (req, res) => {
  res.send('User route is working');
};

// ✅ UPDATE USER
export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorhandler(403, 'You can only update your own account'));
  }

  // Hash new password if it's being changed
  if (req.body.password) {
    req.body.password = bcryptjs.hashSync(req.body.password, 10);
  }

  try {
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


export const deleteUser=async(req,res,next)=>{
  if(req.user.id!==req.params.id) return next(errorhandler(401,'You can delete your own account!'))
    try {
      await User.findByIdAndDelete(req.params.id)
      res.clearCookie('access_token')
      res.status(200).json( 'User has been deleted!')
    } catch (error) {
      next(error)
    }
}