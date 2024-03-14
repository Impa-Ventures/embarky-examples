const isDev = process.env.NODE_ENV === 'development'

const nextConfig = {
  reactStrictMode: false,
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // async rewrites() {
  //   return [
  //     {
  //       source: '/ONBOARDING_API/:path*',
  //       destination: 'http://13.212.200.64:8080/:path*',
  //     },
  //   ]
  // },
}

module.exports = nextConfig
