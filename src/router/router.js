import { Router } from '@vaadin/router';
import { adminGuard, authGuard, guestGuard } from './guards.js';

const router = new Router();
router.setRoutes([
    {
        path: '/',
        component: 'home-page',
    },
    {
        path: '/menu',
        component: 'menu-page',
    },
    {
        path: '/login',
        component: 'login-page',
    },
    {
        path: '/register',
        component: 'register-page',
    },
    {
        path: '/tracking',
        component: 'tracking-page',
        beforeEnter: authGuard,
    },
    { path: '/admin', component: 'admin-page' },
    {
        path: '(.*)',
        redirect: '/',
    },
]);

export { router };
