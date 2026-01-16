'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Search, 
  FileText, 
  Star,
  Copy,
  Heart,
  Brain,
  Baby,
  Stethoscope,
  Activity,
  User,
  Bone,
  Sparkles
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TemplatesPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<number[]>([]);

  const categories = [
    { name: 'Todas', icon: FileText },
    { name: 'Clínica Geral', icon: Stethoscope },
    { name: 'Cardiologia', icon: Heart },
    { name: 'Ginecologia', icon: User },
    { name: 'Ortopedia', icon: Bone },
    { name: 'Dermatologia', icon: Activity },
    { name: 'Pediatria', icon: Baby },
    { name: 'Neurologia', icon: Brain },
    { name: 'Psiquiatria', icon: Sparkles }
  ];

  const templates = [
    {
      id: 1,
      title: 'SOAP Geral',
      category: 'Clínica Geral',
      badge: 'Anamnese',
      description: 'Você é um assistente médico. Organize a transcrição abaixo no formato SOAP:',
      prompt: `Você é um assistente médico. Organize a transcrição abaixo no formato SOAP:

S (Subjetivo): Queixa principal, história da doença atual...
O (Objetivo): Exame físico, sinais vitais...
A (Avaliação): Hipótese diagnóstica...
P (Plano): Conduta, prescrições, orientações...`,
      icon: Stethoscope
    },
    {
      id: 2,
      title: 'Evolução Diária',
      category: 'Clínica Geral',
      badge: 'Evolução',
      description: 'Organize a transcrição como evolução médica hospitalar:',
      prompt: `Organize a transcrição como evolução médica hospitalar:

1. DIA DE INTERNAÇÃO...
2. QUEIXAS DO DIA
3. EXAME FÍSICO
4. EXAMES COMPLEMENTARES
5. AVALIAÇÃO E CONDUTA`,
      icon: Activity
    },
    {
      id: 3,
      title: 'Consulta de Retorno',
      category: 'Clínica Geral',
      badge: 'Retorno',
      description: 'Organize como consulta de RETORNO:',
      prompt: `Organize como consulta de RETORNO:

1. MOTIVO DO RETORNO...
2. EVOLUÇÃO desde última consulta
3. EXAMES trazidos
4. NOVA CONDUTA`,
      icon: FileText
    },
    {
      id: 4,
      title: 'SOAP Cardiológico',
      category: 'Cardiologia',
      badge: 'Anamnese',
      description: 'Organize no formato SOAP para cardiologia:',
      prompt: `Organize no formato SOAP para cardiologia:

S: Queixa CV (dor, dispneia, palpitação, síncope), fatores de risco...
O: PA. FC. ritmo. sopros. edema. estase...
A: Hipótese cardiológica
P: Exames complementares, medicações, orientações`,
      icon: Heart
    },
    {
      id: 5,
      title: 'SOAP Ginecológico',
      category: 'Ginecologia',
      badge: 'Anamnese',
      description: 'Organize no formato SOAP para ginecologia:',
      prompt: `Organize no formato SOAP para ginecologia:

S: Queixa ginecológica, DUM, G_P_A_, anticoncepção, rastreamento...
O: Mamas. abdome. especular. toque vagina...
A: Hipótese ginecológica
P: Exames, orientações, retorno`,
      icon: User
    },
    {
      id: 6,
      title: 'SOAP Ortopédico',
      category: 'Ortopedia',
      badge: 'Anamnese',
      description: 'Organize no formato SOAP para ortopedia:',
      prompt: `Organize no formato SOAP para ortopedia:

S: Mecanismo de lesão, localização, irradiação, tempo de evolução, limitação funcional...
O: Inspeção. palpação. mobilidade. força. testes especiais...
A: Hipótese ortopédica
P: Exames de imagem, conduta, reabilitação`,
      icon: Bone
    },
    {
      id: 7,
      title: 'SOAP Dermatológico',
      category: 'Dermatologia',
      badge: 'Anamnese',
      description: 'Organize no formato SOAP para dermatologia:',
      prompt: `Organize no formato SOAP para dermatologia:

S: Lesão (tempo, evolução, sintomas), tratamentos prévios, alergias, exposições...
O: Descrição da lesão (ti...
A: Hipótese dermatológica
P: Tratamento tópico/sistêmico, orientações, retorno`,
      icon: Activity
    },
    {
      id: 8,
      title: 'SOAP Pediátrico',
      category: 'Pediatria',
      badge: 'Anamnese',
      description: 'Organize no formato SOAP para pediatria:',
      prompt: `Organize no formato SOAP para pediatria:

S: Queixa, início, vacinação, alimentação, desenvolvimento, antecedentes...
O: Peso. altura. PC. FC. FR. Tax. e...
A: Hipótese pediátrica
P: Orientações aos pais, medicações, retorno`,
      icon: Baby
    },
    {
      id: 9,
      title: 'SOAP Neurológico',
      category: 'Neurologia',
      badge: 'Anamnese',
      description: 'Organize no formato SOAP para neurologia:',
      prompt: `Organize no formato SOAP para neurologia:

S: Queixa neurológica (cefaleia, tontura, fraqueza, parestesia), tempo, evolução...
O: Estado mental. pares cr...
A: Hipótese neurológica
P: Exames, medicações, encaminhamento`,
      icon: Brain
    },
    {
      id: 10,
      title: 'SOAP Psiquiátrico',
      category: 'Psiquiatria',
      badge: 'Anamnese',
      description: 'Organize no formato SOAP para psiquiatria:',
      prompt: `Organize no formato SOAP para psiquiatria:

S: Queixa, história atual, antecedentes psiquiátricos, uso de substâncias, história familiar
O: Aparência. comportamento. humor. afeto. pensamento. sensopercepção...
A: Hipótese diagnóstica psiquiátrica
P: Psicoterapia, medicações, orientações, retorno`,
      icon: Sparkles
    }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'Todas' || template.category === selectedCategory;
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const favoriteTemplates = templates.filter(t => favorites.includes(t.id));

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
    );
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Toast notification would go here
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/40 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Biblioteca de Templates</h1>
              <p className="text-sm text-gray-400">Prompts prontos para cada especialidade</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Procure por especialidade ou tipo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-teal-500/50 transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Categories Filter */}
        <div className="flex gap-3 overflow-x-auto pb-4 mb-8 scrollbar-hide">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = selectedCategory === category.name;
            return (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all duration-300 ${
                  isActive
                    ? 'bg-teal-500 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {category.name}
              </button>
            );
          })}
        </div>

        {/* Favorites Section */}
        {favoriteTemplates.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              Meus Favoritos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {favoriteTemplates.map((template) => {
                const Icon = template.icon;
                return (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6 hover:border-yellow-500/30 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-teal-500/20 to-blue-500/20">
                          <Icon className="w-6 h-6 text-teal-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white group-hover:text-teal-400 transition-colors">
                            {template.title}
                          </h3>
                          <p className="text-xs text-gray-500">{template.category}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleFavorite(template.id)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      </button>
                    </div>

                    <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                      {template.description}
                    </p>

                    <button
                      onClick={() => copyToClipboard(template.prompt)}
                      className="flex items-center justify-center gap-2 w-full py-2.5 bg-teal-500 hover:bg-teal-600 text-white rounded-xl font-medium transition-all duration-300 hover:scale-[1.02]"
                    >
                      <Copy className="w-4 h-4" />
                      Copiar
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Templates Grid */}
        <div>
          <h2 className="text-xl font-bold mb-4">
            {selectedCategory === 'Todas' ? 'Todos os Templates' : selectedCategory}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template, index) => {
              const Icon = template.icon;
              const isFavorite = favorites.includes(template.id);
              return (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6 hover:border-teal-500/30 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-teal-500/20 to-blue-500/20">
                        <Icon className="w-6 h-6 text-teal-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white group-hover:text-teal-400 transition-colors">
                          {template.title}
                        </h3>
                        <span className="inline-block px-2 py-1 bg-teal-500/20 text-teal-300 text-xs rounded-full mt-1">
                          {template.badge}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleFavorite(template.id)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <Star 
                        className={`w-5 h-5 transition-colors ${
                          isFavorite 
                            ? 'text-yellow-400 fill-yellow-400' 
                            : 'text-gray-600 hover:text-yellow-400'
                        }`} 
                      />
                    </button>
                  </div>

                  <p className="text-xs text-gray-500 mb-3">{template.category}</p>
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                    {template.description}
                  </p>

                  <button
                    onClick={() => copyToClipboard(template.prompt)}
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-teal-500 hover:bg-teal-600 text-white rounded-xl font-medium transition-all duration-300 hover:scale-[1.02]"
                  >
                    <Copy className="w-4 h-4" />
                    Copiar
                  </button>
                </motion.div>
              );
            })}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Nenhum template encontrado</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
