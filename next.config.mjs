import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    reactStrictMode: true,
    trailingSlash: true,
    turbopack: {
        root: __dirname,
    },
    images: {
        unoptimized: true
    }
};

export default nextConfig;
