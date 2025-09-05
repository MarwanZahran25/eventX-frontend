import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";

const EditEventForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://eventx-backend-production-177a.up.railway.app/admin/event/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const eventData = await response.data;

        const formattedDate = eventData.date
          ? new Date(eventData.date).toISOString().split("T")[0]
          : "";

        setFormData({
          name: eventData.name || "",
          description: eventData.description || "",
          venue: eventData.venue || "",
          date: formattedDate,
          time: eventData.time || "",
          price: eventData.price || "",
          totalSeats: eventData.totalSeats || "",
          category: eventData.category || "",
          status: eventData.status || "upcoming",
        });
      } catch {
        alert("Failed to load event data");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

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
      const response = await fetch(
        `http://eventx-backend-production-177a.up.railway.app/admin/event/update/${id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Failed to update event");

      alert("Event updated!");
      navigate("/admin");
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg max-w-md mx-auto border border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Edit Event
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

export default EditEventForm;
