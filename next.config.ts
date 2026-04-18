import type { NextConfig } from "next";

// GitHub Pages deploy config:
// - Static export (no Node server; app is SPA-like via next/dynamic ssr:false)
// - basePath so assets resolve at /<repo>/ when hosted at user.github.io/<repo>/
// - trailingSlash so /route/ resolves to /route/index.html on static hosts
// - images unoptimized because next/image requires a server loader
const isProd = process.env.NODE_ENV === "production";
const repoBase = "/Code-Design-Hackathon";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isProd ? repoBase : "",
  assetPrefix: isProd ? repoBase : "",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
