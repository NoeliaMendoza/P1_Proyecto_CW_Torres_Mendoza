export function adminGuard(context, commands) {
    if (!isLoggedIn()) return commands.redirect('/login');
    if (!isAdmin()) return commands.redirect('/');
    return undefined;
}

export function guestGuard(context, commands) {
    if (isLoggedIn()) {
        return isAdmin() ? commands.redirect('/admin') : commands.redirect('/');
    }
    return undefined;
}
