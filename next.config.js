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
  //       destination: 'https://auth.embarky.xyz/:path*',
  //     },
  //   ]
  // },
}

module.exports = nextConfig
