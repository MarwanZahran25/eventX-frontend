import React, { useState, useEffect, useContext } from "react";
import {
  Search,
  Plus,
  Calendar,
  MapPin,
  Clock,
  ChevronDown,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "./authProvider";
import axios from "axios";

const AdminEventsPage = () => {
  const context = useContext(AuthContext);
  const isAdmin = context.isAdmin;
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = context.token;

        if (!token) {
          console.error("No JWT token found in localStorage");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          "http://eventx-backend-production-177a.up.railway.app/admin/event/all",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = events.filter(
    (event) =>
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.venue.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort events based on selected criteria
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    switch (sortBy) {
      case "availableSeats":
        const availableA = a.totalSeats - a.soldSeats;
        const availableB = b.totalSeats - b.soldSeats;
        return availableB - availableA; // Descending order
      case "price":
        return parseFloat(a.price) - parseFloat(b.price); // Ascending order
      case "date":
        return new Date(a.date) - new Date(b.date); // Ascending order (earliest first)
      default:
        return 0;
    }
  });

  const getStatusColor = (status) => {
    const colors = {
      upcoming: "bg-blue-100 text-blue-800",
      pending: "bg-yellow-100 text-yellow-800",
      closed: "bg-red-100 text-red-800",
      ongoing: "bg-green-100 text-green-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const handleSortSelect = (sortOption) => {
    setSortBy(sortOption);
    setShowSortDropdown(false);
  };

  const getSortDisplayText = () => {
    switch (sortBy) {
      case "availableSeats":
        return "Available Seats";
      case "price":
        return "Price";
      case "date":
        return "Date";
      default:
        return "Sort by";
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
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Events</h1>

        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-4">
            {isAdmin && (
              <Link to={"/admin/add"}>
                <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-fit">
                  <Plus size={18} />
                  New Event
                </button>
              </Link>
            )}

            <div className="relative">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500"
              >
                {getSortDisplayText()}
                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    showSortDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showSortDropdown && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <button
                    onClick={() => handleSortSelect("")}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-lg ${
                      sortBy === ""
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700"
                    }`}
                  >
                    Default
                  </button>
                  <button
                    onClick={() => handleSortSelect("availableSeats")}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${
                      sortBy === "availableSeats"
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700"
                    }`}
                  >
                    Available Seats
                  </button>
                  <button
                    onClick={() => handleSortSelect("price")}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${
                      sortBy === "price"
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700"
                    }`}
                  >
                    Price (Low to High)
                  </button>
                  <button
                    onClick={() => handleSortSelect("date")}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-50 last:rounded-b-lg ${
                      sortBy === "date"
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700"
                    }`}
                  >
                    Date (Earliest First)
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 w-full sm:w-80"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedEvents.map((event) => (
          <div
            key={event._id.oid}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {event.name}
              </h3>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  event.status
                )}`}
              >
                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin size={16} />
                <span>{event.venue}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <Calendar size={16} />
                <span>{event.date}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <Clock size={16} />
                <span>{event.time}</span>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-bold text-green-600">
                  {event.price} EGP
                </span>
                <span className="text-sm text-gray-500">
                  {event.soldSeats}/{event.totalSeats} sold
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{
                    width: `${Math.min(
                      (event.soldSeats / event.totalSeats) * 100,
                      100
                    )}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="flex gap-2 w-full">
              <Link
                to={`/event/${event._id.oid}`}
                className="grow w-full"
                onClick={() => {
                  console.log(event);
                }}
              >
                <button className=" bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg transition-colors w-full">
                  View Details
                </button>
              </Link>
              {isAdmin ? (
                <Link to={`/admin/edit/${event._id.oid}`} className="grow">
                  <button className=" bg-green-100 hover:bg-green-200 text-gray-800 py-2 px-4 rounded-lg transition-colors grow w-full">
                    edit
                  </button>
                </Link>
              ) : (
                <button
                  className=" bg-green-100 hover:bg-green-200 text-gray-800 py-2 px-4 rounded-lg transition-colors grow w-full"
                  onClick={() => {
                    axios.get(
                      `http://eventx-backend-production-177a.up.railway.app/user/event/buy/${event._id.oid}`,
                      {
                        headers: {
                          Authorization: `Bearer ${context.token}`,
                        },
                      }
                    );
                    navigate("/admin");
                  }}
                >
                  Buy Ticket
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {sortedEvents.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🎪</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No events found
          </h3>
          <p className="text-gray-500">Try searching for something else</p>
        </div>
      )}
    </div>
  );
};

export default AdminEventsPage;
