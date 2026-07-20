import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';
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
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

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
        
        // Save remember state in localStorage if desired
        if (rememberMe) {
          localStorage.setItem('remembered_email', data.email);
        } else {
          localStorage.removeItem('remembered_email');
        }

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
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-white font-sans">Sign in to your account</h2>
        <p className="text-xs text-zinc-400 font-medium">Enter your credentials to access the console</p>
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

        <div className="relative space-y-1.5">
          <FormInput
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            error={errors.password}
            required
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-[38px] text-zinc-400 hover:text-zinc-200"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {/* Remember me & Forgot Password block */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center space-x-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-zinc-800 bg-zinc-950 text-orange-600 focus:ring-1 focus:ring-orange-500 focus:ring-offset-0 transition-all cursor-pointer"
            />
            <span className="text-xs text-zinc-400 font-medium hover:text-zinc-300">Remember me</span>
          </label>

          <a href="#" className="text-xs text-zinc-400 hover:text-orange-400 font-medium transition-all" onClick={(e) => {
            e.preventDefault();
            toast('Forgot password functionality is managed by the administrator.', { icon: '🔑' });
          }}>
            Forgot password?
          </a>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center py-2.5 px-4 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 disabled:pointer-events-none text-white font-semibold rounded-xl transition-all shadow-lg shadow-orange-900/20 text-sm tracking-wide mt-2 cursor-pointer"
        >
          {loading ? <Spinner size="sm" className="mr-2" /> : null}
          Sign In
        </button>
      </form>
      
      {/* Switch to Register */}
      <div className="pt-4 border-t border-zinc-900 text-center">
        <p className="text-xs text-zinc-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-orange-500 hover:text-orange-400 font-semibold transition-all">
            Create an account
          </Link>
        </p>
      </div>

      {/* Helpful Info (Mock accounts helper) */}
      <div className="p-3 bg-zinc-900/40 border border-zinc-800 rounded-xl">
        <p className="text-[10px] text-zinc-500 leading-relaxed text-center">
          💡 First user registered defaults to <span className="text-zinc-300 font-semibold">Admin</span>, others register as <span className="text-zinc-300 font-semibold">Staff</span>.
        </p>
      </div>
    </div>
  );
};

export default Login;

