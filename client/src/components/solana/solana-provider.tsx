'use client'

import Image from 'next/image'
import { WalletError } from '@solana/wallet-adapter-base'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import dynamic from 'next/dynamic'
import { ReactNode, useCallback, useMemo } from 'react'
import { useCluster } from '../cluster/cluster-data-access'

// Import wallet adapters
import { 
    PhantomWalletAdapter,
    SolflareWalletAdapter,
    // BackpackWalletAdapter,
    // BraveWalletAdapter,
    CoinbaseWalletAdapter,
    LedgerWalletAdapter,
    TorusWalletAdapter,
    TrustWalletAdapter
} from '@solana/wallet-adapter-wallets'

require('@solana/wallet-adapter-react-ui/styles.css')

export const WalletButton = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { ssr: false }
)

export function SolanaProvider({ children }: { children: ReactNode }) {
    const { cluster } = useCluster()
    const endpoint = useMemo(() => cluster.endpoint, [cluster])

    // Initialize all the wallets you want to support
    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter(),
            // new BackpackWalletAdapter(),
            // new BraveWalletAdapter(),
            new CoinbaseWalletAdapter(),
            new LedgerWalletAdapter(),
            new TorusWalletAdapter(),
            new TrustWalletAdapter()
        ],
        []
    )

    const onError = useCallback((error: WalletError) => {
        console.error(error)
    }, [])

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} onError={onError} autoConnect={true}>
                <WalletModalProvider>
                    {children}
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    )
}