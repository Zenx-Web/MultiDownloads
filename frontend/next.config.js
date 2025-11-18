/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Force dynamic rendering to avoid build-time Supabase issues
  experimental: {
    outputFileTracingIncludes: {
      '/': ['./node_modules/**/*.wasm', './node_modules/**/*.node'],
    },
  },
};

module.exports = nextConfig;
