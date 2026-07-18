import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "logo.clearbit.com",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    // Legacy category-prefixed detail URLs → flat /<slug>
    const types = ["cars", "hotels", "packages", "destinations", "tirth-yatra", "bus", "visa", "travel-guide", "blogs"];
    return types.map((t) => ({
      source: `/${t}/:slug`,
      destination: "/:slug",
      permanent: true,
    }));
  },
};

export default nextConfig;
