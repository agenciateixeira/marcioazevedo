'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HeartIcon, ArrowLeftIcon, ArrowRightIcon, CheckIcon, SparklesIcon } from '@/components/icons'
import { useRouter } from 'next/navigation'
import { tests } from '@/data/tests'
import { UserResponse, TestResult } from '@/types'
import { supabase } from '@/lib/supabase'

export default function QuizPage() {
  const router = useRouter()
  const [currentPhase, setCurrentPhase] = useState(0) // 0, 1, 2 (3 fases)
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
  const [showPhaseTransition, setShowPhaseTransition] = useState(false)
  const [userName, setUserName] = useState('')

  // Estrutura das fases
  const phases = [
    {
      id: 1,
      title: 'Fase 1 de 3',
      subtitle: 'Sua Relação com a Figura Paterna',
      emoji: '👨',
      description: 'Como o seu pai moldou suas expectativas e escolhas amorosas',
      completionMessage: 'Você completou a análise da sua relação com a figura paterna!',
      test: tests[0]
    },
    {
      id: 2,
      title: 'Fase 2 de 3',
      subtitle: 'Sua Relação com a Figura Materna',
      emoji: '👩',
      description: 'Como sua mãe influenciou sua capacidade de intimidade e auto-cuidado',
      completionMessage: 'Você completou a análise da sua relação com a figura materna!',
      test: tests[1]
    },
    {
      id: 3,
      title: 'Fase 3 de 3',
      subtitle: 'Sua Sexualidade e Afetividade',
      emoji: '💕',
      description: 'Como suas fases psicossexuais afetam sua intimidade hoje',
      completionMessage: 'Parabéns! Você completou toda a avaliação emocional!',
      test: tests[2]
    }
  ]

  const currentPhaseData = phases[currentPhase]
  const currentTest = currentPhaseData.test

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

  const currentQuestion = currentTest.questions[currentQuestionIndex]
  const totalQuestions = tests.reduce((sum, test) => sum + test.questions.length, 0)

  // Progresso dentro da fase atual
  const phaseProgress = ((currentQuestionIndex + 1) / currentTest.questions.length) * 100

  // Progresso global (considerando todas as 3 fases)
  const questionsCompletedBeforePhase = phases.slice(0, currentPhase).reduce((sum, phase) =>
    sum + phase.test.questions.length, 0
  )
  const currentGlobalQuestionNumber = questionsCompletedBeforePhase + currentQuestionIndex + 1
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
    const testKey = `test${currentPhase + 1}` as 'test1' | 'test2' | 'test3'
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
      // Se ainda há perguntas na fase atual
      if (currentQuestionIndex < currentTest.questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1)
        setSelectedAnswer(null)
        setIsTransitioning(false)
      }
      // Se acabou a fase atual mas há mais fases
      else if (currentPhase < phases.length - 1) {
        // Mostrar tela de transição de fase
        setShowPhaseTransition(true)
        setIsTransitioning(false)

        // Após 3 segundos, ir para próxima fase
        setTimeout(() => {
          setShowPhaseTransition(false)
          setCurrentPhase(prev => prev + 1)
          setCurrentQuestionIndex(0)
          setSelectedAnswer(null)
        }, 3000)
      }
      // Se acabaram todas as fases
      else {
        submitResults()
        return
      }
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

      // Redirecionar para checkout (pagamento de R$ 7)
      router.push('/checkout')
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

  // Tela de transição entre fases
  if (showPhaseTransition) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="inline-block mb-6"
          >
            <SparklesIcon className="w-16 h-16 text-pink-500" />
          </motion.div>

          <div className="text-6xl mb-4">{phases[currentPhase].emoji}</div>

          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            {phases[currentPhase].completionMessage}
          </h2>

          <p className="text-gray-600 mb-6">
            Analisando suas respostas...
          </p>

          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-pink-400 to-pink-600"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 3 }}
            />
          </div>

          <p className="text-sm text-gray-500 mt-4">
            Preparando {phases[currentPhase + 1]?.subtitle}...
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header with Progress */}
      <header className="w-full py-4 px-4 border-b border-gray-100 sticky top-0 bg-white z-10">
        <div className="max-w-2xl mx-auto">
          {/* Fase atual */}
          <div className="text-center mb-3">
            <div className="inline-flex items-center gap-2 bg-pink-50 px-3 py-1 rounded-full mb-2">
              <span className="text-2xl">{currentPhaseData.emoji}</span>
              <span className="text-xs font-bold text-pink-700">
                {currentPhaseData.title}
              </span>
            </div>
            <p className="text-sm font-medium text-gray-700">
              {currentPhaseData.subtitle}
            </p>
          </div>

          {/* Progresso da fase */}
          <div className="mb-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500">
                Pergunta {currentQuestionIndex + 1} de {currentTest.questions.length}
              </span>
              <span className="text-xs font-medium text-gray-600">
                {Math.round(phaseProgress)}%
              </span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-pink-400 to-pink-600"
                initial={{ width: 0 }}
                animate={{ width: `${phaseProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Progresso global */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">
              Progresso Total: {currentGlobalQuestionNumber} de {totalQuestions}
            </span>
            <HeartIcon className="w-4 h-4 text-pink-500" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="max-w-2xl w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentPhase}-${currentQuestionIndex}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Descrição da fase (apenas na primeira pergunta) */}
              {currentQuestionIndex === 0 && (
                <div className="mb-8 text-center">
                  <p className="text-gray-600 text-sm sm:text-base italic max-w-xl mx-auto">
                    {currentPhaseData.description}
                  </p>
                </div>
              )}

              {/* Question */}
              <div className="mb-8">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-2">
                  {currentQuestion.text}
                </h2>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((option) => (
                  <motion.button
                    key={option.label}
                    onClick={() => handleAnswer(option.label, option.score)}
                    disabled={isTransitioning}
                    className={`w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all ${
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
                      <p className="flex-1 text-sm sm:text-base text-gray-700 leading-relaxed pt-1">
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
