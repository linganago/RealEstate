import React, { useState } from 'react';
import imageCompression from 'browser-image-compression';

const CreateListing = () => {
  const [files, setFiles] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadingStatus, setUploadingStatus] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const cloudName = 'dhek3hd7v'; // Replace with your Cloudinary cloud name
  const uploadPreset = 'user_uploads'; // Replace with your upload preset

  const handleImageSubmit = async () => {
    if (!files || files.length === 0) {
      setErrorMsg('Please select at least one image to upload.');
      return;
    }

    if (uploadedImages.length + files.length > 6) {
      setErrorMsg('Maximum 6 images allowed.');
      return;
    }

    setErrorMsg('');
    setUploading(true);
    setUploadingStatus(Array(files.length).fill('Uploading...'));

    const uploadPromises = files.map(async (file, index) => {
      try {
        // File type check
        if (!file.type.startsWith('image/')) {
          throw new Error('Unsupported file type.');
        }

        // Compress the image
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 0.7,
          maxWidthOrHeight: 1200,
          useWebWorker: true,
        });

        const formData = new FormData();
        formData.append('file', compressedFile);
        formData.append('upload_preset', uploadPreset);

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );

        const data = await res.json();
        if (!data.secure_url) {
          throw new Error('Invalid response from Cloudinary.');
        }

        setUploadedImages((prev) => [...prev, data.secure_url]);
        setUploadingStatus((prev) => {
          const updated = [...prev];
          updated[index] = 'Uploaded';
          return updated;
        });
      } catch (error) {
        console.error(`Upload failed for file ${index + 1}:`, error.message);
        setUploadingStatus((prev) => {
          const updated = [...prev];
          updated[index] = 'Failed';
          return updated;
        });
        setErrorMsg(`One or more files failed to upload: ${error.message}`);
      }
    });

    await Promise.all(uploadPromises);
    setFiles([]);
    setUploading(false);
  };

  const handleRemoveImage = (index) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <main className="p-3 max-w-6xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Create a Listing</h1>

      <form className="flex flex-col lg:flex-row gap-8">
        {/* LEFT SECTION */}
        <div className="flex flex-col gap-4 w-full lg:w-1/2">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg w-full"
            id="name"
            maxLength="62"
            minLength="10"
            required
          />
          <textarea
            placeholder="Description"
            className="border p-3 rounded-lg w-full"
            id="description"
            required
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg w-full"
            id="address"
            required
          />

          {/* CHECKBOXES */}
          <div className="flex flex-wrap gap-6">
            {['Sell', 'Rent', 'Parking spot', 'Furnished', 'Offer'].map((label) => (
              <div className="flex items-center gap-2" key={label}>
                <input
                  type="checkbox"
                  id={label.toLowerCase().replace(' ', '')}
                  className="w-5 h-5"
                />
                <span className="text-sm sm:text-base">{label}</span>
              </div>
            ))}
          </div>

          {/* BED/BATH/PRICE */}
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2 w-[48%]">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg w-full"
              />
              <p>Beds</p>
            </div>

            <div className="flex items-center gap-2 w-[48%]">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg w-full"
              />
              <p>Baths</p>
            </div>

            <div className="flex items-center gap-2 w-[48%]">
              <input
                type="number"
                id="regularPrice"
                min="50"
                max="10000000"
                required
                className="p-3 border border-gray-300 rounded-lg w-full"
              />
              <p>Regular price (₹)</p>
            </div>

            <div className="flex items-center gap-2 w-[48%]">
              <input
                type="number"
                id="discountedPrice"
                min="0"
                max="10000000"
                className="p-3 border border-gray-300 rounded-lg w-full"
              />
              <p>Discounted price (₹)</p>
            </div>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex flex-col gap-4 w-full lg:w-1/2">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>

          <div className="flex gap-4 flex-col sm:flex-row">
            <input
              onChange={(e) => {
                setFiles(Array.from(e.target.files));
                setErrorMsg('');
              }}
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              onClick={handleImageSubmit}
              type="button"
              disabled={uploading || files.length === 0}
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>

          {errorMsg && <p className="text-red-600 text-sm">{errorMsg}</p>}

          {uploadingStatus.map((status, index) => (
            <p key={index} className="text-xs text-gray-500">
              File {index + 1}: {status}
            </p>
          ))}

          {/* Uploaded Image Previews */}
          <div className="flex flex-col gap-3">
            {uploadedImages.map((url, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 border rounded-lg"
              >
                <img
                  src={url}
                  alt={`Uploaded ${index}`}
                  className="w-20 h-20 object-contain rounded"
                />
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="text-red-700 uppercase hover:opacity-75"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          <button
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
            type="submit"
          >
            Create listing
          </button>
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
