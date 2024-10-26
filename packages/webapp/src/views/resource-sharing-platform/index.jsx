import React, { useState } from 'react';
const ResourceSharingPlatform = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    file: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Resource added:', formData);
    // Reset form
    setFormData({ name: '', description: '', file: null });
    setShowForm(false);
  };

  return (
    <div className="p-4">
      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-blue-500 text-white py-2 px-4 rounded mb-4"
      >
        {showForm ? 'Cancel' : 'Add Resource'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="border p-4 rounded bg-gray-100">
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="file">File</label>
            <input
              type="file"
              id="file"
              name="file"
              onChange={handleChange}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <button
            type="submit"
            className="bg-green-500 text-white py-2 px-4 rounded"
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default ResourceSharingPlatform; 

