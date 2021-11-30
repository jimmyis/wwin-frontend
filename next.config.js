// const isProd = process.env.NODE_ENV === 'production'
// const isDevelop = process.env.NODE_ENV === 'development'

console.log("Next Config", process.env)

module.exports = {
  redirects() {
    return [
      {
        source: '/collections',
        destination: '/',
        permanent: false
      }
    ]
  },
  target: 'serverless',
  productionBrowserSourceMaps: false,
  ignoreDuringBuilds: process.env.NEXT_PUBLIC_BUILD_ENV === "development" ? false : true,  
}
