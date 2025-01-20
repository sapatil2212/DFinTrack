import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { loginUser } from "../services/UserService";
import { useDispatch } from "react-redux";
import { setUser } from "../slices/UserSlices";

const LoginForm = ({ setIsAuthenticated }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    securityKey: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSecurityKey, setShowSecurityKey] = useState(false);

  const navigate = useNavigate();

  // Effect to check if the user is already authenticated and redirect to dashboard
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated === "true") {
      navigate("/dashboard"); // Redirect to dashboard if already authenticated
    }
  }, [navigate]); // Only run once when the component is mounted

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await loginUser(formData);

      if (res && res.email) {
        // Store authentication and user info in localStorage
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("username", res.email);
        localStorage.setItem("isAdmin", res.accountType || "false");

        // Update Redux state
        dispatch(setUser(res));
        setIsAuthenticated(true);
        setLoading(false);

        // Redirect to dashboard after successful login
        navigate("/dashboard");
      } else {
        setError("Invalid response from server.");
        setLoading(false);
      }
    } catch (error) {
      setError(error.message || "Invalid credentials");
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 font-['Poppins']">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-sm mt-4 lg:mt-20">
        <div className="p-6">
          <div className="text-center">
            <h1 className="block text-2xl font-bold text-gray-800">Sign in</h1>
            <p className="mt-2 text-sm text-gray-600">
              Don't have an account yet?{" "}
              <Link
                to="/signup"
                className="text-blue-600 decoration-2 hover:underline font-medium"
              >
                Sign up here
              </Link>
            </p>
          </div>

          <div className="mt-5">
            {error && (
              <div className="text-red-500 text-center mb-4">{error}</div>
            )}
            {loading && (
              <div className="text-blue-500 text-center mb-4">
                Processing...
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid gap-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm mb-2 text-gray-800"
                  >
                    Email address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="py-3 px-4 block w-full border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label
                      htmlFor="password"
                      className="block text-sm text-gray-800"
                    >
                      Password
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="py-3 px-4 block w-full border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? (
                        <FaEyeSlash size={20} />
                      ) : (
                        <FaEye size={20} />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="securityKey"
                    className="block text-sm mb-2 text-gray-800"
                  >
                    Security Key
                  </label>
                  <div className="relative">
                    <input
                      type={showSecurityKey ? "text" : "password"}
                      id="securityKey"
                      name="securityKey"
                      value={formData.securityKey}
                      onChange={handleChange}
                      className="py-3 px-4 block w-full border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      onClick={() => setShowSecurityKey((prev) => !prev)}
                    >
                      {showSecurityKey ? (
                        <FaEyeSlash size={20} />
                      ) : (
                        <FaEye size={20} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="submit"
                    className="w-full py-3 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-500"
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Sign In"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
