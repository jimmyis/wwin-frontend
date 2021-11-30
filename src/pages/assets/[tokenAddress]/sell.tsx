import { useCallback } from 'react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { Input } from '@/components'
import { setFormat } from '@/libs/moment'
// import { demoService } from '@/services/demo.service'
import { /* dialog,  */price } from '@/utils'

export default function AssetSellContainer() {
  // __STATE <React.Hooks>
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      method: 'sell',
      startPrice: '',
      schedule: setFormat(Date.now(), 'YYYY-MM-DDTHH:mm')
    }
  })

  // __FUNCTIONS
  const submit = useCallback(async (/* formData */): Promise<void> => {
    // const res = await demoService.sign('Sign to sell NFT.')
    // await dialog(
    //   `<pre>${JSON.stringify(
    //     {
    //       signToken: res,
    //       ...formData
    //     },
    //     null,
    //     2
    //   )}</pre>`
    // )

    router.push('/assets/'/* + res */)
  }, [])

  // __RENDER
  return (
    <div className='ui--asset router-view'>
      <form className='ui--asset-sell' onSubmit={handleSubmit(submit)}>
        <div className='ui--asset-sell-form'>
          <div className='ui--input-provider'>
            <label className='ui--input-label required'>Select your sell method</label>
            <ul className='method'>
              <li className='li'>
                <input type='radio' id='method-1' className='li-input' value='sell' {...register('method')} />
                <label className='li-label' htmlFor='method-1'>
                  <span className='text'>Set Price</span>
                  <span className='desc'>Sell at a fixed or declining price</span>
                </label>
              </li>

              <li className='li'>
                <input type='radio' id='method-2' className='li-input' value='bid' {...register('method')} />
                <label className='li-label' htmlFor='method-2'>
                  <span className='text'>Highest Bid</span>
                  <span className='desc'>Auction to the highest bidder</span>
                </label>
              </li>
            </ul>
          </div>

          <Input.Main
            key='.price'
            type='number'
            name='startPrice'
            label='Starting Price'
            placeholder='Amount'
            register={register}
            errors={errors.startPrice}
            rules={{ required: true }}
          >
            Will be on sale until you transfer this item or cancel it.
          </Input.Main>

          <Input.Main key='.schedule' type='datetime-local' name='schedule' label='Schedule Post' register={register}>
            You can schedule this listing to only be buyable at a future date
          </Input.Main>
        </div>

        <div className='ui--asset-sell-summary'>
          <div className='ui--asset-sell-summary-title'>
            <span className='icon bi bi-receipt'></span>
            <span className='text'>summary</span>
          </div>

          <div className='ui--asset-sell-summary-info'>
            <label className='label'>price</label>

            <div className='currency'>
              <img className='icon' src='/static/images/eth.svg' />
              <span className='text'>{price(1.1, 2)}</span>
            </div>

            <button type='submit' className='btn btn-primary btn-post'>
              <span className='text'>Post your listing</span>
            </button>
          </div>

          <div className='ui--asset-sell-summary-fee'>
            <label className='label'>fees</label>
            <p className='desc'>Listing is free! At the time of the sale, the following fees will be deducted.</p>

            <ul className='ul'>
              <li className='li'>
                <span className='text'>Total fee</span>
                <span className='value'>{price(1.12, 2)}%</span>
              </li>
            </ul>
          </div>
        </div>
      </form>
    </div>
  )
}
