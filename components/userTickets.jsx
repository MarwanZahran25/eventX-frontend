import React, { useState, useEffect, useContext } from "react";
import { Search, Calendar, MapPin, Clock, Ticket } from "lucide-react";
import { Link } from "react-router";
import { AuthContext } from "./authProvider";
import axios from "axios";

const UserTicketsPage = () => {
  const context = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch user tickets from API
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = context.token;

        if (!token) {
          console.error("No JWT token found in localStorage");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          "https://eventx-backend-production-177a.up.railway.app/user/ticket",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`https error! status: ${response.status}`);
        }

        const data = await response.json();
        setTickets(data);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [context.token]);

  const filteredTickets = tickets.filter(
    (ticket) =>
      ticket.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.venue.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    const colors = {
      upcoming: "bg-blue-100 text-blue-800",
      pending: "bg-yellow-100 text-yellow-800",
      closed: "bg-red-100 text-red-800",
      ongoing: "bg-green-100 text-green-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
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
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Tickets</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTickets.map((ticket) => (
          <div
            key={ticket.altid}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {ticket.name}
              </h3>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  ticket.status
                )}`}
              >
                {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin size={16} />
                <span>{ticket.venue}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <Calendar size={16} />
                <span>{formatDate(ticket.date)}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <Clock size={16} />
                <span>{ticket.time}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <Ticket size={16} />
                <span>Ticket Price: {ticket.price} EGP</span>
              </div>
            </div>

            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Ticket ID</div>
              <div className="font-mono text-sm text-gray-800">
                #{ticket.altid.slice(-8)}
              </div>
            </div>

            <div className="flex gap-2 w-full">
              <Link to={`/event/${ticket.altid}`} className="grow w-full">
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg transition-colors w-full">
                  View Event Details
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredTickets.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🎫</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No tickets found
          </h3>
          <p className="text-gray-500">
            {searchTerm
              ? "Try searching for something else"
              : "You haven't purchased any tickets yet"}
          </p>
        </div>
      )}
    </div>
  );
};

export default UserTicketsPage;
