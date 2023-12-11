import path from "path";
import { defineConfig } from 'vitest/config';
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    build: {
        outDir: '../build/client/',
    },
    test: {
        testTimeout: 10000,
        globals: true,
        environment: 'happy-dom',
        setupFiles: './vitest.setup.ts',
        clearMocks: true,
        coverage: {
            provider: 'v8',
            include: ['src/**/*.{ts,tsx}'],
        },
    }
});
