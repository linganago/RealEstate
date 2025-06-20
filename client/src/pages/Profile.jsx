import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserSuccess,
  deleteuserStart,
  signOutUserFailure,
  signOutUserSuccess,
  signOutUserStart,
} from '../redux/user/userSlice.js';
import axiosInstance from '../utils/axiosInstace.js';
import { Link, useNavigate } from 'react-router-dom';

const Profile = () => {
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    username: currentUser?.username || '',
    email: currentUser?.email || '',
    password: '',
    avatar: currentUser?.avatar || '',
  });

  const [file, setFile] = useState(undefined);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (file) {
      handleCloudinaryUpload(file);
    }
  }, [file]);

  const handleCloudinaryUpload = async (file) => {
    try {
      setUploading(true);
      setUploadSuccess(false);
      const url = await uploadToCloudinary(file);
      setFormData((prev) => ({ ...prev, avatar: url }));
      setUploadSuccess(true);
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadSuccess(false);
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(updateUserStart());
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      const res = await axiosInstance.put(`/user/update/${currentUser._id}`, formData);
      dispatch(updateUserSuccess(res.data));
      setSuccessMessage('Profile updated successfully!');
    } catch (err) {
      const msg = err.response?.data?.message || 'Profile update failed!';
      console.error(msg);
      dispatch(updateUserFailure(msg));
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async () => {
  const confirmDelete = window.confirm(
    'Are you sure you want to delete your account? This action is irreversible.'
  );
  if (!confirmDelete) return;

  dispatch(deleteuserStart());

  try {
    const res = await fetch(`/api/user/delete/${currentUser._id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${currentUser.token}`, // Include if using JWT auth
      },
    });

    const data = await res.json();

    if (!res.ok || data.success === false) {
      dispatch(deleteUserFailure(data.message || 'Account deletion failed'));
      setErrorMessage(data.message || 'Failed to delete account');
      return;
    }

    dispatch(deleteUserSuccess());
    setSuccessMessage('Account deleted successfully!');
    navigate('/sign-in');
  } catch (error) {
    const msg = error.message || 'Something went wrong while deleting the account.';
    dispatch(deleteUserFailure(msg));
    setErrorMessage(msg);
  }
};

 const handleSignout = async () => {
  dispatch(signOutUserStart());
  try {
    const res = await fetch('/api/auth/signout'); // Adjust the endpoint if needed
    const data = await res.json();

    if (data.success === false) {
      dispatch(signOutUserFailure(data.message));
      setErrorMessage(data.message);
      return;
    }

    dispatch(signOutUserSuccess());
    navigate('/sign-in'); // Redirect to sign-in page
  } catch (error) {
    const errorMsg = error.message || 'Sign out failed';
    dispatch(signOutUserFailure(errorMsg));
    setErrorMessage(errorMsg);
  }
};


  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={(e) => {
            const selected = e.target.files[0];
            if (selected && selected.type.startsWith('image/')) {
              setFile(selected);
            } else {
              alert('Please select a valid image file.');
              fileRef.current.value = '';
            }
          }}
        />

        <img
          src={file ? URL.createObjectURL(file) : formData.avatar || '/default-avatar.png'}
          alt="profile"
          onClick={() => fileRef.current.click()}
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />

        {uploading && <p className="text-sm text-center text-gray-500">Uploading...</p>}
        {uploadSuccess && <p className="text-sm text-center text-green-600">Profile image updated successfully!</p>}

        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          autoComplete="username"
          className="border p-3 rounded-lg"
        />
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          autoComplete="email"
          className="border p-3 rounded-lg"
        />
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          autoComplete="new-password"
          className="border p-3 rounded-lg"
          placeholder="New password (optional)"
        />

        <button
          type="submit"
          disabled={uploading || isSubmitting}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                ></path>
              </svg>
              Updating...
            </>
          ) : (
            'Update'
          )}
        </button>

      <Link className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95' to={'/create-listing'}>
        Create Listing
      </Link>

      </form>

      {successMessage && (
        <p className="text-green-600 text-sm text-center mt-4">{successMessage}</p>
      )}

      {errorMessage && (
        <p className="text-red-600 text-sm text-center mt-2">{errorMessage}</p>
      )}

      <div className="flex justify-between mt-5">
        <span onClick={handleDeleteUser} className="text-red-700 cursor-pointer">
          Delete account
        </span>
        <span onClick={handleSignout} className="text-red-700 cursor-pointer">
          Signout
        </span>
      </div>
    </div>
  );
};

export default Profile;
