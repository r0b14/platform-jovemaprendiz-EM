/**
 * APRENDIZAGEM JOVEM — CONTROLADOR PRINCIPAL DA APLICAÇÃO (VANILLA JS)
 * Gerenciamento de Telas (Home, Login, Pós-Login), Renderização Reativa,
 * Resgates de Cupons com QR Code, Candidaturas a Vagas e Mentor IA
 */

import { store } from './data.js';
import { auth } from './auth.js';

// =====================================================================
// GERENCIADOR DE ROTAS / VISUALIZAÇÃO
// =====================================================================
let currentView = 'home'; // 'home' | 'login' | 'dashboard'
let activeYouthSubTab = 'youth-coupons';
let activeAdminSubTab = 'admin-talents';
let activeCouponCategory = 'all';

function setView(viewName) {
  currentView = viewName;

  const viewHome = document.getElementById('view-home');
  const viewLogin = document.getElementById('view-login');
  const viewDashboard = document.getElementById('view-dashboard');

  const headerGuestActions = document.getElementById('header-guest-actions');
  const headerUserActions = document.getElementById('header-user-actions');
  const publicNav = document.getElementById('public-nav');

  // Oculta todas as telas
  viewHome.classList.add('hidden');
  viewLogin.classList.add('hidden');
  viewDashboard.classList.add('hidden');

  const isAuthenticated = auth.isAuthenticated();
  const role = auth.getRole();

  if (viewName === 'home') {
    viewHome.classList.remove('hidden');
    renderHomePreviews();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else if (viewName === 'login') {
    viewLogin.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else if (viewName === 'dashboard') {
    if (!isAuthenticated) {
      setView('login');
      return;
    }
    viewDashboard.classList.remove('hidden');
    renderDashboard();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Atualiza estado do Header
  if (isAuthenticated) {
    headerGuestActions.classList.add('hidden');
    headerUserActions.classList.remove('hidden');
    publicNav.classList.add('hidden');

    const roleBadge = document.getElementById('header-role-badge');
    const pointsBadge = document.getElementById('header-points-badge');
    const pointsVal = document.getElementById('header-points-val');

    if (role === 'admin') {
      roleBadge.textContent = '🟣 Administrador';
      roleBadge.className = 'badge badge-purple';
      pointsBadge.classList.add('hidden');
    } else {
      const youth = store.getCurrentYouth();
      roleBadge.textContent = '🟢 Jovem Aprendiz';
      roleBadge.className = 'badge badge-emerald';
      pointsBadge.classList.remove('hidden');
      pointsVal.textContent = youth.points;
    }
  } else {
    headerGuestActions.classList.remove('hidden');
    headerUserActions.classList.add('hidden');
    publicNav.classList.remove('hidden');
  }
}

// =====================================================================
// RENDERIZAÇÃO DA PÁGINA INICIAL (HOME)
// =====================================================================
function renderHomePreviews() {
  const coupons = store.getCoupons().slice(0, 3);
  const homeCouponsGrid = document.getElementById('home-coupons-grid');

  if (homeCouponsGrid) {
    homeCouponsGrid.innerHTML = coupons.map(c => `
      <div class="content-card">
        <div class="card-top">
          <div class="card-icon-box">${c.icon}</div>
          <span class="badge badge-indigo">${c.badge}</span>
        </div>
        <div class="card-title">${c.title}</div>
        <div style="font-size: 0.8rem; font-weight: 700; color: var(--color-primary); margin-bottom: 6px;">
          ${c.partner} · ${c.category}
        </div>
        <p class="card-desc">${c.description}</p>
        <div class="card-footer">
          <span class="points-cost">${c.pointsCost} pts</span>
          <button class="btn btn-sm btn-outline btn-home-redeem" data-id="${c.id}">
            Resgatar no Portal →
          </button>
        </div>
      </div>
    `).join('');

    // Adiciona evento aos botões de resgate da home
    document.querySelectorAll('.btn-home-redeem').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!auth.isAuthenticated()) {
          setView('login');
          showToast('Faça login primeiro', 'Acesse sua conta para resgatar cupons com seus pontos.', '🔒');
        } else {
          setView('dashboard');
        }
      });
    });
  }

  // Vagas em Destaque na Home
  const jobs = store.getJobs().slice(0, 2);
  const homeJobsGrid = document.getElementById('home-jobs-grid');

  if (homeJobsGrid) {
    homeJobsGrid.innerHTML = jobs.map(j => `
      <div class="content-card">
        <div class="card-top">
          <div class="card-icon-box">💼</div>
          <span class="badge badge-emerald">${j.badge}</span>
        </div>
        <div class="card-title">${j.title}</div>
        <div style="font-size: 0.82rem; font-weight: 700; color: var(--color-text-title); margin-bottom: 4px;">
          ${j.company} · ${j.location}
        </div>
        <div style="font-size: 0.8rem; color: var(--color-text-muted); margin-bottom: 12px;">
          💰 Bolsa: <strong>${j.salary}</strong> · Turno: <strong>${j.shift}</strong>
        </div>
        <p class="card-desc">${j.description}</p>
        <div class="card-footer">
          <span class="badge badge-indigo">Requisitos: ${j.requiredSkills.join(', ')}</span>
          <button class="btn btn-sm btn-primary btn-home-apply" data-id="${j.id}">
            Candidatar-se →
          </button>
        </div>
      </div>
    `).join('');

    document.querySelectorAll('.btn-home-apply').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!auth.isAuthenticated()) {
          setView('login');
          showToast('Login necessário', 'Acesse o portal para se candidatar às vagas.', '💼');
        } else {
          setView('dashboard');
        }
      });
    });
  }
}

// =====================================================================
// RENDERIZAÇÃO DO PÓS-LOGIN (DASHBOARD CONFORME PERMISSÃO)
// =====================================================================
function renderDashboard() {
  const role = auth.getRole();
  const panelYouth = document.getElementById('panel-youth');
  const panelAdmin = document.getElementById('panel-admin');

  const dashAvatar = document.getElementById('dash-avatar');
  const dashName = document.getElementById('dash-name');
  const dashRoleBadge = document.getElementById('dash-role-badge');
  const dashUserExtra = document.getElementById('dash-user-extra');
  const dashYouthStats = document.getElementById('dash-youth-stats');
  const dashSwitchYouthBox = document.getElementById('dash-switch-youth-box');

  if (role === 'admin') {
    // VISÃO DO ADMINISTRADOR
    panelYouth.classList.add('hidden');
    panelAdmin.classList.remove('hidden');

    const admin = store.data.adminUser;
    dashAvatar.textContent = 'G';
    dashAvatar.className = 'user-avatar admin-avatar';
    dashName.textContent = admin.name;
    dashRoleBadge.textContent = '🟣 Administrador';
    dashRoleBadge.className = 'badge badge-purple';
    dashUserExtra.textContent = admin.department;

    dashYouthStats.classList.add('hidden');
    dashSwitchYouthBox.classList.add('hidden');

    renderAdminDashboard();
  } else {
    // VISÃO DO JOVEM APRENDIZ
    panelYouth.classList.remove('hidden');
    panelAdmin.classList.add('hidden');

    const youth = store.getCurrentYouth();
    dashAvatar.textContent = youth.name.charAt(0);
    dashAvatar.className = 'user-avatar';
    dashName.textContent = youth.name;
    dashRoleBadge.textContent = '🟢 Jovem Aprendiz';
    dashRoleBadge.className = 'badge badge-emerald';
    dashUserExtra.textContent = `${youth.neighborhood} · ${youth.age} anos · ${youth.level}`;

    dashYouthStats.classList.remove('hidden');
    dashSwitchYouthBox.classList.remove('hidden');

    // Atualiza indicadores do jovem
    document.getElementById('dash-points-display').textContent = youth.points;
    document.getElementById('dash-streak-display').textContent = `🔥 ${youth.streakDays} dias`;

    const activeVouchers = store.getVouchers(youth.id);
    document.getElementById('dash-vouchers-count').textContent = activeVouchers.length;

    // Popula o seletor de jovem para simulação no MVP
    populateYouthSelector(youth.id);

    renderYouthDashboard();
  }
}

// Popula o seletor rápido de jovens (MVP simulation)
function populateYouthSelector(activeId) {
  const select = document.getElementById('select-active-youth');
  if (!select) return;

  const youths = store.getYouths();
  select.innerHTML = youths.map(y => `
    <option value="${y.id}" ${y.id === activeId ? 'selected' : ''}>
      ${y.name} (${y.age} anos · ${y.points} pts)
    </option>
  `).join('');
}

// =====================================================================
// PAINEL DO JOVEM APRENDIZ (SUB-ABAS)
// =====================================================================
function renderYouthDashboard() {
  const youth = store.getCurrentYouth();

  // 1. Meus Vouchers
  renderMyVouchers(youth);

  // 2. Vitrine de Cupons
  renderYouthCoupons(youth);

  // 3. Metas Diárias & Cursos
  renderYouthCourses(youth);

  // 4. Vagas e Candidaturas
  renderYouthJobs(youth);
}

// Renderiza Meus Vouchers Resgatados
function renderMyVouchers(youth) {
  const myVouchers = store.getVouchers(youth.id);
  const vouchersGrid = document.getElementById('my-vouchers-grid');
  const counterBadge = document.getElementById('vouchers-counter-badge');
  const vouchersSection = document.getElementById('my-vouchers-section');

  if (myVouchers.length === 0) {
    vouchersSection.style.display = 'none';
    return;
  }

  vouchersSection.style.display = 'block';
  counterBadge.textContent = `${myVouchers.length} Ativo${myVouchers.length > 1 ? 's' : ''}`;

  vouchersGrid.innerHTML = myVouchers.map(v => `
    <div class="content-card" style="border-left: 4px solid var(--color-success); background: #fdfdfd;">
      <div class="card-top">
        <span class="badge badge-emerald">Voucher Válido</span>
        <span style="font-size: 0.75rem; font-family: var(--font-mono); color: var(--color-text-muted);">
          Expira em ${v.expiresAt}
        </span>
      </div>
      <div class="card-title">${v.title}</div>
      <div style="font-size: 0.82rem; color: var(--color-text-muted); margin-bottom: 8px;">
        Parceiro: <strong>${v.partner}</strong>
      </div>
      <div style="background: #f1f5f9; padding: 8px 12px; border-radius: var(--radius-sm); font-family: var(--font-mono); font-size: 0.88rem; font-weight: 700; color: var(--color-primary); letter-spacing: 0.05em; margin-bottom: 12px; text-align: center;">
        ${v.code}
      </div>
      <button class="btn btn-sm btn-outline btn-view-voucher" data-code="${v.code}" data-title="${v.title}" data-partner="${v.partner}" style="width: 100%;">
        📱 Exibir QR Code na Loja
      </button>
    </div>
  `).join('');

  document.querySelectorAll('.btn-view-voucher').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const { code, title, partner } = e.currentTarget.dataset;
      openVoucherModal({ code, title, partner });
    });
  });
}

// Renderiza Vitrine de Cupons
function renderYouthCoupons(youth) {
  const couponsGrid = document.getElementById('youth-coupons-grid');
  let coupons = store.getCoupons();

  if (activeCouponCategory !== 'all') {
    coupons = coupons.filter(c => c.category === activeCouponCategory);
  }

  couponsGrid.innerHTML = coupons.map(c => {
    const canRedeem = youth.points >= c.pointsCost;
    return `
      <div class="content-card">
        <div class="card-top">
          <div class="card-icon-box">${c.icon}</div>
          <span class="badge ${canRedeem ? 'badge-indigo' : 'badge-amber'}">
            ${canRedeem ? c.badge : 'Pontos Insuficientes'}
          </span>
        </div>
        <div class="card-title">${c.title}</div>
        <div style="font-size: 0.82rem; font-weight: 700; color: var(--color-primary); margin-bottom: 4px;">
          ${c.partner} · ${c.category}
        </div>
        <p class="card-desc">${c.description}</p>
        <div class="card-footer">
          <div>
            <span class="points-cost">${c.pointsCost} pts</span>
            <div style="font-size: 0.72rem; color: var(--color-text-muted);">Seu saldo: ${youth.points} pts</div>
          </div>
          <button class="btn btn-sm ${canRedeem ? 'btn-success' : 'btn-secondary'} btn-redeem-coupon" data-id="${c.id}" ${!canRedeem ? 'disabled style="opacity: 0.6; cursor: not-allowed;"' : ''}>
            ${canRedeem ? 'Resgatar Cupom 🎉' : `Faltam ${c.pointsCost - youth.points} pts`}
          </button>
        </div>
      </div>
    `;
  }).join('');

  // Ação de resgate
  document.querySelectorAll('.btn-redeem-coupon').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const couponId = e.currentTarget.dataset.id;
      const res = store.redeemCoupon(couponId);
      if (res.success) {
        showToast('Resgate Concluído!', res.message, '🎉');
        openVoucherModal(res.voucher);
        renderDashboard();
      } else {
        showToast('Não foi possível resgatar', res.message, '⚠️');
      }
    });
  });
}

// Renderiza Cursos & Metas Diárias
function renderYouthCourses(youth) {
  // Metas Diárias
  const goalsContainer = document.getElementById('daily-goals-container');
  const goals = store.data.dailyGoals;
  const completedCount = youth.completedDailyGoals.length;
  document.getElementById('daily-goals-count').textContent = `${completedCount}/${goals.length} concluídas`;

  goalsContainer.innerHTML = goals.map(g => {
    const isDone = youth.completedDailyGoals.includes(g.id);
    return `
      <div style="border: 1px solid ${isDone ? 'var(--color-success)' : 'var(--color-border)'}; background: ${isDone ? 'var(--color-success-light)' : '#fff'}; border-radius: var(--radius-md); padding: 14px; display: flex; align-items: center; justify-content: space-between; gap: 10px;">
        <div>
          <div style="font-size: 0.85rem; font-weight: 700; color: var(--color-text-title);">
            ${g.icon} ${g.title}
          </div>
          <div style="font-size: 0.75rem; color: var(--color-text-muted);">
            Recompensa: +${g.points} pts
          </div>
        </div>
        <span style="font-size: 1.1rem;">
          ${isDone ? '✅' : '⏳'}
        </span>
      </div>
    `;
  }).join('');

  // Trilhas de Cursos
  const coursesGrid = document.getElementById('youth-courses-grid');
  const courses = store.getCourses();

  coursesGrid.innerHTML = courses.map(course => {
    const isCompleted = youth.completedCourses.includes(course.id);
    return `
      <div class="content-card">
        <div class="card-top">
          <div class="card-icon-box">${course.icon}</div>
          <span class="badge ${isCompleted ? 'badge-emerald' : 'badge-indigo'}">
            ${isCompleted ? 'Concluído' : course.category}
          </span>
        </div>
        <div class="card-title">${course.title}</div>
        <div style="font-size: 0.8rem; color: var(--color-text-muted); margin-bottom: 6px;">
          ⏱️ Duração: <strong>${course.workload}</strong> · <strong>${course.modulesCount} Módulos</strong>
        </div>
        <p class="card-desc">${course.description}</p>
        <div style="font-size: 0.78rem; font-weight: 600; color: var(--color-primary); margin-bottom: 14px;">
          ⭐ Desenvolve: ${course.skillsEarned}
        </div>
        <div class="card-footer">
          <span class="badge badge-emerald">+${course.pointsReward} pts</span>
          <button class="btn btn-sm btn-primary btn-complete-module" data-id="${course.id}">
            ${isCompleted ? 'Revisar / Fazer Aula Extra (+50 pts)' : 'Completar 1 Módulo (+50 pts) 🚀'}
          </button>
        </div>
      </div>
    `;
  }).join('');

  document.querySelectorAll('.btn-complete-module').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const courseId = e.currentTarget.dataset.id;
      const res = store.completeCourseModule(courseId);
      if (res.success) {
        showToast('Parabéns!', res.message, '⭐');
        renderDashboard();
      }
    });
  });
}

// Renderiza Vagas e Candidaturas
function renderYouthJobs(youth) {
  // 1. Minhas Candidaturas
  const myApplicationsList = document.getElementById('my-applications-list');
  const jobs = store.getJobs();
  const applications = youth.applications || [];

  if (applications.length === 0) {
    myApplicationsList.innerHTML = `
      <div style="text-align: center; padding: 24px; color: var(--color-text-muted); font-size: 0.9rem;">
        Você ainda não se candidatou a nenhuma vaga. Escolha uma das vagas recomendadas abaixo e envie sua candidatura!
      </div>
    `;
  } else {
    myApplicationsList.innerHTML = applications.map(app => {
      const job = jobs.find(j => j.id === app.jobId) || { title: 'Vaga de Aprendiz', company: 'Empresa Parceira' };
      const currentStep = app.step || 1;
      return `
        <div style="background: var(--color-surface-alt); border-radius: var(--radius-md); padding: 16px 20px; margin-bottom: 14px;">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; margin-bottom: 12px;">
            <div>
              <strong style="font-size: 1rem; color: var(--color-text-title);">${job.title}</strong>
              <span style="font-size: 0.85rem; color: var(--color-text-muted);"> na empresa <strong>${job.company}</strong></span>
            </div>
            <span class="badge badge-indigo">Status: ${app.status}</span>
          </div>

          <!-- Stepper Visual da Linha do Tempo -->
          <div class="timeline-stepper">
            <div class="timeline-step ${currentStep >= 1 ? (currentStep > 1 ? 'completed' : 'active') : ''}">
              <div class="step-dot">${currentStep > 1 ? '✓' : '1'}</div>
              <span>Inscrito</span>
            </div>
            <div class="timeline-step ${currentStep >= 2 ? (currentStep > 2 ? 'completed' : 'active') : ''}">
              <div class="step-dot">${currentStep > 2 ? '✓' : '2'}</div>
              <span>Triagem</span>
            </div>
            <div class="timeline-step ${currentStep >= 3 ? (currentStep > 3 ? 'completed' : 'active') : ''}">
              <div class="step-dot">${currentStep > 3 ? '✓' : '3'}</div>
              <span>Entrevista</span>
            </div>
            <div class="timeline-step ${currentStep >= 4 ? 'completed' : ''}">
              <div class="step-dot">${currentStep >= 4 ? '✓' : '4'}</div>
              <span>Contratação</span>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // 2. Vagas Disponíveis com Match
  const youthJobsGrid = document.getElementById('youth-jobs-grid');
  youthJobsGrid.innerHTML = jobs.map(job => {
    const matchPercent = store.calculateMatch(youth, job);
    const hasApplied = applications.some(a => a.jobId === job.id);

    return `
      <div class="content-card">
        <div class="card-top">
          <div class="card-icon-box">💼</div>
          <span class="badge ${matchPercent >= 85 ? 'badge-emerald' : 'badge-indigo'}" style="font-size: 0.82rem; font-weight: 800;">
            🎯 ${matchPercent}% de Match
          </span>
        </div>
        <div class="card-title">${job.title}</div>
        <div style="font-size: 0.85rem; font-weight: 700; color: var(--color-text-title); margin-bottom: 4px;">
          ${job.company} · ${job.location}
        </div>
        <div style="font-size: 0.8rem; color: var(--color-text-muted); margin-bottom: 10px;">
          💰 Bolsa: <strong>${job.salary}</strong> · Turno: <strong>${job.shift}</strong>
        </div>
        <p class="card-desc">${job.description}</p>
        <div style="font-size: 0.78rem; font-weight: 600; color: var(--color-primary); margin-bottom: 14px;">
          Requisitos: ${job.requiredSkills.join(', ')} (Faixa: ${job.ageRequirement})
        </div>
        <div class="card-footer">
          <span style="font-size: 0.78rem; color: var(--color-text-muted);">
            👥 ${job.candidatesCount} inscritos
          </span>
          <button class="btn btn-sm ${hasApplied ? 'btn-secondary' : 'btn-primary'} btn-apply-job" data-id="${job.id}" ${hasApplied ? 'disabled style="opacity: 0.7; cursor: default;"' : ''}>
            ${hasApplied ? '✓ Candidatura Enviada' : 'Candidatar-se com 1 Clique 🚀'}
          </button>
        </div>
      </div>
    `;
  }).join('');

  document.querySelectorAll('.btn-apply-job').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const jobId = e.currentTarget.dataset.id;
      const res = store.applyToJob(jobId);
      if (res.success) {
        showToast('Sucesso!', res.message, '💼');
        renderDashboard();
      } else {
        showToast('Aviso', res.message, 'ℹ️');
      }
    });
  });
}

// =====================================================================
// PAINEL DO ADMINISTRADOR (GESTÃO)
// =====================================================================
function renderAdminDashboard() {
  const youths = store.getYouths();
  const jobs = store.getJobs();
  const coupons = store.getCoupons();
  const vouchers = store.data.vouchers || [];

  // KPIs
  document.getElementById('admin-kpi-youths').textContent = youths.length + 245;
  document.getElementById('admin-kpi-jobs').textContent = jobs.length;
  document.getElementById('admin-kpi-vouchers').textContent = vouchers.length + 340;

  // 1. Banco de Talentos
  renderAdminTalents(youths);

  // 2. Vagas
  renderAdminJobs(jobs);

  // 3. Cupons
  renderAdminCoupons(coupons);
}

// Renderiza Tabela de Talentos (Admin)
function renderAdminTalents(youthsList) {
  const tbody = document.getElementById('admin-talents-tbody');
  const searchVal = (document.getElementById('search-talent-input')?.value || '').toLowerCase();
  const ageFilter = document.getElementById('filter-talent-age')?.value || 'all';

  let filtered = youthsList.filter(y => {
    // Filtro de busca
    const matchSearch = y.name.toLowerCase().includes(searchVal) ||
      y.neighborhood.toLowerCase().includes(searchVal) ||
      y.skills.some(s => s.name.toLowerCase().includes(searchVal));

    if (!matchSearch) return false;

    // Filtro de idade
    if (ageFilter === '18plus') return y.age >= 18;
    if (ageFilter === 'under18') return y.age < 18;
    return true;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 24px; color: var(--color-text-muted);">
          Nenhum jovem encontrado com os critérios de busca selecionados.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(y => {
    const skillsList = (y.skills || []).map(s => `${s.name} (${s.level})`).join(', ');
    const isAdult = y.age >= 18;

    return `
      <tr>
        <td>
          <strong>${y.name}</strong>
          <div style="font-size: 0.78rem; color: var(--color-text-muted);">${y.email}</div>
        </td>
        <td>
          ${y.age} anos · ${y.neighborhood}
          <div>
            <span class="badge ${isAdult ? 'badge-indigo' : 'badge-amber'}" style="font-size: 0.68rem; padding: 2px 6px;">
              ${isAdult ? '+18 anos (Geral)' : '14-17 anos (Menor LGPD)'}
            </span>
          </div>
        </td>
        <td style="max-width: 240px; font-size: 0.82rem;">
          ${skillsList || 'Em mapeamento'}
        </td>
        <td>
          <span class="badge badge-emerald" style="font-family: var(--font-mono); font-size: 0.82rem;">
            ⭐ ${y.points} pts
          </span>
        </td>
        <td>
          <span class="badge badge-indigo">
            ${(y.applications || []).length > 0 ? 'Em Processo Seletivo' : 'Disponível'}
          </span>
        </td>
        <td>
          <button class="btn btn-sm btn-outline btn-admin-action" data-id="${y.id}" style="font-size: 0.78rem;">
            Ver Perfil
          </button>
        </td>
      </tr>
    `;
  }).join('');

  document.querySelectorAll('.btn-admin-action').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const youthId = e.currentTarget.dataset.id;
      const found = youthsList.find(y => y.id === youthId);
      if (found) {
        showToast(`Perfil de ${found.name}`, `Aluno com ${found.points} pts no Clube e ${(found.skills || []).length} habilidades mapeadas.`, '👤');
      }
    });
  });
}

// Renderiza Vagas na visão Admin
function renderAdminJobs(jobs) {
  const adminJobsGrid = document.getElementById('admin-jobs-grid');
  adminJobsGrid.innerHTML = jobs.map(j => `
    <div class="content-card">
      <div class="card-top">
        <div class="card-icon-box">💼</div>
        <span class="badge badge-purple">${j.badge}</span>
      </div>
      <div class="card-title">${j.title}</div>
      <div style="font-size: 0.85rem; font-weight: 700; color: var(--color-text-title); margin-bottom: 4px;">
        Empresa: <strong>${j.company}</strong>
      </div>
      <div style="font-size: 0.8rem; color: var(--color-text-muted); margin-bottom: 8px;">
        Bolsa: ${j.salary} · Turno: ${j.shift}
      </div>
      <p class="card-desc">${j.description}</p>
      <div class="card-footer">
        <span class="badge badge-emerald">👥 ${j.candidatesCount || 0} Jovens Inscritos</span>
        <button class="btn btn-sm btn-outline" onclick="alert('Funcionalidade de exportar triagem pronta no MVP!')">
          Triar Candidatos
        </button>
      </div>
    </div>
  `).join('');
}

// Renderiza Cupons na visão Admin
function renderAdminCoupons(coupons) {
  const adminCouponsGrid = document.getElementById('admin-coupons-grid');
  adminCouponsGrid.innerHTML = coupons.map(c => `
    <div class="content-card">
      <div class="card-top">
        <div class="card-icon-box">${c.icon}</div>
        <span class="badge badge-emerald">Estoque: ${c.stock || 50} un</span>
      </div>
      <div class="card-title">${c.title}</div>
      <div style="font-size: 0.85rem; font-weight: 700; color: var(--color-primary); margin-bottom: 4px;">
        ${c.partner} · ${c.category}
      </div>
      <p class="card-desc">${c.description}</p>
      <div class="card-footer">
        <span class="points-cost">${c.pointsCost} pts</span>
        <span class="badge badge-indigo">Ativo no Clube</span>
      </div>
    </div>
  `).join('');
}

// =====================================================================
// GERADOR DE QR CODE EM SVG PURO (VANILLA JS DETERMINÍSTICO)
// =====================================================================
function generateSvgQrCode(text, size = 180) {
  // Gera uma matriz 21x21 visualmente autêntica baseada no hash do texto
  const matrixSize = 21;
  const cellSize = size / matrixSize;

  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash) + text.charCodeAt(i);
    hash |= 0;
  }

  let rects = '';

  for (let r = 0; r < matrixSize; r++) {
    for (let c = 0; c < matrixSize; c++) {
      // Padrões de posição nos 3 cantos (Finder Patterns)
      const isCornerTopLeft = (r < 7 && c < 7);
      const isCornerTopRight = (r < 7 && c >= matrixSize - 7);
      const isCornerBottomLeft = (r >= matrixSize - 7 && c < 7);

      let isBlack = false;

      if (isCornerTopLeft || isCornerTopRight || isCornerBottomLeft) {
        const localR = isCornerBottomLeft ? r - (matrixSize - 7) : r;
        const localC = isCornerTopRight ? c - (matrixSize - 7) : c;
        if (localR === 0 || localR === 6 || localC === 0 || localC === 6) isBlack = true;
        else if (localR >= 2 && localR <= 4 && localC >= 2 && localC <= 4) isBlack = true;
      } else {
        // Gera pixels com base no hash e coordenadas
        const pseudoRand = Math.sin(hash + r * 31 + c * 17) * 10000;
        isBlack = (pseudoRand - Math.floor(pseudoRand)) > 0.45;
      }

      if (isBlack) {
        rects += `<rect x="${c * cellSize}" y="${r * cellSize}" width="${cellSize}" height="${cellSize}" fill="#0f172a" />`;
      }
    }
  }

  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" class="qr-code-svg" xmlns="http://www.w3.org/2000/svg" style="border-radius: 8px; background: #fff; padding: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.06);">
      ${rects}
    </svg>
  `;
}

// Modal de Voucher
function openVoucherModal(voucher) {
  const modal = document.getElementById('modal-voucher');
  document.getElementById('modal-voucher-partner').innerHTML = `Parceria: <strong>${voucher.partner}</strong>`;
  document.getElementById('modal-voucher-title').textContent = voucher.title;
  document.getElementById('modal-voucher-code').textContent = voucher.code;

  const qrContainer = document.getElementById('modal-voucher-qrcode-svg');
  qrContainer.innerHTML = generateSvgQrCode(voucher.code, 190);

  modal.classList.remove('hidden');
}

function closeVoucherModal() {
  document.getElementById('modal-voucher').classList.add('hidden');
}

// =====================================================================
// CHAT DO MENTOR VIRTUAL IA (MULTI-TURN)
// =====================================================================
async function sendChatMessage(userText) {
  const messagesBox = document.getElementById('chat-messages-box');
  const youth = store.getCurrentYouth();

  // Adiciona bolha do usuário
  const userBubble = document.createElement('div');
  userBubble.className = 'chat-bubble user';
  userBubble.textContent = userText;
  messagesBox.appendChild(userBubble);
  messagesBox.scrollTop = messagesBox.scrollHeight;

  // Bolha de carregamento do bot
  const botBubble = document.createElement('div');
  botBubble.className = 'chat-bubble bot';
  botBubble.innerHTML = '<em>Digitando orientação pedagógica...</em>';
  messagesBox.appendChild(botBubble);
  messagesBox.scrollTop = messagesBox.scrollHeight;

  try {
    // Tenta chamar o endpoint backend do Express
    const res = await fetch('/api/ai/assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mode: 'entrevista',
        message: userText,
        youthName: youth.name,
        youthAge: youth.age,
        skills: youth.skills,
        targetJob: 'Jovem Aprendiz Administrativo'
      })
    });

    if (res.ok) {
      const data = await res.json();
      botBubble.textContent = data.reply;
    } else {
      throw new Error('Servidor offline');
    }
  } catch (err) {
    // Respostas inteligentes de fallback para simulação offline completa do MVP
    setTimeout(() => {
      let reply = '';
      const text = userText.toLowerCase();

      if (text.includes('entrevista') || text.includes('comportar')) {
        reply = `Excelente pergunta, ${youth.name}! Em uma entrevista para Jovem Aprendiz:\n\n1. Chegue com 15 min de antecedência ou teste o link 10 min antes se for online.\n2. Quando perguntarem sobre suas qualidades, mencione que você estuda ativamente na Aprendizagem Jovem (sua ofensiva de ${youth.streakDays} dias mostra dedicação!).\n3. Conte uma situação em que você aprendeu algo novo rápido.\n\nQuer simular uma pergunta real agora? "Como você lidaria com uma tarefa que nunca fez antes?"`;
      } else if (text.includes('currículo') || text.includes('experiência')) {
        reply = `Ótima dúvida! Para o primeiro emprego, as empresas valorizam muito sua vontade de aprender. No seu currículo:\n\n• Destaque suas habilidades em ${youth.skills.map(s => s.name).join(', ')}.\n• Cite seus cursos da Aprendizagem Jovem e projetos escolares.\n• Mostre sua assiduidade e foco em desenvolvimento contínuo.`;
      } else if (text.includes('excel') || text.includes('fórmula')) {
        reply = `No teste de Excel para vagas administrativas, as 4 fórmulas mais cobradas são: SOMA, MÉDIA, SE e PROCV (ou PROCX). Conclua o curso de Excel Essencial na aba "Cursos" para dominar essas planilhas e garantir 100% de match!`;
      } else {
        reply = `Muito bem colocado, ${youth.name}! Essa atitude de buscar conhecimento faz toda a diferença nos processos seletivos. Recomendo também concluir sua meta diária de hoje para somar mais pontos no Clube de Benefícios e fortalecer seu perfil para as empresas parceiras!`;
      }

      botBubble.textContent = reply;
      messagesBox.scrollTop = messagesBox.scrollHeight;
    }, 600);
  }
}

// =====================================================================
// TOAST NOTIFICATIONS (SISTEMA DE AVISO)
// =====================================================================
let toastTimer = null;
function showToast(title, message, icon = '✅') {
  const toast = document.getElementById('toast-banner');
  document.getElementById('toast-icon').textContent = icon;
  document.getElementById('toast-title').textContent = title;
  document.getElementById('toast-msg').textContent = message;

  toast.classList.remove('hidden');

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.add('hidden');
  }, 4500);
}

// =====================================================================
// INICIALIZAÇÃO DE EVENTOS DO DOM
// =====================================================================
document.addEventListener('DOMContentLoaded', () => {
  // Navegação do Header
  document.getElementById('btn-brand-home')?.addEventListener('click', () => setView('home'));
  document.getElementById('btn-nav-login')?.addEventListener('click', () => setView('login'));
  document.getElementById('hero-btn-login')?.addEventListener('click', () => setView('login'));
  document.getElementById('btn-cta-bottom')?.addEventListener('click', () => setView('login'));
  document.getElementById('btn-preview-login-club')?.addEventListener('click', () => setView('login'));
  document.getElementById('btn-preview-login-jobs')?.addEventListener('click', () => setView('login'));

  // Botão Voltar da tela de login
  document.getElementById('btn-login-back-home')?.addEventListener('click', () => setView('home'));

  // Scroll suave para links públicos da Home
  document.querySelectorAll('[data-scroll]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = e.currentTarget.dataset.scroll;
      if (currentView !== 'home') setView('home');
      setTimeout(() => {
        document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    });
  });

  // BOTÕES DE ACESSO RÁPIDO DO MVP (1 CLIQUE)
  document.getElementById('hero-btn-demo-youth')?.addEventListener('click', () => {
    auth.loginAsYouth();
    setView('dashboard');
    showToast('Acesso de Demonstração', 'Você entrou com o perfil de Jovem Aprendiz (Lucas Silva).', '👤');
  });

  document.getElementById('hero-btn-demo-admin')?.addEventListener('click', () => {
    auth.loginAsAdmin();
    setView('dashboard');
    showToast('Acesso Administrativo', 'Você entrou no Painel de Gestão da Aprendizagem Jovem.', '⚙️');
  });

  document.getElementById('btn-quick-youth')?.addEventListener('click', () => {
    auth.loginAsYouth();
    setView('dashboard');
    showToast('Bem-vindo ao Portal!', 'Logado como Jovem Aprendiz com acesso a benefícios e vagas.', '🎓');
  });

  document.getElementById('btn-quick-admin')?.addEventListener('click', () => {
    auth.loginAsAdmin();
    setView('dashboard');
    showToast('Painel Admin Aberto', 'Acesso de Gestão Institucional liberado.', '🟣');
  });

  // Alternar Papel em 1 clique (Header)
  document.getElementById('btn-toggle-role')?.addEventListener('click', () => {
    auth.toggleRole();
    const role = auth.getRole();
    setView('dashboard');
    showToast('Perfil Alternado!', `Agora você está navegando como ${role === 'admin' ? 'Administrador' : 'Jovem Aprendiz'}.`, '⇄');
  });

  // Logout
  document.getElementById('btn-logout')?.addEventListener('click', () => {
    auth.logout();
    setView('home');
    showToast('Sessão Encerrada', 'Você saiu da sua conta com sucesso.', '👋');
  });

  // Abas de Login / Cadastro
  const tabLoginBtn = document.getElementById('tab-login-btn');
  const tabRegisterBtn = document.getElementById('tab-register-btn');
  const formLogin = document.getElementById('form-login');
  const formRegister = document.getElementById('form-register');

  tabLoginBtn?.addEventListener('click', () => {
    tabLoginBtn.classList.add('active');
    tabRegisterBtn.classList.remove('active');
    formLogin.classList.remove('hidden');
    formRegister.classList.add('hidden');
  });

  tabRegisterBtn?.addEventListener('click', () => {
    tabRegisterBtn.classList.add('active');
    tabLoginBtn.classList.remove('active');
    formRegister.classList.remove('hidden');
    formLogin.classList.add('hidden');
  });

  // Formulário de Login Tradicional
  formLogin?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const role = document.getElementById('login-role').value;

    const res = auth.loginWithCredentials(email, password, role);
    if (res.success) {
      setView('dashboard');
      showToast('Login realizado!', `Bem-vindo(a) de volta à Aprendizagem Jovem.`, '✅');
    }
  });

  // Formulário de Cadastro de Novo Jovem
  formRegister?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const age = document.getElementById('reg-age').value;
    const shift = document.getElementById('reg-shift').value;
    const neighborhood = document.getElementById('reg-neighborhood').value;

    const newYouth = store.registerYouth({ name, email, age, shift, neighborhood });
    auth.loginAsYouth(newYouth.id);
    setView('dashboard');
    showToast('Cadastro Concluído!', 'Você ganhou +100 pontos de boas-vindas no Clube!', '🎉');
  });

  // Seletor de Simulação de Jovem (Dashboard)
  document.getElementById('select-active-youth')?.addEventListener('change', (e) => {
    store.setActiveYouth(e.target.value);
    renderDashboard();
    showToast('Perfil Atualizado', 'Dados do jovem selecionado carregados com sucesso.', '🔄');
  });

  // Abas do Jovem Aprendiz
  document.querySelectorAll('[data-tab]').forEach(tabBtn => {
    tabBtn.addEventListener('click', (e) => {
      document.querySelectorAll('[data-tab]').forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');

      const targetTabId = e.currentTarget.dataset.tab;
      activeYouthSubTab = targetTabId;

      document.querySelectorAll('.dash-tab-content').forEach(c => c.classList.add('hidden'));
      document.getElementById(`tab-${targetTabId}`)?.classList.remove('hidden');
    });
  });

  // Filtro de Cupons por Categoria
  document.querySelectorAll('.filter-coupon-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.filter-coupon-btn').forEach(b => {
        b.className = 'btn btn-sm btn-secondary filter-coupon-btn';
      });
      e.currentTarget.className = 'btn btn-sm btn-primary filter-coupon-btn active';
      activeCouponCategory = e.currentTarget.dataset.cat;
      renderYouthCoupons(store.getCurrentYouth());
    });
  });

  // Abas do Administrador
  document.querySelectorAll('[data-admin-tab]').forEach(tabBtn => {
    tabBtn.addEventListener('click', (e) => {
      document.querySelectorAll('[data-admin-tab]').forEach(b => b.classList.remove('active', 'active-admin'));
      e.currentTarget.classList.add('active', 'active-admin');

      const targetTabId = e.currentTarget.dataset.adminTab;
      activeAdminSubTab = targetTabId;

      document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.add('hidden'));
      document.getElementById(`tab-${targetTabId}`)?.classList.remove('hidden');
    });
  });

  // Filtros do Banco de Talentos (Admin)
  document.getElementById('search-talent-input')?.addEventListener('input', () => {
    renderAdminTalents(store.getYouths());
  });

  document.getElementById('filter-talent-age')?.addEventListener('change', () => {
    renderAdminTalents(store.getYouths());
  });

  // Modal de Nova Vaga (Admin)
  const modalNewJob = document.getElementById('modal-new-job');
  document.getElementById('btn-modal-new-job')?.addEventListener('click', () => {
    modalNewJob.classList.remove('hidden');
  });
  document.getElementById('btn-close-job-modal')?.addEventListener('click', () => {
    modalNewJob.classList.add('hidden');
  });

  document.getElementById('form-new-job')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('new-job-title').value;
    const company = document.getElementById('new-job-company').value;
    const salary = document.getElementById('new-job-salary').value;
    const shift = document.getElementById('new-job-shift').value;
    const desc = document.getElementById('new-job-desc').value;
    const skills = document.getElementById('new-job-skills').value.split(',').map(s => s.trim()).filter(Boolean);

    store.createJob({
      title,
      company,
      salary,
      shift,
      description: desc,
      requiredSkills: skills
    });

    modalNewJob.classList.add('hidden');
    document.getElementById('form-new-job').reset();
    showToast('Vaga Publicada!', `A oportunidade para ${title} já está aberta para candidaturas.`, '💼');
    renderDashboard();
  });

  // Modal de Novo Cupom (Admin)
  document.getElementById('btn-modal-new-coupon')?.addEventListener('click', () => {
    showToast('Recurso do MVP', 'Gestão de convênios conectada ao catálogo de parceiros.', '🎁');
  });

  // Fechar Modais
  document.getElementById('btn-close-voucher-modal')?.addEventListener('click', closeVoucherModal);
  document.getElementById('btn-ok-voucher')?.addEventListener('click', closeVoucherModal);
  document.getElementById('toast-close')?.addEventListener('click', () => {
    document.getElementById('toast-banner').classList.add('hidden');
  });

  // Envio de Mensagem no Chat IA
  document.getElementById('form-chat')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('chat-user-input');
    const val = input.value.trim();
    if (!val) return;
    input.value = '';
    sendChatMessage(val);
  });

  // Perguntas rápidas do Mentor IA
  document.querySelectorAll('.quick-prompt-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const prompt = e.currentTarget.dataset.prompt;
      sendChatMessage(prompt);
    });
  });

  // Inicializa na tela Home (ou Dashboard se já estiver autenticado)
  if (auth.isAuthenticated()) {
    setView('dashboard');
  } else {
    setView('home');
  }
});
