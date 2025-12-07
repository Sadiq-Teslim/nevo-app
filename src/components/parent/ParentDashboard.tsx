import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Users, Trophy, LogOut, BookOpen, TrendingUp, Clock, Target, Award, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import nevoLogo from 'figma:asset/eb4ed43b358d525aade73d54d2fe9ed4db700394.png';

interface ChildData {
  name: string;
  profile: string;
  totalXP: number;
  streak: number;
  lessonsCompleted: number;
  totalLessons: number;
  overallProgress: number;
}

const mockChildData: ChildData = {
  name: 'Amara Johnson',
  profile: 'Visual Learner',
  totalXP: 215,
  streak: 7,
  lessonsCompleted: 12,
  totalLessons: 15,
  overallProgress: 78
};

const recentLessons = [
  { id: '1', title: 'Introduction to Fractions', subject: 'Mathematics', completed: true, date: '2 days ago', score: 92 },
  { id: '2', title: 'The Water Cycle', subject: 'Science', completed: true, date: '3 days ago', score: 88 },
  { id: '3', title: 'Parts of Speech', subject: 'English', completed: false, date: 'In progress', score: null },
];

export function ParentDashboard() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'progress' | 'guidance'>('overview');

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) setCurrentUser(JSON.parse(user));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={nevoLogo} alt="Nevo" className="w-8 h-8" />
              <span className="font-['Poppins'] text-[#111827]" style={{ fontSize: '24px', fontWeight: 700 }}>Nevo</span>
              <span className="px-2 py-1 bg-[#FFF7ED] text-[#EA580C] rounded-md text-sm">Parent</span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeTab === 'overview' ? 'text-[#4F46E5]' : 'text-[#6B7280] hover:text-[#111827]'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('progress')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeTab === 'progress' ? 'text-[#4F46E5]' : 'text-[#6B7280] hover:text-[#111827]'
                }`}
              >
                Progress & Achievements
              </button>
              <button
                onClick={() => setActiveTab('guidance')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeTab === 'guidance' ? 'text-[#4F46E5]' : 'text-[#6B7280] hover:text-[#111827]'
                }`}
              >
                AI Guidance
              </button>
              <div className="w-px h-6 bg-gray-200 mx-2" />
              <Button onClick={handleLogout} variant="ghost" size="sm" className="text-[#6B7280] hover:text-[#111827]">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="mb-2">Welcome, {currentUser?.fullName?.split(' ')[0] || 'Parent'}!</h1>
          <p className="text-[#6B7280] text-lg">Track {mockChildData.name}'s learning journey</p>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Child Profile Card */}
              <div className="p-8 border border-[#E5E7EB] rounded-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 rounded-xl bg-[#F3F4F6] flex items-center justify-center text-[#4F46E5]" style={{ fontSize: '28px', fontWeight: 700 }}>
                    {mockChildData.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h2 className="mb-2">{mockChildData.name}</h2>
                    <span className="px-3 py-1 bg-[#F3F4F6] text-[#6B7280] rounded-full text-sm">{mockChildData.profile}</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-6 pt-6 border-t border-[#E5E7EB]">
                  <div>
                    <p className="text-[#6B7280] mb-1">Lessons</p>
                    <p className="text-[#111827]" style={{ fontSize: '28px', fontWeight: 700 }}>
                      {mockChildData.lessonsCompleted}/{mockChildData.totalLessons}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#6B7280] mb-1">Streak</p>
                    <p className="text-[#111827]" style={{ fontSize: '28px', fontWeight: 700 }}>
                      {mockChildData.streak} days
                    </p>
                  </div>
                  <div>
                    <p className="text-[#6B7280] mb-1">Total XP</p>
                    <p className="text-[#111827]" style={{ fontSize: '28px', fontWeight: 700 }}>
                      {mockChildData.totalXP}
                    </p>
                  </div>
                </div>
              </div>

              {/* Overall Progress */}
              <div className="p-8 border border-[#E5E7EB] rounded-2xl">
                <h2 className="mb-6">Overall Progress</h2>
                <div className="mb-6">
                  <div className="flex justify-between mb-3">
                    <span className="text-[#6B7280]">Learning Journey</span>
                    <span className="text-[#111827]">{mockChildData.overallProgress}%</span>
                  </div>
                  <Progress value={mockChildData.overallProgress} className="h-3" />
                </div>
                <p className="text-[#6B7280] leading-relaxed">
                  {mockChildData.name} is doing great! They've completed {mockChildData.lessonsCompleted} lessons and maintained a {mockChildData.streak}-day streak.
                </p>
              </div>

              {/* Recent Activity */}
              <div className="p-8 border border-[#E5E7EB] rounded-2xl">
                <h2 className="mb-6">Recent Lessons</h2>
                <div className="space-y-4">
                  {recentLessons.map((lesson) => (
                    <div key={lesson.id} className="p-6 border border-[#E5E7EB] rounded-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="inline-block px-3 py-1 bg-[#F3F4F6] text-[#6B7280] rounded-full text-sm">
                              {lesson.subject}
                            </span>
                            {lesson.completed && (
                              <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#ECFDF5] text-[#059669] rounded-full text-sm">
                                <CheckCircle className="w-3 h-3" />
                                Completed
                              </span>
                            )}
                          </div>
                          <h3 className="mb-2">{lesson.title}</h3>
                          <div className="flex items-center gap-4">
                            <span className="text-[#6B7280] text-sm flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {lesson.date}
                            </span>
                            {lesson.score && (
                              <span className="text-[#059669] text-sm">
                                Score: {lesson.score}%
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Strengths Card */}
              <div className="p-6 border border-[#D1FAE5] bg-[#F0FDF4] rounded-2xl">
                <div className="flex items-center gap-2 mb-4">
                  <Heart className="w-5 h-5 text-[#059669]" />
                  <h3>Key Strengths</h3>
                </div>
                <ul className="text-[#6B7280] space-y-2">
                  <li>• Consistent daily practice</li>
                  <li>• Strong visual comprehension</li>
                  <li>• Excellent retention rate</li>
                  <li>• Self-motivated learner</li>
                </ul>
              </div>

              {/* Areas for Encouragement */}
              <div className="p-6 border border-[#FED7AA] bg-[#FFF7ED] rounded-2xl">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5 text-[#EA580C]" />
                  <h3>Focus Areas</h3>
                </div>
                <ul className="text-[#6B7280] space-y-2">
                  <li>• Continue with visual examples</li>
                  <li>• Encourage breaks every 20 min</li>
                  <li>• Celebrate small wins</li>
                </ul>
              </div>

              {/* This Week */}
              <div className="p-6 border border-[#E5E7EB] rounded-2xl">
                <h3 className="mb-4">This Week's Progress</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-[#6B7280]">Lessons Completed</span>
                      <span className="text-[#111827]">3</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-[#6B7280]">Time Spent</span>
                      <span className="text-[#111827]">2.5 hrs</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-[#6B7280]">Avg Score</span>
                      <span className="text-[#059669]">90%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Progress & Achievements Tab */}
        {activeTab === 'progress' && (
          <div className="max-w-4xl">
            <div className="p-8 border border-[#E5E7EB] rounded-2xl mb-8">
              <h2 className="mb-8">Achievements & Milestones</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-xl border-2 border-[#FBBF24] flex items-center justify-center">
                    <Trophy className="w-9 h-9 text-[#FBBF24]" />
                  </div>
                  <h3 className="mb-2">7 Day Streak</h3>
                  <p className="text-[#6B7280] text-sm">Consistent learner</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-xl border-2 border-[#10B981] flex items-center justify-center">
                    <Target className="w-9 h-9 text-[#10B981]" />
                  </div>
                  <h3 className="mb-2">Fast Learner</h3>
                  <p className="text-[#6B7280] text-sm">3 lessons in a day</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-xl border-2 border-[#4F46E5] flex items-center justify-center">
                    <Sparkles className="w-9 h-9 text-[#4F46E5]" />
                  </div>
                  <h3 className="mb-2">Quick Start</h3>
                  <p className="text-[#6B7280] text-sm">Completed assessment</p>
                </div>
              </div>
            </div>

            {/* Subject Progress */}
            <div className="p-8 border border-[#E5E7EB] rounded-2xl">
              <h2 className="mb-8">Progress by Subject</h2>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-3">
                    <span className="text-[#111827]">Mathematics</span>
                    <span className="text-[#6B7280]">75%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-3">
                    <span className="text-[#111827]">English</span>
                    <span className="text-[#6B7280]">60%</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-3">
                    <span className="text-[#111827]">Science</span>
                    <span className="text-[#6B7280]">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-3">
                    <span className="text-[#111827]">History</span>
                    <span className="text-[#6B7280]">70%</span>
                  </div>
                  <Progress value={70} className="h-2" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Guidance Tab */}
        {activeTab === 'guidance' && (
          <div className="max-w-4xl space-y-6">
            <div className="p-8 border border-[#E0E7FF] bg-[#F5F7FF] rounded-2xl">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl border-2 border-[#4F46E5] flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-[#4F46E5]" />
                </div>
                <div>
                  <h2 className="mb-3">Personalized Guidance for {mockChildData.name}</h2>
                  <p className="text-[#6B7280] leading-relaxed mb-4">
                    Based on {mockChildData.name}'s learning profile as a Visual Learner, here are some recommendations to support their learning journey:
                  </p>
                  <ul className="space-y-3 text-[#6B7280]">
                    <li className="flex items-start gap-2">
                      <span className="text-[#4F46E5] mt-1">•</span>
                      <span>Use diagrams, charts, and visual aids when explaining concepts at home</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#4F46E5] mt-1">•</span>
                      <span>Encourage them to draw or sketch ideas while learning</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#4F46E5] mt-1">•</span>
                      <span>Watch educational videos together to reinforce lessons</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#4F46E5] mt-1">•</span>
                      <span>Use color-coded notes or highlighters for different topics</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-8 border border-[#D1FAE5] bg-[#F0FDF4] rounded-2xl">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl border-2 border-[#059669] flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-[#059669]" />
                </div>
                <div>
                  <h2 className="mb-3">Optimal Learning Times</h2>
                  <p className="text-[#6B7280] leading-relaxed">
                    Based on recent activity patterns, {mockChildData.name} performs best during morning sessions (9-11 AM) and early afternoon (2-4 PM). Try to schedule challenging subjects during these peak concentration windows.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 border border-[#FED7AA] bg-[#FFF7ED] rounded-2xl">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl border-2 border-[#EA580C] flex items-center justify-center flex-shrink-0">
                  <Heart className="w-6 h-6 text-[#EA580C]" />
                </div>
                <div>
                  <h2 className="mb-3">Encouragement Tips</h2>
                  <ul className="space-y-3 text-[#6B7280]">
                    <li className="flex items-start gap-2">
                      <span className="text-[#EA580C] mt-1">•</span>
                      <span>Celebrate their 7-day streak - consistency is a huge achievement!</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#EA580C] mt-1">•</span>
                      <span>Acknowledge effort, not just results, to build growth mindset</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#EA580C] mt-1">•</span>
                      <span>Create a reward system for milestone achievements</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}