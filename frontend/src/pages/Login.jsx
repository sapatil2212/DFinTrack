import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [psk, setPsk] = useState(""); // Permanent Security Key
  const [rememberMe, setRememberMe] = useState(false); // Remember me checkbox state
  const [error, setError] = useState(""); // For displaying error message
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password || !psk) {
      setError("Please fill in all fields");
      return;
    }

    // For example purposes, assuming credentials are correct if email/password/psk match predefined values
    if (
      email === "user@example.com" &&
      password === "password123" &&
      psk === "yourPSK"
    ) {
      // Store authentication status in localStorage
      localStorage.setItem("isAuthenticated", true);
      if (rememberMe) {
        localStorage.setItem("rememberMe", true);
      }

      // Redirect to the dashboard after successful login
      navigate("/dashboard");
    } else {
      setError("Invalid credentials, please try again");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-sm mt-4 lg:mt-20">
        <div className="p-6">
          <div className="text-center">
            <h1 className="block text-2xl font-bold text-gray-800">Sign in</h1>
            <p className="mt-2 text-sm text-gray-600">
              Don't have an account yet?
              <a
                className="text-blue-600 decoration-2 hover:underline font-medium"
                href="../examples/html/signup.html"
              >
                Sign up here
              </a>
            </p>
          </div>

          {error && (
            <div className="mt-4 bg-red-100 text-red-700 p-3 rounded-md text-center">
              {error}
            </div>
          )}

          <div className="mt-5">
            <div className="py-3 flex items-center text-xs text-gray-400 uppercase before:flex-1 before:border-t before:border-gray-200 after:flex-1 after:border-t after:border-gray-200">
              Or
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid gap-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm mb-2 text-gray-800 border-gray-300"
                  >
                    Email address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="py-3 px-4 block w-full border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center">
                    <label
                      htmlFor="password"
                      className="block text-sm mb-2 text-gray-800"
                    >
                      Password
                    </label>
                    <a
                      className="text-sm text-blue-600 hover:underline font-medium"
                      href="../examples/html/recover-account.html"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="py-3 px-4 block w-full border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="psk"
                    className="block text-sm mb-2 text-gray-800 border-gray-300"
                  >
                    Permanent Security Key
                  </label>
                  <input
                    type="password"
                    id="psk"
                    name="psk"
                    className="py-3 px-4 block w-full border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                    value={psk}
                    onChange={(e) => setPsk(e.target.value)}
                    required
                  />
                </div>

                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 text-sm text-gray-800"
                  >
                    Remember me
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none"
                >
                  Sign in
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
