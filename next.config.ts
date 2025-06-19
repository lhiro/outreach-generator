import type { NextConfig } from 'next'
import { codeInspectorPlugin } from 'code-inspector-plugin'

const nextConfig: NextConfig = {
  reactStrictMode: false,
  /* config options here */
  webpack: config => {
    config.plugins.push(codeInspectorPlugin({ bundler: 'webpack' }))
    return config
  }
}

export default nextConfig
