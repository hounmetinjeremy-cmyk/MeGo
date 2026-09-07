/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/admin",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
