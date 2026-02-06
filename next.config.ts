import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  reactStrictMode: true,  
  images: {
    domains: [
      'zhocnofpayqskvusijut.supabase.co',
    ],
  },  
}

export default nextConfig
