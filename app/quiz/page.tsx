'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HeartIcon, ArrowLeftIcon, ArrowRightIcon, CheckIcon } from '@/components/icons'
import { useRouter } from 'next/navigation'
import { tests } from '@/data/tests'
import { UserResponse, TestResult } from '@/types'
import { supabase } from '@/lib/supabase'

export default function QuizPage() {
  const router = useRouter()
  const [currentTestIndex, setCurrentTestIndex] = useState(0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [responses, setResponses] = useState<{
    test1: UserResponse[]
    test2: UserResponse[]
    test3: UserResponse[]
  }>({
    test1: [],
    test2: [],
    test3: []
  })
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [userName, setUserName] = useState('')

  useEffect(() => {
    // Verificar se o usuário já forneceu os dados
    const name = localStorage.getItem('userName')
    const email = localStorage.getItem('userEmail')

    if (!name || !email) {
      router.push('/')
      return
    }

    setUserName(name)
  }, [router])

  const currentTest = tests[currentTestIndex]
  const currentQuestion = currentTest.questions[currentQuestionIndex]
  const totalQuestions = tests.reduce((sum, test) => sum + test.questions.length, 0)
  const currentGlobalQuestionNumber =
    tests.slice(0, currentTestIndex).reduce((sum, test) => sum + test.questions.length, 0) +
    currentQuestionIndex +
    1

  const progressPercentage = (currentGlobalQuestionNumber / totalQuestions) * 100

  const handleAnswer = (optionLabel: string, score: number) => {
    setSelectedAnswer(optionLabel)

    // Salvar resposta
    const response: UserResponse = {
      questionId: currentQuestion.id,
      answer: optionLabel,
      score: score
    }

    // Atualizar respostas
    const testKey = `test${currentTestIndex + 1}` as 'test1' | 'test2' | 'test3'
    setResponses(prev => ({
      ...prev,
      [testKey]: [...prev[testKey], response]
    }))

    // Aguardar um pouco para mostrar a seleção e depois avançar
    setTimeout(() => {
      handleNext()
    }, 300)
  }

  const handleNext = () => {
    setIsTransitioning(true)

    setTimeout(() => {
      // Se ainda há perguntas no teste atual
      if (currentQuestionIndex < currentTest.questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1)
      }
      // Se acabou o teste atual mas há mais testes
      else if (currentTestIndex < tests.length - 1) {
        setCurrentTestIndex(prev => prev + 1)
        setCurrentQuestionIndex(0)
      }
      // Se acabaram todos os testes
      else {
        submitResults()
        return
      }

      setSelectedAnswer(null)
      setIsTransitioning(false)
    }, 300)
  }

  const submitResults = async () => {
    const name = localStorage.getItem('userName')!
    const email = localStorage.getItem('userEmail')!

    // Calcular scores
    const test1Score = responses.test1.reduce((sum, r) => sum + r.score, 0)
    const test2Score = responses.test2.reduce((sum, r) => sum + r.score, 0)
    const test3Score = responses.test3.reduce((sum, r) => sum + r.score, 0)
    const totalScore = test1Score + test2Score + test3Score

    const maxScore = tests.reduce((sum, test) =>
      sum + test.questions.reduce((qSum, q) =>
        qSum + Math.max(...q.options.map(o => o.score)), 0
      ), 0
    )

    const percentage = (totalScore / maxScore) * 100

    // Determinar nível de saúde emocional
    let healthLevel: 'critical' | 'moderate' | 'good' | 'excellent'
    if (percentage < 40) healthLevel = 'critical'
    else if (percentage < 60) healthLevel = 'moderate'
    else if (percentage < 80) healthLevel = 'good'
    else healthLevel = 'excellent'

    // Gerar análise baseada no nível
    const analysis = generateAnalysis(healthLevel, test1Score, test2Score, test3Score, name)

    // Converter respostas para formato JSON
    const test1ResponsesObj: Record<number, string> = {}
    const test2ResponsesObj: Record<number, string> = {}
    const test3ResponsesObj: Record<number, string> = {}

    responses.test1.forEach(r => { test1ResponsesObj[r.questionId] = r.answer })
    responses.test2.forEach(r => { test2ResponsesObj[r.questionId] = r.answer })
    responses.test3.forEach(r => { test3ResponsesObj[r.questionId] = r.answer })

    try {
      // Salvar no Supabase
      const { error } = await supabase.from('responses').insert({
        name,
        email,
        test_1_score: test1Score,
        test_2_score: test2Score,
        test_3_score: test3Score,
        total_score: totalScore,
        test_1_responses: test1ResponsesObj,
        test_2_responses: test2ResponsesObj,
        test_3_responses: test3ResponsesObj,
        analysis,
        health_level: healthLevel
      })

      if (error) {
        console.error('Error saving to Supabase:', error)
      }

      // Salvar no localStorage para exibir na página de resultado
      localStorage.setItem('testResults', JSON.stringify({
        name,
        email,
        test1Score,
        test2Score,
        test3Score,
        totalScore,
        maxScore,
        percentage,
        healthLevel,
        analysis
      }))

      // Redirecionar para página de resultados
      router.push('/resultado')
    } catch (error) {
      console.error('Error:', error)
      alert('Ocorreu um erro ao salvar seus resultados. Por favor, tente novamente.')
    }
  }

  const generateAnalysis = (
    level: 'critical' | 'moderate' | 'good' | 'excellent',
    test1: number,
    test2: number,
    test3: number,
    name: string
  ): string => {
    const analyses = {
      critical: `${name}, sua avaliação indica que você está passando por um momento de esgotamento emocional significativo em seu relacionamento. Os padrões identificados nas suas respostas sugerem que traumas não resolvidos da infância, especialmente relacionados às figuras parentais, estão impactando profundamente sua capacidade de estabelecer vínculos saudáveis e equilibrados.\n\nÉ fundamental que você busque apoio profissional especializado para trabalhar esses aspectos. A terapia pode ajudá-la a ressignificar experiências passadas e desenvolver novos padrões de relacionamento mais saudáveis.`,

      moderate: `${name}, sua avaliação mostra que você está enfrentando alguns desafios importantes em seu relacionamento. Existem padrões emocionais que precisam de atenção, especialmente relacionados à forma como você vivenciou as relações com suas figuras parentais na infância.\n\nVocê demonstra consciência de alguns desses padrões, o que é extremamente positivo. Com trabalho terapêutico e autoconhecimento, você pode transformar esses aspectos e construir relacionamentos mais satisfatórios e equilibrados.`,

      good: `${name}, sua avaliação indica que você possui uma boa saúde emocional em seu relacionamento. Você demonstra ter trabalhado muitos aspectos importantes de sua formação e consegue estabelecer vínculos de forma relativamente saudável.\n\nExistem algumas áreas que ainda podem ser aprimoradas, especialmente ${test1 < test2 ? 'na relação com a figura paterna' : test2 < test3 ? 'na relação com a figura materna' : 'no desenvolvimento da sexualidade'}. Continuar investindo em autoconhecimento pode levar você a um nível ainda maior de bem-estar emocional.`,

      excellent: `${name}, parabéns! Sua avaliação indica uma excelente saúde emocional no relacionamento. Você demonstra ter feito um trabalho profundo de autoconhecimento e conseguiu ressignificar muitos padrões relacionados à sua história familiar.\n\nVocê possui consciência emocional, estabelece limites saudáveis e mantém uma boa conexão consigo mesma e com seu parceiro. Continue cultivando essa saúde emocional através de práticas de autocuidado e mantendo abertura para o crescimento contínuo.`
    }

    return analyses[level]
  }

  if (!userName) {
    return null
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header with Progress */}
      <header className="w-full py-4 px-4 border-b border-gray-100 sticky top-0 bg-white z-10">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <HeartIcon className="w-5 h-5 text-pink-500" />
            <span className="text-sm font-medium text-gray-600">
              {currentGlobalQuestionNumber} de {totalQuestions}
            </span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-pink-400 to-pink-600"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="max-w-2xl w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentTestIndex}-${currentQuestionIndex}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Test Info */}
              <div className="mb-8 text-center">
                <div className="inline-flex items-center gap-2 bg-pink-50 px-4 py-2 rounded-full mb-4">
                  <span className="text-sm font-medium text-pink-700">
                    {currentTest.title} - {currentTest.subtitle}
                  </span>
                </div>
                {currentQuestionIndex === 0 && (
                  <p className="text-gray-600 text-sm italic">
                    {currentTest.description}
                  </p>
                )}
              </div>

              {/* Question */}
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-2">
                  {currentQuestion.text}
                </h2>
                <p className="text-sm text-gray-500">
                  Pergunta {currentQuestionIndex + 1} de {currentTest.questions.length}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((option) => (
                  <motion.button
                    key={option.label}
                    onClick={() => handleAnswer(option.label, option.score)}
                    disabled={isTransitioning}
                    className={`w-full text-left p-5 rounded-2xl border-2 transition-all ${
                      selectedAnswer === option.label
                        ? 'border-pink-500 bg-pink-50'
                        : 'border-gray-200 hover:border-pink-300 bg-white'
                    } ${isTransitioning ? 'opacity-50 cursor-not-allowed' : ''}`}
                    whileHover={!isTransitioning ? { scale: 1.02 } : {}}
                    whileTap={!isTransitioning ? { scale: 0.98 } : {}}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                        selectedAnswer === option.label
                          ? 'border-pink-500 bg-pink-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedAnswer === option.label ? (
                          <CheckIcon className="w-5 h-5 text-white" />
                        ) : (
                          <span className="text-sm font-medium text-gray-600">{option.label}</span>
                        )}
                      </div>
                      <p className="flex-1 text-gray-700 leading-relaxed pt-1">
                        {option.text}
                      </p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-4 border-t border-gray-100">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sm text-gray-500">
            Responda com sinceridade para obter um resultado preciso
          </p>
        </div>
      </footer>
    </div>
  )
}
