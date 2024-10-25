export interface Question {
  id: string;
  type: 'text' | 'image';
  question: string;
  correctAnswer: string;
  image?: string;
  enabled: boolean;
  timeLimit: number;
}