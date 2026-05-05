import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { LogOut } from "lucide-react";
import { useUser } from "../context/UserContext";
import signupImage from "../../imports/image.png";

export function SignupPage() {
  const navigate = useNavigate();
  const { logout } = useUser();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate signup - in real app, this would be PHP backend
    if (
      formData.name &&
      formData.email &&
      formData.password &&
      formData.password === formData.confirmPassword
    ) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white px-8 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-12 h-12 bg-[#aa5289] rounded-full flex items-center justify-center">
                <span className="text-white text-xl">🍗</span>
              </div>
              <span className="text-2xl text-[#aa5289]">Chicken Chef</span>
            </Link>
            <h1 className="text-3xl mb-2">Create Your Account</h1>
            <p className="text-gray-600">Join us and start ordering today</p>
            <button
              onClick={handleLogout}
              className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Logout</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm mb-2 text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#aa5289] focus:border-transparent"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm mb-2 text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#aa5289] focus:border-transparent"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm mb-2 text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#aa5289] focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm mb-2 text-gray-700"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#aa5289] focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                id="terms"
                className="w-4 h-4 mt-1 text-[#aa5289] border-gray-300 rounded focus:ring-[#aa5289]"
                required
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
                I agree to the{" "}
                <a href="#" className="text-[#aa5289] hover:underline">
                  Terms and Conditions
                </a>{" "}
                and{" "}
                <a href="#" className="text-[#aa5289] hover:underline">
                  Privacy Policy
                </a>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-[#aa5289] hover:bg-[#923d71] text-white py-3 rounded-xl transition-colors"
            >
              Sign Up
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-[#aa5289] hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2d5016]/80 to-[#aa5289]/80" />
        <img
          src={signupImage}
          alt="Signup"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center text-white text-center px-8">
          <div>
            <h2 className="text-4xl mb-4">Join Chicken Chef</h2>
            <p className="text-xl">
              Start your delicious journey with us today
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
