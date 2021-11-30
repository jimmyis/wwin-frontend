// import { wwinContract } from '@/contracts/wwin.contract'
// import { marketContract } from '@/contracts/market.contract'
// import { swapContract } from '@/contracts/swap.contract'
// import { getEtherProvider, getSignature } from '@/libs/web3'
// import { BigNumber } from '@ethersproject/bignumber'

export const demoService = {
//   /**
//    * The bep token owner.
//    *
//    * @returns Wallet address.
//    */
//   async getOwner(): Promise<any> {
//     try {
//       const { methods } = wwinContract.build()
//       return await methods.getOwner().call()
//     } catch (error) {
//       return error
//     }
//   },

//   async sign(message: string): Promise<any> {
//     const res = await getSignature(message)
//     if (res) return res
//     return void 0
//   },

//   async test(): Promise<any> {
//     try {
//       const a = marketContract.build()
//       console.log(a)

//       return a
//     } catch (error) {
//       return error
//     }
//   },

//   async trans(): Promise<void> {
//     const ether = getEtherProvider()
//     if (ether) {
//       const res = await ether.sendTransaction({
//         to: '0xbd5545fC37EC04ccB92Ef0754f7dbDc1BA9a25A4',
//         from: '0x07FE2159b634526630BDd8E4D6a70fFDAC170108',
//         value: 2
//       })

//       console.log(res)
//     }
//   },

//   async swapNFT(address: string, amount: BigNumber, nftAddress: string, rng: BigNumber): Promise<any> {
//     try {
//       const { methods } = swapContract.build()
//       return await methods.swapNFT(address, amount, nftAddress, rng).call()
//     } catch (error) {
//       return error
//     }
//   }
}
