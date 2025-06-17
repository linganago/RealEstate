import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { uploadToCloudinary } from '../utils/cloudinary.js';

const Profile = () => {
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false); // ✅ new state
  const [imageUrl, setImageUrl] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (file) {
      handleCloudinaryUpload(file);
    }
  }, [file]);

  const handleCloudinaryUpload = async (file) => {
    try {
      setUploading(true);
      setUploadSuccess(false); // reset success state
      const url = await uploadToCloudinary(file);
      setImageUrl(url);
      setUploadSuccess(true); // ✅ mark success
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadSuccess(false);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4">
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
            }
          }}
        />

        <img
          src={
            file
              ? URL.createObjectURL(file)
              : imageUrl || currentUser?.avatar || '/default-avatar.png'
          }
          alt="profile"
          onClick={() => fileRef.current.click()}
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />

        {/* ✅ Upload feedback */}
        {uploading && (
          <p className="text-sm text-center text-gray-500">Uploading...</p>
        )}
        {uploadSuccess && (
          <p className="text-sm text-center text-green-600">
            Profile image updated successfully!
          </p>
        )}

        <input
          type="text"
          id="username"
          name="username"
          placeholder="Username"
          autoComplete="username"
          defaultValue={currentUser?.username || ''}
          className="border p-3 rounded-lg"
        />
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Email"
          autoComplete="email"
          defaultValue={currentUser?.email || ''}
          className="border p-3 rounded-lg"
        />
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Password"
          autoComplete="new-password"
          className="border p-3 rounded-lg"
        />

        <button
          type="submit"
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          Update
        </button>
      </form>

      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete account</span>
        <span className="text-red-700 cursor-pointer">Signout</span>
      </div>
    </div>
  );
};

export default Profile;
