import type { RouterConfig } from "nuxt/schema";

export default <RouterConfig>{
    routes: (_routes) => [
        // Test pages
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
            path: '/404e',
            component: () => import('~/pages/404Error.vue'),
        }
        

    ]
};