# 🎓 Aprendizagem Jovem — Plataforma Jovem Aprendiz (MVP)

Plataforma de capacitação prática, clube de benefícios gamificado com resgate de cupons reais e conexão inteligente com vagas de emprego para Jovens Aprendizes.

---

## 🚀 Arquitetura Simplificada (HTML, CSS e JavaScript Puro)

Em conformidade com o objetivo de **reduzir a complexidade**, **eliminar dependências de frameworks pesados** e **entregar um MVP visual, direto e funcional**, a aplicação foi estruturada exclusivamente em tecnologias nativas da web:

```
├── favicon.svg         # Favicon vetorial oficial da marca
├── logo.svg            # Logo vetorial oficial em SVG
├── index.html          # Estrutura semântica: Home, Login, Pós-Login e SEO completo
├── css/
│   └── style.css       # Design System completo (Vanilla CSS), responsivo e moderno
├── js/
│   ├── app.js          # Controlador principal de rotas, eventos, modais e Mentor IA
│   ├── auth.js         # Controle de sessão e permissões RBAC (Jovem vs Admin)
│   └── data.js         # Estado reativo e persistência local (localStorage)
├── server.js           # Servidor HTTP nativo Node.js (Zero dependências externas)
└── package.json        # Configuração simplificada de scripts
```

---

## 🌟 Níveis de Acesso e Fluxo da Plataforma

### 1. Página Inicial (Home / Landing Page)
- **Hero de Alto Impacto**: Apresentação da proposta de valor da plataforma.
- **Métricas do MVP**: Jovens capacitados, vagas abertas, cupons resgatados e taxa de aprovação.
- **Como Funciona**: 3 passos (1. Estude & Ganhe Pontos → 2. Resgate Cupons no Clube → 3. Conquiste sua Vaga).
- **Prévias**: Cupons em destaque e vagas de empresas parceiras.

### 2. Página de Autenticação (Login)
- **Acesso Rápido de Demonstração (1 Clique)**:
  - `👤 Jovem Aprendiz`: Entra instantaneamente como *Lucas Silva* (18 anos, 480 pontos).
  - `⚙️ Administrador`: Entra instantaneamente como a equipe de coordenação da Aprendizagem Jovem.
- **Formulário Tradicional**: Login com validação de permissão e aba para criação de novas contas.

### 3. Pós-Login Condicional por Nível de Permissão (RBAC)

#### 🟢 Visão: Jovem Aprendiz (Aluno)
- **Painel & Gamificação**: Saldo de pontos em tempo real, ofensiva diária e metas concluídas.
- **🎁 Clube de Benefícios & Vouchers**: Vitrine categorizada (Alimentação, Transporte, Lazer, Educação, Internet), resgate interativo por pontos e geração instantânea de **Vouchers com QR Code e código digital**.
- **📚 Cursos & Qualificação**: Módulos práticos de 5 a 10 min. Botão "Completar Módulo" que concede **+50 pontos** imediatos.
- **💼 Vagas & Candidaturas**: Cálculo automático de compatibilidade (% de Match) e linha do tempo de 4 etapas (Inscrito → Triagem → Entrevista → Contratação).
- **🤖 Mentor Virtual IA**: Chat interativo para simulação de entrevistas e dicas de primeiro emprego.

#### 🟣 Visão: Administrador (Coordenação Aprendizagem Jovem)
- **KPIs em Tempo Real**: Alunos ativos, vagas abertas, cupons resgatados e pontos concedidos.
- **👥 Banco de Talentos**: Tabela completa com busca por competência e filtro de faixa etária (`+18 anos` e `14 a 17 anos menor de idade c/ LGPD`).
- **💼 Gestão de Vagas**: Lista de vagas das empresas parceiras e modal para cadastrar novas oportunidades.
- **🎁 Gestão do Clube**: Catálogo de parceiros conveniados e controle de estoque de benefícios.

---

## 💻 Como Rodar Localmente

Como a aplicação utiliza **HTML5, CSS3 e JavaScript nativo com Node.js puro**, ela **não depende de instalações gigantescas**:

### Opção 1: Servidor Nativo (Recomendado)
```bash
npm run dev
# ou
node server.js
```
Acesse no seu navegador: **`http://localhost:5173`**

### Opção 2: Abrir Diretamente no Navegador
Você também pode abrir o arquivo `index.html` diretamente em qualquer navegador moderno ou com extensões como o *Live Server*.
