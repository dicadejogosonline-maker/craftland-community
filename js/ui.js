// ==================== UI FUNCTIONS ====================

let currentPage = 'home';

function navigateTo(page) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
    });

    // Show selected page
    document.getElementById(page + 'Page').classList.add('active');
    currentPage = page;

    // Load data based on page
    if (page === 'explore') {
        loadMaps();
    } else if (page === 'profile') {
        const currentUser = storage.getCurrentUser();
        if (!currentUser) {
            navigateTo('auth');
            return;
        }
        loadProfile();
        loadUserMaps();
    } else if (page === 'ranking') {
        loadRankings();
    } else if (page === 'admin') {
        const currentUser = storage.getCurrentUser();
        if (!currentUser) {
            navigateTo('auth');
            return;
        }
        const user = storage.getUser(currentUser);
        if (!user || !user.isAdmin) {
            showToast('Acesso negado!', 'error');
            navigateTo('home');
            return;
        }
        loadAdminDashboard();
    }

    // Scroll to top
    window.scrollTo(0, 0);
}

function showMessage(element, message, type) {
    element.textContent = message;
    element.className = 'form-message ' + type;
    element.style.display = 'block';

    setTimeout(() => {
        element.style.display = 'none';
    }, 3000);
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast show ' + type;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function switchRankingTab(tab) {
    document.querySelectorAll('.ranking-content').forEach(content => {
        content.classList.remove('active');
    });
    document.querySelectorAll('.ranking-tab').forEach(btn => {
        btn.classList.remove('active');
    });

    if (tab === 'liked') {
        document.getElementById('likedRanking').classList.add('active');
        document.querySelectorAll('.ranking-tab')[0].classList.add('active');
    } else if (tab === 'rated') {
        document.getElementById('ratedRanking').classList.add('active');
        document.querySelectorAll('.ranking-tab')[1].classList.add('active');
    }
}

function loadRankings() {
    const maps = storage.getApprovedMaps();

    // Sort by likes
    const likedMaps = [...maps].sort((a, b) => {
        const likesA = a.likes ? a.likes.length : 0;
        const likesB = b.likes ? b.likes.length : 0;
        return likesB - likesA;
    }).slice(0, 10);

    // Sort by rating
    const ratedMaps = [...maps].sort((a, b) => {
        const ratingA = a.adminReview ? a.adminReview.rating : 0;
        const ratingB = b.adminReview ? b.adminReview.rating : 0;
        return ratingB - ratingA;
    }).slice(0, 10);

    // Display liked ranking
    const likedList = document.getElementById('likedList');
    if (likedMaps.length === 0) {
        likedList.innerHTML = '<p class="loading-text">Nenhum mapa com curtidas ainda.</p>';
    } else {
        likedList.innerHTML = likedMaps.map((map, index) => `
            <div class="ranking-item" onclick="openMapDetail(${map.id})">
                <div class="ranking-position ${index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : ''}">
                    ${index + 1}${index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : ''}
                </div>
                <div class="ranking-info">
                    <h3>${map.name}</h3>
                    <p>Criador: ${map.creator}</p>
                </div>
                <div class="ranking-score">
                    <div class="ranking-score-value">${map.likes ? map.likes.length : 0}</div>
                    <div class="ranking-score-label">❤️ Curtidas</div>
                </div>
            </div>
        `).join('');
    }

    // Display rated ranking
    const ratedList = document.getElementById('ratedList');
    if (ratedMaps.length === 0) {
        ratedList.innerHTML = '<p class="loading-text">Nenhum mapa avaliado ainda.</p>';
    } else {
        ratedList.innerHTML = ratedMaps.map((map, index) => `
            <div class="ranking-item" onclick="openMapDetail(${map.id})">
                <div class="ranking-position ${index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : ''}">
                    ${index + 1}${index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : ''}
                </div>
                <div class="ranking-info">
                    <h3>${map.name}</h3>
                    <p>Criador: ${map.creator}</p>
                </div>
                <div class="ranking-score">
                    <div class="ranking-score-value">${map.adminReview ? map.adminReview.rating.toFixed(1) : '0.0'}</div>
                    <div class="ranking-score-label">⭐ Avaliação</div>
                </div>
            </div>
        `).join('');
    }
}

function loadProfile() {
    const currentUser = storage.getCurrentUser();
    if (!currentUser) return;

    const user = storage.getUser(currentUser);
    if (!user) return;

    document.getElementById('profileUsername').textContent = user.username;
    document.getElementById('profileEmail').textContent = user.email;
    document.getElementById('profileBio').value = user.bio || '';

    // Avatar
    const avatarEl = document.getElementById('profileAvatar');
    if (user.avatar) {
        avatarEl.innerHTML = `<img src="${user.avatar}" alt="Avatar">`;
    } else {
        avatarEl.textContent = '👤';
    }
}

function updateAvatar() {
    const currentUser = storage.getCurrentUser();
    if (!currentUser) return;

    const file = document.getElementById('avatarUpload').files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const user = storage.getUser(currentUser);
        user.avatar = e.target.result;
        storage.saveUser(currentUser, user);

        const avatarEl = document.getElementById('profileAvatar');
        avatarEl.innerHTML = `<img src="${e.target.result}" alt="Avatar">`;

        showToast('Avatar atualizado!', 'success');
    };
    reader.readAsDataURL(file);
}

function updateBio() {
    const currentUser = storage.getCurrentUser();
    if (!currentUser) return;

    const bio = document.getElementById('profileBio').value;
    const user = storage.getUser(currentUser);
    user.bio = bio;
    storage.saveUser(currentUser, user);

    showToast('Bio atualizada!', 'success');
}

// Comments
function addComment() {
    const currentUser = storage.getCurrentUser();
    if (!currentUser) {
        showToast('Você precisa estar logado para comentar.', 'error');
        return;
    }

    const commentText = document.getElementById('commentText').value.trim();
    if (!commentText) {
        showToast('Escreva um comentário!', 'error');
        return;
    }

    const user = storage.getUser(currentUser);
    const comment = {
        author: user.username,
        text: commentText
    };

    storage.addComment(currentMapId, comment);
    document.getElementById('commentText').value = '';
    loadComments(currentMapId);
    showToast('Comentário adicionado!', 'success');

    const map = storage.getMap(currentMapId);
    document.getElementById('mapDetailComments').textContent = map.comments ? map.comments.length : 0;
}

function loadComments(mapId) {
    const comments = storage.getComments(mapId);
    const commentsList = document.getElementById('mapComments');

    if (comments.length === 0) {
        commentsList.innerHTML = '<p class="loading-text">Nenhum comentário ainda. Seja o primeiro!</p>';
        return;
    }

    commentsList.innerHTML = comments.map(comment => `
        <div class="comment">
            <div class="comment-author">${comment.author}</div>
            <div class="comment-text">${comment.text}</div>
            <div class="comment-date">${formatDate(comment.createdAt)}</div>
            ${comment.replies && comment.replies.length > 0 ? `
                <div class="replies">
                    ${comment.replies.map(reply => `
                        <div class="comment reply">
                            <div class="comment-author">↳ ${reply.author}</div>
                            <div class="comment-text">${reply.text}</div>
                            <div class="comment-date">${formatDate(reply.createdAt)}</div>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            <div class="reply-button">
                <button class="btn btn-secondary btn-small" onclick="replyComment(${comment.id})">Responder</button>
            </div>
        </div>
    `).join('');
}

function replyComment(commentId) {
    showToast('Respostas virão em breve!', 'warning');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Agora';
    if (minutes < 60) return `${minutes} min atrás`;
    if (hours < 24) return `${hours}h atrás`;
    if (days < 7) return `${days}d atrás`;

    return date.toLocaleDateString('pt-BR');
}

// Hamburger menu
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
        });
    });

    // Close modal when clicking outside
    const modal = document.getElementById('mapDetailModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeMapDetail();
            }
        });
    }
});