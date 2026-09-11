import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    trailingSlash: true,
    output: 'standalone',
    turbopack: {
        root: __dirname,
    },
    images: {
        unoptimized: true
    }
};

export default nextConfig;
