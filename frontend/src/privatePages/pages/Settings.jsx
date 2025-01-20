import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateUser } from "../../slices/UserSlices";
import {
  User,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  Edit,
  Info,
  Building,
  Briefcase,
} from "lucide-react";
import {
  getProfile,
  updateUsername,
  updatePassword,
} from "../../services/profileService";
import SuccessModal from "/src/components/SuccessModal";

export default function SettingsProfile() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [savingUsername, setSavingUsername] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [profile, setProfile] = useState(null);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    fullName: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await getProfile();
      setProfile(response);

      // Update Redux store with fresh profile data
      dispatch(
        updateUser({
          name: response.name,
          email: response.email,
          accountType: response.accountType,
          propertyName: response.propertyName,
          propertyId: response.propertyId,
        })
      );

      setFormData((prev) => ({
        ...prev,
        fullName: response.name || "",
        email: response.email || "",
      }));
    } catch (error) {
      setErrors((prev) => ({ ...prev, general: error.message }));
    } finally {
      setLoading(false);
    }
  };

  const validateUsername = () => {
    let isValid = true;
    const newErrors = { ...errors, fullName: "" };

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Username is required";
      isValid = false;
    } else if (formData.fullName.length < 3) {
      newErrors.fullName = "Username must be at least 3 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const validatePassword = () => {
    let isValid = true;
    const newErrors = {
      ...errors,
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    };

    if (!formData.oldPassword) {
      newErrors.oldPassword = "Current password is required";
      isValid = false;
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
      isValid = false;
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
      isValid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
      isValid = false;
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    if (!validateUsername()) return;

    setSavingUsername(true);
    setErrors((prev) => ({ ...prev, general: "" }));

    try {
      // Call API to update username
      await updateUsername(formData.fullName);

      // Fetch updated profile data
      const updatedProfile = await getProfile();
      setProfile(updatedProfile);

      // Update Redux store
      dispatch(
        updateUser({
          name: updatedProfile.name,
          email: updatedProfile.email,
          accountType: updatedProfile.accountType,
          propertyName: updatedProfile.propertyName,
          propertyId: updatedProfile.propertyId,
        })
      );

      setSuccessMessage("Username updated successfully!");
    } catch (error) {
      setErrors((prev) => ({ ...prev, general: error.message }));
    } finally {
      setSavingUsername(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword()) return;

    setSavingPassword(true);
    setErrors((prev) => ({ ...prev, general: "" }));

    try {
      await updatePassword(formData.oldPassword, formData.newPassword);
      setSuccessMessage("Password updated successfully!");
      setFormData((prev) => ({
        ...prev,
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        oldPassword: "Incorrect current password",
      }));
    } finally {
      setSavingPassword(false);
    }
  };
  const handleCancel = () => {
    setFormData({
      fullName: profile?.name || "",
      email: profile?.email || "",
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setErrors({
      fullName: "",
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
      general: "",
    });
  };

  const renderPasswordInput = (field, label, show, setShow) => (
    <div className="space-y-1">
      <label className="block text-gray-600 text-xs">{label}</label>
      <div className="relative">
        <KeyRound className="absolute left-2 top-2 text-gray-400 w-4 h-4" />
        <input
          type={show ? "text" : "password"}
          value={formData[field]}
          onChange={(e) =>
            setFormData({ ...formData, [field]: e.target.value })
          }
          className={`w-full pl-8 pr-8 py-2 text-sm bg-blue-50 border rounded-md ${
            errors[field] ? "border-red-500" : "border-gray-200"
          }`}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-2 top-2 text-gray-400"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {errors[field] && <p className="text-red-500 text-xs">{errors[field]}</p>}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 p-4 max-w-6xl mx-auto">
      {/* Left Panel - Personal Information */}
      <div className="flex-1 bg-white rounded-lg border  p-4">
        <h2 className="text-base text-gray-800 font-semibold mb-4 flex items-center">
          <Edit className="w-4 h-4 mr-2" />
          Personal Information
        </h2>

        {errors.general && (
          <div className="p-2 mb-4 text-xs text-red-700 bg-red-100 border border-red-400 rounded-md">
            {errors.general}
          </div>
        )}

        {/* Username and Email Form */}
        <form onSubmit={handleUsernameSubmit} className="mb-4 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-gray-700 text-xs mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-2 top-2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className={`w-full pl-8 py-2 text-sm bg-blue-50 border rounded-md transition-colors ${
                    errors.fullName
                      ? "border-red-500"
                      : "border-gray-200 focus:border-blue-500"
                  }`}
                />
              </div>
              {errors.fullName && (
                <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
              )}
            </div>

            <div className="flex-1">
              <label className="block text-gray-700 text-xs mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-2 top-2 text-gray-400 w-4 h-4" />
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full pl-8 py-2 text-sm bg-gray-100 border border-gray-200 rounded-md text-gray-500"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button
              type="submit"
              disabled={savingUsername}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
            >
              {savingUsername ? "Updating..." : "Update Profile"}
              {!savingUsername && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          </div>
        </form>

        {/* Password Form */}
        <div className="border-t pt-4">
          <h3 className="text-sm text-gray-800 font-semibold mb-2">
            Change Password
          </h3>
          <p className="text-xs text-gray-600 mb-2">
            To update your password, please enter your current password and
            choose a new one.
          </p>

          <form onSubmit={handlePasswordSubmit} className="space-y-3">
            {renderPasswordInput(
              "oldPassword",
              "Current Password",
              showOldPassword,
              setShowOldPassword
            )}
            {renderPasswordInput(
              "newPassword",
              "New Password",
              showNewPassword,
              setShowNewPassword
            )}
            {renderPasswordInput(
              "confirmPassword",
              "Confirm New Password",
              showConfirmPassword,
              setShowConfirmPassword
            )}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-1 text-xs text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingPassword}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
              >
                {savingPassword ? "Updating..." : "Update Password"}
                {!savingPassword && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right Panel - Profile Information */}
      <div className="w-full lg:w-80 bg-white rounded-lg border p-4">
        <h2 className="text-base text-gray-800 font-semibold mb-4 flex items-center">
          <Info className="w-4 h-4 mr-2" />
          Profile Information
        </h2>

        <div className="space-y-3">
          {[
            { label: "Username", icon: User, value: profile?.name },
            { label: "Email Address", icon: Mail, value: profile?.email },
            {
              label: "Account Type",
              icon: Briefcase,
              value: profile?.accountType,
            },
            {
              label: "Property Assigned",
              icon: Building,
              value: profile?.propertyName
                ? `${profile.propertyName} (ID: ${profile.propertyId})`
                : "N/A",
            },
          ].map(({ label, icon: Icon, value }) => (
            <div key={label}>
              <label className="block text-gray-700 text-xs mb-1">
                {label}
              </label>
              <div className="relative">
                <Icon className="absolute left-2 top-2 text-gray-400 w-4 h-4" />
                <div className="pl-8 py-2 text-sm bg-blue-50 border border-gray-200 rounded-md">
                  {value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <SuccessModal
        isOpen={!!successMessage}
        message={successMessage}
        onClose={() => setSuccessMessage("")}
      />
    </div>
  );
}
