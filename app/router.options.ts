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
        }
    ]
};