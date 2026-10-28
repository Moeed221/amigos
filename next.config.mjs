/** @type {import('next').NextConfig} */
const nextConfig = { output: 'export', trailingSlash: true, devIndicators: false, images: { unoptimized: true }, experimental: { cpus: 2 } };
export default nextConfig;
