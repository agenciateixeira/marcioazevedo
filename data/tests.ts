import { Test } from '@/types'

export const tests: Test[] = [
  {
    id: 1,
    title: 'Teste 1',
    subtitle: 'Perguntas Relacionadas ao Pai',
    description: 'A formação com o seu Pai está refletindo no seu relacionamento de hoje?',
    emoji: '💖',
    questions: [
      {
        id: 1,
        text: 'Quando criança, ao tentar se aproximar do seu pai ou obter sua atenção, você sentia:',
        options: [
          { label: 'a', text: 'Medo porque ele era a figura que estabelecia as regras e limites (Lei Paterna).', score: 1 },
          { label: 'b', text: 'Frustação porque ele era mais preocupado com outras coisas ou estava distante.', score: 2 },
          { label: 'c', text: 'Indiferença porque tinha a competição silenciosa com sua mãe pela atenção dele.', score: 3 },
          { label: 'd', text: 'Uma necessidade de ser "perfeita" para merecer o afeto dele.', score: 2 },
          { label: 'e', text: 'Confiança com facilidade e naturalidade no afeto dele.', score: 5 }
        ]
      },
      {
        id: 2,
        text: 'A maneira como seu pai tratava sua mãe (ou outras parceiras) moldou sua expectativa sobre o tratamento que você deve receber em um relacionamento?',
        options: [
          { label: 'a', text: 'Sim, subconscientemente busco replicar essa dinâmica, seja ela boa ou ruim.', score: 2 },
          { label: 'b', text: 'Não, eu rejeito totalmente esse modelo.', score: 3 },
          { label: 'c', text: 'A dinâmica deles me faz duvidar do conceito de felicidade no casamento.', score: 1 },
          { label: 'd', text: 'Sinto-me atraída por parceiros que se comportam de forma oposta a ele.', score: 3 },
          { label: 'e', text: 'A relação deles era o modelo ideal para mim.', score: 5 }
        ]
      },
      {
        id: 3,
        text: 'Qual foi a principal mensagem que você internalizou do seu pai sobre o papel de uma mulher no mundo e nos relacionamentos?',
        options: [
          { label: 'a', text: 'O valor da mulher está ligado à sua beleza e capacidade de cuidar da casa.', score: 1 },
          { label: 'b', text: 'A mulher deve ser independente e buscar o sucesso profissional.', score: 4 },
          { label: 'c', text: 'As mulheres são emocionais e precisam de proteção masculina (visto como fragilidade).', score: 2 },
          { label: 'd', text: 'O papel feminino é de rivalidade ou submissão (visão distorcida).', score: 1 },
          { label: 'e', text: 'A mulher tem liberdade para ser quem quiser, sem definição de papéis rígidos.', score: 5 }
        ]
      },
      {
        id: 4,
        text: 'Na sua infância, você sentia que precisava competir com sua mãe (ou com outra figura feminina) para obter o afeto ou a atenção do seu pai? (Complexo de Édipo)',
        options: [
          { label: 'a', text: 'Sim, sentia uma competição intensa e a necessidade de ser a \'favorita\'.', score: 1 },
          { label: 'b', text: 'Não, a atenção dele era clara e distinta para cada um.', score: 5 },
          { label: 'c', text: 'Sentia que minha mãe era a barreira para a minha relação com ele.', score: 1 },
          { label: 'd', text: 'Eu me afastava para não causar conflitos ou disputas.', score: 2 },
          { label: 'e', text: 'Ele era uma figura tão ausente que a competição não existia.', score: 2 }
        ]
      },
      {
        id: 5,
        text: 'Como seu pai reagia aos seus momentos de sucesso ou conquista (acadêmica, profissional, pessoal)?',
        options: [
          { label: 'a', text: 'Com indiferença, ou como se fosse apenas minha obrigação.', score: 1 },
          { label: 'b', text: 'Com elogios exagerados, que me pareciam superficiais.', score: 2 },
          { label: 'c', text: 'Com orgulho e reconhecimento genuíno, mas sem excessos.', score: 5 },
          { label: 'd', text: 'Com críticas, sempre apontando o que faltava.', score: 1 },
          { label: 'e', text: 'Ele só notava se o sucesso refletisse positivamente na imagem dele.', score: 1 }
        ]
      },
      {
        id: 6,
        text: 'Você busca inconscientemente parceiros que possuem as qualidades que você mais admirava no seu pai? (Idealização)',
        options: [
          { label: 'a', text: 'Sim, busco a replicação exata (seja boa ou ruim) do modelo paterno.', score: 2 },
          { label: 'b', text: 'Eu busco conscientemente o oposto dele para evitar repetir erros.', score: 3 },
          { label: 'c', text: 'Não, mas acabo sempre atraindo o mesmo tipo de personalidade.', score: 2 },
          { label: 'd', text: 'Busco apenas a estabilidade financeira ou o poder que ele representava.', score: 2 },
          { label: 'e', text: 'Busco parceiros que me ofereçam a validação que ele nunca deu.', score: 1 }
        ]
      },
      {
        id: 7,
        text: 'A ausência de limites ou a rigidez excessiva imposta pelo seu pai afetou sua capacidade de estabelecer limites saudáveis em seus relacionamentos atuais?',
        options: [
          { label: 'a', text: 'Sim, tenho grande dificuldade em dizer \'não\' (falha na Lei Paterna).', score: 1 },
          { label: 'b', text: 'Sim, sou excessivamente rígida e controladora com meu parceiro.', score: 2 },
          { label: 'c', text: 'Não, consegui desenvolver limites equilibrados independentemente dele.', score: 5 },
          { label: 'd', text: 'Os limites dele eram tão confusos que hoje tenho medo de confrontos.', score: 1 },
          { label: 'e', text: 'Eu só respeito limites se vierem de uma figura de autoridade.', score: 2 }
        ]
      },
      {
        id: 8,
        text: 'Quando seu pai te repreendia ou punia, qual era o sentimento dominante que ele te transmitia?',
        options: [
          { label: 'a', text: 'Medo e a sensação de que eu era fundamentalmente errada.', score: 1 },
          { label: 'b', text: 'Entendimento de que a punição era justa, sem desamor.', score: 5 },
          { label: 'c', text: 'Raiva e ressentimento pela injustiça.', score: 2 },
          { label: 'd', text: 'Indiferença, como se eu fosse um peso para ele.', score: 1 },
          { label: 'e', text: 'Culpa, fazendo-me sentir responsável pelo sofrimento dele.', score: 1 }
        ]
      },
      {
        id: 9,
        text: 'Em relação ao dinheiro e à estabilidade material, o modelo financeiro do seu pai influencia sua escolha de parceiro?',
        options: [
          { label: 'a', text: 'Sim, a segurança financeira é o fator mais importante (projeção do provedor).', score: 2 },
          { label: 'b', text: 'Não, prefiro parceiros com pouco dinheiro para não depender deles.', score: 2 },
          { label: 'c', text: 'A falta de estabilidade dele me causa ansiedade e medo de escassez.', score: 1 },
          { label: 'd', text: 'O dinheiro nunca foi um fator relevante na minha vida.', score: 4 },
          { label: 'e', text: 'Busco um parceiro que gaste como ele gastava (extravagância ou avareza).', score: 2 }
        ]
      },
      {
        id: 10,
        text: 'Quando o seu pai teve momentos de fragilidade (doença, fracasso), como você reagiu?',
        options: [
          { label: 'a', text: 'Senti-me perdida e sem chão, como se o mundo fosse acabar.', score: 1 },
          { label: 'b', text: 'Assumi o papel de cuidadora ou de "chefe" da casa imediatamente.', score: 2 },
          { label: 'c', text: 'Isso me deu uma sensação de liberdade e alívio por ele estar vulnerável.', score: 2 },
          { label: 'd', text: 'Reagi com indiferença, pois ele sempre foi emocionalmente ausente.', score: 1 },
          { label: 'e', text: 'Senti pena dele, mas sem alterar minha percepção de sua autoridade.', score: 4 }
        ]
      },
      {
        id: 11,
        text: 'Você sente que a maneira como seu pai via o sexo ou a intimidade influenciou a sua relação com a sua própria sexualidade?',
        options: [
          { label: 'a', text: 'Sim, sinto vergonha ou repressão por causa dos tabus que ele impunha.', score: 1 },
          { label: 'b', text: 'Sim, busco a sexualidade como uma forma de rebeldia contra o que ele ensinou.', score: 2 },
          { label: 'c', text: 'A visão dele era natural e permitiu que eu tivesse uma sexualidade saudável.', score: 5 },
          { label: 'd', text: 'Ele tratava o sexo como algo sujo, o que me causa repulsa no relacionamento.', score: 1 },
          { label: 'e', text: 'A sexualidade dele era tão evidente que me causava medo ou nojo.', score: 1 }
        ]
      },
      {
        id: 12,
        text: 'Na presença do seu pai, você costumava sentir que precisava diminuir a si mesma (sua inteligência, seu brilho) para não ofuscá-lo?',
        options: [
          { label: 'a', text: 'Sim, para ser aceita e não ser vista como ameaça.', score: 1 },
          { label: 'b', text: 'Não, ele sempre me incentivou a ser ambiciosa e a brilhar.', score: 5 },
          { label: 'c', text: 'A competição era evidente, mas eu lutava para superá-lo.', score: 2 },
          { label: 'd', text: 'Eu sequer tentava me destacar, pois sabia que ele não notaria.', score: 1 },
          { label: 'e', text: 'Eu só me sentia segura se ele me validasse primeiro.', score: 1 }
        ]
      },
      {
        id: 13,
        text: 'Você já sentiu ou sente atração por homens muito mais velhos, que poderiam, simbolicamente, representar a figura paterna protetora?',
        options: [
          { label: 'a', text: 'Sim, tenho uma clara atração por homens maduros e poderosos.', score: 2 },
          { label: 'b', text: 'Não, busco homens da minha idade ou mais jovens.', score: 4 },
          { label: 'c', text: 'Busco homens emocionalmente imaturos para poder controlá-los.', score: 1 },
          { label: 'd', text: 'A idade não importa, apenas a capacidade de me dar o que quero.', score: 2 },
          { label: 'e', text: 'Já tive atração, mas sinto medo de intimidade com eles.', score: 2 }
        ]
      },
      {
        id: 14,
        text: 'A forma como seu pai lidava com o estresse ou a raiva (explodindo, se isolando, negando) é replicada por você ou seu parceiro em momentos de conflito?',
        options: [
          { label: 'a', text: 'Sim, eu ou meu parceiro replicamos o mesmo padrão de raiva explosiva.', score: 1 },
          { label: 'b', text: 'Sim, replicamos o isolamento e o silêncio (punição passiva).', score: 1 },
          { label: 'c', text: 'Tentamos lidar de maneira aberta e construtiva, buscando o diálogo.', score: 5 },
          { label: 'd', text: 'Meu parceiro foge de qualquer confronto, como meu pai fazia.', score: 2 },
          { label: 'e', text: 'Eu reprimo minha raiva até o ponto de adoecer, como ele fazia.', score: 1 }
        ]
      },
      {
        id: 15,
        text: 'Seu pai era crítico, essa crítica ainda ressoa em sua mente como uma voz interna (Superego) que sabota seus relacionamentos?',
        options: [
          { label: 'a', text: 'Constantemente, sou minha maior crítica e saboto minha felicidade.', score: 1 },
          { label: 'b', text: 'Raramente, consegui silenciar essa voz ao longo dos anos.', score: 5 },
          { label: 'c', text: 'Sim, mas a voz se manifesta como medo de ser abandonada.', score: 1 },
          { label: 'd', text: 'Meu parceiro é quem projeta a crítica dele sobre mim.', score: 2 },
          { label: 'e', text: 'Eu me tornei a crítica implacável dos outros, não de mim mesma.', score: 2 }
        ]
      },
      {
        id: 16,
        text: 'O que representava o maior "ideal" ou o que seu pai mais valorizava (trabalho, moral, honra, dinheiro)?',
        options: [
          { label: 'a', text: 'O sucesso profissional e a posição social.', score: 3 },
          { label: 'b', text: 'A moralidade rígida e o controle das emoções.', score: 2 },
          { label: 'c', text: 'A honra e a integridade acima de tudo.', score: 4 },
          { label: 'd', text: 'O dinheiro e a aquisição de bens materiais.', score: 2 },
          { label: 'e', text: 'O afeto e a conexão familiar.', score: 5 }
        ]
      },
      {
        id: 17,
        text: 'Você sente que a sua escolha de parceiro (ou a ausência dele) é uma forma de rebelião ou de aprovação do seu pai, mesmo que ele não esteja presente?',
        options: [
          { label: 'a', text: 'É uma rebelião inconsciente; escolho parceiros que ele odiaria.', score: 2 },
          { label: 'b', text: 'É uma busca por aprovação; escolho parceiros que ele admiraria.', score: 2 },
          { label: 'c', text: 'Não, minha escolha é baseada em meus próprios desejos e necessidades.', score: 5 },
          { label: 'd', text: 'Eu não consigo me comprometer por medo do julgamento paterno.', score: 1 },
          { label: 'e', text: 'Busco parceiros que me ajudem a confrontar a imagem dele.', score: 3 }
        ]
      },
      {
        id: 18,
        text: 'Em um momento de crise pessoal, qual era o tipo de conselho ou solução que seu pai geralmente oferecia?',
        options: [
          { label: 'a', text: 'Um conselho frio e racional, sem espaço para emoções.', score: 2 },
          { label: 'b', text: 'Um conselho de "se virar sozinha", sem ajuda.', score: 1 },
          { label: 'c', text: 'Ele tentava resolver o problema com dinheiro ou poder.', score: 2 },
          { label: 'd', text: 'Um acolhimento empático, oferecendo ajuda emocional.', score: 5 },
          { label: 'e', text: 'Ele me culpava ou minimizava a minha crise.', score: 1 }
        ]
      },
      {
        id: 19,
        text: 'Você idealiza a figura paterna, acreditando que ele era perfeito, mesmo diante de evidências de falhas ou erros? (Mecanismo de Defesa)',
        options: [
          { label: 'a', text: 'Sim, ele é meu herói, e eu nego qualquer erro dele.', score: 1 },
          { label: 'b', text: 'Não, reconheço suas falhas, o que me permite ter relacionamentos mais realistas.', score: 5 },
          { label: 'c', text: 'Eu supervalorizo as qualidades dele para compensar a ausência.', score: 1 },
          { label: 'd', text: 'Eu o desvalorizo completamente para justificar meus problemas.', score: 2 },
          { label: 'e', text: 'Eu o vejo em dualidade: perfeito em um aspecto, falho em outro.', score: 4 }
        ]
      },
      {
        id: 20,
        text: 'Você já se sentiu atraída por homens casados ou emocionalmente indisponíveis? (Busca pela figura proibida/Complexo de Édipo não resolvido)',
        options: [
          { label: 'a', text: 'Sim, a indisponibilidade ou a proibição aumenta meu interesse.', score: 1 },
          { label: 'b', text: 'Não, busco homens totalmente disponíveis e claros em suas intenções.', score: 5 },
          { label: 'c', text: 'Isso é uma atração esporádica, mas não um padrão.', score: 3 },
          { label: 'd', text: 'Eu me sinto atraída por quem se afasta de mim (busca por rejeição paterna).', score: 1 },
          { label: 'e', text: 'Eu atraio homens indisponíveis, mas não os desejo.', score: 2 }
        ]
      },
      {
        id: 21,
        text: 'A maneira como seu pai via a honestidade e a verdade moldou sua capacidade de ser transparente e de confiar no seu parceiro?',
        options: [
          { label: 'a', text: 'Sim, sou desconfiada, pois ele mentia ou era evasivo.', score: 1 },
          { label: 'b', text: 'Sim, sou excessivamente transparente, o que assusta meu parceiro.', score: 3 },
          { label: 'c', text: 'Não, a transparência e a confiança são valores inegociáveis para mim.', score: 5 },
          { label: 'd', text: 'Eu uso a mentira como defesa, como ele fazia para evitar conflitos.', score: 1 },
          { label: 'e', text: 'Eu exijo uma transparência total do meu parceiro, que considero opressiva.', score: 2 }
        ]
      }
    ]
  },
  {
    id: 2,
    title: 'Teste 2',
    subtitle: 'Perguntas Relacionadas à Mãe',
    description: 'A formação com a sua Mãe está refletindo no seu relacionamento de hoje?',
    emoji: '💖',
    questions: [
      {
        id: 1,
        text: 'Como você descreveria a sua sensação de \'segurança\' ou \'conforto\' emocional proporcionada pela sua mãe na primeira infância?',
        options: [
          { label: 'a', text: 'Era absoluta e incondicional (relação simbiótica).', score: 5 },
          { label: 'b', text: 'Era presente, mas condicionada ao meu bom comportamento.', score: 3 },
          { label: 'c', text: 'Era inconsistente; ora presente, ora ausente.', score: 1 },
          { label: 'd', text: 'Eu me sentia sufocada ou superprotegida.', score: 2 },
          { label: 'e', text: 'Eu me sentia emocionalmente abandonada ou negligenciada.', score: 1 }
        ]
      },
      {
        id: 2,
        text: 'A sua capacidade de expressar vulnerabilidade e carência no seu relacionamento atual se assemelha a forma como você expressava para sua mãe?',
        options: [
          { label: 'a', text: 'Sim, sinto dificuldade em depender ou expressar carência.', score: 1 },
          { label: 'b', text: 'Não, mas busco que meu parceiro supra todas as minhas necessidades (idealização materna).', score: 2 },
          { label: 'c', text: 'Sim, eu me sinto à vontade para ser vulnerável e acolhida.', score: 5 },
          { label: 'd', text: 'Eu me sinto culpada ou envergonhada ao demonstrar fraqueza.', score: 1 },
          { label: 'e', text: 'Eu exijo que meu parceiro adivinhe e supra minhas necessidades sem eu precisar pedir.', score: 1 }
        ]
      },
      {
        id: 3,
        text: 'O que era exigido de você para "merecer" a aprovação ou o amor da sua mãe?',
        options: [
          { label: 'a', text: 'Ser bem-sucedida ou a melhor em algo.', score: 2 },
          { label: 'b', text: 'Obediência total e silêncio.', score: 1 },
          { label: 'c', text: 'Apenas existir (amor incondicional).', score: 5 },
          { label: 'd', text: 'Que eu não a incomodasse ou não tivesse problemas.', score: 1 },
          { label: 'e', text: 'Assumir responsabilidades ou o papel de "mãe" para ela (parentificação).', score: 1 }
        ]
      },
      {
        id: 4,
        text: 'A percepção que você tem de si mesma como mulher (sua feminilidade, seu corpo) é fortemente influenciada pela forma como sua mãe vivia a feminilidade dela?',
        options: [
          { label: 'a', text: 'Sim, e eu tento seguir esse padrão.', score: 3 },
          { label: 'b', text: 'Sim, e eu luto ativamente para ser o oposto.', score: 2 },
          { label: 'c', text: 'Não, minha autoimagem é completamente independente dela.', score: 5 },
          { label: 'd', text: 'A forma como ela vivia me gera culpa ou vergonha da minha própria sexualidade.', score: 1 },
          { label: 'e', text: 'Eu replico o comportamento dela em relação a outros homens (parceiros).', score: 2 }
        ]
      },
      {
        id: 5,
        text: 'Você sente que, no seu relacionamento atual, você busca que seu parceiro preencha um "vazio" emocional que sua mãe deixou?',
        options: [
          { label: 'a', text: 'Sim, a dependência emocional é altíssima e me sinto incompleta sem ele.', score: 1 },
          { label: 'b', text: 'Não, sou excessivamente autossuficiente e rejeito a dependência.', score: 3 },
          { label: 'c', text: 'Eu busco parceiros que me acalmem e me validem constantemente.', score: 1 },
          { label: 'd', text: 'Meu parceiro reclama que eu o sufoco ou exijo demais.', score: 1 },
          { label: 'e', text: 'Busco amigos e outras relações para preencher esse vazio, não o parceiro.', score: 4 }
        ]
      },
      {
        id: 6,
        text: 'Como sua mãe lidava com a dor, o luto ou as emoções negativas (dela ou suas)?',
        options: [
          { label: 'a', text: 'Reprimia tudo e fingia que nada acontecia (negação).', score: 1 },
          { label: 'b', text: 'Expressava de forma dramática e descontrolada.', score: 2 },
          { label: 'c', text: 'Acolhia e ajudava a processar as emoções de forma saudável.', score: 5 },
          { label: 'd', text: 'Ela me culpava ou me fazia sentir responsável pela dor dela.', score: 1 },
          { label: 'e', text: 'Ela usava a dor como forma de manipulação e controle.', score: 1 }
        ]
      },
      {
        id: 7,
        text: 'Você tem dificuldade em se separar ou em finalizar relacionamentos (ou fases da vida), ligada à dificuldade de separação da figura materna? (Individualização)',
        options: [
          { label: 'a', text: 'Sim, a ideia de separação (física ou emocional) me causa pânico ou terror.', score: 1 },
          { label: 'b', text: 'Não, eu me separo com muita facilidade, muitas vezes de forma fria.', score: 3 },
          { label: 'c', text: 'A separação é dolorosa, mas reconheço sua necessidade e lido bem.', score: 5 },
          { label: 'd', text: 'Eu saboto o relacionamento para que o parceiro tome a decisão de se separar.', score: 1 },
          { label: 'e', text: 'Eu só me sinto livre quando estou solteira, longe de laços fortes.', score: 2 }
        ]
      },
      {
        id: 8,
        text: 'Qual era a reação da sua mãe quando você expressava raiva ou frustração na infância?',
        options: [
          { label: 'a', text: 'Era punida, silenciada ou ignorada.', score: 1 },
          { label: 'b', text: 'Era recebida com raiva maior e confronto.', score: 1 },
          { label: 'c', text: 'Ela me ajudava a nomear e expressar a emoção de forma construtiva.', score: 5 },
          { label: 'd', text: 'Ela chorava e me fazia sentir culpada pela tristeza dela.', score: 1 },
          { label: 'e', text: 'Ela tentava me distrair com comida ou presentes (evitação).', score: 2 }
        ]
      },
      {
        id: 9,
        text: 'Você acredita que sua mãe sentia ciúmes ou rivalidade pela sua beleza, seu sucesso ou sua relação com seu pai?',
        options: [
          { label: 'a', text: 'Sim, a rivalidade feminina entre nós era clara e constante.', score: 1 },
          { label: 'b', text: 'Não, ela sempre me apoiou e foi minha maior incentivadora.', score: 5 },
          { label: 'c', text: 'Ela sentia ciúmes, mas tentava disfarçar com superproteção.', score: 1 },
          { label: 'd', text: 'Eu sentia inveja dela, mas não o contrário.', score: 2 },
          { label: 'e', text: 'Ela me usava como extensão para viver as ambições que ela não realizou.', score: 1 }
        ]
      },
      {
        id: 10,
        text: 'Sua capacidade de cuidar de si mesma (saúde, necessidades, auto-estima) é uma réplica ou uma reação ao autocuidado de sua mãe?',
        options: [
          { label: 'a', text: 'Sou negligente comigo mesma, como ela era.', score: 1 },
          { label: 'b', text: 'Sou obsessivamente focada em autocuidado e beleza, como reação à negligência dela.', score: 2 },
          { label: 'c', text: 'Ela era um modelo de autocuidado equilibrado.', score: 5 },
          { label: 'd', text: 'Eu cuido obsessivamente dos outros (parceiro, filhos) para evitar cuidar de mim.', score: 1 },
          { label: 'e', text: 'Eu só me sinto bem quando recebo atenção e validação externa.', score: 1 }
        ]
      },
      {
        id: 11,
        text: 'Como sua mãe lidava com a intimidade física (abraços, toques, carinho) na infância?',
        options: [
          { label: 'a', text: 'Era excessiva e sufocante.', score: 2 },
          { label: 'b', text: 'Era fria, rara e distante.', score: 1 },
          { label: 'c', text: 'Era natural e aconchegante, na medida certa.', score: 5 },
          { label: 'd', text: 'Era condicionada a uma troca (só recebia carinho se fizesse algo).', score: 1 },
          { label: 'e', text: 'Eu evitava o toque dela, pois me sentia invadida.', score: 1 }
        ]
      },
      {
        id: 12,
        text: 'Em seu relacionamento atual, você tende a assumir o papel de "mãe" (cuidando em excesso, controlando, aconselhando) em relação ao seu parceiro?',
        options: [
          { label: 'a', text: 'Sim, sou a cuidadora principal e sinto necessidade de controlar tudo.', score: 1 },
          { label: 'b', text: 'Não, meu parceiro que assume o papel de me "maternar".', score: 2 },
          { label: 'c', text: 'Busco uma parceria onde o cuidado é mútuo e equilibrado.', score: 5 },
          { label: 'd', text: 'Eu me ressinto por ter que cuidar dele, mas sinto que é minha obrigação.', score: 1 },
          { label: 'e', text: 'Eu busco parceiros irresponsáveis para poder "salvá-los".', score: 1 }
        ]
      },
      {
        id: 13,
        text: 'A maneira como sua mãe lidava com a infidelidade ou as falhas do parceiro dela moldou sua tolerância a comportamentos inaceitáveis no seu relacionamento?',
        options: [
          { label: 'a', text: 'Sim, tolero o intolerável, como ela fazia.', score: 1 },
          { label: 'b', text: 'Não, sou extremamente intolerante e não perdoo falhas.', score: 3 },
          { label: 'c', text: 'Busco a comunicação e o entendimento antes de tomar decisões drásticas.', score: 5 },
          { label: 'd', text: 'Eu nego as falhas do meu parceiro para manter a ilusão de estabilidade.', score: 1 },
          { label: 'e', text: 'Eu sou infiel ou crio falhas para forçar o fim da relação.', score: 1 }
        ]
      },
      {
        id: 14,
        text: 'Você sente que a visão de casamento ou união da sua mãe (feliz, infeliz, obrigatória) é o "roteiro" inconsciente do seu relacionamento?',
        options: [
          { label: 'a', text: 'Sim, estou repetindo o padrão de infelicidade ou resignação.', score: 1 },
          { label: 'b', text: 'Sim, busco a todo custo replicar a felicidade dela.', score: 3 },
          { label: 'c', text: 'Estou determinada a quebrar esse roteiro, não importa o custo.', score: 3 },
          { label: 'd', text: 'A visão dela me fez ter medo de qualquer compromisso sério.', score: 1 },
          { label: 'e', text: 'Eu nego a importância do casamento ou da união estável.', score: 2 }
        ]
      },
      {
        id: 15,
        text: 'Ao pedir algo ou expressar uma necessidade, você espera que a resposta do seu parceiro seja imediata e total, como se ele devesse "adivinhar" o que você precisa? (Idealização da Mãe Onipotente)',
        options: [
          { label: 'a', text: 'Sim, tenho expectativas irrealistas e me frustro facilmente.', score: 1 },
          { label: 'b', text: 'Não, eu comunico minhas necessidades de forma clara e assertiva.', score: 5 },
          { label: 'c', text: 'Eu guardo as necessidades até o ponto de explodir de raiva.', score: 1 },
          { label: 'd', text: 'Tenho medo de pedir e ser rejeitada.', score: 1 },
          { label: 'e', text: 'Eu prefiro conseguir as coisas sozinha para não dever nada a ninguém.', score: 2 }
        ]
      },
      {
        id: 16,
        text: 'A maneira como sua mãe lidava com a organização e a limpeza influenciou a forma como você administra o seu espaço e a sua vida?',
        options: [
          { label: 'a', text: 'Sou extremamente metódica e controladora com meu ambiente.', score: 3 },
          { label: 'b', text: 'Sou desorganizada e negligente com o meu espaço.', score: 1 },
          { label: 'c', text: 'Tenho um equilíbrio entre organização e flexibilidade.', score: 5 },
          { label: 'd', text: 'Eu projeto minha desorganização e espero que o parceiro a resolva.', score: 1 },
          { label: 'e', text: 'Eu só me sinto bem em ambientes estéreis e controlados.', score: 2 }
        ]
      },
      {
        id: 17,
        text: 'Você sente que seu relacionamento atual é um constante "teste" para ver se você será abandonada ou rejeitada, refletindo um medo da infância?',
        options: [
          { label: 'a', text: 'Sim, eu provoco o parceiro ou crio crises para testar sua lealdade.', score: 1 },
          { label: 'b', text: 'Sim, vivo com um medo constante de ser abandonada.', score: 1 },
          { label: 'c', text: 'Não, minha confiança no parceiro e na relação é sólida.', score: 5 },
          { label: 'd', text: 'Eu evito a intimidade para não ter que lidar com a dor da perda.', score: 1 },
          { label: 'e', text: 'Eu abandono primeiro para não ser abandonada.', score: 1 }
        ]
      },
      {
        id: 18,
        text: 'Qual era o sentimento dominante quando sua mãe passava tempo com outras pessoas ou não estava totalmente focada em você? (Ciúmes da Criança)',
        options: [
          { label: 'a', text: 'Ciúmes intenso e ressentimento.', score: 1 },
          { label: 'b', text: 'Indiferença, eu estava acostumada a brincar sozinha.', score: 3 },
          { label: 'c', text: 'Eu me sentia livre para explorar e me divertir.', score: 5 },
          { label: 'd', text: 'Eu tentava chamar a atenção dela de forma negativa.', score: 1 },
          { label: 'e', text: 'Eu me isolava ou ia para o lado do meu pai.', score: 2 }
        ]
      },
      {
        id: 19,
        text: 'Você tende a idealizar o parceiro no início do relacionamento, e depois desvalorizá-lo assim que ele demonstra falhas humanas? (Mecanismo de Cisão)',
        options: [
          { label: 'a', text: 'Sim, sou "8 ou 80"; eles são perfeitos ou totalmente ruins.', score: 1 },
          { label: 'b', text: 'Não, reconheço a complexidade e as falhas humanas desde o início.', score: 5 },
          { label: 'c', text: 'Eu só vejo as falhas deles, o que justifica minha insatisfação.', score: 1 },
          { label: 'd', text: 'Eu nego as falhas por medo de perder a imagem idealizada.', score: 1 },
          { label: 'e', text: 'Eu idealizo a relação, mas não o parceiro.', score: 3 }
        ]
      },
      {
        id: 20,
        text: 'Como sua mãe reagia aos seus medos e ansiedades infantis?',
        options: [
          { label: 'a', text: 'Minimizava e mandava eu parar de bobagem.', score: 1 },
          { label: 'b', text: 'Acolhia e ajudava a me acalmar de forma amorosa.', score: 5 },
          { label: 'c', text: 'Aumentava a minha ansiedade com o pânico dela.', score: 1 },
          { label: 'd', text: 'Ignorava ou ficava irritada com a minha fraqueza.', score: 1 },
          { label: 'e', text: 'Usava meus medos para me manter perto e controlada.', score: 1 }
        ]
      },
      {
        id: 21,
        text: 'A sua necessidade de agradar o seu parceiro a todo custo, mesmo negligenciando suas próprias necessidades, reflete a busca pela aprovação materna?',
        options: [
          { label: 'a', text: 'Sim, a aprovação dele é vital, e eu me anulo por ela.', score: 1 },
          { label: 'b', text: 'Não, priorizo minhas necessidades e sou autêntica.', score: 5 },
          { label: 'c', text: 'Eu sou muito exigente e espero que ele me agrade.', score: 2 },
          { label: 'd', text: 'Eu só me sinto amada se estiver servindo ou sendo útil.', score: 1 },
          { label: 'e', text: 'Eu me rebelo contra qualquer expectativa de agradar.', score: 3 }
        ]
      }
    ]
  },
  {
    id: 3,
    title: 'Teste 3',
    subtitle: 'Perguntas Relacionadas à Sexualidade',
    description: 'Como as fases psicossexuais influenciam sua intimidade e relacionamento?',
    emoji: '💖',
    questions: [
      {
        id: 1,
        text: 'Em momentos de estresse ou necessidade de conforto, você tende a buscar alívio através de atividades que envolvem a boca (comer em excesso, fumar, roer unhas)? (Fixação Oral)',
        options: [
          { label: 'a', text: 'Constantemente, é minha principal forma de alívio.', score: 1 },
          { label: 'b', text: 'Sim, mas de forma controlada.', score: 3 },
          { label: 'c', text: 'Não, busco outros tipos de distração.', score: 5 },
          { label: 'd', text: 'Recorro a isso apenas em situações extremas.', score: 4 },
          { label: 'e', text: 'Raramente, meu foco é no controle.', score: 4 }
        ]
      },
      {
        id: 2,
        text: 'Qual é a sua atitude predominante em relação à organização, ao controle e à economia em seu relacionamento?',
        options: [
          { label: 'a', text: 'Sou extremamente controladora, metódica e avessa a "bagunça".', score: 2 },
          { label: 'b', text: 'Sou relaxada, desorganizada e tenho dificuldade em poupar.', score: 2 },
          { label: 'c', text: 'Sou equilibrada; busco organização, mas não sou obsessiva.', score: 5 },
          { label: 'd', text: 'Meu parceiro me acusa de ser avarenta ou teimosa.', score: 1 },
          { label: 'e', text: 'Sinto que o controle do meu parceiro me sufoca.', score: 2 }
        ]
      },
      {
        id: 3,
        text: 'Você sente que a satisfação sexual no seu relacionamento é frequentemente impedida por um sentimento de culpa ou medo de "ir longe demais"? (Repressão Fálica/Genital)',
        options: [
          { label: 'a', text: 'Sim, a culpa é uma constante que limita meu prazer.', score: 1 },
          { label: 'b', text: 'Apenas quando o prazer é muito intenso ou "proibido".', score: 2 },
          { label: 'c', text: 'Não, sinto-me livre para expressar minha sexualidade.', score: 5 },
          { label: 'd', text: 'A culpa existe, mas é mais ligada ao meu parceiro do que a mim.', score: 2 },
          { label: 'e', text: 'Meu foco é mais na performance do que no prazer.', score: 2 }
        ]
      },
      {
        id: 4,
        text: 'O seu relacionamento atual tem uma tendência a repetir padrões de relações passadas onde você se sente constantemente desvalorizada ou negligenciada? (Compulsão à Repetição)',
        options: [
          { label: 'a', text: 'Sim, parece que sempre escolho o mesmo tipo de parceiro "traumático".', score: 1 },
          { label: 'b', text: 'Às vezes, mas consigo romper o padrão antes que seja tarde.', score: 3 },
          { label: 'c', text: 'Não, eu me esforcei para escolher um parceiro completamente diferente dos anteriores.', score: 5 },
          { label: 'd', text: 'Eu sou quem tende a negligenciar ou desvalorizar o parceiro.', score: 2 },
          { label: 'e', text: 'A repetição do padrão é inconsciente, mas me gera sofrimento.', score: 1 }
        ]
      },
      {
        id: 5,
        text: 'Você costuma ter dificuldade em ceder o controle ou em ser totalmente passiva e submissa ao prazer durante a intimidade sexual? (Fixação Anal ou Fálica)',
        options: [
          { label: 'a', text: 'Sim, preciso estar no controle da situação ou me sinto insegura.', score: 2 },
          { label: 'b', text: 'Não, a entrega e a passividade são naturais para mim.', score: 5 },
          { label: 'c', text: 'Eu alterno entre o desejo de controlar e o desejo de ser dominada.', score: 3 },
          { label: 'd', text: 'Uso o sexo como uma forma de obter poder ou compensação.', score: 1 },
          { label: 'e', text: 'A resistência ao controle se manifesta em outras áreas do relacionamento.', score: 2 }
        ]
      },
      {
        id: 6,
        text: 'Quando você busca reconhecimento ou sucesso no trabalho/vida social, esse impulso é movido por uma necessidade de compensar uma sensação de inferioridade ou "falta"? (Simbolismo da Inveja do Pênis)',
        options: [
          { label: 'a', text: 'Sim, o sucesso é a minha forma de provar meu valor e minha "completude".', score: 2 },
          { label: 'b', text: 'Não, é um desejo saudável de realização pessoal.', score: 5 },
          { label: 'c', text: 'Eu me sinto mais poderosa se estiver com um parceiro bem-sucedido (projeção).', score: 2 },
          { label: 'd', text: 'O sucesso me causa ansiedade, pois atrai inveja e rivalidade.', score: 1 },
          { label: 'e', text: 'Eu saboto meu próprio sucesso por medo da castração simbólica (perda).', score: 1 }
        ]
      },
      {
        id: 7,
        text: 'Você já sentiu atração por pessoas que claramente representam o "proibido" ou o "inacessível", mesmo que isso cause sofrimento? (Tabu do Incesto e Repressão)',
        options: [
          { label: 'a', text: 'Sim, a atração pelo proibido é um padrão constante.', score: 1 },
          { label: 'b', text: 'Não, sou atraída por pessoas acessíveis e disponíveis.', score: 5 },
          { label: 'c', text: 'A atração é pelo inacessível, mas por medo da intimidade real.', score: 1 },
          { label: 'd', text: 'Eu fujo de quem se interessa por mim de forma fácil e direta.', score: 1 },
          { label: 'e', text: 'Meu interesse desaparece assim que a pessoa demonstra vulnerabilidade.', score: 1 }
        ]
      },
      {
        id: 8,
        text: 'Sua capacidade de experimentar prazer sexual pleno e orgasmo é frequentemente interrompida por pensamentos intrusivos ou preocupações?',
        options: [
          { label: 'a', text: 'Sim, minha mente está sempre cheia de julgamentos ou análises.', score: 1 },
          { label: 'b', text: 'Não, consigo me entregar completamente ao momento.', score: 5 },
          { label: 'c', text: 'A interrupção ocorre por medo de perder o controle.', score: 1 },
          { label: 'd', text: 'A intimidade física é mais confortável que a emocional.', score: 2 },
          { label: 'e', text: 'Sinto que o prazer é algo que eu preciso "merecer".', score: 1 }
        ]
      },
      {
        id: 9,
        text: 'Você tende a transferir sentimentos e expectativas não resolvidas de seus pais para o seu parceiro atual? (Transferência)',
        options: [
          { label: 'a', text: 'Constantemente, e percebo que reajo a ele como se fosse meu pai/mãe.', score: 1 },
          { label: 'b', text: 'Apenas em momentos de grande estresse ou conflito.', score: 3 },
          { label: 'c', text: 'Não, eu sou consciente dessa tendência e a evito.', score: 5 },
          { label: 'd', text: 'Meu parceiro projeta os problemas dele em mim.', score: 2 },
          { label: 'e', text: 'Eu busco conscientemente parceiros que sejam totalmente diferentes dos meus pais.', score: 4 }
        ]
      },
      {
        id: 10,
        text: 'Sua sexualidade (libido) é predominantemente direcionada para o afeto e a ternura (sexualidade inibida) ou para a satisfação puramente física (sexualidade genitalizada)?',
        options: [
          { label: 'a', text: 'É totalmente separada; afeto e sexo são coisas distintas.', score: 2 },
          { label: 'b', text: 'Busco a união equilibrada de afeto e desejo físico.', score: 5 },
          { label: 'c', text: 'O afeto é mais importante; o sexo é um dever ou uma formalidade.', score: 2 },
          { label: 'd', text: 'O foco é apenas no prazer físico e na intensidade.', score: 2 },
          { label: 'e', text: 'Sinto dificuldade em expressar o desejo e a ternura ao mesmo tempo.', score: 1 }
        ]
      },
      {
        id: 11,
        text: 'Qual é a sua reação mais comum quando seu parceiro mostra fraqueza ou dependência emocional?',
        options: [
          { label: 'a', text: 'Sinto repulsa e me afasto emocionalmente.', score: 1 },
          { label: 'b', text: 'Assumo o papel de força e me sinto poderosa.', score: 2 },
          { label: 'c', text: 'Sinto empatia e dou apoio, incentivando a autonomia dele.', score: 5 },
          { label: 'd', text: 'Entro em pânico, pois também preciso de apoio e me sinto sobrecarregada.', score: 1 },
          { label: 'e', text: 'Uso a fraqueza dele como forma de controle e manipulação.', score: 1 }
        ]
      },
      {
        id: 12,
        text: 'Você já teve ou tem fantasias sexuais que envolvem um alto grau de domínio, submissão ou agressividade?',
        options: [
          { label: 'a', text: 'Sim, fantasias de domínio ou submissão são frequentes.', score: 3 },
          { label: 'b', text: 'Raramente, minhas fantasias são focadas em ternura e conexão.', score: 4 },
          { label: 'c', text: 'Fantasias são tabus para mim, e eu as reprimo.', score: 1 },
          { label: 'd', text: 'Meu parceiro que tem essas fantasias, e eu as aceito passivamente.', score: 2 },
          { label: 'e', text: 'Fantasias agressivas me excitam, mas me causam culpa depois.', score: 1 }
        ]
      },
      {
        id: 13,
        text: 'A sua atitude em relação à sua beleza e à necessidade de ser "vista" e admirada está ligada à forma como você resolveu a sua fase fálica?',
        options: [
          { label: 'a', text: 'Sim, minha autoestima depende da admiração e do olhar externo.', score: 1 },
          { label: 'b', text: 'Não, minha autoimagem é interna e estável.', score: 5 },
          { label: 'c', text: 'Eu evito ser o centro das atenções por medo de ser "descoberta" (fraqueza).', score: 1 },
          { label: 'd', text: 'Eu uso minha imagem para competir com outras mulheres.', score: 1 },
          { label: 'e', text: 'Sinto que sou invisível, a menos que esteja com um parceiro poderoso.', score: 1 }
        ]
      },
      {
        id: 14,
        text: 'Você tem uma aversão ou fobia irracional a algo que, simbolicamente, poderia representar um trauma sexual ou uma ameaça (Complexo de Castração)?',
        options: [
          { label: 'a', text: 'Sim, tenho fobias que interferem na minha vida diária (e.g., medo de objetos pontiagudos).', score: 1 },
          { label: 'b', text: 'Não, sou geralmente destemida e racional.', score: 5 },
          { label: 'c', text: 'Tenho medo do fracasso e da perda de status.', score: 2 },
          { label: 'd', text: 'Meu medo é do abandono ou da solidão extrema.', score: 1 },
          { label: 'e', text: 'Evito situações que me coloquem em vulnerabilidade física ou emocional.', score: 2 }
        ]
      },
      {
        id: 15,
        text: 'Qual é a sua forma mais comum de lidar com a inveja ou rivalidade no seu relacionamento?',
        options: [
          { label: 'a', text: 'Nego a inveja e desvalorizo a pessoa que me ameaça.', score: 1 },
          { label: 'b', text: 'Uso a competição como um motor para melhorar a mim mesma.', score: 4 },
          { label: 'c', text: 'Sinto-me paralisada e inferiorizada.', score: 1 },
          { label: 'd', text: 'Me afasto de situações onde a rivalidade é evidente.', score: 3 },
          { label: 'e', text: 'Ataco a outra pessoa de forma sutil ou agressiva.', score: 1 }
        ]
      },
      {
        id: 16,
        text: 'Em momentos de grande frustração, você tende a regredir para comportamentos imaturos (choro incontrolável, birra, auto-punição)? (Regressão)',
        options: [
          { label: 'a', text: 'Constantemente, a frustração me leva à explosão emocional infantil.', score: 1 },
          { label: 'b', text: 'Não, lido com a frustração de forma madura e racional.', score: 5 },
          { label: 'c', text: 'A repressão é meu mecanismo; eu internalizo a frustração.', score: 2 },
          { label: 'd', text: 'Eu transfiro a culpa para o parceiro (Projeção).', score: 1 },
          { label: 'e', text: 'Recorro a vícios ou compulsões (Oral/Anal) para me acalmar.', score: 1 }
        ]
      },
      {
        id: 17,
        text: 'Você acredita que seu parceiro é uma "extensão" de si mesma e se ofende profundamente quando ele age de forma independente ou diferente de suas expectativas? (Narcisismo Primário)',
        options: [
          { label: 'a', text: 'Sim, o comportamento dele é um reflexo direto de mim e me afeta intensamente.', score: 1 },
          { label: 'b', text: 'Não, reconheço a individualidade dele e valorizo a diferença.', score: 5 },
          { label: 'c', text: 'Eu me sinto invisível e desvalorizada quando ele tem interesses próprios.', score: 1 },
          { label: 'd', text: 'Eu tento impor minhas vontades para que ele se conforme ao meu ideal.', score: 1 },
          { label: 'e', text: 'A independência dele me causa ciúmes ou insegurança.', score: 1 }
        ]
      },
      {
        id: 18,
        text: 'Qual é o papel que o "segredo" ou a "omissão" de informações (mesmo que banais) desempenha em seu relacionamento? (Repressão e Controle)',
        options: [
          { label: 'a', text: 'É essencial; sinto que preciso de segredos para manter minha individualidade.', score: 2 },
          { label: 'b', text: 'Não tenho segredos; sou totalmente transparente.', score: 5 },
          { label: 'c', text: 'Eu minto por medo de magoar ou por receio da reação do parceiro.', score: 1 },
          { label: 'd', text: 'Eu investigo o parceiro em busca de segredos ocultos dele.', score: 1 },
          { label: 'e', text: 'Sinto-me culpada por qualquer omissão, mesmo que pequena.', score: 2 }
        ]
      },
      {
        id: 19,
        text: 'Você tem uma tendência a transformar a dor ou o sofrimento em uma fonte de prazer ou de atenção no relacionamento (Masoquismo Moral)?',
        options: [
          { label: 'a', text: 'Sim, me sinto mais amada ou validada quando estou sofrendo.', score: 1 },
          { label: 'b', text: 'Não, fujo da dor e busco ativamente a felicidade.', score: 5 },
          { label: 'c', text: 'Eu me vitimizo para manipular a situação a meu favor.', score: 1 },
          { label: 'd', text: 'Sinto que meus sofrimentos são insignificantes e os escondo.', score: 2 },
          { label: 'e', text: 'Eu me culpo constantemente por qualquer problema no relacionamento.', score: 1 }
        ]
      },
      {
        id: 20,
        text: 'A maneira como você se comporta no relacionamento é frequentemente uma "atuação" para corresponder ao que você acha que seu parceiro espera de você? (Falsa imagem / Idealização)',
        options: [
          { label: 'a', text: 'Sim, sinto que preciso manter uma performance constante.', score: 1 },
          { label: 'b', text: 'Não, sou autêntica e verdadeira em minhas expressões.', score: 5 },
          { label: 'c', text: 'Eu reprimo minha personalidade para evitar conflitos.', score: 1 },
          { label: 'd', text: 'Eu me rebelo contra qualquer expectativa e faço o oposto do esperado.', score: 2 },
          { label: 'e', text: 'Apenas no início da relação, mas depois me sinto segura para ser eu mesma.', score: 4 }
        ]
      },
      {
        id: 21,
        text: 'O que representa a maior ameaça à sua felicidade e estabilidade no relacionamento, segundo suas fantasias mais profundas?',
        options: [
          { label: 'a', text: 'Ser abandonada e ficar sozinha para sempre (medo primordial).', score: 1 },
          { label: 'b', text: 'Perder o controle e ser dominada (medo da submissão).', score: 2 },
          { label: 'c', text: 'Ser descoberta em sua "imperfeição" ou ser exposta (culpa).', score: 1 },
          { label: 'd', text: 'A destruição ou o fracasso do parceiro (perda da figura de autoridade).', score: 2 },
          { label: 'e', text: 'A rotina e o tédio (morte da libido).', score: 3 }
        ]
      }
    ]
  }
]
