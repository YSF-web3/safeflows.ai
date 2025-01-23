'use client'

import Image from 'next/image'

import {WalletError} from '@solana/wallet-adapter-base'
import {ConnectionProvider, WalletProvider,} from '@solana/wallet-adapter-react'
import {
    WalletModalProvider, 
} from '@solana/wallet-adapter-react-ui'
import dynamic from 'next/dynamic'
import {ReactNode, useCallback, useMemo} from 'react'
import {useCluster} from '../cluster/cluster-data-access'

require('@solana/wallet-adapter-react-ui/styles.css')

import UserIcon from "@/assets/svg/user.svg";


export const WalletButton = dynamic(async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton, {
    ssr: false,
})

export function SolanaProvider({ children }: { children: ReactNode }) {
    const { cluster } = useCluster()
    const endpoint = useMemo(() => cluster.endpoint, [cluster])
    const onError = useCallback((error: WalletError) => {
        console.error(error)
    }, [])

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={[]} onError={onError} autoConnect={true}>
                <WalletModalProvider>
                    {children}
                    {/* <Image src={UserIcon} width={26} height={30} alt='Account'  /> */}
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    )
}