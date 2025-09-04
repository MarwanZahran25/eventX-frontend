import { Navigate, Outlet } from "react-router";
import NavBar from "./navbar";
import { useContext } from "react";
import { AuthContext } from "./authProvider";

export default function AdminCheck() {
  const authInfo = useContext(AuthContext);
  console.log(authInfo);
  return authInfo.isAdmin ? (
    <div>
      <Outlet />
    </div>
  ) : (
    <Navigate to={"/signin"} replace={true} />
  );
}
