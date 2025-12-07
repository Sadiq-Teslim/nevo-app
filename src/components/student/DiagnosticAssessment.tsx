import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, ChevronRight, ChevronLeft, CheckCircle, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import nevoLogo from 'figma:asset/eb4ed43b358d525aade73d54d2fe9ed4db700394.png';

const questions = [
  {
    id: 1,
    question: "When learning something new, which method helps you the most?",
    options: [
      { value: "videos", label: "Watching videos", profile: "Visual", icon: "🎥" },
      { value: "listening", label: "Listening to explanations", profile: "Auditory", icon: "🎧" },
      { value: "notes", label: "Reading step-by-step notes", profile: "Reading/Writing", icon: "📝" },
      { value: "hands-on", label: "Doing hands-on activities", profile: "Kinesthetic", icon: "✋" }
    ]
  },
  {
    id: 2,
    question: "During class or study time, what happens most often?",
    options: [
      { value: "lose-focus", label: "I lose focus easily", profile: "Requires Support with Focus", icon: "⚡" },
      { value: "overwhelmed", label: "I get overwhelmed when information is too fast", profile: "Requires Support with Processing Speed", icon: "🐢" },
      { value: "need-visuals", label: "I need to see visuals to understand", profile: "Visual", icon: "👁️" },
      { value: "prefer-explanation", label: "I prefer someone explaining it to me", profile: "Auditory", icon: "🗣️" }
    ]
  },
  {
    id: 3,
    question: "What type of instructions help you finish tasks correctly?",
    options: [
      { value: "visual-steps", label: "Short visual steps", profile: "Visual", icon: "📊" },
      { value: "verbal", label: "Verbal instructions", profile: "Auditory", icon: "🎤" },
      { value: "written", label: "Written lists", profile: "Reading/Writing", icon: "📋" },
      { value: "physical", label: "Physical demonstrations", profile: "Kinesthetic", icon: "🤸" }
    ]
  },
  {
    id: 4,
    question: "How do you prefer teachers to explain difficult topics?",
    options: [
      { value: "diagrams", label: "Using diagrams or pictures", profile: "Visual", icon: "🎨" },
      { value: "talking", label: "Talking through examples", profile: "Auditory", icon: "💬" },
      { value: "written-examples", label: "Giving written examples", profile: "Reading/Writing", icon: "📖" },
      { value: "practice", label: "Allowing me to practice immediately", profile: "Kinesthetic", icon: "🎯" }
    ]
  },
  {
    id: 5,
    question: "What makes it hard for you to learn sometimes?",
    options: [
      { value: "distracted", label: "I get distracted easily", profile: "Requires Support with Focus", icon: "💨" },
      { value: "need-examples", label: "I don't understand unless I see examples", profile: "Visual", icon: "🖼️" },
      { value: "forget-verbal", label: "I don't remember verbal instructions", profile: "Reading/Writing", icon: "🔇" },
      { value: "need-time", label: "I need more time to process information", profile: "Requires Support with Processing Speed", icon: "⏰" }
    ]
  },
  {
    id: 6,
    question: "Which type of activities do you enjoy the most?",
    options: [
      { value: "drawing", label: "Drawing, charts, visuals", profile: "Visual", icon: "🎨" },
      { value: "discussing", label: "Listening or discussing", profile: "Auditory", icon: "🗨️" },
      { value: "reading-writing", label: "Reading/writing exercises", profile: "Reading/Writing", icon: "✍️" },
      { value: "experiments", label: "Experiments or movement-based tasks", profile: "Kinesthetic", icon: "🧪" }
    ]
  }
];

export function DiagnosticAssessment() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [direction, setDirection] = useState(0);

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleOptionSelect = (value: string) => {
    setSelectedOption(value);
  };

  const handleNext = () => {
    setAnswers({ ...answers, [currentQuestion]: selectedOption });
    
    if (currentQuestion < questions.length - 1) {
      setDirection(1);
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(answers[currentQuestion + 1] || '');
    } else {
      // Calculate learning profile
      const allAnswers = { ...answers, [currentQuestion]: selectedOption };
      const profileCounts: Record<string, number> = {};
      
      Object.values(allAnswers).forEach((answer) => {
        const option = questions.flatMap(q => q.options).find(opt => opt.value === answer);
        if (option) {
          profileCounts[option.profile] = (profileCounts[option.profile] || 0) + 1;
        }
      });
      
      const dominantProfile = Object.entries(profileCounts).sort((a, b) => b[1] - a[1])[0][0];
      
      const assessmentData = {
        answers: allAnswers,
        profile: dominantProfile,
        completedAt: new Date().toISOString()
      };
      
      localStorage.setItem('assessmentData', JSON.stringify(assessmentData));
      navigate('/student/dashboard');
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setDirection(-1);
      setCurrentQuestion(currentQuestion - 1);
      setSelectedOption(answers[currentQuestion - 1] || '');
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-6">
      <div className="max-w-3xl w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#4F46E5] to-[#10B981] flex items-center justify-center">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <span className="font-['Poppins'] text-[#111827] text-3xl font-bold">Nevo</span>
          </div>
          <h1 className="mb-4 text-[#111827]">Let's Personalize Your Learning</h1>
          <p className="text-[#6B7280] text-lg max-w-2xl mx-auto">
            Answer these questions to help us understand how you learn best. There are no right or wrong answers!
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-[#6B7280] font-medium text-sm">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-[#4F46E5] font-bold">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} className="h-2 bg-gray-200" />
        </motion.div>

        {/* Question Card with Animation */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentQuestion}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="card mb-8 p-10"
          >
            <div className="flex items-start gap-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-[#4F46E5] to-[#10B981] rounded-2xl flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xl font-bold">{currentQuestion + 1}</span>
              </div>
              <h3 className="text-[#111827] flex-1 leading-relaxed">
                {questions[currentQuestion].question}
              </h3>
            </div>
            
            <div className="space-y-4">
              {questions[currentQuestion].options.map((option, index) => (
                <motion.button
                  key={option.value}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  onClick={() => handleOptionSelect(option.value)}
                  className={`w-full p-5 rounded-2xl border-2 transition-all text-left flex items-center gap-4 group ${
                    selectedOption === option.value
                      ? 'border-[#4F46E5] bg-gradient-to-r from-[#4F46E5]/10 to-[#10B981]/5 shadow-lg shadow-[#4F46E5]/10'
                      : 'border-gray-200 hover:border-[#4F46E5]/50 hover:bg-gray-50 hover:shadow-md'
                  }`}
                >
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl transition-all ${
                    selectedOption === option.value 
                      ? 'bg-gradient-to-br from-[#4F46E5] to-[#10B981] scale-110' 
                      : 'bg-gray-100 group-hover:bg-gray-200'
                  }`}>
                    {selectedOption === option.value ? '✓' : option.icon}
                  </div>
                  <span className={`flex-1 text-lg transition-colors ${
                    selectedOption === option.value ? 'text-[#111827] font-semibold' : 'text-[#6B7280] font-medium'
                  }`}>
                    {option.label}
                  </span>
                  {selectedOption === option.value && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    >
                      <CheckCircle className="w-6 h-6 text-[#10B981]" />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex justify-between items-center"
        >
          <Button
            onClick={handleBack}
            disabled={currentQuestion === 0}
            variant="outline"
            className="px-8 py-6 text-base rounded-2xl border-2 disabled:opacity-40"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!selectedOption}
            className="btn-primary px-8 py-6 text-base disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {currentQuestion === questions.length - 1 ? 'Complete Assessment' : 'Next Question'}
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>

        {/* Encouraging message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 text-center"
        >
          <p className="text-[#6B7280] italic">
            "Every answer helps us create the perfect learning experience for you! 🎯"
          </p>
        </motion.div>
      </div>
    </div>
  );
}