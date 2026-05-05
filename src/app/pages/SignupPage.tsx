import { Link, useNavigate } from 'react-router';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useUser } from '../context/UserContext';
import signupImage from '../../imports/image.png';

export function SignupPage() {
  const navigate   = useNavigate();
  const { signup } = useUser();

  const [form, setForm]   = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError]  = useState('');
  const [loading, setLoad] = useState(false);

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoad(true);
    try {
      await signup(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message ?? 'Signup failed. Please try again.');
    } finally {
      setLoad(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left – form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white px-6 sm:px-8 py-12 order-2 lg:order-1">
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
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {[
              { id: 'name',            label: 'Full Name',       type: 'text',     placeholder: 'Rahul Sharma' },
              { id: 'email',           label: 'Email Address',   type: 'email',    placeholder: 'you@example.com' },
              { id: 'password',        label: 'Password',        type: 'password', placeholder: '••••••••' },
              { id: 'confirmPassword', label: 'Confirm Password',type: 'password', placeholder: '••••••••' },
            ].map(({ id, label, type, placeholder }) => (
              <div key={id}>
                <label htmlFor={id} className="block text-sm mb-2 text-gray-700">{label}</label>
                <input
                  id={id}
                  type={type}
                  value={(form as any)[id]}
                  onChange={set(id)}
                  placeholder={placeholder}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#aa5289] focus:border-transparent"
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#aa5289] hover:bg-[#923d71] disabled:opacity-60 text-white py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-[#aa5289] hover:underline">Login</Link>
          </p>
        </div>
      </div>

      {/* Right – decorative image */}
      <div className="hidden lg:block lg:w-1/2 relative order-1 lg:order-2">
        <div className="absolute inset-0 bg-gradient-to-bl from-[#aa5289]/80 to-[#2d5016]/80" />
        <img src={signupImage} alt="Signup" className="w-full h-full object-cover" />
        <div className="absolute inset-0 flex items-center justify-center text-white text-center px-8">
          <div>
            <h2 className="text-4xl mb-4">Join Chicken Chef!</h2>
            <p className="text-xl">Delicious food delivered to your door</p>
          </div>
        </div>
      </div>
    </div>
  );
}
