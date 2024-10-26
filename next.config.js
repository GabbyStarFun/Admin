/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
  }
  
  
  module.exports = {
    ...nextConfig,
    experimental: {
      missingSuspenseWithCSRBailout: false,
    },
    async rewrites() {
      
      return [
        {
          source: '/mp3',
          destination: 'https://radio.limeradio.net:8000/radio.mp3',
        },
        {
          source: "/images", destination: "https://radio.limeradio.net/api/station/lime/art/"
        }
      ]
    },
  }