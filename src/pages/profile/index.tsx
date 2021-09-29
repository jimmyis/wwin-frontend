import { useState, useEffect } from 'react'
import { Profile, Loading, ArticleComponent } from '@/components'
import { userService } from '@/services/user.service'
import { useSelector, authSelector } from '@/store'
import { NFTItem } from '@/types'

export default function ProfileContainer() {
  // __STATE <React.Hooks>
  const user = useSelector(authSelector.getUser)
  const [state, setState] = useState<NFTItem[] | null>(null)

  // __EFFECTS <React.Hooks>
  useEffect(() => {
    async function run() {
      const res = await userService.getTransactions()
      if (res) setState(res)
    }

    if (user) run()
  }, [user])

  // __RENDER
  if (!user) return null
  return (
    <Profile.Layout className='main' user={user}>
      {state ? (
        <div className='collects'>
          {state.map((recoed, index) => (
            <ArticleComponent data={recoed} key={index} />
          ))}

          {!state.length && 'No Data!'}
        </div>
      ) : (
        <Loading />
      )}
    </Profile.Layout>
  )
}
