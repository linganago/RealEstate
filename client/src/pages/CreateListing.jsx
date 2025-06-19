import React from 'react';

const CreateListing = () => {
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
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              type="button"
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80 w-full sm:w-auto"
            >
              Upload
            </button>
          </div>

          {/* Image Preview Placeholder */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between p-3 border items-center">
              <img
                src="/placeholder.png"
                alt="listing"
                className="w-20 h-20 object-contain rounded-lg"
              />
              <button
                type="button"
                className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
              >
                Delete
              </button>
            </div>
          </div>

          <button className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
            Create listing
          </button>
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
