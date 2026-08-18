import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { registerCandidate } from '../api/candidateApi';
import { UserPlus } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const mutation = useMutation({
    mutationFn: registerCandidate,
    onSuccess: () => {
      alert('Registration successful! Please login.');
      navigate('/login');
    },
    onError: (err) => alert(err.response?.data?.message || 'Registration failed! Check backend logs.'),
  });

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border p-8">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-2">
            <UserPlus className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Candidate Register</h2>
        </div>

        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase text-slate-500">Full Name</label>
            <input
              {...register('name', { required: 'Name is required' })}
              className="w-full mt-1 p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Sugam Karmakar"
            />
            {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="text-xs font-semibold uppercase text-slate-500">Email Address</label>
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className="w-full mt-1 p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="sugamkarmakar25@gmail.com"
            />
            {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="text-xs font-semibold uppercase text-slate-500">Phone Number</label>
            <input
              type="text"
              {...register('phone', { required: 'Phone is required' })}
              className="w-full mt-1 p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="9876543210"
            />
            {errors.phone && <p className="text-xs text-rose-500 mt-1">{errors.phone.message}</p>}
          </div>

          <div>
            <label className="text-xs font-semibold uppercase text-slate-500">Password</label>
            <input
              type="password"
              {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Minimum 6 chars' } })}
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
            {mutation.isPending ? 'Registering...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-4">
          Already have an account? <Link to="/login" className="text-indigo-600 font-semibold">Login</Link>
        </p>
      </div>
    </div>
  );
}