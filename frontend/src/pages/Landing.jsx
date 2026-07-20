import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowRight, ShoppingBag, Star, Package, Clock, Phone } from 'lucide-react';

const Landing = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // If already logged in, redirect them to their dashboard
  if (isAuthenticated && user) {
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'staff') return <Navigate to="/staff/dashboard" replace />;
    return <Navigate to="/user/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-orange-500/30">
      {/* Header */}
      <header className="px-6 sm:px-10 py-6 flex items-center justify-between border-b border-white/5 sticky top-0 bg-black/80 backdrop-blur-md z-50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center font-bold text-white shadow-lg shadow-orange-500/20">
            ES
          </div>
          <span className="text-xl font-bold tracking-tight">Elite Store</span>
        </div>
        <div className="flex items-center space-x-6">
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-zinc-400">
            <a href="#products" className="hover:text-white transition-colors">Products</a>
            <a href="#about" className="hover:text-white transition-colors">About Us</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </nav>
          <div className="w-px h-6 bg-white/10 hidden md:block"></div>
          <div className="space-x-3 flex items-center">
            <Link 
              to="/login" 
              className="px-4 py-2 text-sm font-semibold text-zinc-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link 
              to="/register" 
              className="px-5 py-2 text-sm font-bold text-black bg-white hover:bg-zinc-200 rounded-full transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]"
            >
              Create Account
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 mt-20 mb-24 animate-fade-in relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-orange-600/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>
        
        <span className="px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-semibold tracking-wide mb-6">
          Premium Quality Guaranteed
        </span>
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-8 max-w-5xl mx-auto leading-[1.1]">
          Discover exceptional products for your <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">everyday lifestyle.</span>
        </h1>
        <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
          We bring you the finest selection of premium goods, carefully curated to elevate your standard of living with unmatched quality and service.
        </p>
        <div className="flex flex-col sm:flex-row gap-5">
          <a 
            href="#products" 
            className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-orange-600 hover:bg-orange-500 rounded-full transition-all shadow-xl shadow-orange-600/20 group"
          >
            Explore Collection
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </a>
          <Link 
            to="/register" 
            className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-full transition-all backdrop-blur-sm"
          >
            Become a Member
          </Link>
        </div>
      </main>

      {/* Features / Why Choose Us */}
      <section id="about" className="py-24 border-t border-white/5 bg-zinc-950 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-[500px] h-[500px] bg-white/5 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Why Choose Us?</h2>
            <p className="text-zinc-400 max-w-xl mx-auto">We are committed to delivering excellence in every interaction, ensuring our customers always receive the best.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <div className="p-8 rounded-3xl bg-black/50 border border-white/5 hover:border-orange-500/30 transition-all group backdrop-blur-sm">
              <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Package className="w-7 h-7 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Premium Quality</h3>
              <p className="text-zinc-400 leading-relaxed text-sm">
                Every product in our catalog is rigorously tested and verified to meet the highest industry standards.
              </p>
            </div>
            
            <div className="p-8 rounded-3xl bg-black/50 border border-white/5 hover:border-orange-500/30 transition-all group backdrop-blur-sm">
              <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Star className="w-7 h-7 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Customer First</h3>
              <p className="text-zinc-400 leading-relaxed text-sm">
                Our dedicated support team is available around the clock to ensure your complete satisfaction.
              </p>
            </div>
            
            <div className="p-8 rounded-3xl bg-black/50 border border-white/5 hover:border-orange-500/30 transition-all group backdrop-blur-sm">
              <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Clock className="w-7 h-7 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Fast Delivery</h3>
              <p className="text-zinc-400 leading-relaxed text-sm">
                We partner with top logistics providers to ensure your orders arrive safely and right on schedule.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t border-white/10 bg-black pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center font-bold text-white">
                ES
              </div>
              <span className="text-lg font-bold tracking-tight">Elite Store</span>
            </div>
            <div className="flex items-center space-x-4 text-zinc-400 text-sm">
              <a href="#" className="hover:text-white transition-colors flex items-center"><Phone className="w-4 h-4 mr-2"/> 1-800-ELITE-STORE</a>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10 text-zinc-600 text-xs gap-4">
            <p>&copy; {new Date().getFullYear()} Elite Store Business. All rights reserved.</p>
            <div className="flex space-x-6">
              <Link to="/login" className="hover:text-zinc-300 transition-colors">Staff / Member Login</Link>
              <a href="#" className="hover:text-zinc-300 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-zinc-300 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
