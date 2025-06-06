/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: 'https://train-schedule-eta.vercel.app'
  },
  output: 'standalone',
  async rewrites() {
    return [];
  }
};

module.exports = nextConfig; 