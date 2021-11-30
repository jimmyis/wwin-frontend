import { useState, useEffect /*, useMemo, useCallback */ } from 'react'
// import { useSelector, useDispatch, coreSelector, coreActions } from '@/store'
import { useWeb3React } from '@web3-react/core'
import { getFirebaseApp } from '@/libs/firebase'

// Get Firebase DB Configs 
// by passing chainId and environment variables to determine which DB connector will be use
// then return a common function to call then in a single point.

export function useDB() {
    // __STATE <React.Hooks>
    const { account, chainId } = useWeb3React()
    const environment_ = chainId === 56 ? "production" : "development"
    const firebaseApp = getFirebaseApp(environment_)
    const [ db, setDB ] = useState<any>(firebaseApp.db)

    useEffect(() => {
        const environment_ = chainId === 56 ? "production" : "development"
        const firebaseApp = getFirebaseApp(environment_);
        setDB(firebaseApp.db);
        // console.log("Current Firebase App", firebaseApp);
    }, [ chainId ])

    return {
        account, chainId, db
    }
}



// Get Firebase DB Configs 
// by passing chainId and environment variables to determine which DB connector will be use
// then return a common function to call then in a single point.

console.log(process.env.NEXT_PUBLIC_BUILD_ENV)

