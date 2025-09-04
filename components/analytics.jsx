import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { DollarSign, Ticket, BarChart3, Users } from "lucide-react";
import { AuthContext } from "./authProvider";
import { useState, useContext, useEffect } from "react";
import axios from "axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// A reusable card component for displaying key stats
const StatCard = ({ icon, title, value, color }) => {
  const IconComponent = icon;
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
      <div className={`p-3 rounded-full ${color}`}>
        <IconComponent size={24} className="text-white" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
};

const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const authContext = useContext(AuthContext);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        if (!authContext.token) {
          throw new Error("Authentication token not found.");
        }
        const response = await axios.get(
          "http://localhost:3000/admin/analytics",
          {
            headers: {
              Authorization: `Bearer ${authContext.token}`,
            },
          }
        );

      
        const result = response.data;


        if (result.success) {
          setAnalytics(result.data);
        } else {
          throw new Error("API returned success: false");
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching analytics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [authContext.token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 text-red-600">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Failed to load data</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="p-8 text-center text-gray-500">
        No analytics data available.
      </div>
    );
  }

  const genderData = {
    labels: [
      `Male (${analytics.genderDistribution.malePercentage}%)`,
      `Female (${analytics.genderDistribution.femalePercentage}%)`,
    ],
    datasets: [
      {
        label: "Gender Distribution",
        data: [
          analytics.genderDistribution.male,
          analytics.genderDistribution.female,
        ],
        backgroundColor: ["#3b82f6", "#ec4899"],
        borderColor: ["#ffffff", "#ffffff"],
        borderWidth: 2,
      },
    ],
  };

  const locationData = {
    labels: Object.keys(analytics.locationDistribution),
    datasets: [
      {
        label: "Events by Location",
        data: Object.values(analytics.locationDistribution),
        backgroundColor: "rgba(59, 130, 246, 0.7)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        font: {
          size: 16,
        },
      },
    },
  };

  return (
    <div className="bg-gray-50/50 p-6 sm:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Analytics & Reports
        </h1>

     
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={DollarSign}
            title="Total Revenue"
            value={`EGP ${analytics.totalRevenue.toLocaleString()}`}
            color="bg-green-500"
          />
          <StatCard
            icon={Ticket}
            title="Total Tickets Sold"
            value={analytics.totalTicketsSold.toLocaleString()}
            color="bg-blue-500"
          />
          <StatCard
            icon={BarChart3}
            title="Total Events"
            value={analytics.totalEvents}
            color="bg-purple-500"
          />
        </div>

    
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
     
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Users size={20} className="text-gray-500" />
              Gender Distribution
            </h2>
            <div className="h-64 sm:h-72">
              <Doughnut
                data={genderData}
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: {
                      ...chartOptions.plugins.title,
                      text: "Attendees by Gender",
                    },
                  },
                }}
              />
            </div>
          </div>

          <div className="lg:col-span-3 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Users Location Distribution
            </h2>
            <div className="h-80">
              <Bar
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: {
                      ...chartOptions.plugins.title,
                      text: "Number of users per City",
                    },
                  },
                }}
                data={locationData}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
