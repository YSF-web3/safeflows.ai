'use client'

import {usePathname} from 'next/navigation'
import Image from 'next/image';
import Link from 'next/link'

import XIcon from "@/assets/svg/x.svg";
import FacebookIcon from "@/assets/svg/facebook.svg"
import GithubIcon from "@/assets/svg/github.svg"
import TelegramIcon from "@/assets/svg/telegram.svg"


export default function Footer ({ links }: { links: { label: string; path: string }[] }) {
    const pathname = usePathname()

    return (
        <div className="container w-full h-[75px] bg-[gray]/10 backdrop-blur-xl border border-[#333333] rounded-[13px] pl-6 pr-3 flex items-center justify-between">
            <div>
                <div className="text-white text-xl w-[120px] lg:w-[180px]"><img src="/logo.svg" width={180} alt="" /></div>
            </div>
            <div className="pr-4 flex items-center gap-2 lg:gap-4">
                <Link  className='hover:scale-105' href={"https://github.com"} target="_blank" >
                    <Image src={GithubIcon} alt='github.com' className="size-6 lg:size-8 hover:color-[#C9F31D]" />
                </Link>

                <Link  className='hover:scale-105' href={"https://x.com/SafeFlowsAI"} target="_blank" >
                    <Image src={XIcon} alt='x.com' className="size-6 lg:size-8 hover:color-[#C9F31D]" />
                </Link>
            </div>
        </div>
    )
}