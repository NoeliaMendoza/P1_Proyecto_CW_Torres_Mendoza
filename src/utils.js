export function getCurrentUser() {
    try {
        const raw = localStorage.getItem('user');
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function isLoggedIn() {
    return !!getCurrentUser();
}

export function isAdmin() {
    const user = getCurrentUser();
    return user && user.rol === 'admin';
}

export function logout() {
    localStorage.removeItem('user');
    window.dispatchEvent(new CustomEvent('userChanged'));
}
