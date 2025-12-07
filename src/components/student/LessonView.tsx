import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, ArrowRight, ArrowLeft, CheckCircle, Sparkles, Volume2, Eye, Book, Target } from 'lucide-react';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';

interface LessonContent {
  id: string;
  title: string;
  subject: string;
  profile: string;
  slides: Slide[];
  xpReward: number;
}

interface Slide {
  type: 'intro' | 'content' | 'visual' | 'interactive' | 'quiz' | 'summary';
  title?: string;
  content: string;
  visual?: string;
  audioHint?: string;
  question?: {
    text: string;
    options: string[];
    correct: number;
    explanation: string;
  };
  breakSuggestion?: boolean;
}

// Sample lesson data for different profiles
const lessonDatabase: Record<string, LessonContent> = {
  'fractions-adhd': {
    id: '1',
    title: 'Introduction to Fractions',
    subject: 'Mathematics',
    profile: 'adhd',
    xpReward: 50,
    slides: [
      {
        type: 'intro',
        content: '🎯 Let\'s learn about fractions! This lesson is split into bite-sized chunks perfect for you.',
        breakSuggestion: false
      },
      {
        type: 'visual',
        title: 'What is a Fraction?',
        content: 'A fraction shows parts of a whole. Imagine cutting a pizza into slices! 🍕',
        visual: '⬜⬜⬜⬜ → Whole Pizza\n🟦⬜⬜⬜ → 1/4 of the pizza'
      },
      {
        type: 'interactive',
        title: 'Quick Check!',
        content: 'If you eat 2 slices of a pizza that has 8 slices total, what fraction did you eat?',
        question: {
          text: 'What fraction represents 2 out of 8 slices?',
          options: ['1/8', '2/8', '2/4', '8/2'],
          correct: 1,
          explanation: 'Correct! 2/8 means 2 parts out of 8 total parts. Great job! 🎉'
        }
      },
      {
        type: 'content',
        title: '⏸️ Take a 2-minute break!',
        content: 'Stand up, stretch, or walk around. Your brain learns better with short breaks!',
        breakSuggestion: true
      },
      {
        type: 'visual',
        title: 'Reading Fractions',
        content: 'The TOP number (numerator) = how many parts you have\nThe BOTTOM number (denominator) = total number of parts\n\n3/4 = "3 out of 4 parts"',
        visual: '🟦🟦🟦⬜\n3 colored, 4 total = 3/4'
      },
      {
        type: 'quiz',
        title: 'Final Challenge!',
        content: 'You\'re doing amazing! One more question:',
        question: {
          text: 'Look at this: 🟩🟩⬜⬜⬜  What fraction is green?',
          options: ['2/5', '3/5', '2/3', '5/2'],
          correct: 0,
          explanation: 'Perfect! 2 green squares out of 5 total = 2/5. You\'re a fraction star! ⭐'
        }
      },
      {
        type: 'summary',
        content: '🎉 Awesome work! You just learned:\n• What fractions are\n• How to read them\n• How to identify them\n\nYou earned 50 XP! Ready for the next lesson?'
      }
    ]
  },
  'fractions-visual': {
    id: '1',
    title: 'Introduction to Fractions',
    subject: 'Mathematics',
    profile: 'visual-learner',
    xpReward: 50,
    slides: [
      {
        type: 'intro',
        content: 'Welcome! This lesson uses lots of visual examples to help you understand fractions clearly.'
      },
      {
        type: 'visual',
        title: 'Understanding Fractions Visually',
        content: 'A fraction represents parts of a whole object.',
        visual: `
WHOLE CIRCLE: ⭕
HALF: ◐
QUARTER: ◔

Fraction = Part/Whole
        `
      },
      {
        type: 'visual',
        title: 'Parts of a Fraction',
        content: 'Every fraction has two numbers:',
        visual: `
     3  ← Numerator (parts you have)
    ―――
     4  ← Denominator (total parts)

Visual:
🟦🟦🟦⬜
3 out of 4 boxes are blue = 3/4
        `
      },
      {
        type: 'interactive',
        title: 'Visual Practice',
        content: 'Look at this diagram carefully:',
        visual: '🟨🟨🟨⬜⬜⬜',
        question: {
          text: 'What fraction of the boxes are yellow?',
          options: ['1/2', '3/6', '3/3', '6/3'],
          correct: 1,
          explanation: 'Excellent! 3 yellow boxes out of 6 total = 3/6 ✨'
        }
      },
      {
        type: 'visual',
        title: 'Real-World Fractions',
        content: 'Fractions are everywhere around you!',
        visual: `
🍕 Pizza slices: 2/8
🍫 Chocolate bar: 3/12  
📊 Progress bar: 7/10
🎂 Cake pieces: 1/6
        `
      },
      {
        type: 'quiz',
        title: 'Final Visual Challenge',
        content: 'One more visual question:',
        visual: '⭐⭐⭐⭐⭐⬜⬜⬜',
        question: {
          text: 'What fraction of stars are filled?',
          options: ['5/3', '3/8', '5/8', '8/5'],
          correct: 2,
          explanation: '🌟 Perfect! 5 filled stars out of 8 total = 5/8. You have a great eye for fractions!'
        }
      },
      {
        type: 'summary',
        content: '🎨 Great visual thinking! You learned:\n\n✓ How to see fractions as parts of a whole\n✓ Reading numerators and denominators\n✓ Recognizing fractions in diagrams\n\n+50 XP earned!'
      }
    ]
  },
  'fractions-autism': {
    id: '1',
    title: 'Introduction to Fractions',
    subject: 'Mathematics',
    profile: 'autism',
    xpReward: 50,
    slides: [
      {
        type: 'intro',
        content: '📚 Introduction to Fractions\n\nThis lesson follows a clear, step-by-step structure. We will cover exactly 3 topics in order.'
      },
      {
        type: 'content',
        title: 'Step 1: Definition',
        content: 'A fraction is a number that represents part of a whole.\n\nStructure of a fraction:\nNumerator / Denominator\n\nThe numerator is always on top.\nThe denominator is always on bottom.\n\nExample: 1/2 means 1 part out of 2 total parts.'
      },
      {
        type: 'content',
        title: 'Step 2: Numerator',
        content: 'The NUMERATOR is the top number.\n\nIt tells you HOW MANY parts you have.\n\nExamples:\n• In 3/4, the numerator is 3\n• In 5/8, the numerator is 5\n• In 1/2, the numerator is 1\n\nRule: The numerator counts the parts we are focusing on.'
      },
      {
        type: 'content',
        title: 'Step 3: Denominator',
        content: 'The DENOMINATOR is the bottom number.\n\nIt tells you the TOTAL number of equal parts.\n\nExamples:\n• In 3/4, the denominator is 4\n• In 5/8, the denominator is 8  \n• In 1/2, the denominator is 2\n\nRule: The denominator must never be zero.'
      },
      {
        type: 'interactive',
        title: 'Practice Question 1',
        content: 'Apply what you learned:',
        question: {
          text: 'In the fraction 7/9, what number is the numerator?',
          options: ['9', '7', '79', '97'],
          correct: 1,
          explanation: 'Correct. The numerator is always the top number. In 7/9, the top number is 7.'
        }
      },
      {
        type: 'interactive',
        title: 'Practice Question 2',
        content: 'Second practice question:',
        question: {
          text: 'In the fraction 4/5, what number is the denominator?',
          options: ['4', '5', '9', '45'],
          correct: 1,
          explanation: 'Correct. The denominator is always the bottom number. In 4/5, the bottom number is 5.'
        }
      },
      {
        type: 'summary',
        content: 'Lesson Complete ✓\n\nYou learned 3 things in order:\n1. What a fraction is (part of a whole)\n2. Numerator = top number = parts you have\n3. Denominator = bottom number = total parts\n\nXP Earned: +50\n\nNext lesson: Comparing Fractions'
      }
    ]
  },
  'fractions-dyslexia': {
    id: '1',
    title: 'Introduction to Fractions',
    subject: 'Mathematics',
    profile: 'dyslexia',
    xpReward: 50,
    slides: [
      {
        type: 'intro',
        content: '✨ Fractions Made Simple\n\nShort text. Big visuals. You\'ve got this! 💪'
      },
      {
        type: 'visual',
        title: 'What Are Fractions?',
        content: 'Parts of something whole.',
        visual: `
Pizza Example:

🍕 Whole pizza

🍕|🍕 Half pizza = 1/2

🍕|🍕|🍕|🍕 Quarter = 1/4
        `
      },
      {
        type: 'visual',
        title: 'Two Parts',
        content: 'Every fraction has 2 numbers:',
        visual: `
    2  ← Top = Parts you have
   ―― 
    5  ← Bottom = All parts


Color code:
🔵 Top = What you have
🟢 Bottom = The total
        `
      },
      {
        type: 'interactive',
        title: 'Quick Check',
        content: 'Look at the shapes:',
        visual: '❤️❤️⬜⬜⬜⬜',
        question: {
          text: 'How many hearts out of total?',
          options: ['2/6', '4/6', '2/4', '6/2'],
          correct: 0,
          explanation: 'Yes! 2 hearts ❤️❤️ out of 6 total boxes = 2/6 ✓'
        }
      },
      {
        type: 'visual',
        title: 'Reading Fractions',
        content: 'Say it simply:',
        visual: `
1/2 = "1 out of 2"
3/4 = "3 out of 4"  
2/5 = "2 out of 5"

Easy! 😊
        `
      },
      {
        type: 'quiz',
        title: 'Last One!',
        content: '',
        visual: '⭐⭐⭐⬜⬜',
        question: {
          text: 'Stars out of total?',
          options: ['3/5', '2/5', '5/3', '3/2'],
          correct: 0,
          explanation: 'Perfect! ⭐⭐⭐ = 3 stars, 5 total = 3/5! 🎉'
        }
      },
      {
        type: 'summary',
        content: '🎊 You Did It!\n\nYou learned:\n✓ Fractions = parts\n✓ Top = what you have\n✓ Bottom = total\n\n+50 XP! 🏆'
      }
    ]
  }
};

export function LessonView() {
  const navigate = useNavigate();
  const { lessonId } = useParams();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);

  // Get user profile from localStorage
  const assessmentData = JSON.parse(localStorage.getItem('assessmentData') || '{}');
  const profile = assessmentData.profile || 'visual-learner';
  
  // Get the appropriate lesson version
  const lessonKey = `fractions-${profile}`;
  const lesson = lessonDatabase[lessonKey] || lessonDatabase['fractions-visual'];
  const slide = lesson.slides[currentSlide];
  const progress = ((currentSlide + 1) / lesson.slides.length) * 100;

  const handleNext = () => {
    if (currentSlide < lesson.slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      // Lesson complete
      const currentXP = parseInt(localStorage.getItem('studentXP') || '215');
      localStorage.setItem('studentXP', (currentXP + lesson.xpReward).toString());
      navigate('/student/dashboard');
    }
  };

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }
  };

  const handleAnswerSelect = (index: number) => {
    if (showFeedback) return;
    setSelectedAnswer(index);
  };

  const handleCheckAnswer = () => {
    if (selectedAnswer === null) return;
    setShowFeedback(true);
    if (slide.question && selectedAnswer === slide.question.correct) {
      setScore(score + 1);
      setXpEarned(xpEarned + 10);
    }
  };

  const getProfileIcon = () => {
    switch (profile) {
      case 'adhd': return <Target className="w-5 h-5" />;
      case 'visual-learner': return <Eye className="w-5 h-5" />;
      case 'autism': return <Book className="w-5 h-5" />;
      case 'dyslexia': return <Sparkles className="w-5 h-5" />;
      default: return <Brain className="w-5 h-5" />;
    }
  };

  const getProfileLabel = () => {
    const labels: Record<string, string> = {
      'adhd': 'Active Learner',
      'visual-learner': 'Visual Learner',
      'autism': 'Structured Learner',
      'dyslexia': 'Visual Learner',
      'typical': 'Balanced Learner'
    };
    return labels[profile] || 'Learner';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/student/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-[#6B7280]" />
              </button>
              <div>
                <h2 className="text-[#111827]">{lesson.title}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-1 bg-[#F3F4F6] text-[#6B7280] rounded-md text-sm">
                    {lesson.subject}
                  </span>
                  <span className="px-2 py-1 bg-[#F0F4FF] text-[#4F46E5] rounded-md text-sm flex items-center gap-1">
                    {getProfileIcon()}
                    {getProfileLabel()}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-[#6B7280]">Progress</p>
                <p className="font-semibold text-[#111827]">{currentSlide + 1}/{lesson.slides.length}</p>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>

      {/* Lesson Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl border border-gray-200 p-8 md:p-12 shadow-sm"
            >
              {/* Break Suggestion */}
              {slide.breakSuggestion && (
                <div className="mb-8 p-6 bg-gradient-to-r from-[#ECFDF5] to-[#D1FAE5] rounded-2xl border border-[#10B981]/20">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-[#10B981] rounded-xl flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-[#059669]">Time for a Break!</h3>
                  </div>
                </div>
              )}

              {/* Slide Title */}
              {slide.title && (
                <h2 className="text-[#111827] mb-6">{slide.title}</h2>
              )}

              {/* Slide Content */}
              <div className="text-[#374151] text-lg leading-relaxed mb-8 whitespace-pre-line">
                {slide.content}
              </div>

              {/* Visual Content */}
              {slide.visual && (
                <div className="mb-8 p-6 bg-[#F9FAFB] rounded-2xl border border-gray-200">
                  <pre className="text-2xl leading-loose font-mono text-center">
                    {slide.visual}
                  </pre>
                </div>
              )}

              {/* Interactive Question */}
              {slide.question && (
                <div className="space-y-4">
                  <div className="p-6 bg-[#F0F4FF] rounded-2xl border border-[#4F46E5]/20 mb-6">
                    <p className="text-lg text-[#111827]">{slide.question.text}</p>
                  </div>

                  <div className="grid gap-3">
                    {slide.question.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        disabled={showFeedback}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          selectedAnswer === index
                            ? showFeedback
                              ? index === slide.question!.correct
                                ? 'border-[#10B981] bg-[#ECFDF5]'
                                : 'border-[#EF4444] bg-[#FEF2F2]'
                              : 'border-[#4F46E5] bg-[#F0F4FF]'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            selectedAnswer === index
                              ? showFeedback && index === slide.question!.correct
                                ? 'border-[#10B981] bg-[#10B981]'
                                : selectedAnswer === index
                                ? 'border-[#4F46E5] bg-[#4F46E5]'
                                : 'border-gray-300'
                              : 'border-gray-300'
                          }`}>
                            {showFeedback && index === slide.question!.correct && (
                              <CheckCircle className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <span className="text-[#111827]">{option}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {!showFeedback && selectedAnswer !== null && (
                    <Button
                      onClick={handleCheckAnswer}
                      className="w-full bg-[#4F46E5] text-white hover:bg-[#4338CA] h-12 rounded-xl mt-4"
                    >
                      Check Answer
                    </Button>
                  )}

                  {showFeedback && slide.question.explanation && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-6 rounded-2xl mt-6 ${
                        selectedAnswer === slide.question.correct
                          ? 'bg-[#ECFDF5] border border-[#10B981]/20'
                          : 'bg-[#FEF2F2] border border-[#EF4444]/20'
                      }`}
                    >
                      <p className={`${
                        selectedAnswer === slide.question.correct
                          ? 'text-[#059669]'
                          : 'text-[#DC2626]'
                      }`}>
                        {slide.question.explanation}
                      </p>
                    </motion.div>
                  )}
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between mt-12 pt-8 border-t border-gray-100">
                <Button
                  onClick={handlePrevious}
                  disabled={currentSlide === 0}
                  variant="ghost"
                  className="text-[#6B7280] hover:text-[#111827]"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                  <Target className="w-4 h-4 text-[#FBBF24]" />
                  <span>+{xpEarned} XP earned</span>
                </div>

                <Button
                  onClick={handleNext}
                  disabled={slide.question && !showFeedback}
                  className="bg-[#4F46E5] text-white hover:bg-[#4338CA]"
                >
                  {currentSlide === lesson.slides.length - 1 ? 'Complete Lesson' : 'Next'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
