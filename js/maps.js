// ==================== MAPS MANAGEMENT ====================

let currentMapId = null;
let vipPasswordVisible = false;

function publishMap(e) {
    e.preventDefault();

    const currentUser = storage.getCurrentUser();
    if (!currentUser) {
        showToast('Você precisa estar logado para publicar um mapa.', 'error');
        return;
    }

    const mapName = document.getElementById('mapName').value.trim();
    const roomId = document.getElementById('roomId').value.trim();
    const vipPassword = document.getElementById('vipPassword').value;
    const description = document.getElementById('mapDescription').value.trim();
    const category = document.getElementById('mapCategory').value;
    const imageFile = document.getElementById('mapImage').files[0];
    const messageEl = document.getElementById('publishMessage');

    if (!mapName || !roomId || !description || !category || !imageFile) {
        showMessage(messageEl, 'Por favor, preencha todos os campos obrigatórios.', 'error');
        return;
    }

    // Convert image to base64
    const reader = new FileReader();
    reader.onload = function(e) {
        const mapData = {
            name: mapName,
            roomId: roomId,
            vipPassword: vipPassword || null,
            description: description,
            category: category,
            image: e.target.result,
            creator: storage.getUser(currentUser).username,
            creatorEmail: currentUser
        };

        const newMap = storage.addMap(mapData);
        showMessage(messageEl, 'Mapa publicado com sucesso! Aguardando aprovação.', 'success');
        showToast('Seu mapa foi enviado para aprovação!', 'success');

        // Reset form
        document.getElementById('publishForm').reset();
        document.getElementById('mapImagePreview').innerHTML = '';

        // Redirect to explore
        setTimeout(() => {
            navigateTo('explore');
            loadMaps();
        }, 1500);
    };
    reader.readAsDataURL(imageFile);
}

function previewMapImage() {
    const file = document.getElementById('mapImage').files[0];
    const preview = document.getElementById('mapImagePreview');

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        };
        reader.readAsDataURL(file);
    } else {
        preview.innerHTML = '';
    }
}

function loadMaps() {
    const maps = storage.getApprovedMaps();
    const mapsList = document.getElementById('mapsList');

    if (maps.length === 0) {
        mapsList.innerHTML = '<p class="loading-text">Nenhum mapa publicado ainda. Seja o primeiro!</p>';
        return;
    }

    mapsList.innerHTML = maps.map(map => `
        <div class="map-card" onclick="openMapDetail(${map.id})">
            <div class="map-card-image">
                <img src="${map.image}" alt="${map.name}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22280%22 height=%22200%22%3E%3Crect fill=%22%231a1a2e%22 width=%22280%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22Arial%22 font-size=%2224%22 fill=%22%239d4edd%22%3E⛏️ ${map.name}%3C/text%3E%3C/svg%3E'">
            </div>
            <div class="map-card-content">
                <div class="map-card-title">${map.name}</div>
                <div class="map-card-creator">Por: ${map.creator}</div>
                <span class="map-card-category">${getCategoryLabel(map.category)}</span>
                <div class="map-card-description">${map.description}</div>
                <div class="map-card-stats">
                    <div class="map-card-stat"><span>❤️</span> ${map.likes ? map.likes.length : 0}</div>
                    <div class="map-card-stat"><span>⭐</span> ${getMapRating(map.id)}</div>
                    <div class="map-card-stat"><span>💬</span> ${map.comments ? map.comments.length : 0}</div>
                </div>
            </div>
        </div>
    `).join('');
}

function loadUserMaps() {
    const currentUser = storage.getCurrentUser();
    if (!currentUser) {
        document.getElementById('userMapsList').innerHTML = '<p class="loading-text">Você não está logado.</p>';
        return;
    }

    const maps = storage.getMaps().filter(m => m.creatorEmail === currentUser);
    const mapsList = document.getElementById('userMapsList');

    if (maps.length === 0) {
        mapsList.innerHTML = '<p class="loading-text">Você ainda não publicou nenhum mapa.</p>';
        return;
    }

    mapsList.innerHTML = maps.map(map => `
        <div class="map-card" onclick="openMapDetail(${map.id})">
            <div class="map-card-image">
                <img src="${map.image}" alt="${map.name}">
            </div>
            <div class="map-card-content">
                <div class="map-card-title">${map.name}</div>
                <span class="map-card-category">${map.status === 'approved' ? '✅ Aprovado' : map.status === 'pending' ? '⏳ Pendente' : '❌ Rejeitado'}</span>
                <div class="map-card-description">${map.description}</div>
                <div class="map-card-stats">
                    <div class="map-card-stat"><span>❤️</span> ${map.likes ? map.likes.length : 0}</div>
                    <div class="map-card-stat"><span>⭐</span> ${getMapRating(map.id)}</div>
                    <div class="map-card-stat"><span>💬</span> ${map.comments ? map.comments.length : 0}</div>
                </div>
            </div>
        </div>
    `).join('');
}

function openMapDetail(mapId) {
    const map = storage.getMap(mapId);
    if (!map) {
        showToast('Mapa não encontrado.', 'error');
        return;
    }

    currentMapId = mapId;
    const currentUser = storage.getCurrentUser();
    const currentUserData = currentUser ? storage.getUser(currentUser) : null;

    // Set map details
    document.getElementById('mapDetailImage').src = map.image;
    document.getElementById('mapDetailName').textContent = map.name;
    document.getElementById('mapDetailCreator').textContent = map.creator;
    document.getElementById('mapDetailRoomId').textContent = map.roomId;
    document.getElementById('mapDetailDescription').textContent = map.description;
    document.getElementById('mapDetailLikes').textContent = map.likes ? map.likes.length : 0;
    document.getElementById('mapDetailRating').textContent = getMapRating(mapId);
    document.getElementById('mapDetailComments').textContent = map.comments ? map.comments.length : 0;

    // VIP Password
    const vipSection = document.getElementById('vipPasswordSection');
    if (map.vipPassword) {
        vipSection.style.display = 'block';
        document.getElementById('mapDetailVipPassword').textContent = '••••••••';
        vipPasswordVisible = false;
    } else {
        vipSection.style.display = 'none';
    }

    // Like button
    const likeBtn = document.getElementById('likeBtn');
    if (currentUser && map.likes && map.likes.includes(currentUser)) {
        likeBtn.innerHTML = '❤️ Curtido';
        likeBtn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
    } else {
        likeBtn.innerHTML = '❤️ Curtir';
        likeBtn.style.background = '';
    }

    // Edit/Delete buttons
    const editBtn = document.getElementById('editBtn');
    const deleteBtn = document.getElementById('deleteBtn');
    if (currentUser && map.creatorEmail === currentUser) {
        editBtn.style.display = 'inline-block';
        deleteBtn.style.display = 'inline-block';
    } else {
        editBtn.style.display = 'none';
        deleteBtn.style.display = 'none';
    }

    // Admin Review Section
    const adminReviewSection = document.getElementById('adminReviewSection');
    if (currentUserData && currentUserData.isAdmin) {
        adminReviewSection.style.display = 'block';
        const existingReview = storage.getAdminReview(mapId);
        if (existingReview) {
            document.getElementById('existingReview').style.display = 'block';
            document.getElementById('adminRatingDisplay').textContent = existingReview.rating;
            document.getElementById('adminReviewComment').textContent = existingReview.comment;
        } else {
            document.getElementById('existingReview').style.display = 'none';
        }
    } else {
        adminReviewSection.style.display = 'none';
    }

    // Add Comment Section
    const addCommentSection = document.getElementById('addCommentSection');
    if (currentUser) {
        addCommentSection.style.display = 'block';
    } else {
        addCommentSection.style.display = 'none';
    }

    // Load comments
    loadComments(mapId);

    // Show modal
    document.getElementById('mapDetailModal').classList.add('active');
}

function closeMapDetail() {
    document.getElementById('mapDetailModal').classList.remove('active');
    currentMapId = null;
}

function toggleLike() {
    const currentUser = storage.getCurrentUser();
    if (!currentUser) {
        showToast('Você precisa estar logado para curtir um mapa.', 'error');
        navigateTo('auth');
        return;
    }

    const liked = storage.toggleLike(currentMapId, currentUser);
    const map = storage.getMap(currentMapId);
    const likeBtn = document.getElementById('likeBtn');

    if (liked) {
        likeBtn.innerHTML = '❤️ Curtido';
        likeBtn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
        showToast('Mapa curtido!', 'success');
    } else {
        likeBtn.innerHTML = '❤️ Curtir';
        likeBtn.style.background = '';
        showToast('Curtida removida!', 'success');
    }

    document.getElementById('mapDetailLikes').textContent = map.likes ? map.likes.length : 0;
}

function copyRoomId() {
    const roomId = document.getElementById('mapDetailRoomId').textContent;
    navigator.clipboard.writeText(roomId).then(() => {
        showToast('Room ID copiado!', 'success');
    });
}

function copyVipPassword() {
    const map = storage.getMap(currentMapId);
    if (map && map.vipPassword) {
        navigator.clipboard.writeText(map.vipPassword).then(() => {
            showToast('Senha VIP copiada!', 'success');
        });
    }
}

function toggleVipPasswordVisibility() {
    const map = storage.getMap(currentMapId);
    if (!map || !map.vipPassword) return;

    const passwordEl = document.getElementById('mapDetailVipPassword');
    vipPasswordVisible = !vipPasswordVisible;

    if (vipPasswordVisible) {
        passwordEl.textContent = map.vipPassword;
    } else {
        passwordEl.textContent = '••••••••';
    }
}

function filterMaps() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;
    const maps = storage.getApprovedMaps();

    const filtered = maps.filter(map => {
        const matchesSearch = !searchTerm || 
            map.name.toLowerCase().includes(searchTerm) ||
            map.creator.toLowerCase().includes(searchTerm) ||
            map.roomId.includes(searchTerm);
        
        const matchesCategory = !category || map.category === category;
        
        return matchesSearch && matchesCategory;
    });

    const mapsList = document.getElementById('mapsList');
    if (filtered.length === 0) {
        mapsList.innerHTML = '<p class="loading-text">Nenhum mapa encontrado com esses critérios.</p>';
        return;
    }

    mapsList.innerHTML = filtered.map(map => `
        <div class="map-card" onclick="openMapDetail(${map.id})">
            <div class="map-card-image">
                <img src="${map.image}" alt="${map.name}">
            </div>
            <div class="map-card-content">
                <div class="map-card-title">${map.name}</div>
                <div class="map-card-creator">Por: ${map.creator}</div>
                <span class="map-card-category">${getCategoryLabel(map.category)}</span>
                <div class="map-card-description">${map.description}</div>
                <div class="map-card-stats">
                    <div class="map-card-stat"><span>❤️</span> ${map.likes ? map.likes.length : 0}</div>
                    <div class="map-card-stat"><span>⭐</span> ${getMapRating(map.id)}</div>
                    <div class="map-card-stat"><span>💬</span> ${map.comments ? map.comments.length : 0}</div>
                </div>
            </div>
        </div>
    `).join('');
}

function getCategoryLabel(category) {
    const labels = {
        'survival': '🌲 Sobrevivência',
        'creative': '🎨 Criativo',
        'adventure': '🗻 Aventura',
        'pvp': '⚔️ PvP',
        'minigame': '🎮 Mini-Jogo',
        'outros': '❓ Outros'
    };
    return labels[category] || category;
}

function getMapRating(mapId) {
    const map = storage.getMap(mapId);
    if (!map || !map.adminReview) return '0.0';
    return map.adminReview.rating.toFixed(1);
}

function editMap() {
    showToast('Edição de mapas virá em breve!', 'warning');
}

function deleteMap() {
    if (confirm('Tem certeza que deseja deletar este mapa?')) {
        storage.deleteMap(currentMapId);
        showToast('Mapa deletado!', 'success');
        closeMapDetail();
        loadMaps();
        loadUserMaps();
    }
}