/**
 * Aprendizagem Jovem — Camada de Dados e Estado do MVP
 * Gerenciamento de dados com persistência em localStorage
 */

const STORAGE_KEY = 'aprendizagem_jovem_mvp_v1';

// Dados semente iniciais do MVP
const DEFAULT_DATA = {
  // Usuário atual simulado (padrão inicial)
  currentUserId: 'youth-1',
  
  // Jovens Aprendizes cadastrados no Banco de Talentos
  youths: [
    {
      id: 'youth-1',
      name: 'Lucas Silva',
      email: 'lucas.silva@aprendizagemjovem.org.br',
      role: 'youth',
      age: 18,
      neighborhood: 'Boqueirão',
      city: 'Curitiba',
      education: 'Ensino Médio Completo',
      shift: 'Tarde / Noite',
      points: 480,
      level: 'Nível 3 · Especialista Júnior',
      streakDays: 6,
      completedDailyGoals: ['goal-1', 'goal-2'],
      skills: [
        { name: 'Excel', level: 'Intermediário' },
        { name: 'Word', level: 'Avançado' },
        { name: 'Atendimento ao Cliente', level: 'Intermediário' },
        { name: 'Power BI', level: 'Básico' }
      ],
      completedCourses: ['curso-1', 'curso-2'],
      applications: [
        {
          jobId: 'job-1',
          appliedAt: '2026-10-18',
          status: 'Entrevista Agendada',
          step: 3 // 1: Inscrito, 2: Triagem, 3: Entrevista, 4: Contratado
        }
      ]
    },
    {
      id: 'youth-2',
      name: 'Beatriz Santos',
      email: 'beatriz.santos@aprendizagemjovem.org.br',
      role: 'youth',
      age: 17,
      neighborhood: 'CIC',
      city: 'Curitiba',
      education: 'Ensino Médio (2º Ano)',
      shift: 'Manhã',
      points: 390,
      level: 'Nível 2 · Praticante',
      streakDays: 4,
      completedDailyGoals: ['goal-1'],
      skills: [
        { name: 'Figma', level: 'Intermediário' },
        { name: 'Canva', level: 'Avançado' },
        { name: 'Comunicação', level: 'Avançado' }
      ],
      completedCourses: ['curso-3'],
      applications: []
    },
    {
      id: 'youth-3',
      name: 'Gabriel Souza',
      email: 'gabriel.souza@aprendizagemjovem.org.br',
      role: 'youth',
      age: 19,
      neighborhood: 'Pinheirinho',
      city: 'Curitiba',
      education: 'Ensino Médio Técnico em Informática',
      shift: 'Flexível',
      points: 620,
      level: 'Nível 4 · Destaque Aprendizagem Jovem',
      streakDays: 12,
      completedDailyGoals: ['goal-1', 'goal-2', 'goal-3'],
      skills: [
        { name: 'VS Code & Web', level: 'Intermediário' },
        { name: 'Lógica de Programação', level: 'Avançado' },
        { name: 'Excel', level: 'Intermediário' }
      ],
      completedCourses: ['curso-1', 'curso-4'],
      applications: [
        {
          jobId: 'job-2',
          appliedAt: '2026-10-19',
          status: 'Em Triagem Pedagógica',
          step: 2
        }
      ]
    }
  ],

  // Administrador da Instituição
  adminUser: {
    id: 'admin-1',
    name: 'Coordenação Aprendizagem Jovem',
    email: 'admin@aprendizagemjovem.org.br',
    role: 'admin',
    department: 'Gestão Pedagógica & Inserção Profissional'
  },

  // Clube de Benefícios (Cupons resgatáveis)
  coupons: [
    {
      id: 'cupom-1',
      partner: 'iFood & Refeição',
      category: 'Alimentação',
      title: 'Vale Almoço / Lanche R$ 25',
      description: 'Crédito direto no app iFood para um almoço nutritivo ou lanche nos dias de formação prática.',
      pointsCost: 150,
      icon: '🍔',
      badge: 'Mais Popular',
      stock: 45
    },
    {
      id: 'cupom-2',
      partner: 'Bilhete Único / Transporte',
      category: 'Transporte',
      title: 'Passe Transporte Extra (4 Viagens)',
      description: 'Recarga para deslocamento até as entrevistas presenciais e oficinas do programa.',
      pointsCost: 100,
      icon: '🚌',
      badge: 'Essencial',
      stock: 60
    },
    {
      id: 'cupom-3',
      partner: 'Cinemark & Lazer',
      category: 'Lazer',
      title: 'Ingresso de Cinema 2D',
      description: 'Entrada cortesia de segunda a quinta-feira para relaxar e curtir cultura.',
      pointsCost: 200,
      icon: '🍿',
      badge: 'Recompensa',
      stock: 30
    },
    {
      id: 'cupom-4',
      partner: 'Livraria & Cursos',
      category: 'Educação',
      title: 'Vale Livro / E-book R$ 35',
      description: 'Voucher para compra de livros técnicos, literatura ou assinaturas digitais de estudo.',
      pointsCost: 220,
      icon: '📚',
      badge: 'Conhecimento',
      stock: 25
    },
    {
      id: 'cupom-5',
      partner: 'Recarga Conectividade',
      category: 'Internet',
      title: 'Recarga 5GB de Internet Móvel',
      description: 'Pacote de dados para celular para continuar estudando as metas e cursos de onde estiver.',
      pointsCost: 120,
      icon: '📶',
      badge: 'Conexão',
      stock: 50
    },
    {
      id: 'cupom-6',
      partner: 'Subway & Nutrição',
      category: 'Alimentação',
      title: 'Combo Sanduíche + Bebida',
      description: 'Almoço saudável nas unidades parceiras conveniadas do centro da cidade.',
      pointsCost: 160,
      icon: '🥪',
      badge: 'Parceiro Local',
      stock: 40
    }
  ],

  // Vouchers já resgatados pelo jovem logado
  vouchers: [
    {
      id: 'VOUCHER-9481',
      youthId: 'youth-1',
      couponId: 'cupom-1',
      title: 'Vale Almoço iFood R$ 25',
      partner: 'iFood',
      category: 'Alimentação',
      code: 'AJ-IFOOD-8392',
      redeemedAt: '2026-10-15',
      expiresAt: '2026-11-15',
      status: 'Ativo'
    }
  ],

  // Cursos rápidos e trilhas de qualificação
  courses: [
    {
      id: 'curso-1',
      title: 'Excel Essencial para o Primeiro Emprego',
      category: 'Produtividade',
      workload: '12 horas',
      modulesCount: 4,
      pointsReward: 120,
      skillsEarned: 'Excel (Fórmulas, Tabelas, Procv)',
      description: 'Aprenda as planilhas e relatórios mais cobrados nos testes de admissão corporativos.',
      icon: '📊'
    },
    {
      id: 'curso-2',
      title: 'Atendimento Humanizado & Comunicação',
      category: 'Atendimento',
      workload: '8 horas',
      modulesCount: 3,
      pointsReward: 90,
      skillsEarned: 'Atendimento ao Cliente, Escuta Ativa',
      description: 'Como encantar clientes via WhatsApp, telefone, e-mail e atendimento presencial.',
      icon: '💬'
    },
    {
      id: 'curso-3',
      title: 'Introdução ao Design no Figma & Canva',
      category: 'Criatividade',
      workload: '10 horas',
      modulesCount: 4,
      pointsReward: 110,
      skillsEarned: 'Figma Básico, Identidade Visual',
      description: 'Criação de apresentações profissionais, posts de redes sociais e documentos visuais.',
      icon: '🎨'
    },
    {
      id: 'curso-4',
      title: 'Lógica de Programação & Tecnologia Web',
      category: 'Tecnologia',
      workload: '16 horas',
      modulesCount: 5,
      pointsReward: 150,
      skillsEarned: 'HTML, CSS, Lógica e Raciocínio',
      description: 'Construção de páginas simples, formulários e entendimento da era digital.',
      icon: '💻'
    }
  ],

  // Metas diárias de gamificação
  dailyGoals: [
    { id: 'goal-1', title: 'Completar 1 Módulo de Curso', points: 50, icon: '🎯' },
    { id: 'goal-2', title: 'Ler 1 Dica Técnica de Carreira', points: 30, icon: '📖' },
    { id: 'goal-3', title: 'Praticar no Simulador de Entrevista', points: 40, icon: '🤖' },
    { id: 'goal-4', title: 'Atualizar Habilidades no Perfil', points: 35, icon: '⭐' }
  ],

  // Vagas de Aprendizagem de Empresas Parceiras
  jobs: [
    {
      id: 'job-1',
      title: 'Jovem Aprendiz Administrativo & Suporte',
      company: 'LogSul Distribuição & Logística',
      location: 'Curitiba - PR (Boqueirão)',
      salary: 'R$ 980,00 + VT + VR',
      shift: 'Tarde (13h às 17h)',
      ageRequirement: '18 a 24 anos',
      description: 'Apoio no controle de planilhas de entrada/saída, emissão de formulários simples e atendimento interno de setores.',
      requiredSkills: ['Excel', 'Word'],
      candidatesCount: 6,
      badge: 'Vaga Urgente'
    },
    {
      id: 'job-2',
      title: 'Jovem Aprendiz em Tecnologia e Suporte de TI',
      company: 'InovaTech Soluções Digitais',
      location: 'Curitiba - PR (Centro Cívico)',
      salary: 'R$ 1.050,00 + VT + Seguro de Vida',
      shift: 'Manhã (08h às 12h)',
      ageRequirement: '16 a 24 anos',
      description: 'Configuração básica de computadores, suporte a usuários, organização de chamados e apoio em rotinas de TI.',
      requiredSkills: ['VS Code & Web', 'Lógica de Programação'],
      candidatesCount: 4,
      badge: 'Match com Tecnologia'
    },
    {
      id: 'job-3',
      title: 'Jovem Aprendiz no Atendimento ao Cliente & Varejo',
      company: 'Rede FarmaMais Paraná',
      location: 'Curitiba - PR (Batel)',
      salary: 'R$ 950,00 + VT + Descontos em Medicamentos',
      shift: 'Tarde (14h às 18h)',
      ageRequirement: '14 a 24 anos',
      description: 'Recepção cordial de clientes, apoio na conferência de prateleiras e auxílio na emissão de cupons fiscais.',
      requiredSkills: ['Atendimento ao Cliente'],
      candidatesCount: 8,
      badge: 'Início Imediato'
    }
  ]
};

// Gerenciador de Estado com LocalStorage
class DataStore {
  constructor() {
    this.data = this.load();
  }

  load() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Erro ao ler localStorage, utilizando dados padrão:', e);
    }
    this.save(DEFAULT_DATA);
    return JSON.parse(JSON.stringify(DEFAULT_DATA));
  }

  save(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data || this.data));
    } catch (e) {
      console.error('Erro ao salvar no localStorage:', e);
    }
  }

  // Obter usuário logado atual
  getCurrentYouth() {
    return this.data.youths.find(y => y.id === this.data.currentUserId) || this.data.youths[0];
  }

  // Obter lista de jovens
  getYouths() {
    return this.data.youths;
  }

  // Obter cupons
  getCoupons() {
    return this.data.coupons;
  }

  // Obter vouchers resgatados do jovem atual
  getVouchers(youthId) {
    const id = youthId || this.data.currentUserId;
    return this.data.vouchers.filter(v => v.youthId === id);
  }

  // Obter cursos
  getCourses() {
    return this.data.courses;
  }

  // Obter vagas
  getJobs() {
    return this.data.jobs;
  }

  // Calcular compatibilidade (Match %) do jovem com a vaga
  calculateMatch(youth, job) {
    if (!job.requiredSkills || job.requiredSkills.length === 0) return 90;
    const youthSkillNames = (youth.skills || []).map(s => s.name.toLowerCase());
    let matches = 0;
    job.requiredSkills.forEach(req => {
      if (youthSkillNames.some(s => s.includes(req.toLowerCase()))) {
        matches++;
      }
    });
    const base = Math.round((matches / job.requiredSkills.length) * 40) + 60;
    return Math.min(100, base);
  }

  // Resgatar cupom de benefício
  redeemCoupon(couponId) {
    const youth = this.getCurrentYouth();
    const coupon = this.data.coupons.find(c => c.id === couponId);

    if (!coupon) return { success: false, message: 'Cupom não encontrado.' };
    if (youth.points < coupon.pointsCost) {
      return {
        success: false,
        message: `Saldo insuficiente. Você possui ${youth.points} pts e este cupom custa ${coupon.pointsCost} pts.`
      };
    }

    // Deduz pontos
    youth.points -= coupon.pointsCost;

    // Cria voucher
    const voucherId = 'VOUCHER-' + Math.floor(1000 + Math.random() * 9000);
    const code = `AJ-${coupon.category.substring(0, 4).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const newVoucher = {
      id: voucherId,
      youthId: youth.id,
      couponId: coupon.id,
      title: coupon.title,
      partner: coupon.partner,
      category: coupon.category,
      code: code,
      redeemedAt: new Date().toISOString().split('T')[0],
      expiresAt: '2026-11-30',
      status: 'Ativo'
    };

    this.data.vouchers.unshift(newVoucher);
    this.save();

    return {
      success: true,
      voucher: newVoucher,
      remainingPoints: youth.points,
      message: `Sucesso! Cupom "${coupon.title}" resgatado com sucesso.`
    };
  }

  // Completar módulo de curso e ganhar pontos
  completeCourseModule(courseId) {
    const youth = this.getCurrentYouth();
    const course = this.data.courses.find(c => c.id === courseId);
    if (!course) return { success: false, message: 'Curso não encontrado.' };

    const reward = 50; // Pontos por módulo
    youth.points += reward;
    if (!youth.completedCourses.includes(courseId)) {
      youth.completedCourses.push(courseId);
    }

    // Marca meta diária 1 se não estiver
    if (!youth.completedDailyGoals.includes('goal-1')) {
      youth.completedDailyGoals.push('goal-1');
    }

    this.save();
    return {
      success: true,
      pointsEarned: reward,
      totalPoints: youth.points,
      message: `Parabéns! Módulo concluído. Você ganhou +${reward} pontos no Clube!`
    };
  }

  // Candidatar-se a uma vaga
  applyToJob(jobId) {
    const youth = this.getCurrentYouth();
    const job = this.data.jobs.find(j => j.id === jobId);
    if (!job) return { success: false, message: 'Vaga não encontrada.' };

    const existing = youth.applications.find(a => a.jobId === jobId);
    if (existing) {
      return { success: false, message: 'Você já se candidatou a esta vaga!' };
    }

    const application = {
      jobId: jobId,
      appliedAt: new Date().toISOString().split('T')[0],
      status: 'Inscrição Realizada',
      step: 1
    };

    youth.applications.push(application);
    job.candidatesCount = (job.candidatesCount || 0) + 1;
    this.save();

    return {
      success: true,
      application,
      message: `Candidatura enviada para "${job.title}" na empresa ${job.company}!`
    };
  }

  // Adicionar nova vaga (visão Admin)
  createJob(jobData) {
    const newJob = {
      id: 'job-' + Date.now(),
      title: jobData.title,
      company: jobData.company,
      location: jobData.location || 'Curitiba - PR',
      salary: jobData.salary || 'A combinar',
      shift: jobData.shift || 'Manhã ou Tarde',
      ageRequirement: jobData.ageRequirement || '14 a 24 anos',
      description: jobData.description,
      requiredSkills: jobData.requiredSkills || ['Comunicação'],
      candidatesCount: 0,
      badge: 'Nova Vaga'
    };
    this.data.jobs.unshift(newJob);
    this.save();
    return newJob;
  }

  // Cadastrar novo jovem pelo formulário
  registerYouth(youthData) {
    const newId = 'youth-' + Date.now();
    const newYouth = {
      id: newId,
      name: youthData.name,
      email: youthData.email,
      role: 'youth',
      age: parseInt(youthData.age) || 18,
      neighborhood: youthData.neighborhood || 'Centro',
      city: youthData.city || 'Curitiba',
      education: youthData.education || 'Ensino Médio',
      shift: youthData.shift || 'Manhã',
      points: 100, // Bônus de boas-vindas
      level: 'Nível 1 · Iniciante',
      streakDays: 1,
      completedDailyGoals: [],
      skills: [{ name: 'Comunicação Básica', level: 'Básico' }],
      completedCourses: [],
      applications: []
    };
    this.data.youths.push(newYouth);
    this.data.currentUserId = newId;
    this.save();
    return newYouth;
  }

  // Trocar o jovem ativo (para testes no MVP)
  setActiveYouth(id) {
    if (this.data.youths.some(y => y.id === id)) {
      this.data.currentUserId = id;
      this.save();
      return true;
    }
    return false;
  }

  // Resetar dados para o padrão do MVP
  resetToDefaults() {
    this.data = JSON.parse(JSON.stringify(DEFAULT_DATA));
    this.save();
  }
}

export const store = new DataStore();
