/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Build a self-contained server bundle so the app runs on a generic Node runtime and in a plain
  // Docker container — ADR-0008 constraint 2 (generic deployability), verified by CI. Opt-in via
  // env because the standalone trace copy uses symlinks, which require privileges Windows dev
  // machines lack; CI (Linux) and the Docker build set NEXT_STANDALONE=1.
  output: process.env.NEXT_STANDALONE === '1' ? 'standalone' : undefined,
  // Compile the workspace source packages (they ship TypeScript source, not built output).
  transpilePackages: ['@platform/ui', '@platform/tokens', '@platform/domain'],
  // Linting runs as its own CI step (eslint .); do not run it again inside `next build`.
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: false },
};

export default nextConfig;
