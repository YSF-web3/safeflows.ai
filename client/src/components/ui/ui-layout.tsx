'use client'

import { Poppins } from "next/font/google";
import {usePathname} from 'next/navigation'
import * as React from 'react'
import {ReactNode, Suspense, useEffect, useRef} from 'react'
import toast, {Toaster} from 'react-hot-toast'

import {AccountChecker} from '../account/account-ui'
import {ClusterChecker, ClusterUiSelect, ExplorerLink} from '../cluster/cluster-ui'
import {WalletButton} from '../solana/solana-provider'

import Header from './header'
import Footer from "./footer";

const poppins = Poppins({
    weight: ['400', '500', '600', '700'],
    subsets: ['latin'],
})


export function UiLayout({ children, links }: { children: ReactNode; links: { label: string; path: string }[] }) {

     

    return (
        <>
            <style jsx global>{`
                html {
                    font-family: ${poppins.style.fontFamily};
                }
            `}</style>

            <div className="relative h-screen bg-[#000000] min-h-fit overflow-x-hidden">
                <div className="absolute -top-[200px] -left-[200px] size-[600px] bg-gradient-radial rounded-full opacity-35"></div>
                <div className="absolute top-[calc(100vh_/_3)] -right-[300px] size-[600px] bg-gradient-radial rounded-full opacity-25"></div>

                <div className="relative z-10 text-center min-h-fit">
                    <div className="h-full px-11 pt-11 pb-8 min-h-fit">
                        <div className="flex items-center justify-center w-full">
                            <Header links={links} />
                        </div>
                        {/* <div className="navbar bg-base-300 dark:text-neutral-content flex-col md:flex-row space-y-2 md:space-y-0">
                            <div className="flex-1">
                                <Link className="btn btn-ghost normal-case text-xl" href="/">
                                    Safeflowsaifront
                                </Link>
                                <ul className="menu menu-horizontal px-1 space-x-2">
                                    {links.map(({ label, path }) => (
                                    <li key={path}>
                                        <Link
                                        className={pathname.startsWith(path) ? "active" : ""}
                                        href={path}
                                        >
                                            {label}
                                        </Link>
                                    </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex-none space-x-2">
                                <WalletButton />
                                <ClusterUiSelect />
                            </div>
                        </div> */}
                        <ClusterChecker>
                            <AccountChecker />
                        </ClusterChecker>
                        <div className="w-full h-full flex justify-center min-h-fit">
                            <div className="w-full h-full container min-h-fit">
                                <Suspense
                                    fallback={
                                        <div className="text-center my-32">
                                            <span className="loading loading-spinner loading-lg"></span>
                                        </div>
                                    }
                                >
                                    {children}
                                </Suspense>
                                <Toaster position="bottom-right" />
                            </div>
                        </div>
                        <div className="flex items-center justify-center w-full mt-8">
                            <Footer links={links} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export function AppModal({
    children,
    title,
    hide,
    show,
    submit,
    submitDisabled,
    submitLabel,
}: {
    children: ReactNode
    title: string
    hide: () => void
    show: boolean
    submit?: () => void
    submitDisabled?: boolean
    submitLabel?: string
}) {
    const dialogRef = useRef<HTMLDialogElement | null>(null)

    useEffect(() => {
        if (!dialogRef.current) return
        if (show) {
            dialogRef.current.showModal()
        } else {
            dialogRef.current.close()
        }
    }, [show, dialogRef])

    return (
        <dialog className="modal" ref={dialogRef}>
            <div className="modal-box space-y-5">
                <h3 className="font-bold text-lg">{title}</h3>
                {children}
                <div className="modal-action">
                    <div className="join space-x-2">
                        {submit ? (
                        <button className="btn btn-xs lg:btn-md btn-primary" onClick={submit} disabled={submitDisabled}>
                            {submitLabel || 'Save'}
                        </button>
                        ) : null}
                        <button onClick={hide} className="btn">
                        Close
                        </button>
                    </div>
                </div>
            </div>
        </dialog>
    )
}

export function AppHero({
        children,
        title,
        subtitle,
    }: {
        children?: ReactNode
        title: ReactNode
        subtitle: ReactNode
    }) {
    return (
        <div className="hero py-[64px]">
            <div className="hero-content text-center">
                <div className="max-w-2xl">
                    {typeof title === 'string' ? <h1 className="text-5xl font-bold">{title}</h1> : title}
                    {typeof subtitle === 'string' ? <p className="py-6">{subtitle}</p> : subtitle}
                    {children}
                </div>
            </div>
        </div>
    )
}

export function ellipsify(str = '', len = 4) {
    if (str.length > 30) {
        return str.substring(0, len) + '..' + str.substring(str.length - len, str.length)
    }
    return str
}

export function useTransactionToast() {
    return (signature: string) => {
        toast.success(
            <div className={'text-center'}>
                <div className="text-lg">Transaction sent</div>
                <ExplorerLink path={`tx/${signature}`} label={'View Transaction'} className="btn btn-xs btn-primary" />
            </div>,
        )
    }
}
