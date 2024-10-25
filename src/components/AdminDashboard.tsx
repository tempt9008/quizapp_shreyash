import React, { useState, useEffect } from 'react'
import { Question } from '../types'
import { v4 as uuidv4 } from 'uuid'

interface AdminDashboardProps {
  onAddQuestion: (question: Question) => void
  onLogout: () => void
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onAddQuestion, onLogout }) => {
  const [questions, setQuestions] = useState<Question[]>([])
  const [questionType, setQuestionType] = useState<'text' | 'image'>('text')
  const [question, setQuestion] = useState('')
  const [correctAnswer, setCorrectAnswer] = useState('')
  const [image, setImage] = useState<string>('')
  const [timeLimit, setTimeLimit] = useState<number>(30)
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    const storedQuestions = localStorage.getItem('quizQuestions')
    if (storedQuestions) {
      setQuestions(JSON.parse(storedQuestions))
    }
  }, [])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newQuestion: Question = {
      id: editingId || uuidv4(),
      type: questionType,
      question,
      correctAnswer,
      image: image || undefined,
      enabled: true,
      timeLimit
    }
    if (editingId) {
      const updatedQuestions = questions.map(q => q.id === editingId ? newQuestion : q)
      setQuestions(updatedQuestions)
      localStorage.setItem('quizQuestions', JSON.stringify(updatedQuestions))
    } else {
      onAddQuestion(newQuestion)
      setQuestions([...questions, newQuestion])
    }
    resetForm()
  }

  const resetForm = () => {
    setQuestionType('text')
    setQuestion('')
    setCorrectAnswer('')
    setImage('')
    setTimeLimit(30)
    setEditingId(null)
  }

  const handleEdit = (q: Question) => {
    setEditingId(q.id)
    setQuestionType(q.type)
    setQuestion(q.question)
    setCorrectAnswer(q.correctAnswer)
    setImage(q.image || '')
    setTimeLimit(q.timeLimit || 30)
  }

  const handleDelete = (id: string) => {
    const updatedQuestions = questions.filter(q => q.id !== id)
    setQuestions(updatedQuestions)
    localStorage.setItem('quizQuestions', JSON.stringify(updatedQuestions))
  }

  const handleToggleEnable = (id: string) => {
    const updatedQuestions = questions.map(q => 
      q.id === id ? { ...q, enabled: !q.enabled } : q
    )
    setQuestions(updatedQuestions)
    localStorage.setItem('quizQuestions', JSON.stringify(updatedQuestions))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-blue-400 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Question Type</label>
            <select
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value as 'text' | 'image')}
              className="w-full p-2 border rounded"
            >
              <option value="text">Text</option>
              <option value="image">Image</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">Question</label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          {questionType === 'image' && (
            <div>
              <label className="block mb-1">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full p-2 border rounded"
              />
              {image && <img src={image} alt="Uploaded" className="mt-2 max-w-full h-40 object-contain" />}
            </div>
          )}
          <div>
            <label className="block mb-1">Correct Answer</label>
            <input
              type="text"
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Time Limit (seconds)</label>
            <input
              type="number"
              min="5"
              max="300"
              value={timeLimit}
              onChange={(e) => setTimeLimit(Number(e.target.value))}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            {editingId ? 'Update Question' : 'Add Question'}
          </button>
        </form>
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Existing Questions</h2>
          {questions.map((q) => (
            <div key={q.id} className="bg-gray-100 p-4 rounded mb-4">
              <p><strong>Type:</strong> {q.type}</p>
              <p><strong>Question:</strong> {q.question}</p>
              <p><strong>Answer:</strong> {q.correctAnswer}</p>
              <p><strong>Time Limit:</strong> {q.timeLimit} seconds</p>
              <p><strong>Status:</strong> {q.enabled ? 'Enabled' : 'Disabled'}</p>
              {q.image && <img src={q.image} alt="Question" className="mt-2 max-w-full h-40 object-contain" />}
              <div className="mt-2 space-x-2">
                <button onClick={() => handleEdit(q)} className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600">
                  Edit
                </button>
                <button onClick={() => handleDelete(q.id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
                  Delete
                </button>
                <button 
                  onClick={() => handleToggleEnable(q.id)} 
                  className={`${q.enabled ? 'bg-gray-500' : 'bg-green-500'} text-white px-2 py-1 rounded hover:opacity-80`}
                >
                  {q.enabled ? 'Disable' : 'Enable'}
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={onLogout}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default AdminDashboard