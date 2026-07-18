// ==================== ADMIN FUNCTIONS ====================

function switchAdminTab(tab) {
    document.querySelectorAll('.admin-content').forEach(content => {
        content.classList.remove('active');
    });
    document.querySelectorAll('.admin-tab').forEach(btn => {
        btn.classList.remove('active');
    });

    if (tab === 'maps') {
        document.getElementById('mapsManagement').classList.add('active');
        document.querySelectorAll('.admin-tab')[0].classList.add('active');
        loadPendingMaps();
    } else if (tab === 'users') {
        document.getElementById('usersManagement').classList.add('active');
        document.querySelectorAll('.admin-tab')[1].classList.add('active');
        loadUsers();
    } else if (tab === 'dashboard') {
        document.getElementById('dashboardManagement').classList.add('active');
        document.querySelectorAll('.admin-tab')[2].classList.add('active');
        loadDashboardStats();
    }
}

function loadAdminDashboard() {
    switchAdminTab('maps');
}

function loadPendingMaps() {
    const maps = storage.getPendingMaps();
    const pendingMapsList = document.getElementById('pendingMapsList');

    if (maps.length === 0) {
        pendingMapsList.innerHTML = '<p class="loading-text">Nenhum mapa pendente de aprovação.</p>';
        return;
    }

    pendingMapsList.innerHTML = maps.map(map => `
        <div class="admin-map-card">
            <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
                <img src="${map.image}" alt="${map.name}" style="width: 150px; height: 150px; border-radius: 8px; object-fit: cover;">
                <div>
                    <div class="admin-map-title">${map.name}</div>
                    <div class="admin-map-creator">Criador: ${map.creator}</div>
                    <div class="admin-map-status">Pendente</div>
                    <p style="color: var(--text-secondary); font-size: 14px; margin-top: 0.5rem;"><strong>Room ID:</strong> ${map.roomId}</p>
                    <p style="color: var(--text-secondary); font-size: 14px;"><strong>Descrição:</strong> ${map.description}</p>
                </div>
            </div>
            <div class="admin-actions">
                <button class="btn btn-primary" onclick="approveMap(${map.id})">✅ Aprovar</button>
                <button class="btn btn-danger" onclick="rejectMap(${map.id})">❌ Rejeitar</button>
                <button class="btn btn-secondary" onclick="openMapDetail(${map.id})">👁️ Visualizar</button>
            </div>
        </div>
    `).join('');
}

function loadUsers() {
    const users = storage.getUsers();
    const usersList = document.getElementById('usersList');
    const userArray = Object.values(users);

    if (userArray.length === 0) {
        usersList.innerHTML = '<p class="loading-text">Nenhum usuário registrado.</p>';
        return;
    }

    usersList.innerHTML = userArray.map(user => `
        <div class="admin-user-card">
            <div style="display: flex; gap: 1rem; align-items: center;">
                <div style="width: 80px; height: 80px; border-radius: 50%; background: var(--primary-color); display: flex; align-items: center; justify-content: center; font-size: 40px; overflow: hidden;">
                    ${user.avatar ? `<img src="${user.avatar}" alt="Avatar" style="width: 100%; height: 100%; object-fit: cover;">` : '👤'}
                </div>
                <div>
                    <div class="admin-map-title">${user.username}</div>
                    <p style="color: var(--text-secondary); font-size: 14px;">${user.email}</p>
                    <p style="color: var(--text-secondary); font-size: 14px;">Membro desde: ${new Date(user.createdAt).toLocaleDateString('pt-BR')}</p>
                    ${user.isAdmin ? '<span class="admin-map-status">👑 Administrador</span>' : ''}
                </div>
            </div>
        </div>
    `).join('');
}

function loadDashboardStats() {
    const users = storage.getUsers();
    const maps = storage.getMaps();
    const pendingMaps = storage.getPendingMaps();
    const approvedMaps = storage.getApprovedMaps();

    let totalComments = 0;
    approvedMaps.forEach(map => {
        totalComments += map.comments ? map.comments.length : 0;
    });

    document.getElementById('totalUsers').textContent = Object.keys(users).length;
    document.getElementById('totalMaps').textContent = maps.length;
    document.getElementById('pendingMaps').textContent = pendingMaps.length;
    document.getElementById('totalComments').textContent = totalComments;
}

function approveMap(mapId) {
    const map = storage.getMap(mapId);
    if (!map) return;

    if (confirm(`Aprovar o mapa "${map.name}"?`)) {
        storage.approveMap(mapId);
        showToast('Mapa aprovado com sucesso!', 'success');
        loadPendingMaps();
        loadDashboardStats();
    }
}

function rejectMap(mapId) {
    const map = storage.getMap(mapId);
    if (!map) return;

    if (confirm(`Rejeitar o mapa "${map.name}"?`)) {
        storage.rejectMap(mapId);
        showToast('Mapa rejeitado!', 'success');
        loadPendingMaps();
        loadDashboardStats();
    }
}

function submitAdminReview() {
    const rating = document.getElementById('adminRating').value;
    const comment = document.getElementById('adminComment').value.trim();

    if (!rating || !comment) {
        showToast('Por favor, preencha avaliação e comentário.', 'error');
        return;
    }

    const numRating = parseFloat(rating);
    if (isNaN(numRating) || numRating < 0 || numRating > 10) {
        showToast('A avaliação deve estar entre 0.0 e 10.0', 'error');
        return;
    }

    storage.setAdminReview(currentMapId, numRating, comment);
    showToast('Revisão salva com sucesso!', 'success');

    document.getElementById('adminRating').value = '';
    document.getElementById('adminComment').value = '';

    // Reload modal
    const mapId = currentMapId;
    closeMapDetail();
    openMapDetail(mapId);
}