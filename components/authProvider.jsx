import { createContext, useState } from "react";
const AuthContext = createContext();
function AuthContextProvider({ children }) {
  let token;
  let role;
  try {
    token = localStorage.getItem("token");
    role = localStorage.getItem("role");
  } catch {
    token = "";
    role = "";
  }
  const [authObj, setAuthObj] = useState({
    isLoggedIn: token ? true : false,
    isAdmin: role === "Admin",
    token,
  });

  return (
    <AuthContext.Provider value={{ ...authObj, setAuthObj }}>
      {children}
    </AuthContext.Provider>
  );
}
export { AuthContextProvider, AuthContext };
