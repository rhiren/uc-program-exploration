import type { NextConfig } from "next";

const pagesBasePath = process.env.PAGES_BASE_PATH;
const isGitHubPagesBuild = pagesBasePath !== undefined;

const nextConfig: NextConfig = {
  output: isGitHubPagesBuild ? "export" : undefined,
  basePath: isGitHubPagesBuild ? pagesBasePath : undefined,
  assetPrefix: isGitHubPagesBuild ? pagesBasePath : undefined,
  trailingSlash: isGitHubPagesBuild,
  images: {
    unoptimized: isGitHubPagesBuild,
  },
};

export default nextConfig;
