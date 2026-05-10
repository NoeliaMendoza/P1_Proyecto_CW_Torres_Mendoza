import { Router } from '@vaadin/router';

const outlet = document.getElementById('app');

const router = new Router(outlet);

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
        path: '(.*)',
        redirect: '/',
    },
]);

export { router };
