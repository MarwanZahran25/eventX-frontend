import { useState, useContext } from "react";
import { Navigate } from "react-router";
import axios from "axios";
import { AuthContext } from "./authProvider";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const authObj = useContext(AuthContext);
  const isAuthenticated = authObj.isLoggedIn;
  console.log(isAuthenticated);
  const isAdmin = authObj.isAdmin;
  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    let data;
    try {
      const body = { email, password };
      data = (await axios.post("http://localhost:3000/user/signin", body)).data;
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.isAdmin ? "Admin" : "User");
      authObj.setAuthObj((obj) => {
        return {
          ...obj,
          isLoggedIn: true,
          isAdmin: data.isAdmin,
          token: data.token,
        };
      });
      console.log(data);
    } catch {
      setError("incorrect email or password");
      setIsLoading(false);
    }
  }

  return isAuthenticated ? (
    isAdmin ? (
      <Navigate to={"/admin"} />
    ) : (
      <Navigate to={"/"} />
    )
  ) : (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={(e) => {
                  handleSubmit(e);
                }}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
