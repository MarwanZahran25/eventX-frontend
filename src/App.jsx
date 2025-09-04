import "./App.css";
import { Routes, Route, Outlet, Navigate } from "react-router";
import NavBar from "../components/navbar";
import { useContext } from "react";
import { AuthContext } from "../components/authProvider";
export default function App() {
  const a = useContext(AuthContext);
  const isLoggedIn = a.isLoggedIn;
  console.log(a);

  return isLoggedIn ? (
    <div className="grid grid-cols-[256px_1fr]">
      <NavBar stateFunction={console.log} />
      <Outlet className="col-start-2" />
    </div>
  ) : (
    <Navigate to={"/signin"} replace={true} />
  );
}
