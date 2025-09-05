import { AuthContext } from "./authProvider";
import {
  ChevronDown,
  Plus,
  Bell,
  Settings,
  LogOut,
  Users,
  BarChart2,
  Ticket,
  Briefcase,
  LayoutDashboard,
  FileText,
  ShoppingCart,
  Megaphone,
} from "lucide-react";
import { Link } from "react-router";
import { useContext } from "react";

export default function NavBar() {
  const auth = useContext(AuthContext);
  function onClick() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    auth.setAuthObj((prev) => {
      return { ...prev, isAdmin: false, isLoggedIn: false };
    });
  }
  const navLinks = {
    "Main Navigation": [
      {
        icon: <LayoutDashboard size={20} />,
        text: "Dashboard",
        link: "/admin/analytics",
      },

      {
        icon: <Ticket size={20} />,
        text: "My Tickets",
        link: "/tickets",
      },
    ],

    "Account Management": [
      { icon: <LogOut size={20} />, text: "Logout", onClick },
    ],
  };

  return (
    <div>
      <nav className="bg-black text-white  w-64  p-4 flex flex-col fixed min-h-screen overflow-y-scroll">
        <div className="flex items-center justify-between mb-8">
          <Link to={"/"}>
            <div className="flex items-center gap-3">
              <div className="bg-green-500 p-2 rounded-lg">
                <Ticket className="text-black" />
              </div>
              <span className="text-xl font-bold">EventX</span>
            </div>
          </Link>
        </div>
        <div className={`flex-col lg:flex  `}>
          {Object.entries(navLinks).map(([category, links]) => (
            <div key={category} className="mb-6">
              <h3 className="text-gray-400 text-sm font-bold uppercase flex justify-between items-center mb-3">
                {category} <ChevronDown size={16} />
              </h3>
              <ul>
                {links.map((link, index) => (
                  <li
                    key={index}
                    className={`mb-2 ${
                      link.text === "Manage Events"
                        ? "bg-gray-700 rounded-lg"
                        : ""
                    }`}
                  >
                    <Link
                      to={link.link || "#"}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 transition-colors"
                      onClick={link.onClick}
                    >
                      {link.icon}
                      <span>{link.text}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
}
