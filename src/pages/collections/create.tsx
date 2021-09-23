import { useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { useWeb3React } from '@web3-react/core'
import { RouterLink, Input } from '@/components'
import { useRole } from '@/hooks'
import { collectionService } from '@/services/collection.service'
import { dialog, loader, getFileListAt } from '@/utils'
import { FormCollection } from '@/types'

export default function CreateCollectionContainer() {
  // __STATE <React.Hooks>
  const router = useRouter()
  const { account } = useWeb3React()
  const { isUser } = useRole()
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<FormCollection>()

  // __EFFECTS <React.Hooks>
  useEffect(() => {
    if (account) setValue('owner', account)
  }, [account])

  // __FUNCTIONS
  const submit = useCallback(async (formData: FormCollection) => {
    if (isUser) {
      dialog({
        title: 'Permission Denied.',
        message: 'You not have permission for create collection.'
      })
      return void 0
    }

    loader('on')

    let { logo, cover } = formData
    logo = getFileListAt(logo as FileList, 0)!

    // Set cover image same as logo when not choose.
    if (!cover) {
      cover = logo
    } else {
      cover = getFileListAt(cover as FileList, 0)!
    }

    const res = await collectionService.create({ ...formData, cover, logo })
    if (res) {
      router.push('/collections')
    } else {
      loader('off')
    }
  }, [])

  // __RENDER
  return (
    <div className='ui--collect router-view'>
      <form className='ui--collect-create' onSubmit={handleSubmit(submit)}>
        <div className='ui--collect-create-header'>
          <RouterLink className='btn btn-overlay btn-back' href='/collections'>
            <span className='icon bi bi-arrow-left-short'></span>
            <span className='text'>back</span>
          </RouterLink>

          <h1 className='h1'>Create your collection</h1>
        </div>

        <div className='ui--collect-create-body'>
          <Input.Image
            key='.logo'
            name='logo'
            label='logo image'
            register={register}
            errors={errors.logo}
            rules={{ required: true }}
          >
            This image will also be used for navigation. 350 x 350 recommended.
          </Input.Image>

          <Input.Image key='.cover' name='cover' label='cover image' register={register}>
            This image will be used for featuring your collection on the homepage or category pages. 600 x 400
            recommended.
          </Input.Image>

          <Input.Main
            key='.name'
            name='name'
            label='collection name'
            register={register}
            errors={errors.logo}
            rules={{ required: true }}
          />

          <Input.Textarea key='.description' name='description' label='description' register={register}>
            Markdown syntax is supported. 0 of 500 characters used.
          </Input.Textarea>
        </div>

        <div className='ui--collect-create-footer'>
          <button className='btn btn-primary btn-create' type='submit'>
            <span className='text'>create</span>
          </button>
        </div>
      </form>
    </div>
  )
}
