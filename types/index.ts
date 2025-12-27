export interface Question {
  id: number
  text: string
  options: {
    label: string
    text: string
    score: number
  }[]
}

export interface Test {
  id: number
  title: string
  subtitle: string
  description: string
  emoji: string
  questions: Question[]
}

export interface UserResponse {
  questionId: number
  answer: string
  score: number
}

export interface TestResult {
  testId: number
  responses: UserResponse[]
  score: number
  maxScore: number
  percentage: number
}

export interface FinalResult {
  name: string
  email: string
  test1: TestResult
  test2: TestResult
  test3: TestResult
  totalScore: number
  totalMaxScore: number
  totalPercentage: number
  healthLevel: 'critical' | 'moderate' | 'good' | 'excellent'
  analysis: string
}
