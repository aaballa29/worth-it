/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      // Photos are resized in the browser before upload, but leave headroom over the 1 MB default.
      // Vercel caps request bodies at 4.5 MB, so don't raise this past that.
      bodySizeLimit: "4mb",
    },
  },
};

export default nextConfig;
