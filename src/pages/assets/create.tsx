import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { Input } from '@/components'
import { useRole } from '@/hooks'
import { isProduction } from '@/libs/configs'
import { assetService } from '@/services/assets.service'
import { collectionService } from '@/services/collection.service'
import { useSelector, recordSelector } from '@/store'
import { dialog, loader, getQueryAt } from '@/utils'
import { fileValidator, digitsValidator } from '@/utils/validator'
import { FormMintNFT } from '@/types'

export default function CreateAssetContainer() {
  // __STATE <React.Hooks>
  const router = useRouter()
  const { isUser } = useRole()
  const [wait, setWait] = useState<boolean>(false)
  const collects = useSelector(recordSelector.getCollections)
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<FormMintNFT>({
    defaultValues: {
      status: 'new',
      totalSupply: 1,
      price: 0.0001,
      currency: 'bnb',
      excludes: []
    }
  })

  // __EFFECTS <React.Hooks>
  useEffect(() => {
    collectionService.getLists()
  }, [])

  useEffect(() => {
    const { collectId } = router.query
    if (collectId) {
      setValue('collection_id', getQueryAt(collectId))
    }
  }, [router])

  // __FUNCTIONS
  const submit = useCallback(async (formData: FormMintNFT): Promise<void> => {
    if (isUser) {
      dialog({
        title: 'Permission Denied.',
        message: 'You not have permission for mint new NFT.'
      })
      return void 0
    }

    const _desc =
      formData.totalSupply > 5
        ? 'Minting a large supply will take a very long time!'
        : 'Minting takes about 30 seconds to 1 minute per supply.'

    const { isDenied } = await dialog({
      type: 'confirm',
      title: 'Minting Confirm.',
      message: `<p>Comfirm to minting new NFT?</p><small>${_desc}</small>`
    })

    if (isDenied) return void 0

    const signature = await getSign()
    if (!signature) return void 0

    loader('on')
    setWait(true)

    if (formData.excludes?.length) {
      formData.excludes = formData.excludes.filter((r) => Boolean(+r)).map((r) => +r)
    }

    const res = await assetService.create({ ...formData, signature })
    if (res) {
      location.href = `/assets/${res.contractToken}`
    } else {
      loader('off')
    }
  }, [])

  const getSign = useCallback(async (): Promise<any> => {
    const signature = await assetService.getSignature()
    if (signature && !signature.code) {
      return signature
    } else {
      dialog(signature.message)
      return void 0
    }
  }, [])

  // __RENDER
  return (
    <div className='ui--asset router-view'>
      <form className='ui--asset-create' onSubmit={handleSubmit(submit)}>
        <div className='ui--asset-create-header'>
          <button className='btn btn-overlay btn-back' onClick={router.back}>
            <span className='icon bi bi-arrow-left-short'></span>
            <span className='text'>back</span>
          </button>

          <h1 className='h1'>Create new item</h1>
        </div>

        <div className='ui--asset-create-body'>
          <Input.Media
            key='.image'
            name='image'
            label='Image or Video'
            accept='image/*,video/*'
            register={register}
            errors={errors.image}
            rules={{
              required: true,
              validate: (files: FileList) =>
                fileValidator(files, {
                  fileType: {
                    regex: /\.(jpg|png|gif|svg|webp|webm|mp4|ogg)$/i,
                    message: 'File type is unsupported.'
                  },
                  fileMaxSize: {
                    regex: 40,
                    message: 'Over limit of file size. (Maximum 40MB)'
                  }
                })
            }}
          >
            File types supported: JPG, PNG, GIF, SVG, WEBP, MP4, WEBM, OGG. Max size: 40 MB
          </Input.Media>

          <Input.Main
            key='.name'
            name='name'
            label='name'
            placeholder='Item name'
            register={register}
            errors={errors.name}
            rules={{ required: true }}
          />

          <Input.Textarea
            key='.description'
            name='description'
            label='description'
            placeholder='Provide a detailed description of your item.'
            register={register}
          >
            The description will be included on the item's detail page underneath its image.
          </Input.Textarea>

          <Input.Select
            key='.collection'
            name='collection_id'
            label='Collection'
            placeholder='Untitled Collection'
            register={register}
            options={collects.map((r: any) => ({ label: r.name, value: r.id }))}
          >
            This is the collection where your item will appear.
          </Input.Select>

          <Input.Property onChange={(s) => setValue('properties', s)} />

          <Input.Tags
            key='.categories'
            name='categories'
            label='Categories'
            onChange={(v) => setValue('excludes', v)}
            register={() => {}}
          />

          <Input.Main
            key='.price'
            type='text'
            name='price'
            label='Price'
            register={register}
            errors={errors.price}
            rules={{
              required: true,
              pattern: digitsValidator()
            }}
          />

          <Input.Select
            key='.currency'
            name='currency'
            label='currency'
            register={register}
            options={[
              { label: 'BNB', value: 'bnb' },
              { label: 'BUSD', value: 'busd' },
              { label: 'BATH', value: 'bath' },
              { label: 'wWin', value: 'wwin' }
            ].filter(({ value }) => (isProduction ? value !== 'bath' : true))}
          />

          <Input.Main
            key='.supply'
            type='number'
            name='totalSupply'
            label='Total Supply'
            register={register}
            errors={errors.totalSupply}
            rules={{
              required: true,
              pattern: digitsValidator()
            }}
          >
            The number of copies that can be minted. No gas cost to you! Quantities above one coming soon.
          </Input.Main>

          <Input.Tags
            key='.excludes'
            name='excludes'
            label='excludes'
            onChange={(arr: any[]) => setValue('excludes', arr)}
            register={() => {}}
          />
        </div>

        <div className='ui--asset-create-footer'>
          <button type='submit' className='btn btn-primary btn-create' disabled={isUser || wait}>
            <span className='text'>{wait ? 'creating...' : 'create'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
