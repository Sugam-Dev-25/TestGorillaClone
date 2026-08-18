import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { loginCandidate } from '../api/candidateApi';
import { useAuth } from '../context/AuthContext';
import { LogIn } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const mutation = useMutation({
    mutationFn: loginCandidate,
    onSuccess: (data) => {
      // ব্যাকএন্ডের পাঠানো ডাটা কনসোলে প্রিন্ট করে দেখা
      console.log('Backend Response:', data);

      // সব ধরণের সম্ভাব্য ব্যাকএন্ড রেসপন্স ফরম্যাট চেকিং
      const userData = data?.user || data?.candidate || data?.data?.user || data?.data?.candidate || data?.data;
      const token = data?.token || data?.accessToken || data?.data?.token;

      if (token) {
        login(userData || { name: 'Candidate' }, token);

        // Role ভিত্তিক ডাইনামিক রিডাইরেক্ট
        const userRole = userData?.role;

        if (userRole === 'admin') {
          navigate('/admin/dashboard', { replace: true });
        } else if (userRole === 'recruiter') {
          navigate('/recruiter/create', { replace: true });
        } else {
          navigate('/dashboard', { replace: true }); // Candidate
        }
      } else {
        alert('Token missing in server response!');
      }
    },
    onError: (err) => {
      const errorMessage = err.response?.data?.message || 'Invalid email or password!';
      alert(errorMessage);
    },
  });

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border p-8">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-2">
            <LogIn className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Account Login</h2>
        </div>

        <form onSubmit={handleSubmit((formData) => mutation.mutate(formData))} className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase text-slate-500">Email</label>
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className="w-full mt-1 p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="user@test.com"
            />
            {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="text-xs font-semibold uppercase text-slate-500">Password</label>
            <input
              type="password"
              {...register('password', { required: 'Password is required' })}
              className="w-full mt-1 p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-xs text-rose-500 mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {mutation.isPending ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-4">
          Don't have an account? <Link to="/register" className="text-indigo-600 font-semibold">Register</Link>
        </p>
      </div>
    </div>
  );
}