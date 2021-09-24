import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import { Input, MediaComponent, CurrencyComponent } from '@/components'
import { useBEP20Contract, marketContract } from '@/contracts'
import { useAuth, useModal } from '@/hooks'
import { configs, chian } from '@/libs/configs'
import { getCookie } from '@/libs/cookies'
import { getEtherProvider, bigNumber, toUint256 } from '@/libs/web3'
import { assetService } from '@/services/assets.service'
import { dialog, loader, getRandom, getShortAddress, upperCase, lowerCase } from '@/utils'
import { NFTItem } from '@/types'
import { Connectors } from '@/types/constants'
import { notification as notice } from 'antd'

export function TradeComponent({ data }: { data: NFTItem }) {
  // __STATE <React.Hooks>
  const { account, signin } = useAuth()
  const { onModelActive: modal } = useModal(null, 'checkout')

  // __EFFECTS <React.Hooks>
  useEffect(() => {
    if (!account) {
      const connector: Connectors = getCookie(configs.CONNECTOR)
      if (connector) signin(connector)
    }
  }, [account, signin])

  // __FUNCTIONS
  const handleSignin = useCallback(() => {
    signin(Connectors.Injected)
  }, [])

  const handleShop = useCallback(() => {
    if (!data.available) return void 0
    if (account) {
      modal(<ModalChackout item={data} account={account} />)
    }
  }, [account, data])

  // __RENDER
  return (
    <div className='ui--assets-trade'>
      <div className='status'>
        <div className='columns owner'>
          <span className='label'>Owned by</span>
          <a className='btn btn-default' href={`${chian.explorer}/address/${data.owner}`} target='_blank'>
            {data.owner === account ? 'You' : getShortAddress(data.owner)}
          </a>
        </div>

        {data.owner !== account && (
          <>
            <div className='columns available'>
              <span className='icon bi bi-basket2'></span>
              <span className='text'>{data.available || 0} Available</span>
            </div>

            <div className='columns supply'>
              <span className='icon bi bi-archive'></span>
              <span className='text'>{data.totalSupply || 0} Total Supply</span>
            </div>
          </>
        )}
      </div>

      {data.owner !== account && (
        <div className='actions'>
          <div className='label'>Current price</div>
          <CurrencyComponent currency={data.currency} amount={data.price} size='large'>
            <small className='unit'>{data.currency}</small>
          </CurrencyComponent>

          {account ? (
            <button className='btn btn-dark btn-shop' disabled={!data.available} onClick={handleShop}>
              <span className='icon bi bi-basket2'></span>
              <span className='text'>{!data?.available ? 'out of stock' : 'buy now'}</span>
            </button>
          ) : (
            <button className='btn btn-dark btn-connect' onClick={handleSignin}>
              <span className='icon bi bi-wallet2'></span>
              <span className='text'>Connect Wallet</span>
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export function ModalChackout({ item, account }: { item: NFTItem; account: string }) {
  // __STATE <React.Hooks>
  const [wait, setWait] = useState<boolean>(false)
  const [agree, setAgree] = useState<boolean>(false)
  const [allowance, setAllowance] = useState<number>(0)
  const { onModelActive: modal } = useModal(null, 'success')

  const coinContract = useBEP20Contract(item.currency)
  const isBNB = lowerCase(item.currency) === 'bnb'

  const tokenId = getRandom(item.tokenIds)
  const tokenPrice = toUint256(item.price)
  const tokenAddress = item.id
  const marketAddress = marketContract.getAddress()

  // __EFFECTS <React.Hooks>
  useEffect(() => {
    async function getBalance() {
      const ether = getEtherProvider()
      if (ether) {
        const balance = await ether.getBalance(account)
        setAllowance(bigNumber(balance).toNumber())
      }
    }

    async function getAllowance() {
      const { methods } = coinContract.build()
      const res = await methods.allowance(account, marketAddress).call()
      setAllowance(bigNumber(res).toNumber())
    }

    if (account) {
      if (isBNB) getBalance()
      else getAllowance()

      console.log('RNG TokenId:', tokenId)
    }
  }, [account])

  // __FUNCTIONS
  const handleAction = useCallback(async (): Promise<void> => {
    if (!account) return void 0
    if (isBNB && allowance < tokenPrice.toNumber()) return void 0
    if (allowance < tokenPrice.toNumber()) return handleApprove()

    setWait(true)

    try {
      const { methods } = marketContract.build()

      let res: any = void 0
      if (isBNB) {
        res = await methods.buyWithBNB(tokenAddress, tokenId).send({
          from: account,
          value: tokenPrice.toString(),
          gas: 199e3
        })
      } else {
        res = await methods.buy(tokenAddress, tokenId).send({ from: account })
      }

      if (res.status) {
        assetService.buy({
          postId: tokenId,
          nftAddress: tokenAddress,
          account,
          mode: 'buy'
        })
        modal(<ModalPurchase name={item.name} />)
      }

      console.log('Action Checkout:', res)
    } catch (err: any) {
      dialog({
        title: 'Transaction Error.',
        message: err.message || 'Transaction has been reverted!'
      })
      console.error('Action Checkout:', err)
    }

    setWait(false)
  }, [account, tokenPrice])

  const handleApprove = useCallback(async (): Promise<void> => {
    setWait(true)

    try {
      const { methods } = coinContract.build()
      const res: any = await methods.approve(marketAddress, tokenPrice.toString()).send({ from: account })
      if (res.status) {
        setAllowance(tokenPrice.toNumber())
        notice.success({
          duration: 3,
          message: 'Transaction Receipt',
          description: `Approve amount: ${item.price} ${upperCase(item.currency)}`
        })
      }
    } catch (err) {
      console.error('handleApprove', err)
    }

    setWait(false)
  }, [account, tokenPrice])

  // __RENDER
  return (
    <div className='ui--asset-modal checkout'>
      <h3 className='h3'>item</h3>

      <div className='ul'>
        <div className='item'>
          <MediaComponent media={item.image} autoPlay />
          <div className='meta' title={item.name}>
            <p className='name'>{item.name}</p>
            <p className='desc'>Untitled Collection</p>
          </div>
          <CurrencyComponent currency={item.currency} amount={item.price} size='large' />
        </div>
      </div>

      <div className='summary'>
        <h3 className='h3'>total</h3>
        <CurrencyComponent currency={item.currency} amount={item.price} size='large' />
      </div>

      <Input.Checkbox
        key='.agree'
        name='agree'
        label='By checking this box, I agree to winwinwin term of service.'
        register={() => ({ onChange: ({ target }: any) => setAgree(target.checked) })}
      />

      <div className='ui--asset-modal-footer'>
        <button className='btn btn-dark btn-checkout' disabled={!agree || wait} onClick={handleAction}>
          <span className='text'>
            {wait
              ? 'Awaiting...'
              : allowance < tokenPrice.toNumber()
              ? isBNB
                ? 'Insufficient BNB balance'
                : `Approve ${upperCase(item.currency)}`
              : 'Checkout'}
          </span>
        </button>
      </div>
    </div>
  )
}

export function ModalPurchase({ name }: { name: string }) {
  // __STATE <React.Hooks>
  const router = useRouter()

  // __EFFECTS <React.Hooks>
  useEffect(() => {
    loader('on')
    setTimeout(() => {
      router.push({ pathname: '/profile' })
    }, 3e3)
  }, [])

  // __RENDER
  return (
    <div className='ui--asset-modal purchase'>
      <span className='icon bi bi-check-circle-fill'></span>
      <h2 className='h2'>Your purchase has processed!</h2>
      <h6 className='h6'>You just purchased ({name})</h6>
    </div>
  )
}
