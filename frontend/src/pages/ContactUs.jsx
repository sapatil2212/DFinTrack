import React, { useState } from "react";
import { Mail, Phone, HelpCircle, Send } from "lucide-react";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    details: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const validateForm = () => {
    const errors = {};

    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Invalid email format";
    }

    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    if (formData.phoneNumber && !phoneRegex.test(formData.phoneNumber)) {
      errors.phoneNumber = "Invalid phone number format";
    }

    if (!formData.details.trim()) {
      errors.details = "Please provide some details";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Clear specific error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setSubmitStatus("success");

        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          details: "",
        });
      } catch (error) {
        setSubmitStatus("error");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto font-poppins">
      <div className="max-w-2xl lg:max-w-5xl mx-auto">
        <div className="text-center mb-8 pt-[4rem]">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3">
            <Mail className="text-blue-600" size={36} />
            Contact Us
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            We're here to help and answer any question you might have. We look
            forward to hearing from you!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-gray-50 border border-gray-300  rounded-xl p-6 sm:p-8">
            <form onSubmit={handleSubmit} noValidate>
              <div className="grid gap-5">
                {/* Name Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      className={`w-full px-4 py-3 rounded-lg border ${
                        formErrors.firstName
                          ? "border-red-500 focus:ring-red-200"
                          : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                      } transition-all`}
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                    {formErrors.firstName && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.firstName}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      className={`w-full px-4 py-3 rounded-lg border ${
                        formErrors.lastName
                          ? "border-red-500 focus:ring-red-200"
                          : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                      } transition-all`}
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                    {formErrors.lastName && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email and Phone */}
                <div className="grid gap-4">
                  <div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      className={`w-full px-4 py-3 rounded-lg border ${
                        formErrors.email
                          ? "border-red-500 focus:ring-red-200"
                          : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                      } transition-all`}
                      value={formData.email}
                      onChange={handleChange}
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      type="tel"
                      name="phoneNumber"
                      placeholder="Phone Number (Optional)"
                      className={`w-full px-4 py-3 rounded-lg border ${
                        formErrors.phoneNumber
                          ? "border-red-500 focus:ring-red-200"
                          : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                      } transition-all`}
                      value={formData.phoneNumber}
                      onChange={handleChange}
                    />
                    {formErrors.phoneNumber && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.phoneNumber}
                      </p>
                    )}
                  </div>
                </div>

                {/* Details Textarea */}
                <div>
                  <textarea
                    name="details"
                    rows="2"
                    placeholder="Your Message"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      formErrors.details
                        ? "border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                    } transition-all`}
                    value={formData.details}
                    onChange={handleChange}
                  />
                  {formErrors.details && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.details}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin">◌</span>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Send Message
                    </>
                  )}
                </button>

                {/* Submit Status Message */}
                {submitStatus === "success" && (
                  <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded mt-4 text-center">
                    Thank you! We'll get back to you soon.
                  </div>
                )}
                {submitStatus === "error" && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mt-4 text-center">
                    Oops! Something went wrong. Please try again.
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Support Information */}
          <div className=" rounded-xl p-6 sm:p-8 space-y-6">
            <div className="flex items-start space-x-4">
              <HelpCircle className="text-blue-600 shrink-0" size={25} />
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Frequently Asked Questions
                </h3>
                <p className="text-gray-600 mb-4">
                  Check our comprehensive FAQ section to find quick answers to
                  common queries.
                </p>
                <a
                  href="/faq"
                  className="text-blue-600 hover:underline flex items-center gap-2"
                >
                  View FAQs <Send size={16} />
                </a>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div className="flex items-start space-x-4">
              <Phone className="text-blue-600 shrink-0" size={25} />
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Customer Support
                </h3>
                <p className="text-gray-600 mb-2">
                  Reach out to our support team for immediate assistance.
                </p>
                <div className="space-y-1">
                  <p className="text-sm">
                    Email:{" "}
                    <a
                      href="mailto:help@digiworldinfotech.com"
                      className="text-blue-600 hover:underline"
                    >
                      help@digiworldinfotech.com
                    </a>
                  </p>
                  <p className="text-sm">
                    Phone:{" "}
                    <a
                      href="tel:+918830553868"
                      className="text-blue-600 hover:underline"
                    >
                      +91 883 055 3868
                    </a>
                  </p>
                  <p className="text-sm">
                    Phone:{" "}
                    <a
                      href="tel:+918208415943"
                      className="text-blue-600 hover:underline"
                    >
                      +91 820 841 5943
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
