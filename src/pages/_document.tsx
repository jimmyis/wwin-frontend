import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document'

export default class CustomDocument extends Document {
  static async getInitialProps(context: DocumentContext) {
    const initialProps = await Document.getInitialProps(context)
    return { ...initialProps }
  }

  render() {
    return (
      <Html lang='en-US'>
        <Head>
          <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
          <meta name='theme-color' content='#515BD4' />
          <link rel='manifest' href='/manifest.json' />
          <link rel='icon' href='/favicon.ico' />
          <link rel='preconnect' href='https://fonts.googleapis.com' />
          <link rel='preconnect' href='https://fonts.gstatic.com' />
          <link rel='preconnect' href='https://cdn.jsdelivr.net' />
          <link
            rel='stylesheet'
            href='https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600&display=swap'
          />
          <link rel='stylesheet' href='https://fonts.googleapis.com/css2?family=PT+Serif:wght@400;700&display=swap' />
          <link
            rel='stylesheet'
            href='https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.0/font/bootstrap-icons.css?display=swap'
          />
          <link rel='stylesheet' href='https://cdn.jsdelivr.net/npm/antd@4.16.12/dist/antd.min.css' />
        </Head>

        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
