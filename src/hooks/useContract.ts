import { useEffect /*, useMemo, useCallback */ } from 'react'
// import { useSelector, useDispatch, coreSelector, coreActions } from '@/store'
import { useWeb3React } from '@web3-react/core'
import { getContracts } from '@/libs/contracts'

// Get Firebase DB Configs 
// by passing chainId and environment variables to determine which DB connector will be use
// then return a common function to call then in a single point.

export function useContract() {
    // __STATE <React.Hooks>
    const { chainId } = useWeb3React()
    const contracts = getContracts(chainId)

    // const { db } = useDB()
    // Load contract in database

    useEffect(() => {
        // const firebaseApp = getContracts(environment_);
        // setDB(firebaseApp.db);
        // console.log("Current Firebase App", firebaseApp);
    }, [ chainId ])

    return {
        chainId, contracts
    }
}



// Get Firebase DB Configs 
// by passing chainId and environment variables to determine which DB connector will be use
// then return a common function to call then in a single point.

console.log(process.env.NEXT_PUBLIC_BUILD_ENV)

