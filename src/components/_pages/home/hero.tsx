export function HeroBannerComponent() {
  // __RENDER
  return (
    <section className='ui--home-hero'>
      <div className='ui--home-hero-content'>
        <img className='coin' src='/static/images/003.png' alt='wwin-coin' />
        <h2 style={{
        fontFamily: 'made-bon-voyage-regular',
        fontWeight: 900,
        fontSize: '44px',
        color: '#a58231'
      }}>Welcome to the</h2>
        <h1 style={{
        fontFamily: 'made-bon-voyage-regular',
        fontWeight: 900,
        fontSize: '49px',
        color: 'white'
      }}>First SNFT Marketplace,</h1>
        <h4 style={{
        fontFamily: 'made-bon-voyage-regular',
        fontWeight: 900,
        fontSize: '18px',
        color: '#abacba'
      }}>
          where blockchain technology
          <br />
          meets ancient Tradition.
        </h4>
      </div>
    </section>
  )
}
