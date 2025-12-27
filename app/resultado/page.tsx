'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { HeartIcon, Share2Icon, CheckCircleIcon, AlertCircleIcon, TrendingUpIcon, HomeIcon, SparklesIcon, ArrowRightIcon } from '@/components/icons'
import { useRouter } from 'next/navigation'

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
}

export default function ResultadoPage() {
  const router = useRouter()
  const [results, setResults] = useState<Results | null>(null)
  const [scoreOutOf10, setScoreOutOf10] = useState(0)
  const [showAnalysis, setShowAnalysis] = useState(false)

  useEffect(() => {
    const savedResults = localStorage.getItem('testResults')

    if (!savedResults) {
      router.push('/')
      return
    }

    const parsedResults: Results = JSON.parse(savedResults)
    setResults(parsedResults)

    // Calcular nota de 0 a 10
    const score = Math.round((parsedResults.percentage / 100) * 10 * 10) / 10
    setScoreOutOf10(score)

    // Mostrar análise após animação do gauge
    setTimeout(() => {
      setShowAnalysis(true)
    }, 2500)
  }, [router])

  if (!results) {
    return null
  }

  // Configuração do termômetro baseado na nota 0-10
  const getGaugeConfig = (score: number) => {
    if (score >= 9) return {
      color: '#3b82f6', // blue
      label: 'EXCEPCIONAL',
      emoji: '🔵',
      gradient: 'from-blue-400 to-blue-600',
      message: 'Sua saúde emocional está em um nível extraordinário!'
    }
    if (score >= 7) return {
      color: '#10b981', // green
      label: 'MUITO BOM',
      emoji: '🟢',
      gradient: 'from-green-400 to-green-600',
      message: 'Você tem uma ótima saúde emocional no relacionamento!'
    }
    if (score >= 5) return {
      color: '#f59e0b', // amber
      label: 'ATENÇÃO',
      emoji: '🟡',
      gradient: 'from-amber-400 to-amber-600',
      message: 'Existem padrões importantes que precisam da sua atenção.'
    }
    if (score >= 3) return {
      color: '#f97316', // orange
      label: 'PREOCUPANTE',
      emoji: '🟠',
      gradient: 'from-orange-400 to-orange-600',
      message: 'Padrões prejudiciais estão impactando seu relacionamento.'
    }
    return {
      color: '#ef4444', // red
      label: 'CRÍTICO',
      emoji: '🔴',
      gradient: 'from-red-400 to-red-600',
      message: 'Sua saúde emocional precisa de atenção urgente!'
    }
  }

  const gaugeConfig = getGaugeConfig(scoreOutOf10)

  // Algoritmo Preditivo Consultivo
  const generatePredictiveAnalysis = () => {
    const { test1Score, test2Score, test3Score, maxScore } = results

    // Calcular percentuais de cada teste
    const maxScorePerTest = maxScore / 3
    const test1Percentage = (test1Score / maxScorePerTest) * 100
    const test2Percentage = (test2Score / maxScorePerTest) * 100
    const test3Percentage = (test3Score / maxScorePerTest) * 100

    let analysis = ''
    let actionPlan: string[] = []
    let patterns: string[] = []

    // Análise Geral por Nota
    if (scoreOutOf10 < 3) {
      analysis = `${results.name}, sua nota ${scoreOutOf10.toFixed(1)} indica uma **situação de emergência emocional**. Os padrões identificados estão causando um esgotamento profundo que requer ação imediata. Você está repetindo ciclos destrutivos que drenam sua energia vital e impedem você de experimentar a plenitude que merece no relacionamento.`
    } else if (scoreOutOf10 < 5) {
      analysis = `${results.name}, sua nota ${scoreOutOf10.toFixed(1)} revela que **padrões destrutivos estão instalados** em sua dinâmica emocional. Eles não surgiram do nada – são ecos de experiências não resolvidas que continuam moldando suas escolhas hoje. A boa notícia? Agora que você pode vê-los, pode transformá-los.`
    } else if (scoreOutOf10 < 7) {
      analysis = `${results.name}, sua nota ${scoreOutOf10.toFixed(1)} mostra que você possui **consciência presente, mas padrões ainda ativos**. Você já deu passos importantes no autoconhecimento, mas existem áreas específicas que, quando trabalhadas, podem elevar sua qualidade emocional a um novo patamar.`
    } else if (scoreOutOf10 < 9) {
      analysis = `${results.name}, sua nota ${scoreOutOf10.toFixed(1)} demonstra uma **boa saúde emocional** no relacionamento. Você fez um trabalho significativo de autoconhecimento e ressignificação. Ainda há oportunidades de refinamento que podem transformar "bom" em "excepcional".`
    } else {
      analysis = `${results.name}, sua nota ${scoreOutOf10.toFixed(1)} é **excepcional**! Você alcançou um nível raro de equilíbrio emocional. Conseguiu transformar padrões limitantes em recursos de crescimento. Continue cultivando essa consciência.`
    }

    // Análise Cruzada de Padrões Específicos

    // Padrão 1: Ferida Paterna + Baixa Sexualidade
    if (test1Percentage < 40 && test3Percentage < 40) {
      patterns.push('🎯 **Padrão de Validação Masculina via Sexualidade**: Você possui um padrão inconsciente de buscar validação e aprovação masculina através da performance sexual. Isso é comum em mulheres com feridas paternas não resolvidas – a tentativa de "ganhar" o amor do pai se transfere para o parceiro.')
      actionPlan.push('Trabalhar a separação entre valor pessoal e desempenho sexual')
      actionPlan.push('Ressignificar a relação com a figura paterna')
    }

    // Padrão 2: Mãe baixa + Pai alto
    if (test2Percentage < 30 && test1Percentage > 70) {
      patterns.push('💔 **Padrão de Competição Feminina e Idealização Masculina**: Existe uma tendência de idealizar figuras masculinas enquanto mantém relações competitivas ou conflituosas com mulheres. Isso pode gerar dificuldade em confiar em si mesma e em outras mulheres.')
      actionPlan.push('Reconstruir a relação com o feminino (incluindo o seu próprio)')
      actionPlan.push('Desconstruir a idealização do masculino')
    }

    // Padrão 3: Pai baixo + Mãe baixa
    if (test1Percentage < 35 && test2Percentage < 35) {
      patterns.push('⚠️ **Padrão de Abandono Duplo**: Houve falhas significativas tanto na figura paterna quanto materna. Isso pode gerar um medo profundo de abandono, dificuldade em confiar e uma sensação constante de não ser "suficiente". Você pode oscilar entre dependência extrema e distanciamento emocional.')
      actionPlan.push('Terapia focada em vínculos de apego')
      actionPlan.push('Construir segurança interna (re-parentalização)')
    }

    // Padrão 4: Sexualidade muito baixa
    if (test3Percentage < 25) {
      patterns.push('🚫 **Bloqueio na Sexualidade e Intimidade**: Suas fases psicossexuais apresentam bloqueios significativos. Isso pode se manifestar como dificuldade em sentir prazer, culpa relacionada ao sexo, ou uso da sexualidade de forma compensatória. A intimidade verdadeira assusta.')
      actionPlan.push('Terapia sexual ou somática')
      actionPlan.push('Trabalhar crenças limitantes sobre prazer')
    }

    // Padrão 5: Mãe baixa (isolada)
    if (test2Percentage < 30 && test1Percentage > 40 && test3Percentage > 40) {
      patterns.push('👩 **Dificuldade com Auto-Cuidado e Limites**: A relação com sua mãe deixou marcas na sua capacidade de cuidar de si mesma. Você pode se sacrificar demais, ter dificuldade em dizer "não", ou sentir culpa ao priorizar suas próprias necessidades.')
      actionPlan.push('Praticar auto-compaixão e estabelecimento de limites')
      actionPlan.push('Trabalhar a culpa relacionada ao auto-cuidado')
    }

    // Padrão 6: Todos os testes equilibrados mas abaixo de 60%
    if (test1Percentage < 60 && test2Percentage < 60 && test3Percentage < 60 &&
        Math.abs(test1Percentage - test2Percentage) < 15) {
      patterns.push('🔄 **Padrão Generalizado de Insegurança**: As três áreas apresentam desafios semelhantes, sugerindo uma base de insegurança que permeia todos os aspectos da sua vida emocional e relacional.')
      actionPlan.push('Trabalho profundo de autoestima e autoaceitação')
      actionPlan.push('Identificar crenças centrais limitantes')
    }

    // Identificar qual teste foi o PIOR
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

  const predictiveAnalysis = generatePredictiveAnalysis()

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Teste Para Mulheres Esgotadas no Relacionamento',
        text: `Descobri minha nota de saúde emocional: ${scoreOutOf10.toFixed(1)}/10!`,
        url: window.location.origin
      })
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="w-full py-6 px-4 border-b border-gray-100">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2"
          >
            <HeartIcon className="w-6 h-6 text-pink-500" />
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">Sua Avaliação Completa</h1>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Greeting */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">
              {results.name}, sua nota é:
            </h2>
          </motion.div>

          {/* Termômetro/Gauge 0-10 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
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
                  <span className="text-8xl md:text-9xl font-black">
                    {scoreOutOf10.toFixed(1)}
                  </span>
                  <span className="text-4xl md:text-5xl font-bold opacity-90">/10</span>
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
          {showAnalysis && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                  Pontuação por Área Avaliada
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-purple-50 to-white border-2 border-purple-100 rounded-2xl p-6 text-center">
                    <div className="text-3xl mb-2">👨</div>
                    <p className="text-sm text-gray-600 mb-2 font-medium">Relação Paterna</p>
                    <p className="text-3xl font-bold text-gray-900">{results.test1Score}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {Math.round((results.test1Score / (results.maxScore / 3)) * 100)}%
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-pink-50 to-white border-2 border-pink-100 rounded-2xl p-6 text-center">
                    <div className="text-3xl mb-2">👩</div>
                    <p className="text-sm text-gray-600 mb-2 font-medium">Relação Materna</p>
                    <p className="text-3xl font-bold text-gray-900">{results.test2Score}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {Math.round((results.test2Score / (results.maxScore / 3)) * 100)}%
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-red-50 to-white border-2 border-red-100 rounded-2xl p-6 text-center">
                    <div className="text-3xl mb-2">💕</div>
                    <p className="text-sm text-gray-600 mb-2 font-medium">Sexualidade</p>
                    <p className="text-3xl font-bold text-gray-900">{results.test3Score}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {Math.round((results.test3Score / (results.maxScore / 3)) * 100)}%
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Análise Preditiva */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-3xl p-8 md:p-10 mb-8"
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
                      <div key={index} className="bg-white border-l-4 border-pink-500 rounded-r-xl p-5">
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
                      <div key={index} className="flex items-start gap-3 bg-white rounded-xl p-4 border border-gray-200">
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <p className="text-gray-700 pt-1">{action}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* CTA - Funil de Vendas */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-3xl p-8 md:p-10 text-white text-center mb-8"
              >
                <div className="text-5xl mb-4">🎯</div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  E Agora? Como Transformar Esses Padrões?
                </h3>
                <p className="text-lg md:text-xl mb-6 opacity-95 max-w-2xl mx-auto leading-relaxed">
                  Você acabou de dar o primeiro passo: <span className="font-bold">consciência</span>.<br/>
                  Mas consciência sem ação não transforma.
                </p>
                <button
                  onClick={() => router.push('/oferta-1')}
                  className="w-full bg-white text-pink-600 font-bold py-5 px-8 rounded-xl hover:bg-gray-50 transition-all transform hover:scale-105 inline-flex items-center justify-center gap-3 text-lg shadow-lg mb-4"
                >
                  <SparklesIcon className="w-6 h-6" />
                  VER SOLUÇÃO COMPLETA
                  <ArrowRightIcon className="w-6 h-6" />
                </button>
                <button
                  onClick={() => router.push('/canal-whatsapp')}
                  className="text-white/90 hover:text-white underline text-sm transition-all"
                >
                  Não quero ver ofertas, ir direto para o canal WhatsApp →
                </button>
              </motion.div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => router.push('/')}
                  className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-200 rounded-xl hover:border-pink-500 hover:text-pink-600 transition-colors"
                >
                  <HomeIcon className="w-5 h-5" />
                  Voltar ao Início
                </button>

                <button
                  onClick={handleShare}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  <Share2Icon className="w-5 h-5" />
                  Compartilhar
                </button>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-gray-500">
            © 2026 Teste Para Mulheres Esgotadas. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
