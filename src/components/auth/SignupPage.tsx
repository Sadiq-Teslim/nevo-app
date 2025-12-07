import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Brain, Eye, EyeOff, BookOpen, Users, Heart, Check, User, Mail, Lock, ArrowRight, UserCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import nevoLogo from 'figma:asset/eb4ed43b358d525aade73d54d2fe9ed4db700394.png';

export function SignupPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roleFromUrl = searchParams.get('role') || '';
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: roleFromUrl,
    // Student-specific
    age: '',
    school: '',
    grade: '',
    // Teacher-specific
    schoolName: '',
    classTaught: '',
    // Parent-specific
    childName: '',
    childEmail: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const userData = {
      ...formData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('currentUser', JSON.stringify(userData));
    
    if (formData.role === 'student') {
      navigate('/assessment');
    } else if (formData.role === 'teacher') {
      navigate('/teacher/dashboard');
    } else if (formData.role === 'parent') {
      navigate('/parent/dashboard');
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Image */}
      <div className="hidden lg:block relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1744809448493-448812255e4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwc3R1ZGVudCUyMHNtaWxpbmclMjBzY2hvb2x8ZW58MXx8fHwxNzYzNTIxODIyfDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Happy Nigerian child learning"
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
              Every Child Deserves to Feel Understood
            </h1>
            
            <p className="text-white/90 text-lg leading-relaxed">
              Join Nevo and give your students personalized learning experiences that adapt to their unique needs, pace, and learning style.
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
            <h2 className="mb-3 text-[#111827]">Create Your Account</h2>
            <p className="text-[#6B7280]">Start learning in less than a minute</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-semibold text-[#111827]">Full Name</Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  className="pl-12 h-12 text-base rounded-xl border-2 border-gray-200 focus:border-[#4F46E5] bg-white"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>
            </div>

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
                  placeholder="Create a password"
                  className="pl-12 h-12 text-base rounded-xl border-2 border-gray-200 focus:border-[#4F46E5] bg-white"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-semibold text-[#111827]">I am a...</Label>
              <div className="relative">
                <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF] pointer-events-none z-10" />
                <select
                  id="role"
                  className="w-full pl-12 pr-4 h-12 text-base rounded-xl border-2 border-gray-200 bg-white focus:outline-none focus:border-[#4F46E5] transition-colors appearance-none cursor-pointer"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                >
                  <option value="">Select your role</option>
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="parent">Parent</option>
                </select>
              </div>
            </div>

            {/* Student-specific fields */}
            {formData.role === 'student' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-sm font-semibold text-[#111827]">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Enter your age"
                    className="h-12 text-base rounded-xl border-2 border-gray-200 focus:border-[#4F46E5] bg-white"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="school" className="text-sm font-semibold text-[#111827]">School (Optional)</Label>
                  <Input
                    id="school"
                    type="text"
                    placeholder="Enter your school name"
                    className="h-12 text-base rounded-xl border-2 border-gray-200 focus:border-[#4F46E5] bg-white"
                    value={formData.school}
                    onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grade" className="text-sm font-semibold text-[#111827]">Class/Grade</Label>
                  <Input
                    id="grade"
                    type="text"
                    placeholder="e.g., Grade 5, JSS 2"
                    className="h-12 text-base rounded-xl border-2 border-gray-200 focus:border-[#4F46E5] bg-white"
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    required
                  />
                </div>
              </>
            )}

            {/* Teacher-specific fields */}
            {formData.role === 'teacher' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="schoolName" className="text-sm font-semibold text-[#111827]">School Name</Label>
                  <Input
                    id="schoolName"
                    type="text"
                    placeholder="Enter your school name"
                    className="h-12 text-base rounded-xl border-2 border-gray-200 focus:border-[#4F46E5] bg-white"
                    value={formData.schoolName}
                    onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="classTaught" className="text-sm font-semibold text-[#111827]">Class You Teach</Label>
                  <Input
                    id="classTaught"
                    type="text"
                    placeholder="e.g., Grade 4, JSS 1"
                    className="h-12 text-base rounded-xl border-2 border-gray-200 focus:border-[#4F46E5] bg-white"
                    value={formData.classTaught}
                    onChange={(e) => setFormData({ ...formData, classTaught: e.target.value })}
                    required
                  />
                </div>
              </>
            )}

            {/* Parent-specific fields */}
            {formData.role === 'parent' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="childName" className="text-sm font-semibold text-[#111827]">Child's Name (Optional)</Label>
                  <Input
                    id="childName"
                    type="text"
                    placeholder="Enter your child's name"
                    className="h-12 text-base rounded-xl border-2 border-gray-200 focus:border-[#4F46E5] bg-white"
                    value={formData.childName}
                    onChange={(e) => setFormData({ ...formData, childName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="childEmail" className="text-sm font-semibold text-[#111827]">Child's Email (Optional)</Label>
                  <Input
                    id="childEmail"
                    type="email"
                    placeholder="Enter your child's email"
                    className="h-12 text-base rounded-xl border-2 border-gray-200 focus:border-[#4F46E5] bg-white"
                    value={formData.childEmail}
                    onChange={(e) => setFormData({ ...formData, childEmail: e.target.value })}
                  />
                </div>
              </>
            )}

            <Button type="submit" className="w-full bg-[#4F46E5] text-white h-12 text-base rounded-xl hover:bg-[#4338CA] transition-colors flex items-center justify-center gap-2 mt-6">
              Create Account
              <ArrowRight className="w-5 h-5" />
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[#6B7280]">
              Already have an account?{' '}
              <Link to="/login" className="text-[#4F46E5] hover:underline font-semibold">
                Login
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
