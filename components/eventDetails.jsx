import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, data } from "react-router";
import { ArrowLeft } from "lucide-react";
import axios from "axios";

import { AuthContext } from "./authProvider";
const TicketDetailPage = () => {
  const context = useContext(AuthContext);
  const isAdmin = context.isAdmin;
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");
  const [isAllocating, setIsAllocating] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:3000/admin/event/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);
        setEvent(response.data);
      } catch (err) {
        console.log("Error fetching event:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleAllocateTicket = async () => {
    if (!userId.trim()) {
      alert("Please enter a user ID");
      return;
    }

    setIsAllocating(true);
    try {
      await axios.post(
        `http://localhost:3000/admin/allocate/${event._id}`,
        { userId: userId.trim() },
        {
          headers: {
            Authorization: `Bearer ${context.token}`,
          },
        }
      );

      alert("Ticket allocated successfully!");
      setUserId("");
    } catch {
      alert("Failed to allocate ticket. Please try again.");
    } finally {
      setIsAllocating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!event) {
    return <div className="p-6">Event not found</div>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <button
        onClick={() => navigate(`${isAdmin ? "/admin" : "/"}`)}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h1 className="text-2xl font-bold mb-4">{event.name}</h1>

        <div className="space-y-3 mb-6">
          <div>
            <span className="font-medium">Date:</span> {formatDate(event.date)}
          </div>
          <div>
            <span className="font-medium">Time:</span> {event.time}
          </div>
          <div>
            <span className="font-medium">Venue:</span> {event.venue}
          </div>
          <div>
            <span className="font-medium">Price:</span> {event.price} EGP
          </div>
          <div>
            <span className="font-medium">Category:</span> {event.category}
          </div>
          <div>
            <span className="font-medium">Status:</span> {event.status}
          </div>
        </div>

        {event.description && (
          <div className="mb-6">
            <h2 className="font-medium mb-2">Description</h2>
            <p className="text-gray-700">{event.description}</p>
          </div>
        )}

        <div className="border-t pt-4 mb-6">
          <h2 className="font-medium mb-3">Seats</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold">{event.totalSeats}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-600">
                {event.soldSeats}
              </div>
              <div className="text-sm text-gray-600">Sold</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-600">
                {event.availableSeats}
              </div>
              <div className="text-sm text-gray-600">Available</div>
            </div>
          </div>
        </div>

        {isAdmin ? (
          <div className="space-y-4">
            <div className="border-t pt-4">
              <h2 className="font-medium mb-3">Allocate Ticket to User</h2>
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <label
                    htmlFor="userId"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    User ID
                  </label>
                  <input
                    id="userId"
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="Enter user ID"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={handleAllocateTicket}
                  disabled={isAllocating || !userId.trim()}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg"
                >
                  {isAllocating ? "Allocating..." : "Allocate Ticket"}
                </button>
              </div>
            </div>

            <button
              onClick={() => navigate(`/admin/edit/${event._id}`)}
              className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg mx-[30%]`}
            >
              Edit Event
            </button>
          </div>
        ) : (
          <div className="flex justify-center w-full gap-3">
            <button
              onClick={() => {
                axios.post(
                  `http://localhost:3000/user/event/buy/${event._id}`,
                  {},
                  {
                    headers: {
                      Authorization: `Bearer ${context.token}`,
                    },
                  }
                );
                navigate(`/`);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg "
            >
              Buy Ticket
            </button>
            <button
              onClick={() => {
                navigate(`/qr/${event._id}`);
              }}
              className="bg-black  text-white px-4 py-2 rounded-lg "
            >
              QR code
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketDetailPage;
