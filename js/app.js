// ==================== MAIN APP ====================

document.addEventListener('DOMContentLoaded', function() {
    // Hide loading screen
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        loadingScreen.classList.add('hidden');
    }, 1000);

    // Initialize auth UI
    updateAuthUI();

    // Load initial page
    navigateTo('home');

    // Check if user is still logged in (persistent login)
    const currentUser = storage.getCurrentUser();
    if (currentUser) {
        const user = storage.getUser(currentUser);
        if (user) {
            showToast(`Bem-vindo de volta, ${user.username}!`, 'success');
        }
    }
});

// Handle page visibility change (persistent login)
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        const currentUser = storage.getCurrentUser();
        if (currentUser) {
            const user = storage.getUser(currentUser);
            if (user) {
                updateAuthUI();
            }
        }
    }
});

// Prevent accidental navigation loss
window.addEventListener('beforeunload', function(e) {
    // Data is automatically saved to localStorage, so no warning needed
});