import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { BrowserRouter, Route, Routes } from "react-router";
import AdminEventsPage from "../components/adminEventsPage.jsx";
import AdminCheck from "../components/adminCheck.jsx";
import SignIn from "../components/SignIn.jsx";
import App from "./App.jsx";
import EditEventForm from "../components/editEventPage.jsx";
import EventDetails from "../components/eventDetails.jsx";
import UserEvents from "../components/userTickets.jsx";
import QrPage from "../components/qrCode.jsx";
import AddEventForm from "../components/addEvent.jsx";
import AnalyticsPage from "../components/analytics.jsx";
import {
  AuthContext,
  AuthContextProvider,
} from "../components/authProvider.jsx";
import { QrCode } from "lucide-react";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/" element={<App />}>
            <Route index={true} element={<AdminEventsPage />} />
            <Route path="/event/:id" element={<EventDetails />} />
            <Route path="/tickets" element={<UserEvents />} />
            <Route path="qr/:ticketId" element={<QrPage />} />
            <Route path="admin" element={<AdminCheck />}>
              <Route index={true} element={<AdminEventsPage />} />
              <Route path="add" element={<AddEventForm />} />
              <Route path="edit/:id" element={<EditEventForm />} />
              <Route path="analytics" element={<AnalyticsPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthContextProvider>
  </StrictMode>
);
