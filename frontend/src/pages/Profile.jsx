import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User, Phone, Mail, Award, Calendar, ToggleLeft, Edit2, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchCurrentUser } from '../store/authSlice';
import FormInput from '../components/forms/FormInput';
import Spinner from '../components/common/Spinner';

const profileSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z.string().trim().min(1, 'Email is required').email('Invalid email address'),
  phone: z.string().trim().min(10, 'Phone must be at least 10 digits'),
  password: z.string().optional().or(z.literal('')),
});

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      password: '',
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Mock profile updates to persist locally because the backend has no profile update endpoints that allow admins/staff to update themselves.
      const updatedUser = {
        ...user,
        name: data.name,
        email: data.email,
        phone: data.phone,
      };
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      toast.success('Profile details updated successfully!');
      setIsEditing(false);
      
      // reload window or refresh redux store state
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      toast.error('Failed to save profile changes.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">User Profile</h1>
        <p className="text-sm text-gray-400 font-medium mt-1">Review your login details and account settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side: Avatar & Readonly Stats */}
        <div className="glass p-6 rounded-2xl border border-white/5 flex flex-col items-center text-center space-y-4 md:col-span-1">
          <div className="w-20 h-20 rounded-2xl bg-blue-600/10 border-2 border-blue-500/20 flex items-center justify-center font-bold text-blue-400 text-3xl shadow-xl shadow-blue-500/5">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-white tracking-wide">{user?.name}</h3>
            <p className="text-xs text-gray-400 font-medium capitalize mt-0.5">{user?.role} Portal</p>
          </div>

          <div className="w-full pt-4 border-t border-white/5 space-y-3.5 text-left text-xs">
            <div className="flex items-center text-gray-400">
              <Award className="w-4 h-4 mr-2.5 text-blue-500 shrink-0" />
              <div>
                <p className="font-semibold text-white capitalize">{user?.role}</p>
                <p className="text-[10px] text-gray-500">Security Clearance</p>
              </div>
            </div>
            
            <div className="flex items-center text-gray-400">
              <ToggleLeft className="w-4 h-4 mr-2.5 text-blue-500 shrink-0" />
              <div>
                <p className="font-semibold text-white">{user?.status || 'Active'}</p>
                <p className="text-[10px] text-gray-500">Status Indicator</p>
              </div>
            </div>

            <div className="flex items-center text-gray-400">
              <Calendar className="w-4 h-4 mr-2.5 text-blue-500 shrink-0" />
              <div>
                <p className="font-semibold text-white">
                  {user?.joiningDate ? new Date(user.joiningDate).toLocaleDateString('en-IN') : '2026-07-14'}
                </p>
                <p className="text-[10px] text-gray-500">Member Since</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Editable Settings Form */}
        <div className="glass p-6 rounded-2xl border border-white/5 space-y-6 md:col-span-2">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <h3 className="text-lg font-bold text-white tracking-wide">Account Details</h3>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center text-xs font-semibold text-blue-400 hover:text-blue-300 transition-all border border-blue-500/20 hover:bg-blue-600/10 px-3 py-1.5 rounded-xl"
              >
                <Edit2 className="w-3.5 h-3.5 mr-1.5" />
                Edit Profile
              </button>
            ) : null}
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <FormInput
                label="Full Name"
                name="name"
                error={errors.name}
                required
                {...register('name')}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="Email Address"
                  name="email"
                  type="email"
                  error={errors.email}
                  required
                  {...register('email')}
                />
                
                <FormInput
                  label="Phone Number"
                  name="phone"
                  error={errors.phone}
                  required
                  {...register('phone')}
                />
              </div>

              <FormInput
                label="Change Password"
                name="password"
                type="password"
                placeholder="Leave blank to keep current password"
                error={errors.password}
                {...register('password')}
              />

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-500 font-semibold text-white text-sm rounded-xl transition-all shadow-lg"
                >
                  {loading ? <Spinner size="sm" className="mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                  Save Details
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Full Name</span>
                <p className="text-white font-medium flex items-center">
                  <User className="w-4 h-4 text-gray-500 mr-2 shrink-0" />
                  {user?.name}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email Address</span>
                <p className="text-white font-medium flex items-center">
                  <Mail className="w-4 h-4 text-gray-500 mr-2 shrink-0" />
                  {user?.email}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Phone Number</span>
                <p className="text-white font-medium flex items-center">
                  <Phone className="w-4 h-4 text-gray-500 mr-2 shrink-0" />
                  {user?.phone}
                </p>
              </div>

              {user?.role === 'staff' && (
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Monthly Base Salary</span>
                  <p className="text-emerald-400 font-bold">
                    ₹{Number(user.salary).toLocaleString('en-IN')}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
