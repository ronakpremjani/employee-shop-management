import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Check, X, ShieldAlert, Sparkles } from 'lucide-react';
import { registerUser } from '../../store/authSlice';
import FormInput from '../../components/forms/FormInput';
import Spinner from '../../components/common/Spinner';

// Schema validation using Zod
const registerSchema = z.object({
  name: z.string().trim().min(1, 'Full Name is required').min(2, 'Name must be at least 2 characters'),
  email: z.string().trim().min(1, 'Email is required').email('Invalid email address'),
  phone: z.string().trim()
    .min(1, 'Phone number is required')
    .regex(/^\d{10}$/, 'Phone number must be exactly 10 digits'),
  password: z.string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string().min(1, 'Confirm Password is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', phone: '', password: '', confirmPassword: '' },
  });

  const passwordVal = watch('password', '');

  // Calculate password strength score (0 to 5)
  const getPasswordStrength = (pwd) => {
    let score = 0;
    if (!pwd) return score;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const strengthScore = getPasswordStrength(passwordVal);

  const getStrengthLabelAndColor = (score) => {
    if (score === 0) return { label: 'None', color: 'bg-zinc-800', text: 'text-zinc-500' };
    if (score <= 2) return { label: 'Weak', color: 'bg-rose-500', text: 'text-rose-500' };
    if (score <= 4) return { label: 'Medium', color: 'bg-amber-500', text: 'text-amber-500' };
    return { label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-500' };
  };

  const strength = getStrengthLabelAndColor(strengthScore);

  const onSubmit = async (data) => {
    try {
      // Create request payload (remove confirmPassword)
      const { confirmPassword, ...payload } = data;
      const resultAction = await dispatch(registerUser(payload));
      
      if (registerUser.fulfilled.match(resultAction)) {
        toast.success('Registration successful! Please log in.');
        navigate('/login');
      } else {
        toast.error(resultAction.payload || 'Registration failed. Please check your inputs.');
      }
    } catch (err) {
      toast.error('An unexpected error occurred during signup.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-white">Create an account</h2>
        <p className="text-xs text-zinc-400 font-medium">Get started with your ShopManager access portal</p>
      </div>

      {/* Register Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          label="Full Name"
          name="name"
          placeholder="e.g. John Doe"
          error={errors.name}
          required
          {...register('name')}
        />

        <FormInput
          label="Email Address"
          name="email"
          type="email"
          placeholder="e.g. john@company.com"
          error={errors.email}
          required
          {...register('email')}
        />

        <FormInput
          label="Phone Number"
          name="phone"
          type="tel"
          placeholder="e.g. 9876543210"
          error={errors.phone}
          required
          {...register('phone')}
        />

        {/* Password block with toggle & strength indicator */}
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

        {/* Password Strength Visualizer */}
        {passwordVal && (
          <div className="space-y-2 px-1 py-1">
            <div className="flex justify-between items-center text-[10px] font-semibold tracking-wide uppercase text-zinc-400">
              <span>Password Strength</span>
              <span className={strength.text}>{strength.label}</span>
            </div>
            <div className="grid grid-cols-5 gap-1.5 h-1">
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className={`h-full rounded-full transition-all duration-300 ${
                    strengthScore >= level ? strength.color : 'bg-zinc-800'
                  }`}
                />
              ))}
            </div>
            
            {/* Realtime Checklist validation helper */}
            <ul className="text-[10px] text-zinc-500 space-y-1 mt-1 font-medium">
              <li className="flex items-center">
                {passwordVal.length >= 8 ? (
                  <Check className="w-3 h-3 text-emerald-500 mr-1 shrink-0" />
                ) : (
                  <X className="w-3 h-3 text-zinc-600 mr-1 shrink-0" />
                )}
                At least 8 characters
              </li>
              <li className="flex items-center">
                {/[A-Z]/.test(passwordVal) ? (
                  <Check className="w-3 h-3 text-emerald-500 mr-1 shrink-0" />
                ) : (
                  <X className="w-3 h-3 text-zinc-600 mr-1 shrink-0" />
                )}
                At least one uppercase letter
              </li>
              <li className="flex items-center">
                {/[0-9]/.test(passwordVal) ? (
                  <Check className="w-3 h-3 text-emerald-500 mr-1 shrink-0" />
                ) : (
                  <X className="w-3 h-3 text-zinc-600 mr-1 shrink-0" />
                )}
                At least one numeric digit
              </li>
              <li className="flex items-center">
                {/[^A-Za-z0-9]/.test(passwordVal) ? (
                  <Check className="w-3 h-3 text-emerald-500 mr-1 shrink-0" />
                ) : (
                  <X className="w-3 h-3 text-zinc-600 mr-1 shrink-0" />
                )}
                At least one special character
              </li>
            </ul>
          </div>
        )}

        <div className="relative space-y-1.5">
          <FormInput
            label="Confirm Password"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="••••••••"
            error={errors.confirmPassword}
            required
            {...register('confirmPassword')}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3.5 top-[38px] text-zinc-400 hover:text-zinc-200"
            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
          >
            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center py-2.5 px-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:pointer-events-none text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-900/20 text-sm tracking-wide mt-3 cursor-pointer"
        >
          {loading ? <Spinner size="sm" className="mr-2" /> : null}
          Register Account
        </button>
      </form>

      {/* Switch to login */}
      <div className="pt-4 border-t border-zinc-900 text-center">
        <p className="text-xs text-zinc-400">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 hover:text-blue-400 font-semibold transition-all">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
