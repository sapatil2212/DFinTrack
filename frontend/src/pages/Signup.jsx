import React, { useState } from "react";

const Signup = () => {
  const [signUpAs, setSignUpAs] = useState("");
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    otp: "",
    password: "",
    securityKey: "",
    property: "",
  });
  const [message, setMessage] = useState("");

  // Handle "Sign Up As" selection
  const handleSignUpAsChange = (e) => {
    setSignUpAs(e.target.value);
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Send OTP
  const sendOtp = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/auth/send-otp?email=${formData.email}`,
        {
          method: "POST",
        }
      );
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      console.error("Error sending OTP:", error);
      setMessage("Failed to send OTP");
    }
  };

  // Verify OTP
  const verifyOtp = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/auth/verify-otp?otp=${formData.otp}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: formData.email }),
        }
      );
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setMessage("Failed to verify OTP");
    }
  };

  // Complete signup
  const completeSignup = async (e) => {
    e.preventDefault();
    const user = {
      name: `${formData.firstname} ${formData.lastname}`,
      email: formData.email,
      password: formData.password,
      psc: formData.securityKey,
      propertyName: signUpAs === "caretaker" ? formData.property : undefined,
    };

    try {
      const response = await fetch(
        signUpAs === "caretaker"
          ? "http://localhost:8080/api/auth/caretaker-signup"
          : "http://localhost:8080/api/auth/complete-signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        }
      );
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      console.error("Error completing signup:", error);
      setMessage("Failed to complete signup");
    }
  };

  return (
    <div>
      <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-32 mx-auto">
        <div className="grid md:grid-cols-2 items-center gap-12">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl lg:text-5xl lg:leading-tight">
              Hire us
            </h1>
            <p className="mt-1 md:text-lg text-gray-800">
              We help brands and platforms turn big ideas into beautiful digital
              products and experiences.
            </p>

            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-800">
                What can I expect?
              </h2>
              <ul className="mt-2 space-y-2">
                <li className="flex gap-x-3">
                  <svg
                    className="shrink-0 mt-0.5 size-5 text-gray-600"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-gray-600">Industry-leading design</span>
                </li>
                <li className="flex gap-x-3">
                  <svg
                    className="shrink-0 mt-0.5 size-5 text-gray-600"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-gray-600">
                    Developer community support
                  </span>
                </li>
                <li className="flex gap-x-3">
                  <svg
                    className="shrink-0 mt-0.5 size-5 text-gray-600"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-gray-600">Simple and affordable</span>
                </li>
              </ul>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-800">
                Enjoyed by:
              </h2>
            </div>

            <div className="mt-10 flex items-center gap-x-5">
              <div className="flex -space-x-2">
                <span className="inline-flex justify-center items-center size-8 rounded-full bg-blue-600 text-white ring-2 ring-white">
                  <svg
                    className="size-3.5"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                  </svg>
                </span>
              </div>
              <span className="text-sm text-gray-500">
                Trusted by over 37k customers
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="flex flex-col border rounded-xl p-4 sm:p-6 lg:p-10">
              <div className="text-center">
                <h1 className="block text-2xl font-bold text-gray-800">
                  Sign in
                </h1>
                <p className="mt-2 text-sm text-gray-600">
                  Already have an account?{" "}
                  <a
                    className="text-blue-600 decoration-2 hover:underline font-medium"
                    href="/login"
                  >
                    Log in here
                  </a>
                </p>
              </div>

              <form onSubmit={completeSignup}>
                <div className="mt-6 grid gap-4 lg:gap-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                    <div>
                      <label
                        htmlFor="firstname"
                        className="block mb-2 text-sm text-gray-700 font-medium"
                      >
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstname"
                        name="firstname"
                        value={formData.firstname}
                        onChange={handleInputChange}
                        className="py-3 px-4 block w-full border rounded-lg text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="lastname"
                        className="block mb-2 text-sm text-gray ```javascript
                        .700 font-medium"
                      >
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastname"
                        name="lastname"
                        value={formData.lastname}
                        onChange={handleInputChange}
                        className="py-3 px-4 block w-full border rounded-lg text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center">
                      <label
                        htmlFor="email"
                        className="block text-sm mb-2 text-gray-800 font-medium"
                      >
                        Email
                      </label>
                      <button
                        type="button"
                        onClick={sendOtp}
                        className="text-sm text-blue-600 hover:underline font-medium"
                      >
                        Send OTP
                      </button>
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="py-3 px-4 block w-full border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                    <div>
                      <label
                        htmlFor="otp"
                        className="block mb-2 text-sm text-gray-700 font-medium"
                      >
                        Enter OTP
                      </label>
                      <input
                        type="text"
                        id="otp"
                        name="otp"
                        value={formData.otp}
                        onChange={handleInputChange}
                        className="py-3 px-4 block w-full border rounded-lg text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={verifyOtp}
                        className="text-sm text-blue-600 hover:underline font-medium"
                      >
                        Verify OTP
                      </button>
                    </div>
                    <div>
                      <label
                        htmlFor="signUpAs"
                        className="block mb-2 text-sm text-gray-700 font-medium"
                      >
                        Sign Up As
                      </label>
                      <select
                        id="signUpAs"
                        value={signUpAs}
                        onChange={handleSignUpAsChange}
                        className="py-3 px-4 block w-full border rounded-lg text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="">Select</option>
                        <option value="admin">Admin</option>
                        <option value="caretaker">Caretaker</option>
                      </select>
                    </div>
                  </div>

                  {signUpAs === "caretaker" && (
                    <div>
                      <label
                        htmlFor="property"
                        className="block mb-2 text-sm text-gray-700 font-medium"
                      >
                        Select Property
                      </label>
                      <select
                        id="property"
                        name="property"
                        value={formData.property}
                        onChange={handleInputChange}
                        className="py-3 px-4 block w-full border rounded-lg text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="prabhadevi">Prabhadevi</option>
                        <option value="bkc">BKC</option>
                        <option value="pawoi">Pawoi</option>
                        <option value="bandra">Bandra</option>
                        <option value="andheri">Andheri</option>
                      </select>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                    <div>
                      <label
                        htmlFor="password"
                        className="block mb-2 text-sm text-gray-700 font-medium"
                      >
                        Password
                      </label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="py-3 px-4 block w-full border rounded-lg text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="securityKey"
                        className="block mb-2 text-sm text-gray-700 font-medium"
                      >
                        Permanent Security Key
                      </label>
                      <input
                        type="text"
                        id="securityKey"
                        name="securityKey" // Remove the extra space here
                        value={formData.securityKey}
                        onChange={handleInputChange}
                        className="py-3 px-4 block w-full border rounded-lg text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="w-full py-3 mt-6 text-white bg-blue-600 rounded-lg font-medium hover:bg-blue-700"
                    >
                      Create Account
                    </button>
                  </div>
                </div>
              </form>
              {message && (
                <p className="mt-4 text-center text-gray-600">{message}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
