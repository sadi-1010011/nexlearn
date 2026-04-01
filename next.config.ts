import type { NextConfig } from "next";
import withFlowbiteReact from "flowbite-react/plugin/nextjs";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://nexlearn.noviindusdemosites.in/:path*",
      },
    ];
  },
};

export default withFlowbiteReact(nextConfig);