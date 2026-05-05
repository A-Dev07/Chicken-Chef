import { Link, useNavigate } from 'react-router';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useUser } from '../context/UserContext';
import loginImage from '../../imports/image.png';

export function LoginPage() {
  const navigate  = useNavigate();
  const { login } = useUser();

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message ?? 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left – decorative image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[#aa5289]/80 to-[#2d5016]/80" />
        <img src={loginImage} alt="Login" className="w-full h-full object-cover" />
        <div className="absolute inset-0 flex items-center justify-center text-white text-center px-8">
          <div>
            <h2 className="text-4xl mb-4">Welcome Back!</h2>
            <p className="text-xl">Order your favourite chicken dishes</p>
          </div>
        </div>
      </div>

      {/* Right – form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white px-6 sm:px-8 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-12 h-12 bg-[#aa5289] rounded-full flex items-center justify-center">
                <span className="text-white text-xl">🍗</span>
              </div>
              <span className="text-2xl text-[#aa5289]">Chicken Chef</span>
            </Link>
            <h1 className="text-3xl mb-2">Login to Your Account</h1>
            <p className="text-gray-600">Enter your credentials to continue</p>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm mb-2 text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
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
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#aa5289] focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#aa5289] hover:bg-[#923d71] disabled:opacity-60 text-white py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Logging in…' : 'Login'}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#aa5289] hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
