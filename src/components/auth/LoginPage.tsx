import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Brain, Eye, EyeOff, BookOpen, Users, Heart, Mail, Lock, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import nevoLogo from 'figma:asset/eb4ed43b358d525aade73d54d2fe9ed4db700394.png';

export function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // For demo purposes, create a mock user and route based on email pattern
    const role = formData.email.includes('teacher') ? 'teacher' 
                : formData.email.includes('parent') ? 'parent' 
                : 'student';
    
    const userData = {
      fullName: 'Demo User',
      email: formData.email,
      role,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('currentUser', JSON.stringify(userData));
    
    // Route based on role
    if (role === 'student') {
      // Check if assessment completed
      const assessmentData = localStorage.getItem('assessmentData');
      if (assessmentData) {
        navigate('/student/dashboard');
      } else {
        navigate('/assessment');
      }
    } else if (role === 'teacher') {
      navigate('/teacher/dashboard');
    } else if (role === 'parent') {
      navigate('/parent/dashboard');
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Image */}
      <div className="hidden lg:block relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1623035792727-61da15e1a383?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwZ2lybCUyMHN0dWRlbnQlMjBsZWFybmluZyUyMGhhcHB5fGVufDF8fHx8MTc2MzUyMjcyOXww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Happy Nigerian girl learning"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#4F46E5]/60 via-[#4F46E5]/50 to-[#6366F1]/40" />
        
        <div className="relative h-full flex flex-col justify-between p-12">
          <Link to="/" className="flex items-center gap-3 text-white">
            <img src={nevoLogo} alt="Nevo" className="w-12 h-12 brightness-0 invert" />
            <span className="font-['Poppins'] text-2xl font-bold">Nevo</span>
          </Link>
          
          <div className="space-y-6 max-w-md">
            <h1 className="text-white leading-tight">
              Welcome Back
            </h1>
            
            <p className="text-white/90 text-lg leading-relaxed">
              Continue your personalized learning journey. Your students are waiting for lessons that truly understand them.
            </p>
          </div>
          
          <div className="flex items-center gap-6 text-white/60 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <span>•</span>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <span>•</span>
            <a href="#" className="hover:text-white transition-colors">Help</a>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex items-center justify-center p-6 lg:p-12 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <Link to="/" className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <img src={nevoLogo} alt="Nevo" className="w-12 h-12" />
            <span className="font-['Poppins'] text-[#111827] text-2xl font-bold">Nevo</span>
          </Link>

          <div className="mb-10">
            <h2 className="mb-3 text-[#111827]">Welcome Back</h2>
            <p className="text-[#6B7280]">Login to continue your learning journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-[#111827]">Email</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="pl-12 h-12 text-base rounded-xl border-2 border-gray-200 focus:border-[#4F46E5] bg-white"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-[#111827]">Password</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="pl-12 h-12 text-base rounded-xl border-2 border-gray-200 focus:border-[#4F46E5] bg-white"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#4F46E5] focus:ring-[#4F46E5]" />
                <span className="text-[#6B7280]">Remember me</span>
              </label>
              <a href="#" className="text-[#4F46E5] hover:underline font-semibold">
                Forgot password?
              </a>
            </div>

            <Button type="submit" className="w-full bg-[#4F46E5] text-white h-12 text-base rounded-xl hover:bg-[#4338CA] transition-colors flex items-center justify-center gap-2 mt-6">
              Login
              <ArrowRight className="w-5 h-5" />
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[#6B7280]">
              Don't have an account?{' '}
              <Link to="/signup" className="text-[#4F46E5] hover:underline font-semibold">
                Sign up
              </Link>
            </p>
          </div>

          <div className="mt-8 p-4 bg-[#F0F4FF] rounded-xl border border-[#4F46E5]/20">
            <p className="text-xs font-semibold text-[#4F46E5] mb-1">💡 Demo Hint:</p>
            <p className="text-xs text-[#6B7280]">
              Use any email with "teacher", "parent", or default for student role
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
