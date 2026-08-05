import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin the workspace root explicitly so Turbopack doesn't try to infer it
  // from stray lockfiles higher up the filesystem (e.g. in the user profile).
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
