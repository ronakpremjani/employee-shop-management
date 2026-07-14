import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { loginUser } from '../../store/authSlice';
import FormInput from '../../components/forms/FormInput';
import Spinner from '../../components/common/Spinner';

// Schema validation using Zod
const loginSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required').min(8, 'Password must be at least 8 characters'),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data) => {
    try {
      const resultAction = await dispatch(loginUser(data));
      if (loginUser.fulfilled.match(resultAction)) {
        toast.success(`Welcome back, ${resultAction.payload.user.name}!`);
        
        // Redirect based on role
        if (resultAction.payload.user.role === 'admin') {
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate('/staff/dashboard', { replace: true });
        }
      } else {
        toast.error(resultAction.payload || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      toast.error('An unexpected error occurred.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex w-12 h-12 rounded-xl bg-blue-600 items-center justify-center font-bold text-white text-xl shadow-lg shadow-blue-500/20 mb-2">
          ES
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Sign in to your account</h2>
        <p className="text-xs text-gray-400 font-medium">Shop Management System portal</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          label="Email Address"
          name="email"
          type="email"
          placeholder="admin@shop.com or employee@shop.com"
          error={errors.email}
          required
          {...register('email')}
        />

        <FormInput
          label="Password"
          name="password"
          type="password"
          placeholder="••••••••"
          error={errors.password}
          required
          {...register('password')}
        />

        {/* Action Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center py-2.5 px-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-900/20 text-sm tracking-wide mt-2"
        >
          {loading ? <Spinner size="sm" className="mr-2" /> : null}
          Sign In
        </button>
      </form>
      
      {/* Helpful Info (Mock accounts helper) */}
      <div className="pt-4 border-t border-white/5 text-center">
        <p className="text-[10px] text-gray-500 leading-relaxed">
          Tip: First user registered defaults to <span className="text-blue-400 font-semibold">Admin</span>, others register as <span className="text-blue-400 font-semibold">Staff</span>.
        </p>
      </div>
    </div>
  );
};

export default Login;
