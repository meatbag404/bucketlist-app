import type { NextConfig } from 'next'

const config: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@bucketlist/shared'],
  // Allow LAN devices (phones on same Wi-Fi) to load Next.js dev resources.
  // Only affects `next dev`; production builds are unaffected.
  allowedDevOrigins: ['192.168.1.194'],
}

export default config
