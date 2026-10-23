/**
 * Aprendizagem Jovem — Sistema de Autenticação e Controle de Acesso (RBAC)
 * Níveis de Permissão:
 * - 'youth': Jovem Aprendiz / Aluno (Acesso ao Clube, Cursos, Vagas, Mentor IA)
 * - 'admin': Administrador / Coordenação Aprendizagem Jovem (Banco de Talentos, Vagas, Métricas)
 */

import { store } from './data.js';

const AUTH_STORAGE_KEY = 'aprendizagem_jovem_auth_session';

class AuthManager {
  constructor() {
    this.session = this.loadSession();
    this.listeners = [];
  }

  loadSession() {
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn('Erro ao carregar sessão:', e);
    }
    // Por padrão no primeiro acesso, inicia deslogado para exibir Home/Login
    return null;
  }

  saveSession(session) {
    this.session = session;
    if (session) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
    this.notify();
  }

  // Verifica se há usuário autenticado
  isAuthenticated() {
    return !!this.session;
  }

  // Retorna papel atual: 'youth' | 'admin' | null
  getRole() {
    return this.session ? this.session.role : null;
  }

  // Retorna os dados do usuário atual
  getUser() {
    if (!this.session) return null;
    if (this.session.role === 'admin') {
      return store.data.adminUser;
    }
    // Se for jovem, busca os dados atualizados no store
    return store.getCurrentYouth();
  }

  // Login Rápido de Demonstração para Jovem Aprendiz
  loginAsYouth(youthId = 'youth-1') {
    store.setActiveYouth(youthId);
    const youth = store.getCurrentYouth();
    const session = {
      userId: youth.id,
      name: youth.name,
      email: youth.email,
      role: 'youth',
      loggedInAt: new Date().toISOString()
    };
    this.saveSession(session);
    return session;
  }

  // Login Rápido de Demonstração para Administrador
  loginAsAdmin() {
    const admin = store.data.adminUser;
    const session = {
      userId: admin.id,
      name: admin.name,
      email: admin.email,
      role: 'admin',
      loggedInAt: new Date().toISOString()
    };
    this.saveSession(session);
    return session;
  }

  // Login por Credenciais (Formulário)
  loginWithCredentials(email, password, role = 'youth') {
    if (!email || !password) {
      return { success: false, message: 'Preencha o e-mail e a senha.' };
    }

    if (role === 'admin') {
      // Login Admin
      return { success: true, session: this.loginAsAdmin() };
    } else {
      // Login Jovem
      const youths = store.getYouths();
      const found = youths.find(y => y.email.toLowerCase() === email.toLowerCase()) || youths[0];
      return { success: true, session: this.loginAsYouth(found.id) };
    }
  }

  // Alternar permissão/papel em 1 clique (para facilidade de apresentação do MVP)
  toggleRole() {
    if (!this.session) return;
    if (this.session.role === 'youth') {
      this.loginAsAdmin();
    } else {
      this.loginAsYouth();
    }
  }

  // Logout
  logout() {
    this.saveSession(null);
  }

  // Observador de mudanças de estado
  onAuthChange(callback) {
    this.listeners.push(callback);
  }

  notify() {
    this.listeners.forEach(cb => {
      try {
        cb(this.session);
      } catch (err) {
        console.error('Erro em listener de auth:', err);
      }
    });
  }
}

export const auth = new AuthManager();
