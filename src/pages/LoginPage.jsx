import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { genrateOTPforLogin, validateOTPforUsers } from "../apis/auth";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const role = queryParams.get("role"); // "teacher" or "student"


  console.log(role);
  if (!role) {
    navigate("/loginType");
  }
  const [formData, setFormData] = useState({ userName: "", otp: "" });
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const startCountdown = () => {
    setCountdown(30);
    const timer = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.userName.trim()) {
      setError("Please enter your email or mobile number");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        userName: formData.userName
      };
      const response = await genrateOTPforLogin(payload);
      if (response.success) {
        setUserId(response.userId);
        setShowOtp(true);
        startCountdown();
      } else {
        setError(response.msg || "Failed to send OTP");
      }
      setLoading(false);
    } catch (err) {
      setError(err?.message || "Failed to send OTP. Please try again.");
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.otp.trim()) {
      setError("Please enter the OTP");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        ...formData,
        userId
      };
      const response = await validateOTPforUsers(payload);
      if (response.success) {
        localStorage.setItem("jwt", response.authToken);
        localStorage.setItem("role", role);
        navigate("/");
      } else {
        setError(response.msg || "Invalid OTP");
      }
      setLoading(false);
    } catch (err) {
      setError(err?.message || "Login failed. Please try again.");
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;

    setError("");
    try {
      setLoading(true);
      const payload = {
        userName: formData.userName
      };
      const response = await genrateOTPforLogin(payload);
      if (response.success) {
        startCountdown();
        setError(""); // Clear any existing errors
      } else {
        setError(response.msg || "Failed to resend OTP");
      }
      setLoading(false);
    } catch (err) {
      setError(err?.message || "Failed to resend OTP");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white-600 via-white-600 to-white-500 animate-gradient bg-[length:400%_400%]">
      <div className="relative w-full max-w-md p-8 bg-white/20 backdrop-blur-xl rounded-3xl shadow-2xl transition duration-300 ease-in-out border border-black/60">
        {/* Decorative elements */}
        <div className="absolute -top-12 -right-12 w-24 h-24 bg-pink-500/30 rounded-full blur-xl"></div>
        <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-indigo-500/30 rounded-full blur-xl"></div>

        <div className="relative z-10">
          <div className="flex justify-center mb-8">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-4 rounded-2xl shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>

          <h2 className="text-4xl font-extrabold text-center text-black mb-2 tracking-tight">
            Cloud Class
          </h2>
          <p className="text-center text-black/80 mb-8">
            Secure login to access your dashboard
          </p>

          <form onSubmit={showOtp ? handleLogin : handleEmailSubmit} className="space-y-6">
            {/* Email/Mobile Number */}
            <div className="relative group">
              <input
                type="text"
                name="userName"
                id="userName"
                required
                value={formData.userName}
                onChange={handleChange}
                disabled={showOtp}
                className="peer w-full border-2 border-black/30 rounded-xl bg-white/30 px-4 pt-6 pb-2 text-black placeholder-transparent focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent disabled:bg-white/40 disabled:cursor-not-allowed transition-all duration-200"
                placeholder="Email Address"
              />
              <label
                htmlFor="userName"
                className="absolute left-4 top-2 text-gray/70 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray/50 peer-focus:top-2 peer-focus:text-sm peer-focus:text-indigo-200"
              >
                Email Address
              </label>
              {showOtp && (
                <div className="absolute right-4 top-4 bg-white/30 text-white px-2 py-1 rounded-md text-xs font-medium">
                  Verified
                </div>
              )}
            </div>

            {/* OTP */}
            {showOtp && (
              <div className="relative group">
                <input
                  type="text"
                  name="otp"
                  id="otp"
                  required
                  maxLength={6}
                  value={formData.otp}
                  onChange={handleChange}
                  className="peer w-full border-2 border-black/30 rounded-xl bg-white/30 px-4 pt-6 pb-2 text-black placeholder-transparent focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
                  placeholder="OTP"
                />
                <label
                  htmlFor="otp"
                  className="absolute left-4 top-2 text-gray/70 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray/50 peer-focus:top-2 peer-focus:text-sm peer-focus:text-indigo-200"
                >
                  Enter 6-digit OTP
                </label>
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={countdown > 0 || loading}
                  className="absolute right-4 top-4 text-indigo-100 hover:text-white disabled:text-white/50 text-xs font-medium transition-colors"
                >
                  {countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
                </button>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
                <p className="text-sm text-white font-medium">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:ring-4 focus:ring-indigo-500/50 active:scale-98 transform transition-all duration-150 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              <span className="flex items-center justify-center">
                {loading ? (
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : null}
                {showOtp ? "Authenticate" : "Send OTP"}
              </span>
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-8 flex items-center text-white/70 text-sm justify-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <p>Secured with end-to-end encryption</p>
          </div>

          <p className="mt-6 text-center text-xs text-white/60">
            &copy; {new Date().getFullYear()} Cloud Class. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;