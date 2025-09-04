import React, { useState } from "react";
import { useNavigate } from "react-router";
const AddEventForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    venue: "",
    date: "",
    time: "",
    price: "",
    totalSeats: "",
    category: "",
    status: "upcoming",
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/admin/event/add", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to create event");
      navigate("/admin/events");

      alert("Event created!");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg max-w-md mx-auto border border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Add Event
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.keys(formData).map((field) => (
          <div key={field} className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1 capitalize">
              {field}
            </label>
            <input
              type="text"
              name={field}
              value={formData[field]}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                         transition"
            />
          </div>
        ))}

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow 
                       transition font-medium"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEventForm;
