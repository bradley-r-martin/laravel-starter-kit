import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import svgr from "vite-plugin-svgr";
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { createHash } from 'crypto';

// Plugin to build service worker with version injection
function serviceWorkerPlugin() {
    let version = '';
    
    return {
        name: 'service-worker-plugin',
        buildStart() {
            // Generate a version hash based on current time and build
            version = createHash('md5')
                .update(Date.now().toString())
                .update(process.env.NODE_ENV || 'production')
                .digest('hex')
                .substring(0, 8);
        },
        writeBundle() {
            // This runs after the build is complete, so we can read the manifest
            // Read the service worker source
            const swSource = readFileSync(
                resolve(__dirname, 'resources/js/service-worker.js'),
                'utf-8'
            );

            // Replace the version placeholder
            let swContent = swSource.replace(/__CACHE_VERSION__/g, version);

            // Try to read manifest and inject asset paths for precaching
            const manifestPath = resolve(__dirname, 'public/build/manifest.json');
            if (existsSync(manifestPath)) {
                try {
                    const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
                    const assetPaths = Object.values(manifest)
                        .map((entry) => {
                            if (typeof entry === 'object' && entry.file) {
                                return `/build/${entry.file}`;
                            }
                            return null;
                        })
                        .filter(Boolean);

                    // Inject asset paths into PRECACHE_ASSETS
                    if (assetPaths.length > 0) {
                        const precacheAssets = ['/', '/favicon.ico', ...assetPaths]
                            .map((path) => `    '${path}'`)
                            .join(',\n');
                        swContent = swContent.replace(
                            /const PRECACHE_ASSETS = \[[\s\S]*?\];/,
                            `const PRECACHE_ASSETS = [\n${precacheAssets},\n];`
                        );
                        console.log(`[Service Worker] Precaching ${assetPaths.length} assets from manifest`);
                    }
                } catch (error) {
                    console.warn('[Service Worker] Could not read manifest for precaching:', error.message);
                }
            }

            // Write to public directory
            writeFileSync(
                resolve(__dirname, 'public/service-worker.js'),
                swContent
            );

            // Also write version to a file that can be read by Laravel
            writeFileSync(
                resolve(__dirname, 'public/sw-version.txt'),
                version
            );

            console.log(`[Service Worker] Built with version: ${version}`);
        },
    };
}

export default defineConfig({
    plugins: [
        react(),
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            refresh: true,
        }),
        tailwindcss(),
        svgr(),
        serviceWorkerPlugin(),
    ],
    resolve: {
        alias: {
            '~packages': '/resouses/packages',
            '@': '/resources/js',
        },
    },
});
