'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { SparklesIcon, AlertCircleIcon } from '@/components/icons'
import { getCurrentUser } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import MembersSidebar from '@/components/MembersSidebar'

interface Results {
  name: string
  email: string
  test1Score: number
  test2Score: number
  test3Score: number
  totalScore: number
  maxScore: number
  percentage: number
  healthLevel: 'critical' | 'moderate' | 'good' | 'excellent'
  analysis: string
  createdAt: string
}

export default function MeuResultadoPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [results, setResults] = useState<Results | null>(null)
  const [scoreOutOf10, setScoreOutOf10] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [hasTest, setHasTest] = useState(false)

  useEffect(() => {
    loadResultsFromDatabase()
  }, [])

  const loadResultsFromDatabase = async () => {
    // Verificar autenticação
    const { user: currentUser, error: userError } = await getCurrentUser()

    if (userError || !currentUser) {
      router.push('/area-membros/login')
      return
    }

    setUser(currentUser)

    // Buscar resultado da anamnese do banco
    try {
      const { data, error } = await supabase
        .from('responses')
        .select('*')
        .eq('email', currentUser.email)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (error || !data) {
        // Usuário não fez o teste
        setHasTest(false)
        setIsLoading(false)
        return
      }

      setHasTest(true)

      const resultsFromDB: Results = {
        name: data.name,
        email: data.email,
        test1Score: data.test_1_score,
        test2Score: data.test_2_score,
        test3Score: data.test_3_score,
        totalScore: data.total_score,
        maxScore: 315, // 3 testes x 21 questões x 5 pontos
        percentage: (data.total_score / 315) * 100,
        healthLevel: data.health_level,
        analysis: data.analysis,
        createdAt: data.created_at
      }

      setResults(resultsFromDB)
      const score = Math.round((resultsFromDB.percentage / 100) * 10 * 10) / 10
      setScoreOutOf10(score)
      setIsLoading(false)
    } catch (error) {
      console.error('Erro ao buscar resultado:', error)
      setIsLoading(false)
    }
  }

  // Configuração do termômetro baseado na nota 0-10
  const getGaugeConfig = (score: number) => {
    if (score >= 9) return {
      label: 'EXCEPCIONAL',
      emoji: '🔵',
      gradient: 'from-blue-400 to-blue-600',
      message: 'Sua saúde emocional está em um nível extraordinário!'
    }
    if (score >= 7) return {
      label: 'MUITO BOM',
      emoji: '🟢',
      gradient: 'from-green-400 to-green-600',
      message: 'Você tem uma ótima saúde emocional no relacionamento!'
    }
    if (score >= 5) return {
      label: 'ATENÇÃO',
      emoji: '🟡',
      gradient: 'from-amber-400 to-amber-600',
      message: 'Existem padrões importantes que precisam da sua atenção.'
    }
    if (score >= 3) return {
      label: 'PREOCUPANTE',
      emoji: '🟠',
      gradient: 'from-orange-400 to-orange-600',
      message: 'Padrões prejudiciais estão impactando seu relacionamento.'
    }
    return {
      label: 'CRÍTICO',
      emoji: '🔴',
      gradient: 'from-red-400 to-red-600',
      message: 'Sua saúde emocional precisa de atenção urgente!'
    }
  }

  // Análise Preditiva
  const generatePredictiveAnalysis = () => {
    if (!results) return null

    const { test1Score, test2Score, test3Score, maxScore } = results

    const maxScorePerTest = maxScore / 3
    const test1Percentage = (test1Score / maxScorePerTest) * 100
    const test2Percentage = (test2Score / maxScorePerTest) * 100
    const test3Percentage = (test3Score / maxScorePerTest) * 100

    let analysis = ''
    let actionPlan: string[] = []
    let patterns: string[] = []

    // Análise Geral por Nota
    if (scoreOutOf10 < 3) {
      analysis = `${results.name}, sua nota ${scoreOutOf10.toFixed(1)} indica uma **situação de emergência emocional**. Os padrões identificados estão causando um esgotamento profundo que requer ação imediata.`
    } else if (scoreOutOf10 < 5) {
      analysis = `${results.name}, sua nota ${scoreOutOf10.toFixed(1)} revela que **padrões destrutivos estão instalados** em sua dinâmica emocional.`
    } else if (scoreOutOf10 < 7) {
      analysis = `${results.name}, sua nota ${scoreOutOf10.toFixed(1)} mostra que você possui **consciência presente, mas padrões ainda ativos**.`
    } else if (scoreOutOf10 < 9) {
      analysis = `${results.name}, sua nota ${scoreOutOf10.toFixed(1)} demonstra uma **boa saúde emocional** no relacionamento.`
    } else {
      analysis = `${results.name}, sua nota ${scoreOutOf10.toFixed(1)} é **excepcional**! Você alcançou um nível raro de equilíbrio emocional.`
    }

    // Padrões Identificados
    if (test1Percentage < 40 && test3Percentage < 40) {
      patterns.push('🎯 **Padrão de Validação Masculina via Sexualidade**: Você possui um padrão inconsciente de buscar validação e aprovação masculina através da performance sexual.')
      actionPlan.push('Trabalhar a separação entre valor pessoal e desempenho sexual')
      actionPlan.push('Ressignificar a relação com a figura paterna')
    }

    if (test2Percentage < 30 && test1Percentage > 70) {
      patterns.push('💔 **Padrão de Competição Feminina e Idealização Masculina**: Existe uma tendência de idealizar figuras masculinas enquanto mantém relações competitivas ou conflituosas com mulheres.')
      actionPlan.push('Reconstruir a relação com o feminino')
      actionPlan.push('Desconstruir a idealização do masculino')
    }

    if (test1Percentage < 35 && test2Percentage < 35) {
      patterns.push('⚠️ **Padrão de Abandono Duplo**: Houve falhas significativas tanto na figura paterna quanto materna.')
      actionPlan.push('Terapia focada em vínculos de apego')
      actionPlan.push('Construir segurança interna (re-parentalização)')
    }

    if (test3Percentage < 25) {
      patterns.push('🚫 **Bloqueio na Sexualidade e Intimidade**: Suas fases psicossexuais apresentam bloqueios significativos.')
      actionPlan.push('Terapia sexual ou somática')
      actionPlan.push('Trabalhar crenças limitantes sobre prazer')
    }

    if (test2Percentage < 30 && test1Percentage > 40 && test3Percentage > 40) {
      patterns.push('👩 **Dificuldade com Auto-Cuidado e Limites**: A relação com sua mãe deixou marcas na sua capacidade de cuidar de si mesma.')
      actionPlan.push('Praticar auto-compaixão e estabelecimento de limites')
      actionPlan.push('Trabalhar a culpa relacionada ao auto-cuidado')
    }

    if (test1Percentage < 60 && test2Percentage < 60 && test3Percentage < 60 &&
        Math.abs(test1Percentage - test2Percentage) < 15) {
      patterns.push('🔄 **Padrão Generalizado de Insegurança**: As três áreas apresentam desafios semelhantes.')
      actionPlan.push('Trabalho profundo de autoestima e autoaceitação')
      actionPlan.push('Identificar crenças centrais limitantes')
    }

    // Identificar área mais crítica
    const lowestTest = Math.min(test1Percentage, test2Percentage, test3Percentage)
    let criticalArea = ''

    if (lowestTest === test1Percentage) {
      criticalArea = '**Relação Paterna**'
      actionPlan.push('Priorizar o trabalho terapêutico com a figura paterna')
    } else if (lowestTest === test2Percentage) {
      criticalArea = '**Relação Materna**'
      actionPlan.push('Priorizar o trabalho terapêutico com a figura materna')
    } else {
      criticalArea = '**Sexualidade e Intimidade**'
      actionPlan.push('Buscar acompanhamento especializado em sexualidade')
    }

    return {
      generalAnalysis: analysis,
      patterns: patterns.length > 0 ? patterns : ['Seus padrões emocionais demonstram equilíbrio nas três áreas avaliadas.'],
      criticalArea,
      actionPlan: actionPlan.length > 0 ? actionPlan : ['Continue investindo em seu autoconhecimento'],
      lowestPercentage: lowestTest
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <SparklesIcon className="w-16 h-16 text-pink-500 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Carregando seu resultado...</p>
        </div>
      </div>
    )
  }

  // Se não fez o teste
  if (!hasTest) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
        <MembersSidebar user={user} />
        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto px-4 lg:px-8 py-8 md:py-12 lg:ml-0 ml-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border-2 border-gray-100 p-8 text-center"
            >
              <AlertCircleIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Você ainda não fez a anamnese
              </h3>
              <p className="text-gray-600 mb-6">
                Complete o teste de avaliação emocional para ver seus resultados aqui.
              </p>
              <button
                onClick={() => router.push('/')}
                className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-xl transition-all"
              >
                Fazer Anamnese Agora
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  const gaugeConfig = getGaugeConfig(scoreOutOf10)
  const predictiveAnalysis = generatePredictiveAnalysis()

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 overflow-x-hidden">
      <MembersSidebar user={user} />

      <div className="flex-1 overflow-x-hidden w-full lg:w-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 pt-20 lg:pt-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Meu Resultado da Anamnese
            </h1>
            <p className="text-gray-600">
              Avaliação realizada em {new Date(results!.createdAt).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
              })}
            </p>
          </motion.div>

          {/* Termômetro/Gauge 0-10 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className={`bg-gradient-to-br ${gaugeConfig.gradient} rounded-3xl p-8 md:p-12 text-white shadow-2xl`}>
              {/* Nota grande */}
              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                  className="inline-flex items-baseline gap-2"
                >
                  <span className="text-7xl md:text-8xl font-black">
                    {scoreOutOf10.toFixed(1)}
                  </span>
                  <span className="text-3xl md:text-4xl font-bold opacity-90">/10</span>
                </motion.div>
              </div>

              {/* Label */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-center"
              >
                <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full mb-4">
                  <span className="text-3xl">{gaugeConfig.emoji}</span>
                  <span className="text-xl md:text-2xl font-bold">{gaugeConfig.label}</span>
                </div>
                <p className="text-lg md:text-xl opacity-95 max-w-2xl mx-auto">
                  {gaugeConfig.message}
                </p>
              </motion.div>

              {/* Barra de progresso visual */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="mt-8"
              >
                <div className="flex items-center justify-between text-sm mb-2 opacity-90">
                  <span>0</span>
                  <span>10</span>
                </div>
                <div className="h-4 bg-white/30 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-white"
                    initial={{ width: 0 }}
                    animate={{ width: `${(scoreOutOf10 / 10) * 100}%` }}
                    transition={{ delay: 1.7, duration: 1.5, ease: 'easeOut' }}
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Scores Individuais */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Pontuação por Área Avaliada
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-purple-50 to-white border-2 border-purple-100 rounded-2xl p-6 text-center">
                <div className="text-3xl mb-2">👨</div>
                <p className="text-sm text-gray-600 mb-2 font-medium">Relação Paterna</p>
                <p className="text-3xl font-bold text-gray-900">{results!.test1Score}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {Math.round((results!.test1Score / (results!.maxScore / 3)) * 100)}%
                </p>
              </div>
              <div className="bg-gradient-to-br from-pink-50 to-white border-2 border-pink-100 rounded-2xl p-6 text-center">
                <div className="text-3xl mb-2">👩</div>
                <p className="text-sm text-gray-600 mb-2 font-medium">Relação Materna</p>
                <p className="text-3xl font-bold text-gray-900">{results!.test2Score}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {Math.round((results!.test2Score / (results!.maxScore / 3)) * 100)}%
                </p>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-white border-2 border-red-100 rounded-2xl p-6 text-center">
                <div className="text-3xl mb-2">💕</div>
                <p className="text-sm text-gray-600 mb-2 font-medium">Sexualidade</p>
                <p className="text-3xl font-bold text-gray-900">{results!.test3Score}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {Math.round((results!.test3Score / (results!.maxScore / 3)) * 100)}%
                </p>
              </div>
            </div>
          </motion.div>

          {/* Análise Preditiva */}
          {predictiveAnalysis && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-3xl border-2 border-gray-100 p-8 md:p-10 mb-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <SparklesIcon className="w-8 h-8 text-pink-500" />
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Análise Preditiva Personalizada
                </h3>
              </div>

              <div className="prose prose-lg max-w-none mb-8">
                <p className="text-gray-700 leading-relaxed text-lg">
                  {predictiveAnalysis.generalAnalysis}
                </p>
              </div>

              {/* Padrões Identificados */}
              <div className="mb-8">
                <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span>🔍</span> Padrões Identificados
                </h4>
                <div className="space-y-4">
                  {predictiveAnalysis.patterns.map((pattern, index) => (
                    <div key={index} className="bg-pink-50 border-l-4 border-pink-500 rounded-r-xl p-5">
                      <p className="text-gray-700 leading-relaxed">{pattern}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Área Crítica */}
              <div className="mb-8 bg-amber-50 border-2 border-amber-200 rounded-2xl p-6">
                <h4 className="text-lg font-bold text-amber-900 mb-2 flex items-center gap-2">
                  <span>⚡</span> Área que Precisa de Maior Atenção
                </h4>
                <p className="text-amber-800 text-lg">
                  {predictiveAnalysis.criticalArea} ({Math.round(predictiveAnalysis.lowestPercentage)}% de desenvolvimento)
                </p>
              </div>

              {/* Plano de Ação */}
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span>📋</span> Seus Próximos Passos
                </h4>
                <div className="space-y-3">
                  {predictiveAnalysis.actionPlan.map((action, index) => (
                    <div key={index} className="flex items-start gap-3 bg-gradient-to-r from-pink-50 to-white rounded-xl p-4 border border-pink-100">
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <p className="text-gray-700 pt-1">{action}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Análise Original */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-2xl p-8"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Análise Completa
            </h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {results!.analysis}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
