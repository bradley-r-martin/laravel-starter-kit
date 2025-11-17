import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import svgr from "vite-plugin-svgr";
export default defineConfig({
    plugins: [
        react(),
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            refresh: true,
        }),
        tailwindcss(),
        svgr(),
    ],
    resolve: {
        alias: {
            '~packages': '/resouses/packages',
            '@': '/resources/js',
        },
    },
});
