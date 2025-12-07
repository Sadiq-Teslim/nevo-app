import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Upload, Users, BarChart3, LogOut, BookOpen, CheckCircle, Clock, AlertCircle, ArrowRight, UserPlus } from 'lucide-react';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { AddConnections } from '../AddConnections';
import nevoLogo from 'figma:asset/eb4ed43b358d525aade73d54d2fe9ed4db700394.png';

interface Student {
  id: string;
  name: string;
  profile: string;
  progress: number;
  lessonsCompleted: number;
  totalLessons: number;
  lastActive: string;
}

const mockStudents: Student[] = [
  { id: '1', name: 'Amara Johnson', profile: 'Visual Learner', progress: 78, lessonsCompleted: 12, totalLessons: 15, lastActive: '2 hours ago' },
  { id: '2', name: 'Kofi Williams', profile: 'Active Learner', progress: 65, lessonsCompleted: 10, totalLessons: 15, lastActive: '1 day ago' },
  { id: '3', name: 'Zara Davis', profile: 'Structured Learner', progress: 92, lessonsCompleted: 14, totalLessons: 15, lastActive: '30 min ago' },
  { id: '4', name: 'Jamal Brown', profile: 'Auditory Learner', progress: 55, lessonsCompleted: 8, totalLessons: 15, lastActive: '3 hours ago' },
];

export function TeacherDashboard() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'upload' | 'insights' | 'students'>('overview');
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonSubject, setLessonSubject] = useState('');
  const [lessonContent, setLessonContent] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) setCurrentUser(JSON.parse(user));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  const handleUploadLesson = () => {
    setUploading(true);
    // Simulate AI processing
    setTimeout(() => {
      setUploading(false);
      setLessonTitle('');
      setLessonSubject('');
      setLessonContent('');
      alert('Lesson uploaded and personalized for all students!');
    }, 2000);
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
              <span className="px-2 py-1 bg-[#ECFDF5] text-[#059669] rounded-md text-sm">Teacher</span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeTab === 'overview' ? 'text-[#4F46E5]' : 'text-[#6B7280] hover:text-[#111827]'
                }`}
              >
                Class Overview
              </button>
              <button
                onClick={() => setActiveTab('upload')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeTab === 'upload' ? 'text-[#4F46E5]' : 'text-[#6B7280] hover:text-[#111827]'
                }`}
              >
                Upload Lesson
              </button>
              <button
                onClick={() => setActiveTab('insights')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeTab === 'insights' ? 'text-[#4F46E5]' : 'text-[#6B7280] hover:text-[#111827]'
                }`}
              >
                Student Insights
              </button>
              <button
                onClick={() => setActiveTab('students')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeTab === 'students' ? 'text-[#4F46E5]' : 'text-[#6B7280] hover:text-[#111827]'
                }`}
              >
                Manage Students
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
          <h1 className="mb-2">Welcome, {currentUser?.fullName?.split(' ')[0] || 'Teacher'}!</h1>
          <p className="text-[#6B7280] text-lg">Manage your class and create personalized lessons</p>
        </div>

        {/* Class Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="p-6 border border-[#E5E7EB] rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[#6B7280]">Total Students</h3>
                  <Users className="w-5 h-5 text-[#4F46E5]" />
                </div>
                <p style={{ fontSize: '36px', fontWeight: 700 }} className="text-[#111827]">{mockStudents.length}</p>
              </div>

              <div className="p-6 border border-[#E5E7EB] rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[#6B7280]">Avg Progress</h3>
                  <BarChart3 className="w-5 h-5 text-[#10B981]" />
                </div>
                <p style={{ fontSize: '36px', fontWeight: 700 }} className="text-[#111827]">
                  {Math.round(mockStudents.reduce((acc, s) => acc + s.progress, 0) / mockStudents.length)}%
                </p>
              </div>

              <div className="p-6 border border-[#E5E7EB] rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[#6B7280]">Active Lessons</h3>
                  <BookOpen className="w-5 h-5 text-[#FBBF24]" />
                </div>
                <p style={{ fontSize: '36px', fontWeight: 700 }} className="text-[#111827]">15</p>
              </div>

              <div className="p-6 border border-[#E5E7EB] rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[#6B7280]">Completion Rate</h3>
                  <CheckCircle className="w-5 h-5 text-[#F97316]" />
                </div>
                <p style={{ fontSize: '36px', fontWeight: 700 }} className="text-[#111827]">73%</p>
              </div>
            </div>

            {/* Students Table */}
            <div className="p-8 border border-[#E5E7EB] rounded-2xl">
              <h2 className="mb-8">Your Students</h2>
              <div className="space-y-4">
                {mockStudents.map((student) => (
                  <div key={student.id} className="p-6 border border-[#E5E7EB] rounded-xl hover:border-[#4F46E5] transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#F3F4F6] flex items-center justify-center text-[#4F46E5]" style={{ fontWeight: 700 }}>
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h3>{student.name}</h3>
                          <p className="text-[#6B7280]">{student.profile}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                        <div className="text-center">
                          <p className="text-[#6B7280] text-sm mb-1">Lessons</p>
                          <p className="text-[#111827]">{student.lessonsCompleted}/{student.totalLessons}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[#6B7280] text-sm mb-1">Last Active</p>
                          <p className="text-[#111827]">{student.lastActive}</p>
                        </div>
                        <div className="w-40">
                          <div className="flex justify-between mb-2">
                            <span className="text-[#6B7280] text-sm">Progress</span>
                            <span className="text-[#111827] text-sm">
                              {student.progress}%
                            </span>
                          </div>
                          <Progress value={student.progress} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Upload Lesson Tab */}
        {activeTab === 'upload' && (
          <div className="max-w-3xl">
            <div className="p-8 border border-[#E5E7EB] rounded-2xl">
              <div className="flex items-start gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl border-2 border-[#4F46E5] flex items-center justify-center flex-shrink-0">
                  <Upload className="w-6 h-6 text-[#4F46E5]" />
                </div>
                <div>
                  <h2 className="mb-1">Upload New Lesson</h2>
                  <p className="text-[#6B7280]">AI will personalize this lesson for each student</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="lessonTitle" className="text-[#111827]">Lesson Title</Label>
                  <Input
                    id="lessonTitle"
                    placeholder="e.g., Introduction to Fractions"
                    value={lessonTitle}
                    onChange={(e) => setLessonTitle(e.target.value)}
                    className="h-12 border-[#E5E7EB] rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-[#111827]">Subject</Label>
                  <select
                    id="subject"
                    className="w-full h-12 px-4 rounded-xl border border-[#E5E7EB] bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                    value={lessonSubject}
                    onChange={(e) => setLessonSubject(e.target.value)}
                  >
                    <option value="">Select subject</option>
                    <option value="mathematics">Mathematics</option>
                    <option value="english">English</option>
                    <option value="science">Science</option>
                    <option value="history">History</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content" className="text-[#111827]">Lesson Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Enter the main lesson content here. The AI will adapt it to each student's learning profile..."
                    rows={10}
                    value={lessonContent}
                    onChange={(e) => setLessonContent(e.target.value)}
                    className="border-[#E5E7EB] rounded-xl"
                  />
                </div>

                <div className="p-6 border border-[#E0E7FF] bg-[#F5F7FF] rounded-2xl">
                  <h3 className="mb-3">How AI Personalization Works</h3>
                  <ul className="space-y-2 text-[#6B7280]">
                    <li>• Adjusts content length and complexity based on each student's profile</li>
                    <li>• Breaks lessons into appropriate segments for attention span</li>
                    <li>• Adds visual aids for visual learners, audio for auditory learners</li>
                    <li>• Provides step-by-step instructions for structured learners</li>
                    <li>• Suggests optimal pacing and break times</li>
                  </ul>
                </div>

                <Button
                  onClick={handleUploadLesson}
                  disabled={!lessonTitle || !lessonSubject || !lessonContent || uploading}
                  className="w-full bg-[#4F46E5] text-white hover:bg-[#4338CA] h-12 rounded-xl"
                >
                  {uploading ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      AI is Personalizing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload & Personalize Lesson
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Student Insights Tab */}
        {activeTab === 'insights' && (
          <div className="space-y-6">
            <div className="p-8 border border-[#E5E7EB] rounded-2xl">
              <h2 className="mb-8">Student Insights & Recommendations</h2>
              
              <div className="space-y-6">
                {mockStudents.map((student) => (
                  <div key={student.id} className="p-6 border border-[#E5E7EB] rounded-xl">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#F3F4F6] flex items-center justify-center text-[#4F46E5]" style={{ fontWeight: 700 }}>
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h3 className="mb-1">{student.name}</h3>
                          <span className="px-3 py-1 bg-[#F3F4F6] text-[#6B7280] rounded-full text-sm">{student.profile}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[#6B7280] text-sm mb-1">Overall Progress</p>
                        <p className="text-[#111827]" style={{ fontSize: '28px', fontWeight: 700 }}>{student.progress}%</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 border border-[#D1FAE5] bg-[#F0FDF4] rounded-xl">
                        <div className="flex items-center gap-2 mb-3">
                          <CheckCircle className="w-5 h-5 text-[#059669]" />
                          <h3>Strengths</h3>
                        </div>
                        <ul className="text-[#6B7280] space-y-2">
                          <li>• Consistent engagement</li>
                          <li>• Strong in visual content</li>
                          <li>• Quick lesson completion</li>
                        </ul>
                      </div>

                      <div className="p-4 border border-[#FED7AA] bg-[#FFF7ED] rounded-xl">
                        <div className="flex items-center gap-2 mb-3">
                          <AlertCircle className="w-5 h-5 text-[#EA580C]" />
                          <h3>Recommendations</h3>
                        </div>
                        <ul className="text-[#6B7280] space-y-2">
                          <li>• Add more interactive elements</li>
                          <li>• Consider shorter lesson segments</li>
                          <li>• Increase visual examples</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Manage Students Tab */}
        {activeTab === 'students' && (
          <div className="space-y-8">
            {/* Add Students Module */}
            <AddConnections userRole="teacher" />

            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="p-6 border border-[#E5E7EB] rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[#6B7280]">Total Students</h3>
                  <Users className="w-5 h-5 text-[#4F46E5]" />
                </div>
                <p style={{ fontSize: '36px', fontWeight: 700 }} className="text-[#111827]">{mockStudents.length}</p>
              </div>

              <div className="p-6 border border-[#E5E7EB] rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[#6B7280]">Avg Progress</h3>
                  <BarChart3 className="w-5 h-5 text-[#10B981]" />
                </div>
                <p style={{ fontSize: '36px', fontWeight: 700 }} className="text-[#111827]">
                  {Math.round(mockStudents.reduce((acc, s) => acc + s.progress, 0) / mockStudents.length)}%
                </p>
              </div>

              <div className="p-6 border border-[#E5E7EB] rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[#6B7280]">Active Lessons</h3>
                  <BookOpen className="w-5 h-5 text-[#FBBF24]" />
                </div>
                <p style={{ fontSize: '36px', fontWeight: 700 }} className="text-[#111827]">15</p>
              </div>

              <div className="p-6 border border-[#E5E7EB] rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[#6B7280]">Completion Rate</h3>
                  <CheckCircle className="w-5 h-5 text-[#F97316]" />
                </div>
                <p style={{ fontSize: '36px', fontWeight: 700 }} className="text-[#111827]">73%</p>
              </div>
            </div>

            {/* Students Table */}
            <div className="p-8 border border-[#E5E7EB] rounded-2xl">
              <h2 className="mb-8">Your Students</h2>
              <div className="space-y-4">
                {mockStudents.map((student) => (
                  <div key={student.id} className="p-6 border border-[#E5E7EB] rounded-xl hover:border-[#4F46E5] transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#F3F4F6] flex items-center justify-center text-[#4F46E5]" style={{ fontWeight: 700 }}>
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h3>{student.name}</h3>
                          <p className="text-[#6B7280]">{student.profile}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                        <div className="text-center">
                          <p className="text-[#6B7280] text-sm mb-1">Lessons</p>
                          <p className="text-[#111827]">{student.lessonsCompleted}/{student.totalLessons}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[#6B7280] text-sm mb-1">Last Active</p>
                          <p className="text-[#111827]">{student.lastActive}</p>
                        </div>
                        <div className="w-40">
                          <div className="flex justify-between mb-2">
                            <span className="text-[#6B7280] text-sm">Progress</span>
                            <span className="text-[#111827] text-sm">
                              {student.progress}%
                            </span>
                          </div>
                          <Progress value={student.progress} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}