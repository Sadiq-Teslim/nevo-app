import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './components/LandingPage';
import { SignupPage } from './components/auth/SignupPage';
import { LoginPage } from './components/auth/LoginPage';
import { DiagnosticAssessment } from './components/student/DiagnosticAssessment';
import { StudentDashboard } from './components/student/StudentDashboard';
import { LessonView } from './components/student/LessonView';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { ParentDashboard } from './components/parent/ParentDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/assessment" element={<DiagnosticAssessment />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/lesson/:lessonId" element={<LessonView />} />
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/parent/dashboard" element={<ParentDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;