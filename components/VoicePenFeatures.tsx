'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Zap,
  Smartphone,
  Mic,
  MessageSquare,
  Video,
  Globe,
  Shield,
  Upload,
  Share2,
  Sparkles,
  ChevronRight,
  Check,
  Play,
  Download
} from 'lucide-react';

interface VoicePenFeaturesProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VoicePenFeatures({ isOpen, onClose }: VoicePenFeaturesProps) {
  const [selectedFeature, setSelectedFeature] = useState<number | null>(null);

  const features = [
    {
      id: 1,
      icon: Mic,
      title: 'Gravações até 2 horas',
      subtitle: 'Recording power',
      description: 'Perfeito para reuniões longas, palestras e entrevistas',
      gradient: 'from-red-500 to-pink-500',
      details: [
        'Grave consultas completas sem limite de tempo',
        'Qualidade de áudio profissional',
        'Continua gravando mesmo com tela bloqueada',
        'Indicador visual de tempo em tempo real'
      ],
      image: '🎙️'
    },
    {
      id: 2,
      icon: Zap,
      title: 'Transcrição Rápida',
      subtitle: 'Fast transcription',
      description: 'Transcreva 1 hora de áudio em 30 segundos',
      gradient: 'from-yellow-500 to-orange-500',
      details: [
        'IA de última geração para precisão máxima',
        'Processamento em tempo recorde',
        'Reconhece terminologia médica especializada',
        'Pontuação automática inteligente'
      ],
      image: '⚡'
    },
    {
      id: 3,
      icon: MessageSquare,
      title: 'Chat com suas Notas',
      subtitle: 'Interactive assistant',
      description: 'Transforme notas em assistente inteligente',
      gradient: 'from-purple-500 to-indigo-500',
      details: [
        'Faça perguntas sobre qualquer transcrição',
        'Extraia insights instantaneamente',
        'Resumos automáticos sob demanda',
        'Busca semântica avançada'
      ],
      image: '💬'
    },
    {
      id: 4,
      icon: Users,
      title: 'Separação de Falantes',
      subtitle: 'Speaker separation',
      description: 'Identifica automaticamente quem disse o quê',
      gradient: 'from-blue-500 to-cyan-500',
      details: [
        'Ideal para consultas médico-paciente',
        'Labels automáticos (Médico, Paciente)',
        'Timeline visual por falante',
        'Facilita revisão e análise'
      ],
      image: '👥'
    },
    {
      id: 5,
      icon: Globe,
      title: 'Gravação Offline',
      subtitle: 'Always available',
      description: 'Nunca perca um momento, mesmo sem internet',
      gradient: 'from-green-500 to-emerald-500',
      details: [
        'Funciona 100% offline no iPhone',
        'Sincroniza automaticamente quando online',
        'Perfeito para áreas remotas',
        'Zero preocupações com conectividade'
      ],
      image: '📡'
    },
    {
      id: 6,
      icon: Sparkles,
      title: '25+ Estilos de IA',
      subtitle: 'Rewrite options',
      description: 'Transforme transcrições em qualquer formato',
      gradient: 'from-pink-500 to-rose-500',
      details: [
        'SOAP, Evolução, Retorno profissionais',
        'Sumário executivo automático',
        'Lista de ações extraída',
        'Estilo personalizado com seu prompt'
      ],
      image: '✨'
    },
    {
      id: 7,
      icon: Upload,
      title: 'Upload de Qualquer Coisa',
      subtitle: 'Universal input',
      description: 'Arquivos, vídeos, podcasts e muito mais',
      gradient: 'from-violet-500 to-purple-500',
      details: [
        'Importa áudio/vídeo do celular',
        'Transcreve reuniões do Zoom gravadas',
        'Processa mensagens de voz do WhatsApp',
        'Converte vídeos do YouTube'
      ],
      image: '📤'
    },
    {
      id: 8,
      icon: Share2,
      title: 'Compartilhar & Exportar',
      subtitle: 'Flexible output',
      description: 'PDF, DOC ou texto editável',
      gradient: 'from-teal-500 to-cyan-500',
      details: [
        'Exporte para PDF profissional',
        'Gere DOC editável no Word',
        'Copie texto formatado',
        'Integra com prontuários eletrônicos'
      ],
      image: '📄'
    },
    {
      id: 9,
      icon: Smartphone,
      title: 'Acesso em Qualquer Lugar',
      subtitle: 'Cross-platform',
      description: 'iPhone, iPad, Mac - sempre sincronizado',
      gradient: 'from-gray-600 to-gray-800',
      details: [
        'App nativo para iOS/macOS',
        'Sincronização automática iCloud',
        'Interface otimizada para cada device',
        'Trabalhe de onde estiver'
      ],
      image: '📱'
    },
    {
      id: 10,
      icon: Shield,
      title: 'Privacidade Total',
      subtitle: 'Your data, your control',
      description: 'iCloud próprio - nada em nossos servidores',
      gradient: 'from-yellow-600 to-amber-600',
      details: [
        'Dados salvos apenas no SEU iCloud',
        'Criptografia de ponta a ponta',
        'Conformidade total com LGPD',
        'Você é dono dos seus dados'
      ],
      image: '🔒'
    },
    {
      id: 11,
      icon: Globe,
      title: '80+ Idiomas',
      subtitle: 'Global reach',
      description: 'Comunique em múltiplos idiomas',
      gradient: 'from-blue-600 to-indigo-600',
      details: [
        'Português brasileiro nativo',
        'Inglês, Espanhol, Francês e mais',
        'Tradução automática opcional',
        'Reconhecimento de sotaque'
      ],
      image: '🌍'
    }
  ];

  const useCases = [
    {
      icon: '🩺',
      title: 'Organizar pensamentos e ideias',
      description: 'Nunca deixe uma ideia brilhante escapar - capture com cada detalhe'
    },
    {
      icon: '🎥',
      title: 'Resumos de Reuniões Zoom',
      description: 'Extraia insights-chave de qualquer conversa'
    },
    {
      icon: '💬',
      title: 'Importar mensagens de voz',
      description: 'Transcreva áudios para capturar pontos-chave e reter a ideia principal'
    },
    {
      icon: '🎤',
      title: 'Gravar palestras',
      description: 'Turbine seu aprendizado! Transforme palestras em notas concisas'
    },
    {
      icon: '✍️',
      title: 'Criação de Conteúdo Fácil',
      description: 'Dite suas ideias e veja-as se transformarem em conteúdo em segundos'
    },
    {
      icon: '📝',
      title: 'Transcrições de Entrevistas',
      description: 'Entreviste como um profissional! Transcrições instantâneas para foco na conversa'
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-xl z-40"
            onClick={onClose}
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-7xl max-h-[90vh] overflow-hidden"
            >
              <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-black rounded-3xl border border-white/10 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-white/10 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">
                      Funcionalidades do VoicePen
                    </h2>
                    <p className="text-gray-400">
                      O app de transcrição médica mais poderoso do mercado
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Hero Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mb-12"
                >
                  <div className="inline-block p-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 mb-6">
                    <div className="text-6xl">🎯</div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    Como o VoicePen pode te ajudar
                  </h3>
                  <p className="text-gray-400 max-w-2xl mx-auto">
                    Transforme reuniões, palestras, memos, vídeos e podcasts em transcrições,
                    notas e resumos precisos com IA
                  </p>
                </motion.div>

                {/* Use Cases Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
                  {useCases.map((useCase, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-all"
                    >
                      <div className="text-4xl mb-3">{useCase.icon}</div>
                      <h4 className="text-white font-semibold mb-2">{useCase.title}</h4>
                      <p className="text-sm text-gray-400">{useCase.description}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Features Grid */}
                <div>
                  <h3 className="text-2xl font-bold text-white mb-6 text-center">
                    <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      Features
                    </span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {features.map((feature, index) => {
                      const Icon = feature.icon;
                      const isSelected = selectedFeature === feature.id;

                      return (
                        <motion.div
                          key={feature.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.03 }}
                          onClick={() => setSelectedFeature(isSelected ? null : feature.id)}
                          className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
                            isSelected
                              ? 'bg-gradient-to-br ' + feature.gradient + ' shadow-lg scale-105'
                              : 'bg-white/5 hover:bg-white/10 border border-white/10'
                          }`}
                        >
                          <div className="text-4xl mb-4">{feature.image}</div>
                          <div className="flex items-center gap-2 mb-2">
                            <Icon className="w-5 h-5 text-white" />
                            <h4 className="font-bold text-white">{feature.title}</h4>
                          </div>
                          <p className="text-xs text-gray-300 mb-3">{feature.subtitle}</p>
                          <p className="text-sm text-gray-200 mb-4">{feature.description}</p>

                          <AnimatePresence>
                            {isSelected && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="space-y-2 pt-4 border-t border-white/20"
                              >
                                {feature.details.map((detail, i) => (
                                  <div key={i} className="flex items-start gap-2">
                                    <Check className="w-4 h-4 text-white flex-shrink-0 mt-0.5" />
                                    <p className="text-xs text-white">{detail}</p>
                                  </div>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>

                          <button className="mt-4 text-sm text-white/70 hover:text-white flex items-center gap-1">
                            {isSelected ? 'Ver menos' : 'Ver mais'}
                            <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'rotate-90' : ''}`} />
                          </button>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* CTA Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-center"
                >
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Pronto para transformar sua prática médica?
                  </h3>
                  <p className="text-white/90 mb-6">
                    Baixe o VoicePen gratuitamente e experimente todas as funcionalidades
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href="https://apps.apple.com/us/app/ai-note-taker-voicepen/id6462815872"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-gray-100 transition-all"
                    >
                      <Download className="w-5 h-5" />
                      Baixar na App Store
                    </a>
                    <button
                      onClick={onClose}
                      className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white rounded-xl font-bold hover:bg-white/20 transition-all border border-white/20"
                    >
                      Continuar Explorando
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

function Users({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}
