// ==================== LOCAL STORAGE MANAGEMENT ====================

class StorageManager {
    constructor() {
        this.dbName = 'CraftlandDB';
        this.version = 1;
    }

    // Users Storage
    saveUser(email, userData) {
        const users = this.getUsers();
        users[email] = userData;
        localStorage.setItem('craftland_users', JSON.stringify(users));
    }

    getUsers() {
        const data = localStorage.getItem('craftland_users');
        return data ? JSON.parse(data) : {};
    }

    getUser(email) {
        const users = this.getUsers();
        return users[email] || null;
    }

    deleteUser(email) {
        const users = this.getUsers();
        delete users[email];
        localStorage.setItem('craftland_users', JSON.stringify(users));
    }

    // Current Session
    setCurrentUser(email) {
        localStorage.setItem('craftland_current_user', email);
    }

    getCurrentUser() {
        return localStorage.getItem('craftland_current_user');
    }

    clearCurrentUser() {
        localStorage.removeItem('craftland_current_user');
    }

    // Maps Storage
    saveMaps(maps) {
        localStorage.setItem('craftland_maps', JSON.stringify(maps));
    }

    getMaps() {
        const data = localStorage.getItem('craftland_maps');
        return data ? JSON.parse(data) : [];
    }

    addMap(mapData) {
        const maps = this.getMaps();
        mapData.id = Date.now();
        mapData.createdAt = new Date().toISOString();
        mapData.status = 'pending';
        mapData.likes = [];
        mapData.rating = 0;
        mapData.reviews = [];
        mapData.comments = [];
        maps.push(mapData);
        this.saveMaps(maps);
        return mapData;
    }

    getMap(mapId) {
        const maps = this.getMaps();
        return maps.find(m => m.id === mapId);
    }

    updateMap(mapId, updates) {
        const maps = this.getMaps();
        const index = maps.findIndex(m => m.id === mapId);
        if (index !== -1) {
            maps[index] = { ...maps[index], ...updates };
            this.saveMaps(maps);
            return maps[index];
        }
        return null;
    }

    deleteMap(mapId) {
        const maps = this.getMaps();
        const filtered = maps.filter(m => m.id !== mapId);
        this.saveMaps(filtered);
    }

    // Likes
    toggleLike(mapId, userEmail) {
        const map = this.getMap(mapId);
        if (!map) return false;

        if (!map.likes) map.likes = [];

        const index = map.likes.indexOf(userEmail);
        if (index > -1) {
            map.likes.splice(index, 1);
        } else {
            map.likes.push(userEmail);
        }

        this.updateMap(mapId, { likes: map.likes });
        return index === -1;
    }

    isMapLiked(mapId, userEmail) {
        const map = this.getMap(mapId);
        return map && map.likes && map.likes.includes(userEmail);
    }

    // Comments
    addComment(mapId, comment) {
        const map = this.getMap(mapId);
        if (!map) return null;

        if (!map.comments) map.comments = [];

        const newComment = {
            id: Date.now(),
            author: comment.author,
            text: comment.text,
            createdAt: new Date().toISOString(),
            replies: []
        };

        map.comments.push(newComment);
        this.updateMap(mapId, { comments: map.comments });
        return newComment;
    }

    getComments(mapId) {
        const map = this.getMap(mapId);
        return map ? (map.comments || []) : [];
    }

    deleteComment(mapId, commentId) {
        const map = this.getMap(mapId);
        if (!map) return false;

        map.comments = map.comments.filter(c => c.id !== commentId);
        this.updateMap(mapId, { comments: map.comments });
        return true;
    }

    addReply(mapId, commentId, reply) {
        const map = this.getMap(mapId);
        if (!map) return null;

        const comment = map.comments.find(c => c.id === commentId);
        if (!comment) return null;

        if (!comment.replies) comment.replies = [];

        const newReply = {
            id: Date.now(),
            author: reply.author,
            text: reply.text,
            createdAt: new Date().toISOString()
        };

        comment.replies.push(newReply);
        this.updateMap(mapId, { comments: map.comments });
        return newReply;
    }

    // Admin Review
    setAdminReview(mapId, rating, comment) {
        const map = this.getMap(mapId);
        if (!map) return null;

        const review = {
            rating: parseFloat(rating),
            comment: comment,
            reviewedAt: new Date().toISOString()
        };

        this.updateMap(mapId, { adminReview: review });
        return review;
    }

    getAdminReview(mapId) {
        const map = this.getMap(mapId);
        return map ? (map.adminReview || null) : null;
    }

    // Map Status
    approveMap(mapId) {
        return this.updateMap(mapId, { status: 'approved' });
    }

    rejectMap(mapId) {
        return this.updateMap(mapId, { status: 'rejected' });
    }

    getPendingMaps() {
        const maps = this.getMaps();
        return maps.filter(m => m.status === 'pending');
    }

    getApprovedMaps() {
        const maps = this.getMaps();
        return maps.filter(m => m.status === 'approved');
    }
}

const storage = new StorageManager();

// Initialize with admin user
function initializeAdmin() {
    const adminEmail = 'Janddersonjanddersonde@gmail.com';
    const users = storage.getUsers();

    if (!users[adminEmail]) {
        const adminUser = {
            email: adminEmail,
            username: 'Administrador',
            password: hashPassword('admin123'),
            isAdmin: true,
            createdAt: new Date().toISOString(),
            avatar: null,
            bio: 'Administrador do Craftland Community'
        };
        storage.saveUser(adminEmail, adminUser);
    }
}

// Simple password hashing (for demo purposes only)
function hashPassword(password) {
    return btoa(password);
}

function comparePassword(password, hash) {
    return btoa(password) === hash;
}

// Initialize app
initializeAdmin();