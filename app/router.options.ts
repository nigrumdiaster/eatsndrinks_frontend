import type { RouterConfig } from "nuxt/schema";

export default <RouterConfig>{
    routes: (_routes) => [
        // USERS
        {
            name: 'home',
            path: '/',
            component: () => import('~/pages/users/Home.vue'),
        },
        {
            name: 'about',
            path: '/about',
            component: () => import('~/pages/users/About.vue'),
        },
        {
            name: 'restaurant',
            path: '/restaurant',
            component: () => import('~/pages/users/Map.vue'),
        },
        {
            name: 'menu',
            path: '/menu',
            component: () => import('~/pages/users/Menu.vue'),
        },
        {
            name: 'product-id', //  Dynamic route for product details
            path: '/product/:id', // Dynamic segment ":id"
            component: () => import('~/pages/users/product/[id].vue'),
        },
        {
            name: '404',
            path: '/:catchAll(.*)', // Catch all unknown routes
            component: () => import('@/pages/users/404Error.vue'), // Load your 404 page
        },
        {
            name: 'login',
            path: '/login',
            component: () => import('~/pages/users/auth/Login.vue'),
        },
        {
            name: 'register',
            path: '/register',
            component: () => import('~/pages/users/auth/Register.vue'),
        },
        {
            name: 'profile',
            path: '/profile',
            component: () => import('~/pages/users/user/Profile.vue'),
        },
        {
            name: 'cart',
            path: '/cart',
            component: () => import('~/pages/users/user/Cart.vue'),
        },
        {
            name: 'order', 
            path: '/order', 
            component: () => import('~/pages/users/order/Order.vue'),
        },
        {
            name: 'user-orders',
            path: '/user/orders',
            component: () => import('~/pages/users/order/ListOrders.vue'),
        },
        {
            name: 'profile-update',
            path: '/update',
            component: () => import('~/pages/users/user/Update.vue'),
        },
        {
            name: 'change-password',
            path: '/changepassword',
            component: () => import('~/pages/users/user/Change.vue'),
        },
        {
            name: 'user-orders-id',
            path: '/user/orders/:id',
            component: () => import('~/pages/users/order/[id].vue'),
        },
        {
            name: 'address',
            path: '/address',
            component: () => import('~/pages/users/user/AddressBook.vue'),
        },
    ]
};