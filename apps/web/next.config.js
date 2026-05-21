/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const apiBaseUrl = apiUrl.replace(/\/trpc$/, "");
    return [
      {
        source: "/docs",
        destination: `${apiBaseUrl}/docs`,
      },
      {
        source: "/openapi.json",
        destination: `${apiBaseUrl}/openapi.json`,
      },
    ];
  },
};

export default nextConfig;
