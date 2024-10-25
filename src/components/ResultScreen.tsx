import React from 'react'
import { Award, RefreshCw } from 'lucide-react'
import { Question } from '../types'

interface ResultScreenProps {
  score: number
  totalQuestions: number
  onRestart: () => void
  questions: Question[]
  userAnswers: string[]
}

const ResultScreen: React.FC<ResultScreenProps> = ({
  score,
  totalQuestions,
  onRestart,
  questions,
  userAnswers
}) => {
  const percentage = (score / totalQuestions) * 100

  return (
    <div className="text-center">
      <Award className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
      <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
      <p className="text-lg mb-4">
        You scored {score} out of {totalQuestions}
      </p>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
        <div
          className="bg-blue-600 h-2.5 rounded-full"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <p className="text-xl font-semibold mb-6">
        {percentage >= 80
          ? "Great job! You're a quiz master! 🎉"
          : percentage >= 60
          ? "Well done! Keep learning! 👍"
          : "Good try! Let's practice more! 💪"}
      </p>
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2">Review Your Answers:</h3>
        {questions.map((q, index) => (
          <div key={q.id} className="mb-4 text-left p-4 bg-gray-100 rounded-lg">
            <p className="font-semibold">{q.question}</p>
            {q.type === 'image' && q.image && (
              <img src={q.image} alt="Question" className="w-full mt-2 mb-2 rounded-lg" />
            )}
            <p className={userAnswers[index].toLowerCase() === q.correctAnswer.toLowerCase() ? "text-green-600" : "text-red-600"}>
              Your answer: {userAnswers[index]}
            </p>
            {userAnswers[index].toLowerCase() !== q.correctAnswer.toLowerCase() && (
              <p className="text-green-600">Correct answer: {q.correctAnswer}</p>
            )}
          </div>
        ))}
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 flex items-center justify-center mx-auto"
        onClick={onRestart}
      >
        <RefreshCw className="mr-2" /> Play Again
      </button>
    </div>
  )
}

export default ResultScreen