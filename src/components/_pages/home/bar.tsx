import { CopyToClipboard } from "react-copy-to-clipboard";

export function BarComponent() {
//   const [isCopied, setIsCopied] = useState(false);
  
//   const onCopyText = () => {
//     setIsCopied(true);
//     setTimeout(() => {
//       setIsCopied(false);
//     }, 1000);
//   };
  // __RENDER
  return (
    <section className='ui--home-bar'>
      <div className='ui--home-bar-content'>
          <div className="contract">
            Contract Address: 0x1FC2C1C218B079F21b6FdD52b07e4fd256c0A17f 
            <CopyToClipboard text='0x1FC2C1C218B079F21b6FdD52b07e4fd256c0A17f'><img className="copyContract" src="/static/images/copy.svg" alt="Click For Copy Contract Address" /></CopyToClipboard>
          </div>
          <div className="btnarea">
          <a className='btn btn-default buywwin' href="https://pancakeswap.finance/swap?outputCurrency=0x1FC2C1C218B079F21b6FdD52b07e4fd256c0A17f" target="_blank"><img className="wwintoken" src="/static/images/wwin-token.svg" alt="WWIN Token" /> Buy WWIN</a>
          </div>
      </div>
    </section>
  )
}
