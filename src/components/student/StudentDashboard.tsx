import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, BookOpen, Trophy, Settings, LogOut, Sparkles, Clock, Target, TrendingUp, ArrowRight, UserPlus } from 'lucide-react';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { AddConnections } from '../AddConnections';
import nevoLogo from 'figma:asset/eb4ed43b358d525aade73d54d2fe9ed4db700394.png';

interface Lesson {
  id: string;
  title: string;
  subject: string;
  status: 'not-started' | 'in-progress' | 'completed';
  progress: number;
  xp: number;
  duration: string;
}

const mockLessons: Lesson[] = [
  { id: '1', title: 'Introduction to Fractions', subject: 'Mathematics', status: 'in-progress', progress: 65, xp: 50, duration: '15 min' },
  { id: '2', title: 'Parts of Speech', subject: 'English', status: 'not-started', progress: 0, xp: 45, duration: '12 min' },
  { id: '3', title: 'The Water Cycle', subject: 'Science', status: 'completed', progress: 100, xp: 60, duration: '18 min' },
  { id: '4', title: 'Ancient Egypt', subject: 'History', status: 'not-started', progress: 0, xp: 55, duration: '20 min' },
];

export function StudentDashboard() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [assessmentData, setAssessmentData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'today' | 'all' | 'progress' | 'connections' | 'settings'>('today');
  const [totalXP, setTotalXP] = useState(215);
  const [streak, setStreak] = useState(7);

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    const assessment = localStorage.getItem('assessmentData');
    
    if (user) setCurrentUser(JSON.parse(user));
    if (assessment) setAssessmentData(JSON.parse(assessment));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  const getProfileDescription = (profile: string) => {
    const profiles: Record<string, { title: string; description: string; color: string }> = {
      'Visual': { 
        title: 'Visual Learner', 
        description: 'You learn best through diagrams, charts, videos, and visual examples',
        color: '#4F46E5'
      },
      'Auditory': { 
        title: 'Auditory Learner', 
        description: 'You understand better by listening to explanations and verbal discussions',
        color: '#10B981'
      },
      'Reading/Writing': { 
        title: 'Reading/Writing Learner', 
        description: 'You excel with written notes, lists, and text-based materials',
        color: '#FBBF24'
      },
      'Kinesthetic': { 
        title: 'Kinesthetic Learner', 
        description: 'You learn best through hands-on activities and physical practice',
        color: '#F97316'
      },
      'Requires Support with Focus': { 
        title: 'Focus Support', 
        description: 'You benefit from shorter lessons with frequent breaks and interactive elements',
        color: '#8B5CF6'
      },
      'Requires Support with Processing Speed': { 
        title: 'Processing Support', 
        description: 'You learn best with slower-paced explanations and extra time to process',
        color: '#06B6D4'
      },
      'Mixed Learning Style': { 
        title: 'Mixed Learning Style', 
        description: 'You learn well with a combination of different teaching methods',
        color: '#EC4899'
      }
    };
    return profiles[profile] || profiles['Mixed Learning Style'];
  };

  const profileInfo = assessmentData ? getProfileDescription(assessmentData.profile) : null;

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#10B981] flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="font-['Poppins'] text-[#111827]" style={{ fontSize: '24px', fontWeight: 700 }}>Nevo</span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('today')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeTab === 'today' ? 'text-[#4F46E5]' : 'text-[#6B7280] hover:text-[#111827]'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeTab === 'all' ? 'text-[#4F46E5]' : 'text-[#6B7280] hover:text-[#111827]'
                }`}
              >
                All Lessons
              </button>
              <button
                onClick={() => setActiveTab('progress')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeTab === 'progress' ? 'text-[#4F46E5]' : 'text-[#6B7280] hover:text-[#111827]'
                }`}
              >
                Progress
              </button>
              <button
                onClick={() => setActiveTab('connections')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeTab === 'connections' ? 'text-[#4F46E5]' : 'text-[#6B7280] hover:text-[#111827]'
                }`}
              >
                My Team
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeTab === 'settings' ? 'text-[#4F46E5]' : 'text-[#6B7280] hover:text-[#111827]'
                }`}
              >
                Settings
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
          <h1 className="mb-2">Welcome back, {currentUser?.fullName?.split(' ')[0] || 'Student'}!</h1>
          <p className="text-[#6B7280] text-lg">Let's continue your learning journey</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Learning Profile Card */}
            {profileInfo && (
              <div className="p-8 border border-[#E5E7EB] rounded-2xl">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-5 h-5 text-[#4F46E5]" />
                      <span className="text-[#6B7280]">Your Learning Profile</span>
                    </div>
                    <h3 className="mb-2">{profileInfo.title}</h3>
                    <p className="text-[#6B7280] leading-relaxed">{profileInfo.description}</p>
                  </div>
                  <div className="w-14 h-14 rounded-xl border-2 border-[#4F46E5] flex items-center justify-center ml-6">
                    <Brain className="w-7 h-7 text-[#4F46E5]" />
                  </div>
                </div>
              </div>
            )}

            {/* Today's Lesson */}
            {activeTab === 'today' && (
              <div>
                <h2 className="mb-6">Today's Featured Lesson</h2>
                <div className="p-8 border border-[#E5E7EB] rounded-2xl hover:border-[#4F46E5] transition-all">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <span className="inline-block px-3 py-1 bg-[#F3F4F6] text-[#6B7280] rounded-full text-sm mb-3">
                        {mockLessons[0].subject}
                      </span>
                      <h3 className="mb-3">{mockLessons[0].title}</h3>
                      <div className="flex items-center gap-6 text-[#6B7280]">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{mockLessons[0].duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          <span>{mockLessons[0].xp} XP</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-[#6B7280]">Progress</span>
                      <span className="text-[#111827]">
                        {mockLessons[0].progress}%
                      </span>
                    </div>
                    <Progress value={mockLessons[0].progress} className="h-2" />
                  </div>

                  <Button className="bg-[#4F46E5] text-white hover:bg-[#4338CA] h-12 px-6 rounded-xl" asChild>
                    <Link to="/student/lesson/1">
                      Continue Learning
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>

                {/* AI Tutor Tip */}
                <div className="mt-8 p-6 border border-[#E0E7FF] bg-gradient-to-br from-[#F5F7FF] to-[#EEF2FF] rounded-2xl">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#4F46E5] flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="mb-2">Personalized Tip</h3>
                      <p className="text-[#6B7280] leading-relaxed">
                        Based on your learning profile, try breaking this lesson into 3 sessions with short breaks in between. This will help you retain more information!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* All Lessons */}
            {activeTab === 'all' && (
              <div>
                <h2 className="mb-6">All Lessons</h2>
                <div className="space-y-4">
                  {mockLessons.map((lesson) => (
                    <div key={lesson.id} className="p-6 border border-[#E5E7EB] rounded-2xl hover:border-[#4F46E5] transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="inline-block px-3 py-1 bg-[#F3F4F6] text-[#6B7280] rounded-full text-sm">
                              {lesson.subject}
                            </span>
                            {lesson.status === 'completed' && (
                              <span className="inline-block px-3 py-1 bg-[#ECFDF5] text-[#059669] rounded-full text-sm">
                                Completed
                              </span>
                            )}
                          </div>
                          <h3 className="mb-3">{lesson.title}</h3>
                          <div className="flex items-center gap-6 text-[#6B7280]">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>{lesson.duration}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Target className="w-4 h-4" />
                              <span>{lesson.xp} XP</span>
                            </div>
                          </div>
                          {lesson.progress > 0 && lesson.progress < 100 && (
                            <div className="mt-4 max-w-xs">
                              <Progress value={lesson.progress} className="h-2" />
                            </div>
                          )}
                        </div>
                        <Button 
                          className={lesson.status === 'completed' 
                            ? 'border border-[#E5E7EB] bg-white text-[#111827] hover:bg-[#F9FAFB]' 
                            : 'bg-[#4F46E5] text-white hover:bg-[#4338CA]'
                          }
                        >
                          {lesson.status === 'completed' ? 'Review' : 
                           lesson.status === 'in-progress' ? 'Continue' : 'Start'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Progress Tab */}
            {activeTab === 'progress' && (
              <div>
                <h2 className="mb-6">Your Progress</h2>
                
                {/* Achievements */}
                <div className="p-8 border border-[#E5E7EB] rounded-2xl mb-8">
                  <h3 className="mb-6">Recent Achievements</h3>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-3 rounded-xl border-2 border-[#FBBF24] flex items-center justify-center">
                        <Trophy className="w-7 h-7 text-[#FBBF24]" />
                      </div>
                      <h3 className="mb-1">7 Day Streak</h3>
                      <p className="text-[#6B7280] text-sm">Keep it up!</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-3 rounded-xl border-2 border-[#10B981] flex items-center justify-center">
                        <Target className="w-7 h-7 text-[#10B981]" />
                      </div>
                      <h3 className="mb-1">Fast Learner</h3>
                      <p className="text-[#6B7280] text-sm">3 lessons in a day</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-3 rounded-xl border-2 border-[#4F46E5] flex items-center justify-center">
                        <Sparkles className="w-7 h-7 text-[#4F46E5]" />
                      </div>
                      <h3 className="mb-1">Quick Start</h3>
                      <p className="text-[#6B7280] text-sm">Completed assessment</p>
                    </div>
                  </div>
                </div>

                {/* Subject Progress */}
                <div className="p-8 border border-[#E5E7EB] rounded-2xl">
                  <h3 className="mb-6">Progress by Subject</h3>
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
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div>
                <h2 className="mb-6">Settings</h2>
                <div className="p-8 border border-[#E5E7EB] rounded-2xl">
                  <h3 className="mb-6">Profile Information</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="text-[#6B7280] mb-2 block text-sm">
                        Full Name
                      </label>
                      <p className="text-[#111827]">{currentUser?.fullName}</p>
                    </div>
                    <div>
                      <label className="text-[#6B7280] mb-2 block text-sm">
                        Email
                      </label>
                      <p className="text-[#111827]">{currentUser?.email}</p>
                    </div>
                    <div>
                      <label className="text-[#6B7280] mb-2 block text-sm">
                        Learning Profile
                      </label>
                      <p className="text-[#111827]">{profileInfo?.title}</p>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-8 border-t border-[#E5E7EB]">
                    <Button className="border border-[#E5E7EB] bg-white text-[#111827] hover:bg-[#F9FAFB]">
                      Retake Assessment
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Connections Tab */}
            {activeTab === 'connections' && (
              <div>
                <AddConnections userRole="student" />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* XP Card */}
            <div className="p-6 border border-[#E5E7EB] rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3>Total XP</h3>
                <Trophy className="w-5 h-5 text-[#FBBF24]" />
              </div>
              <div className="mb-2">
                <span style={{ fontSize: '48px', fontWeight: 700 }} className="text-[#111827]">{totalXP}</span>
              </div>
              <p className="text-[#6B7280]">
                +50 XP today
              </p>
            </div>

            {/* Streak Card */}
            <div className="p-6 border border-[#E5E7EB] rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3>Current Streak</h3>
                <TrendingUp className="w-5 h-5 text-[#10B981]" />
              </div>
              <div className="text-center py-4">
                <div className="text-[#10B981] mb-2" style={{ fontSize: '56px', fontWeight: 700 }}>
                  {streak}
                </div>
                <p className="text-[#6B7280]">days in a row! 🔥</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-6 border border-[#E5E7EB] rounded-2xl">
              <h3 className="mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button 
                  onClick={() => setActiveTab('connections')}
                  className="w-full justify-start text-[#6B7280] hover:text-[#111827] hover:bg-[#F9FAFB]" 
                  variant="ghost"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Teacher/Parent
                </Button>
                <Button className="w-full justify-start text-[#6B7280] hover:text-[#111827] hover:bg-[#F9FAFB]" variant="ghost">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Browse All Lessons
                </Button>
                <Button className="w-full justify-start text-[#6B7280] hover:text-[#111827] hover:bg-[#F9FAFB]" variant="ghost">
                  <Trophy className="w-4 h-4 mr-2" />
                  View Achievements
                </Button>
                <Button 
                  onClick={() => setActiveTab('settings')}
                  className="w-full justify-start text-[#6B7280] hover:text-[#111827] hover:bg-[#F9FAFB]" 
                  variant="ghost"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Account Settings
                </Button>
              </div>
            </div>

            {/* Add Connections */}
            <AddConnections />
          </div>
        </div>
      </div>
    </div>
  );
}