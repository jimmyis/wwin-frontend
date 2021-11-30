import { createContext, useContext, useEffect } from 'react'
import { changeCurrentChain } from '@/libs/configs'
import { useDB } from '@/hooks'
import { useWeb3React } from '@web3-react/core'

export const Context = createContext<{
    account?: string | null
    chainId?: number
    db?: any
}>({} as any)


export function useDataContext() {
    return useContext(Context)
}

export const DataProvider = ({ children }: any) => {
    const web3 = useWeb3React()
    const { account, chainId } = web3
    const { db } = useDB()

    useEffect(() => {
        changeCurrentChain(chainId)
    }, [chainId])

    useEffect(() => {
        console.log("Account is changing")
    }, [account])

    const value = {
        account, chainId, db
    }

    useEffect(() => {
        console.log("DB is Changing")
    }, [db])

    return (
        <Context.Provider value={value}>
            { children }
        </Context.Provider>
    )
}

export default DataProvider
