import React, { useState, useEffect } from 'react'
import { Brain, Lock } from 'lucide-react'
import QuizQuestion from './components/QuizQuestion'
import ResultScreen from './components/ResultScreen'
import AdminDashboard from './components/AdminDashboard'
import { Question } from './types'

function App() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [userAnswers, setUserAnswers] = useState<string[]>([])

  useEffect(() => {
    const storedQuestions = localStorage.getItem('quizQuestions')
    if (storedQuestions) {
      setQuestions(shuffleQuestions(JSON.parse(storedQuestions)))
    }
  }, [])

  const shuffleQuestions = (questionsArray: Question[]): Question[] => {
    return [...questionsArray].filter(q => q.enabled).sort(() => Math.random() - 0.5)
  }

  const handleAnswer = (selectedAnswer: string) => {
    const newUserAnswers = [...userAnswers, selectedAnswer]
    setUserAnswers(newUserAnswers)

    if (selectedAnswer.toLowerCase() === questions[currentQuestion].correctAnswer.toLowerCase()) {
      setScore(prevScore => prevScore + 1)
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prevQuestion => prevQuestion + 1)
    } else {
      setShowResult(true)
    }
  }

  const restartQuiz = () => {
    setQuestions(shuffleQuestions(questions))
    setCurrentQuestion(0)
    setScore(0)
    setShowResult(false)
    setUserAnswers([])
  }

  const handleAdminLogin = () => {
    const password = prompt("Enter admin password")
    if (password === "123") {
      setIsAdmin(true)
    } else {
      alert("Incorrect password")
    }
  }

  const handleAdminLogout = () => {
    setIsAdmin(false)
  }

  const handleQuestionAdd = (newQuestion: Question) => {
    setQuestions(prevQuestions => {
      const updatedQuestions = [...prevQuestions, newQuestion]
      localStorage.setItem('quizQuestions', JSON.stringify(updatedQuestions))
      return shuffleQuestions(updatedQuestions)
    })
  }

  if (isAdmin) {
    return <AdminDashboard onAddQuestion={handleQuestionAdd} onLogout={handleAdminLogout} />
  }

  const enabledQuestions = questions.filter(q => q.enabled)

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-blue-400 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-600 flex items-center justify-center">
          <Brain className="mr-2" /> Kid's Quiz
        </h1>
        {!showResult && enabledQuestions.length > 0 ? (
          <QuizQuestion
            question={enabledQuestions[currentQuestion]}
            onAnswer={handleAnswer}
            currentQuestion={currentQuestion + 1}
            totalQuestions={enabledQuestions.length}
          />
        ) : showResult ? (
          <ResultScreen
            score={score}
            totalQuestions={enabledQuestions.length}
            onRestart={restartQuiz}
            questions={enabledQuestions}
            userAnswers={userAnswers}
          />
        ) : (
          <div className="text-center">
            <p className="mb-4">No questions available. Please add questions in the admin dashboard.</p>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center mx-auto"
              onClick={handleAdminLogin}
            >
              <Lock className="mr-2" /> Admin Login
            </button>
          </div>
        )}
        {!isAdmin && !showResult && enabledQuestions.length > 0 && (
          <button
            className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded flex items-center justify-center mx-auto"
            onClick={handleAdminLogin}
          >
            <Lock className="mr-2" /> Admin Login
          </button>
        )}
      </div>
    </div>
  )
}

export default App