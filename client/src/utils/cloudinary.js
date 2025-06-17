import axios from 'axios';

export const uploadToCloudinary = async (file) => {
  const data = new FormData();
  data.append('file', file);
  data.append('upload_preset', 'user_uploads'); // your unsigned preset

  try {
    const res = await axios.post(
      'https://api.cloudinary.com/v1_1/dhek3hd7v/image/upload', // ✅ your actual cloud name
      data
    );
    return res.data.secure_url; // ✅ Cloudinary returns this URL
  } catch (error) {
    console.error('Cloudinary upload failed:', error);
    throw error;
  }
};
