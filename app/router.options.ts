import type { RouterConfig } from "nuxt/schema";

export default <RouterConfig>{
    routes: (_routes) => [
        {
            name: 'home',
            path: '/',
            component: () => import('~/pages/Home.vue'),
        },
        {
            name: 'about',
            path: '/about',
            component: () => import('~/pages/About.vue'),
        },
        {
            name: 'product-id', // ✅ Dynamic route for product details
            path: '/product/:id', // Dynamic segment ":id"
            component: () => import('~/pages/product/[id].vue'),
        },
        {
            name: '404',
            path: '/:catchAll(.*)', // Catch all unknown routes
            component: () => import('@/pages/404Error.vue'), // Load your 404 page
        },
        {
            name: 'login',
            path: '/login',
            component: () => import('~/pages/auth/Login.vue'),
        },
        {
            name: 'register',
            path: '/register',
            component: () => import('~/pages/auth/Register.vue'),
        },
        {
            name: 'profile',
            path: '/profile',
            component: () => import('~/pages/user/Profile.vue'),
        },
        {
            name: 'cart',
            path: '/cart',
            component: () => import('~/pages/user/Cart.vue'),
        },
        {
            name: 'admin',
            path: '/admin',
            component: () => import('~/pages/admin/Dashboard.vue'),
        },
        {
            name: 'admin_user_management',
            path: '/admin/users',
            component: () => import('~/pages/admin/usermgmt/List.vue'),
        },
        {
            name: 'admin_user_management_create',
            path: '/admin/users/create',
            component: () => import('~/pages/admin/usermgmt/Create.vue'),
        },
        {
            name: 'admin_user_management_id', // ✅ Dynamic route for product details
            path: '/admin/users/:id', // Dynamic segment ":id"
            component: () => import('~~/pages/admin/usermgmt/[id].vue'),
        },
        {
            name: 'order', 
            path: '/order', 
            component: () => import('~/pages/user/Order.vue'),
        },
    ]
};