import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { uploadToCloudinary } from '../utils/cloudinary.js'; // your Cloudinary util file

const CreateListing = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    type: 'rent',
    parking: false,
    furnished: false,
    offer: false,
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 100000,
    discountPrice: 0,
    imageUrls: [],
  });

  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadError, setUploadError] = useState('');

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;

    if (id === 'sale' || id === 'rent') {
      setFormData({ ...formData, type: id });
    } else if (type === 'checkbox') {
      setFormData({ ...formData, [id]: checked });
    }  else {
  
  if (id === 'name') {
    const lettersOnly = /^[A-Za-z\s]*$/;
    if (!lettersOnly.test(value)) return; 
  }
  setFormData({ ...formData, [id]: value });
}

  };

  const handleImageUpload = async () => {
    if (!files || files.length === 0) return;

    if (files.length + formData.imageUrls.length > 6) {
      setUploadError('Maximum of 6 images allowed');
      return;
    }

    setUploading(true);
    try {
      const urls = await Promise.all(files.map(uploadToCloudinary));
      setFormData((prev) => ({
        ...prev,
        imageUrls: [...prev.imageUrls, ...urls],
      }));
      setUploadError('');
    } catch (err) {
      console.error(err);
      setUploadError('Image upload failed. Please try again.');
    } finally {
      setUploading(false);
      setFiles([]);
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.imageUrls.length < 1) {
      setError('Please upload at least one image.');
      return;
    }

    if (formData.offer && formData.discountPrice >= formData.regularPrice) {
      setError('Discount price must be less than regular price.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/listing/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userRef: currentUser._id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Submission failed');

      navigate(`/listing/${data._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Create a Listing</h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            id="name"
            placeholder="Name"
            className="border p-3 rounded-lg"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <textarea
            id="description"
            placeholder="Description"
            className="border p-3 rounded-lg"
            value={formData.description}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            id="address"
            placeholder="Address"
            className="border p-3 rounded-lg"
            value={formData.address}
            onChange={handleChange}
            required
          />

          <div className="flex gap-4 flex-wrap">
            {['sale', 'rent', 'parking', 'furnished', 'offer'].map((id) => (
              <label key={id} className="flex gap-2">
                <input
                  type="checkbox"
                  id={id}
                  onChange={handleChange}
                  checked={id === 'sale' || id === 'rent' ? formData.type === id : formData[id]}
                />
                <span>{id.charAt(0).toUpperCase() + id.slice(1)}</span>
              </label>
            ))}
          </div>

          <div className="flex flex-wrap gap-6">
            {[
              { id: 'bedrooms', label: 'Beds', min: 1 },
              { id: 'bathrooms', label: 'Baths', min: 1 },
              { id: 'regularPrice', label: 'Regular Price ₹', min: 100000 },
            ].map(({ id, label, min }) => (
              <div className="flex items-center gap-2" key={id}>
                <input
                  type="number"
                  id={id}
                  min={min}
                  max="10000000"
                  className="p-3 border rounded-lg"
                  value={formData[id]}
                  onChange={handleChange}
                />
                <span>{label}</span>
              </div>
            ))}
            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountPrice"
                  min="0"
                  max="10000000"
                  className="p-3 border rounded-lg"
                  value={formData.discountPrice}
                  onChange={handleChange}
                />
                <span>Discount Price ₹</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 flex-1">
          <p className="font-semibold">
            Images: <span className="text-gray-600 text-sm ml-1">(First image is cover, max 6)</span>
          </p>
          <div className="flex gap-4">
            <input
              type="file"
              accept="image/*"
              multiple
              className="p-3 border rounded w-full"
              onChange={(e) => setFiles(Array.from(e.target.files))}
            />
            <button
              type="button"
              disabled={uploading}
              onClick={handleImageUpload}
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
          {uploadError && <p className="text-red-700 text-sm">{uploadError}</p>}

          {formData.imageUrls.map((url, index) => (
            <div key={url} className="flex justify-between items-center border p-3 rounded">
              <img src={url} alt="Uploaded" className="w-20 h-20 object-contain rounded" />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="text-red-700 uppercase hover:opacity-75"
              >
                Delete
              </button>
            </div>
          ))}

          <button
            type="submit"
            disabled={loading || uploading}
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? 'Creating...' : 'Create Listing'}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
