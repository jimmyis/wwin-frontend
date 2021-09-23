// const isProd = process.env.NODE_ENV === 'production'
// const isDevelop = process.env.NODE_ENV === 'development'

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
  productionBrowserSourceMaps: false
}
