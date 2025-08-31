/** @type {import('next').NextConfig} */
const API_BASE_URL = "http://localhost:8000";

const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',          // what the browser calls
        destination: `${API_BASE_URL}/:path*`, // actual backend URL
      },
    ];
  },
};

export default nextConfig;
