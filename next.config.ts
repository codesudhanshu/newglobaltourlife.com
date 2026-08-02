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
    // Legacy category-prefixed detail URLs → flat /<slug>.
    // cars / hotels / destinations are NOT listed here: those prefixes now serve
    // real filter pages (/cars/<category>, /hotels/<city>, /destinations/<region>)
    // and handle the legacy-slug redirect themselves.
    const types = ["packages", "tirth-yatra", "bus", "visa", "travel-guide", "blogs"];
    return types.map((t) => ({
      source: `/${t}/:slug`,
      destination: "/:slug",
      permanent: true,
    }));
  },
};

export default nextConfig;
