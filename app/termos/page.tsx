'use client'

import { motion } from 'framer-motion'
import { HeartIcon, ArrowLeftIcon } from '@/components/icons'
import { useRouter } from 'next/navigation'

export default function TermosPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="w-full py-4 px-4 border-b border-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 text-gray-600 hover:text-pink-600 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              <span className="font-medium">Voltar</span>
            </button>

            <div className="flex items-center gap-2">
              <HeartIcon className="w-6 h-6 text-pink-500" />
              <h1 className="text-xl font-bold text-gray-800">Transformação Emocional</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 py-12">
        <div className="max-w-4xl mx-auto prose prose-pink">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Termos de Uso e Política de Privacidade</h1>

            <p className="text-sm text-gray-500 mb-8">
              Última atualização: 27 de dezembro de 2024
            </p>

            {/* Introdução */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introdução</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Bem-vinda à plataforma de Avaliação de Saúde Emocional. Ao utilizar nossos serviços, você concorda com os termos descritos neste documento e com nossa Política de Privacidade em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
              </p>
            </section>

            {/* Coleta de Dados */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Coleta e Uso de Dados Pessoais</h2>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">2.1 Dados Coletados</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Coletamos os seguintes dados pessoais:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                <li><strong>Dados de Identificação:</strong> Nome e endereço de e-mail</li>
                <li><strong>Respostas aos Testes:</strong> Suas respostas aos questionários sobre relação paterna, materna e desenvolvimento sexual</li>
                <li><strong>Dados de Pagamento:</strong> Informações de transação processadas pela Kiwify (não armazenamos dados de cartão de crédito)</li>
                <li><strong>Dados de Navegação:</strong> Endereço IP, tipo de dispositivo, navegador e páginas visitadas</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">2.2 Finalidade do Tratamento</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Utilizamos seus dados exclusivamente para:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                <li>Processar sua avaliação psicológica e gerar análise personalizada</li>
                <li>Enviar seus resultados e comunicações relacionadas ao serviço</li>
                <li>Processar pagamentos através da Kiwify</li>
                <li>Melhorar nossos serviços e experiência do usuário</li>
                <li>Cumprir obrigações legais e regulatórias</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">2.3 Base Legal</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                O tratamento dos seus dados se baseia em:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                <li><strong>Consentimento:</strong> Você nos autoriza expressamente ao marcar a caixa de aceitação</li>
                <li><strong>Execução de Contrato:</strong> Necessário para fornecer o serviço contratado</li>
                <li><strong>Legítimo Interesse:</strong> Para melhorias e comunicações relevantes</li>
              </ul>
            </section>

            {/* Compartilhamento */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Compartilhamento de Dados</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Seus dados podem ser compartilhados com:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                <li><strong>Kiwify:</strong> Processamento de pagamentos (conforme política de privacidade deles)</li>
                <li><strong>Supabase:</strong> Armazenamento seguro de dados (servidor na nuvem)</li>
                <li><strong>Prestadores de Serviço:</strong> Apenas quando necessário para operação do serviço</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>Nunca vendemos, alugamos ou comercializamos seus dados pessoais.</strong>
              </p>
            </section>

            {/* Segurança */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Segurança dos Dados</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Implementamos medidas técnicas e organizacionais para proteger seus dados:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                <li>Criptografia de dados em trânsito e em repouso</li>
                <li>Controle de acesso restrito</li>
                <li>Monitoramento contínuo de segurança</li>
                <li>Backups regulares</li>
                <li>Conformidade com padrões de segurança</li>
              </ul>
            </section>

            {/* Direitos do Titular */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Seus Direitos (LGPD)</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                De acordo com a LGPD, você tem direito a:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                <li><strong>Confirmação e Acesso:</strong> Saber se tratamos seus dados e acessá-los</li>
                <li><strong>Correção:</strong> Corrigir dados incompletos, inexatos ou desatualizados</li>
                <li><strong>Anonimização ou Eliminação:</strong> Solicitar a exclusão de dados desnecessários</li>
                <li><strong>Portabilidade:</strong> Receber seus dados em formato estruturado</li>
                <li><strong>Revogação do Consentimento:</strong> Retirar seu consentimento a qualquer momento</li>
                <li><strong>Oposição:</strong> Opor-se ao tratamento em determinadas situações</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mb-4">
                Para exercer seus direitos, entre em contato através do e-mail: <a href="mailto:contato@saudeemocional.com" className="text-pink-600 font-semibold hover:underline">contato@saudeemocional.com</a>
              </p>
            </section>

            {/* Retenção */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Retenção de Dados</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Manteremos seus dados:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                <li>Pelo período necessário para fornecer o serviço contratado</li>
                <li>Por até 5 anos após o término do serviço (obrigações legais)</li>
                <li>Até que você solicite a exclusão (exceto dados que devemos manter por lei)</li>
              </ul>
            </section>

            {/* Cookies */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Cookies e Tecnologias Similares</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Utilizamos cookies essenciais para o funcionamento da plataforma. Você pode gerenciar cookies através das configurações do seu navegador.
              </p>
            </section>

            {/* Menores */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Menores de Idade</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Nossos serviços são destinados a pessoas maiores de 18 anos. Não coletamos intencionalmente dados de menores de idade.
              </p>
            </section>

            {/* Alterações */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Alterações nesta Política</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Podemos atualizar esta política periodicamente. Notificaremos sobre alterações significativas através do e-mail cadastrado.
              </p>
            </section>

            {/* Contato */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contato e Encarregado de Dados</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Para dúvidas, solicitações ou exercício de direitos:
              </p>
              <div className="bg-pink-50 border-l-4 border-pink-500 p-6 rounded-r-lg">
                <p className="text-gray-700"><strong>E-mail:</strong> contato@saudeemocional.com</p>
                <p className="text-gray-700"><strong>Encarregado de Dados (DPO):</strong> privacy@saudeemocional.com</p>
              </div>
            </section>

            {/* Consentimento */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Consentimento</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Ao marcar a caixa de aceite e utilizar nossos serviços, você declara ter lido, compreendido e concordado com todos os termos desta política.
              </p>
            </section>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-gray-500">
            © 2026 Saúde Emocional. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
