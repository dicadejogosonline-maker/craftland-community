// Estado global
const state = {
  currentUser: null,
  currentPage: 'home',
  maps: [],
  comments: {},
  likes: {}
};

// Renderizar app
function renderApp() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <nav class="navbar">
      <div class="navbar-brand">🎮 CRAFTLAND</div>
      <div class="navbar-menu" id="navbar-menu"></div>
    </nav>
    <div id="page-content"></div>
  `;
  
  renderNavbar();
  checkSession();
}

// Navbar
function renderNavbar() {
  const navMenu = document.getElementById('navbar-menu');
  let html = '';

  if (state.currentUser) {
    html = `
      <a href="#" onclick="goToPage('explore')" class="nav-link">Explorar</a>
      <a href="#" onclick="goToPage('publish')" class="nav-link">Publicar Mapa</a>
      <a href="#" onclick="goToPage('rankings')" class="nav-link">Rankings</a>
      <a href="#" onclick="goToPage('profile')" class="nav-link">Perfil</a>
      ${state.currentUser.isAdmin ? '<a href="#" onclick="goToPage(\"admin\")" class="nav-link" style="color: var(--accent-gold);">⚙️ Admin</a>' : ''}
      <button onclick="logout()" class="nav-btn">Sair</button>
    `;
  } else {
    html = `
      <a href="#" onclick="goToPage('home')" class="nav-link">Início</a>
      <button onclick="showModal('login-modal')" class="nav-btn">Entrar</button>
      <button onclick="showModal('register-modal')" class="nav-btn">Registrar</button>
    `;
  }

  navMenu.innerHTML = html;
}

// Verificar sessão
async function checkSession() {
  try {
    const res = await fetch('/api/auth/session');
    if (res.ok) {
      state.currentUser = (await res.json()).user;
      renderNavbar();
      goToPage(state.currentPage);
    } else {
      goToPage('home');
    }
  } catch (error) {
    console.error('Erro ao verificar sessão:', error);
    goToPage('home');
  }
}

// Navegar para página
function goToPage(page) {
  state.currentPage = page;
  const content = document.getElementById('page-content');

  switch (page) {
    case 'home':
      content.innerHTML = renderHome();
      break;
    case 'explore':
      if (!state.currentUser) return goToPage('home');
      content.innerHTML = renderExplore();
      loadMaps();
      break;
    case 'publish':
      if (!state.currentUser) return goToPage('home');
      content.innerHTML = renderPublish();
      break;
    case 'rankings':
      content.innerHTML = renderRankings();
      loadRankings();
      break;
    case 'profile':
      if (!state.currentUser) return goToPage('home');
      content.innerHTML = renderProfile();
      loadProfile();
      break;
    case 'admin':
      if (!state.currentUser || !state.currentUser.isAdmin) return goToPage('home');
      content.innerHTML = renderAdmin();
      loadAdminDashboard();
      break;
    default:
      goToPage('home');
  }
}

// HOME PAGE
function renderHome() {
  return `
    <div class="container">
      <div style="text-align: center; padding: 3rem 0;">
        <h1 style="font-size: 3rem; margin-bottom: 1rem; background: linear-gradient(135deg, #7c3aed, #f59e0b); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">CRAFTLAND COMMUNITY</h1>
        <p style="font-size: 1.2rem; color: var(--text-secondary); margin-bottom: 2rem;">Compartilhe seus mapas favoritos com a comunidade</p>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; margin-top: 3rem;">
          <div class="card" style="text-align: left;">
            <h3 style="color: var(--accent-gold); margin-bottom: 0.5rem;">📍 Publicar Mapas</h3>
            <p class="card-text">Compartilhe seus mapas personalizados com a comunidade Craftland</p>
          </div>
          <div class="card" style="text-align: left;">
            <h3 style="color: var(--accent-gold); margin-bottom: 0.5rem;">👥 Comunidade Ativa</h3>
            <p class="card-text">Conecte-se com outros jogadores e veja os mapas mais populares</p>
          </div>
          <div class="card" style="text-align: left;">
            <h3 style="color: var(--accent-gold); margin-bottom: 0.5rem;">⭐ Rankings</h3>
            <p class="card-text">Descobra os mapas mais curtidos e melhor avaliados</p>
          </div>
        </div>
      </div>

      ${renderAuthModals()}
    </div>
  `;
}

// AUTH MODALS
function renderAuthModals() {
  return `
    <div id="login-modal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">Entrar</h2>
          <button class="close-btn" onclick="closeModal('login-modal')">✕</button>
        </div>
        <form onsubmit="handleLogin(event)">
          <div class="form-group">
            <label>Email</label>
            <input type="email" id="login-email" required>
          </div>
          <div class="form-group">
            <label>Senha</label>
            <input type="password" id="login-password" required>
          </div>
          <button type="submit" class="btn btn-primary" style="width: 100%;">Entrar</button>
        </form>
      </div>
    </div>

    <div id="register-modal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">Registrar</h2>
          <button class="close-btn" onclick="closeModal('register-modal')">✕</button>
        </div>
        <form onsubmit="handleRegister(event)">
          <div class="form-group">
            <label>Nome de usuário</label>
            <input type="text" id="register-username" required>
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" id="register-email" required>
          </div>
          <div class="form-group">
            <label>Senha</label>
            <input type="password" id="register-password" required>
          </div>
          <button type="submit" class="btn btn-primary" style="width: 100%;">Registrar</button>
        </form>
      </div>
    </div>
  `;
}

// EXPLORE PAGE
function renderExplore() {
  return `
    <div class="container">
      <h1 style="margin-bottom: 1rem; color: var(--accent-gold);">Explorar Mapas</h1>
      
      <div style="margin-bottom: 2rem;">
        <input type="text" id="search-input" placeholder="Buscar por nome, criador ou Room ID..." style="margin-bottom: 1rem;">
        <button onclick="searchMaps()" class="btn btn-primary">Buscar</button>
      </div>

      <div id="maps-container" class="grid"></div>
    </div>
  `;
}

// PUBLISH PAGE
function renderPublish() {
  return `
    <div class="container">
      <h1 style="margin-bottom: 2rem; color: var(--accent-gold);">Publicar Novo Mapa</h1>
      
      <div class="card" style="max-width: 600px;">
        <form onsubmit="handlePublishMap(event)">
          <div class="form-group">
            <label>Nome do Mapa</label>
            <input type="text" id="map-name" required>
          </div>
          
          <div class="form-group">
            <label>Room ID</label>
            <input type="text" id="room-id" required>
          </div>
          
          <div class="form-group">
            <label>Senha VIP (Opcional)</label>
            <input type="text" id="vip-password">
          </div>
          
          <div class="form-group">
            <label>Categoria</label>
            <select id="category" required>
              <option value="">Selecione uma categoria</option>
              <option value="Aventura">Aventura</option>
              <option value="Puzzle">Puzzle</option>
              <option value="Sobrevivência">Sobrevivência</option>
              <option value="Parkour">Parkour</option>
              <option value="PvP">PvP</option>
              <option value="Criativo">Criativo</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Descrição</label>
            <textarea id="map-description" required></textarea>
          </div>
          
          <div class="form-group">
            <label>Imagem do Mapa</label>
            <input type="file" id="map-image" accept="image/*" required>
            <div id="image-preview" style="margin-top: 1rem;"></div>
          </div>
          
          <button type="submit" class="btn btn-primary" style="width: 100%;">Publicar Mapa</button>
        </form>
      </div>
    </div>
  `;
}

// PROFILE PAGE
function renderProfile() {
  return `
    <div class="container">
      <h1 style="margin-bottom: 2rem; color: var(--accent-gold);">Meu Perfil</h1>
      
      <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 2rem;">
        <div class="card" style="text-align: center;">
          <div id="profile-avatar" style="margin-bottom: 1rem;"></div>
          <button onclick="triggerAvatarUpload()" class="btn btn-secondary">Alterar Avatar</button>
          <input type="file" id="avatar-input" accept="image/*" style="display: none;" onchange="handleAvatarUpload()">
        </div>
        
        <div class="card">
          <form onsubmit="handleProfileUpdate(event)">
            <div class="form-group">
              <label>Nome de usuário</label>
              <input type="text" id="profile-username" required>
            </div>
            
            <div class="form-group">
              <label>Bio</label>
              <textarea id="profile-bio"></textarea>
            </div>
            
            <button type="submit" class="btn btn-primary" style="width: 100%;">Salvar Perfil</button>
          </form>
        </div>
      </div>
    </div>
  `;
}

// RANKINGS PAGE
function renderRankings() {
  return `
    <div class="container">
      <h1 style="margin-bottom: 2rem; color: var(--accent-gold);">Rankings</h1>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
        <div>
          <h2 style="color: var(--accent-green); margin-bottom: 1rem;">❤️ Mais Curtidos</h2>
          <div id="most-liked-ranking"></div>
        </div>
        
        <div>
          <h2 style="color: var(--accent-gold); margin-bottom: 1rem;">⭐ Melhor Avaliados</h2>
          <div id="highest-rated-ranking"></div>
        </div>
      </div>
    </div>
  `;
}

// ADMIN PAGE
function renderAdmin() {
  return `
    <div class="container">
      <h1 style="margin-bottom: 2rem; color: var(--accent-gold);">⚙️ Painel do Administrador</h1>
      
      <div class="grid-large" id="admin-stats"></div>
      
      <h2 style="margin-top: 3rem; color: var(--accent-purple);">Mapas Pendentes de Aprovação</h2>
      <div id="pending-maps" style="margin-top: 1.5rem;"></div>
    </div>
  `;
}

// ============ FUNCIONALIDADES ============

// Login
async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (res.ok) {
      state.currentUser = (await res.json()).user;
      closeModal('login-modal');
      renderNavbar();
      goToPage('explore');
    } else {
      alert('Email ou senha inválidos');
    }
  } catch (error) {
    console.error('Erro ao fazer login:', error);
  }
}

// Register
async function handleRegister(e) {
  e.preventDefault();
  const username = document.getElementById('register-username').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;

  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });

    if (res.ok) {
      state.currentUser = (await res.json()).user;
      closeModal('register-modal');
      renderNavbar();
      goToPage('explore');
    } else {
      alert((await res.json()).error);
    }
  } catch (error) {
    console.error('Erro ao registrar:', error);
  }
}

// Logout
function logout() {
  fetch('/api/auth/logout');
  state.currentUser = null;
  renderNavbar();
  goToPage('home');
}

// Load maps
async function loadMaps() {
  try {
    const res = await fetch('/api/maps');
    state.maps = await res.json();
    renderMaps(state.maps);
  } catch (error) {
    console.error('Erro ao carregar mapas:', error);
  }
}

// Render maps
function renderMaps(maps) {
  const container = document.getElementById('maps-container');
  
  if (maps.length === 0) {
    container.innerHTML = '<p style="color: var(--text-secondary);">Nenhum mapa encontrado</p>';
    return;
  }

  container.innerHTML = maps.map(map => `
    <div class="map-card" onclick="viewMapDetails('${map.id}')" style="cursor: pointer;">
      <img src="${map.image}" alt="${map.mapName}" class="map-image">
      <div class="map-content">
        <h3 class="map-name">${map.mapName}</h3>
        <p class="map-creator">Por ${map.creator}</p>
        <div class="map-room-id">
          <code>${map.roomId}</code>
          <button class="copy-btn" onclick="copyToClipboard('${map.roomId}', event)">Copiar</button>
        </div>
        <span class="map-category">${map.category}</span>
        <p class="map-description">${map.description}</p>
        ${map.rating > 0 ? `<p class="map-rating">⭐ ${map.rating}/10</p>` : ''}
        <div class="map-stats">
          <div class="stat">❤️ ${map.likeCount || 0}</div>
          <div class="stat">💬 ${map.commentCount || 0}</div>
        </div>
      </div>
    </div>
  `).join('');
}

// View map details
function viewMapDetails(mapId) {
  const map = state.maps.find(m => m.id === mapId);
  if (!map) return;

  const modal = document.createElement('div');
  modal.className = 'modal active';
  modal.innerHTML = `
    <div class="modal-content" style="max-width: 700px; max-height: 90vh; overflow-y: auto;">
      <div class="modal-header">
        <h2 class="modal-title">${map.mapName}</h2>
        <button class="close-btn" onclick="this.parentElement.parentElement.remove()">✕</button>
      </div>
      
      <img src="${map.image}" alt="${map.mapName}" style="width: 100%; height: 300px; object-fit: cover; border-radius: 5px; margin-bottom: 1.5rem;">
      
      <p><strong>Criador:</strong> ${map.creator}</p>
      <div class="map-room-id" style="margin: 1rem 0;">
        <code>${map.roomId}</code>
        <button class="copy-btn" onclick="copyToClipboard('${map.roomId}', event)">Copiar</button>
      </div>
      <p><strong>Categoria:</strong> ${map.category}</p>
      <p><strong>Descrição:</strong> ${map.description}</p>
      ${map.vipPassword ? `<p><strong>Senha VIP:</strong> ${map.vipPassword}</p>` : ''}
      ${map.rating > 0 ? `<p><strong>Avaliação:</strong> ⭐ ${map.rating}/10</p>` : ''}
      ${map.adminReview ? `<p><strong>Avaliação do Admin:</strong> ${map.adminReview}</p>` : ''}
      
      <div style="margin-top: 1.5rem;">
        <button id="like-btn" class="like-btn" onclick="toggleLike('${map.id}', event)" style="width: 100%; margin-bottom: 1rem;">❤️ Curtir</button>
      </div>
      
      <div style="margin-top: 1.5rem;">
        <h3 style="color: var(--accent-purple); margin-bottom: 1rem;">Comentários</h3>
        <div id="comments-section"></div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });

  loadCommentsForMap(mapId, modal);
  checkIfLiked(mapId, modal);
}

// Load comments
async function loadCommentsForMap(mapId, modalElement) {
  try {
    const res = await fetch(`/api/maps/${mapId}/comments`);
    const comments = await res.json();
    const section = modalElement.querySelector('#comments-section');
    
    let html = `
      <form onsubmit="handlePostComment('${mapId}', event)">
        <div class="form-group">
          <textarea id="comment-text" placeholder="Adicione um comentário..." required></textarea>
        </div>
        <button type="submit" class="btn btn-primary">Comentar</button>
      </form>
      <div style="margin-top: 1.5rem;">
    `;

    comments.forEach(comment => {
      html += `
        <div class="comment">
          <div class="comment-header">
            <span class="comment-author">${comment.username}</span>
            <span class="comment-date">${new Date(comment.createdAt).toLocaleDateString('pt-BR')}</span>
          </div>
          <p class="comment-text">${comment.text}</p>
          <button class="reply-btn" onclick="toggleReplyForm('reply-form-${comment.id}', event)">Responder</button>
          
          <div id="reply-form-${comment.id}" style="display: none; margin-top: 1rem;">
            <form onsubmit="handleReplyComment('${mapId}', '${comment.id}', event)">
              <textarea placeholder="Sua resposta..." required style="margin-bottom: 0.5rem;"></textarea>
              <button type="submit" class="btn btn-primary btn-small">Responder</button>
            </form>
          </div>
          
          ${comment.replies && comment.replies.length > 0 ? `
            <div class="replies">
              ${comment.replies.map(reply => `
                <div class="comment" style="margin-left: 1rem; margin-top: 0.5rem;">
                  <div class="comment-header">
                    <span class="comment-author">${reply.username}</span>
                    <span class="comment-date">${new Date(reply.createdAt).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <p class="comment-text">${reply.text}</p>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>
      `;
    });

    html += '</div>';
    section.innerHTML = html;
  } catch (error) {
    console.error('Erro ao carregar comentários:', error);
  }
}

// Publish map
async function handlePublishMap(e) {
  e.preventDefault();
  
  const mapName = document.getElementById('map-name').value;
  const roomId = document.getElementById('room-id').value;
  const vipPassword = document.getElementById('vip-password').value;
  const category = document.getElementById('category').value;
  const description = document.getElementById('map-description').value;
  const imageInput = document.getElementById('map-image');

  if (!imageInput.files[0]) {
    alert('Selecione uma imagem para o mapa');
    return;
  }

  const formData = new FormData();
  formData.append('mapName', mapName);
  formData.append('roomId', roomId);
  formData.append('vipPassword', vipPassword);
  formData.append('category', category);
  formData.append('description', description);
  formData.append('image', imageInput.files[0]);

  try {
    const res = await fetch('/api/maps', {
      method: 'POST',
      body: formData
    });

    if (res.ok) {
      alert('Mapa publicado! Aguardando aprovação do administrador.');
      document.querySelector('form').reset();
      goToPage('explore');
    } else {
      alert((await res.json()).error);
    }
  } catch (error) {
    console.error('Erro ao publicar mapa:', error);
  }
}

// Copy to clipboard
function copyToClipboard(text, event) {
  event.stopPropagation();
  navigator.clipboard.writeText(text).then(() => {
    alert('Room ID copiado!');
  });
}

// Like map
async function toggleLike(mapId, event) {
  event.stopPropagation();
  try {
    const res = await fetch(`/api/maps/${mapId}/like`, { method: 'POST' });
    const data = await res.json();
    if (res.ok) {
      loadMaps();
      checkIfLiked(mapId, event.target.closest('.modal-content'));
    }
  } catch (error) {
    console.error('Erro ao curtir mapa:', error);
  }
}

// Check if liked
async function checkIfLiked(mapId, modalElement) {
  try {
    const res = await fetch(`/api/maps/${mapId}/likes`);
    const data = await res.json();
    const btn = modalElement.querySelector('#like-btn');
    if (data.userLiked) {
      btn.classList.add('liked');
      btn.textContent = '❤️ Curtido';
    } else {
      btn.classList.remove('liked');
      btn.textContent = '❤️ Curtir';
    }
  } catch (error) {
    console.error('Erro ao verificar curtida:', error);
  }
}

// Post comment
async function handlePostComment(mapId, event) {
  event.preventDefault();
  const text = event.target.querySelector('textarea').value;

  try {
    const res = await fetch(`/api/maps/${mapId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });

    if (res.ok) {
      event.target.reset();
      loadMaps();
      const modal = event.target.closest('.modal-content');
      loadCommentsForMap(mapId, modal.parentElement);
    }
  } catch (error) {
    console.error('Erro ao postar comentário:', error);
  }
}

// Reply comment
async function handleReplyComment(mapId, parentId, event) {
  event.preventDefault();
  const text = event.target.querySelector('textarea').value;

  try {
    const res = await fetch(`/api/maps/${mapId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, parentId })
    });

    if (res.ok) {
      const modal = event.target.closest('.modal-content');
      loadCommentsForMap(mapId, modal.parentElement);
    }
  } catch (error) {
    console.error('Erro ao responder comentário:', error);
  }
}

// Toggle reply form
function toggleReplyForm(formId, event) {
  event.preventDefault();
  const form = document.getElementById(formId);
  form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

// Search maps
async function searchMaps() {
  const query = document.getElementById('search-input').value;
  if (!query) {
    loadMaps();
    return;
  }

  try {
    const res = await fetch(`/api/maps/search?query=${encodeURIComponent(query)}`);
    const results = await res.json();
    renderMaps(results);
  } catch (error) {
    console.error('Erro ao buscar mapas:', error);
  }
}

// Load rankings
async function loadRankings() {
  try {
    const mostLiked = await fetch('/api/rankings/most-liked').then(r => r.json());
    const highestRated = await fetch('/api/rankings/highest-rated').then(r => r.json());

    const renderRankingList = (maps) => maps.map((map, index) => `
      <div class="card" style="cursor: pointer;" onclick="viewMapDetailsFromRanking('${map.id}')">
        <div style="display: flex; align-items: center; gap: 1rem;">
          <div style="font-size: 1.5rem; color: var(--accent-gold); font-weight: bold;">#${index + 1}</div>
          <div style="flex-grow: 1;">
            <h3 style="color: var(--accent-gold); margin-bottom: 0.3rem;">${map.mapName}</h3>
            <p style="color: var(--text-secondary); font-size: 0.9rem;">${map.category}</p>
          </div>
        </div>
      </div>
    `).join('');

    document.getElementById('most-liked-ranking').innerHTML = renderRankingList(mostLiked) || '<p>Nenhum mapa</p>';
    document.getElementById('highest-rated-ranking').innerHTML = renderRankingList(highestRated) || '<p>Nenhum mapa</p>';
  } catch (error) {
    console.error('Erro ao carregar rankings:', error);
  }
}

// Load profile
async function loadProfile() {
  try {
    const res = await fetch(`/api/users/${state.currentUser.id}`);
    const user = await res.json();
    
    document.getElementById('profile-username').value = user.username;
    document.getElementById('profile-bio').value = user.bio || '';
    
    const avatarDiv = document.getElementById('profile-avatar');
    if (user.avatar) {
      avatarDiv.innerHTML = `<img src="${user.avatar}" alt="Avatar" class="avatar avatar-lg">`;
    } else {
      avatarDiv.innerHTML = '<div style="width: 150px; height: 150px; background: var(--border-color); border-radius: 50%; display: flex; align-items: center; justify-content: center;">Sem Avatar</div>';
    }
  } catch (error) {
    console.error('Erro ao carregar perfil:', error);
  }
}

// Avatar upload
function triggerAvatarUpload() {
  document.getElementById('avatar-input').click();
}

async function handleAvatarUpload() {
  const file = document.getElementById('avatar-input').files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('avatar', file);

  try {
    const res = await fetch('/api/upload-avatar', {
      method: 'POST',
      body: formData
    });

    if (res.ok) {
      const data = await res.json();
      state.currentUser.avatar = data.avatar;
      loadProfile();
      alert('Avatar atualizado!');
    }
  } catch (error) {
    console.error('Erro ao fazer upload de avatar:', error);
  }
}

// Profile update
async function handleProfileUpdate(event) {
  event.preventDefault();
  
  const username = document.getElementById('profile-username').value;
  const bio = document.getElementById('profile-bio').value;

  try {
    const res = await fetch(`/api/users/${state.currentUser.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, bio })
    });

    if (res.ok) {
      state.currentUser = (await res.json()).user;
      alert('Perfil atualizado!');
      renderNavbar();
    }
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
  }
}

// Admin dashboard
async function loadAdminDashboard() {
  try {
    const res = await fetch('/api/admin/dashboard');
    const dashboard = await res.json();

    const statsHtml = `
      <div class="card">
        <h3 style="color: var(--accent-gold);">👥 Total de Usuários</h3>
        <p style="font-size: 2rem; color: var(--accent-purple);">${dashboard.totalUsers}</p>
      </div>
      <div class="card">
        <h3 style="color: var(--accent-gold);">📍 Total de Mapas</h3>
        <p style="font-size: 2rem; color: var(--accent-green);">${dashboard.totalMaps}</p>
      </div>
      <div class="card">
        <h3 style="color: var(--accent-gold);">✅ Mapas Aprovados</h3>
        <p style="font-size: 2rem; color: var(--accent-gold);">${dashboard.approvedMaps}</p>
      </div>
      <div class="card">
        <h3 style="color: var(--accent-gold);">⏳ Pendentes</h3>
        <p style="font-size: 2rem; color: #dc2626;">${dashboard.pendingMaps}</p>
      </div>
    `;

    document.getElementById('admin-stats').innerHTML = statsHtml;

    const pendingHtml = dashboard.pendingMapsList.map(map => `
      <div class="card">
        <h3 style="color: var(--accent-gold); margin-bottom: 1rem;">${map.mapName}</h3>
        <p><strong>Criador ID:</strong> ${map.creator}</p>
        <p><strong>Categoria:</strong> ${map.category}</p>
        <p><strong>Descrição:</strong> ${map.description}</p>
        
        <div style="margin-top: 1rem; display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div>
            <label>Avaliação (0-10):</label>
            <input type="number" id="rating-${map.id}" min="0" max="10" step="0.1" value="0">
          </div>
          <div>
            <label>Avaliação Admin:</label>
            <textarea id="review-${map.id}" placeholder="Escreva uma avaliação"></textarea>
          </div>
        </div>
        
        <div style="display: flex; gap: 1rem; margin-top: 1rem;">
          <button onclick="approveMap('${map.id}')" class="btn btn-primary">Aprovar</button>
          <button onclick="editMapAdmin('${map.id}')" class="btn btn-secondary">Editar</button>
          <button onclick="deleteMap('${map.id}')" class="btn btn-danger">Deletar</button>
        </div>
      </div>
    `).join('');

    document.getElementById('pending-maps').innerHTML = pendingHtml;
  } catch (error) {
    console.error('Erro ao carregar dashboard admin:', error);
  }
}

// Approve map
async function approveMap(mapId) {
  const rating = document.getElementById(`rating-${mapId}`).value;
  const review = document.getElementById(`review-${mapId}`).value;

  try {
    await fetch(`/api/admin/maps/${mapId}/approve`, { method: 'PUT' });
    
    if (rating > 0 || review) {
      await fetch(`/api/admin/maps/${mapId}/rate`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: parseFloat(rating), review })
      });
    }

    alert('Mapa aprovado!');
    loadAdminDashboard();
  } catch (error) {
    console.error('Erro ao aprovar mapa:', error);
  }
}

// Delete map
async function deleteMap(mapId) {
  if (!confirm('Tem certeza que deseja deletar este mapa?')) return;

  try {
    const res = await fetch(`/api/admin/maps/${mapId}`, { method: 'DELETE' });
    if (res.ok) {
      alert('Mapa deletado!');
      loadAdminDashboard();
    }
  } catch (error) {
    console.error('Erro ao deletar mapa:', error);
  }
}

// Edit map admin
async function editMapAdmin(mapId) {
  const map = state.maps.find(m => m.id === mapId);
  if (!map) return;

  const newName = prompt('Novo nome do mapa:', map.mapName);
  if (!newName) return;

  try {
    await fetch(`/api/admin/maps/${mapId}/edit`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mapName: newName })
    });

    alert('Mapa editado!');
    loadAdminDashboard();
  } catch (error) {
    console.error('Erro ao editar mapa:', error);
  }
}

// Modal functions
function showModal(modalId) {
  document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('active');
}

function viewMapDetailsFromRanking(mapId) {
  const map = state.maps.find(m => m.id === mapId);
  if (!map) {
    console.error('Mapa não encontrado');
    return;
  }
  viewMapDetails(mapId);
}

// Inicializar
renderApp();
