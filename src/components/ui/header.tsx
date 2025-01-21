'use client'

import {ReactNode, Suspense, useEffect, useRef} from 'react'
import {usePathname} from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'


import LogoIcon from "@/assets/svg/logo.svg";
import SettingIcon from "@/assets/svg/setting.svg";
import SearchIcom from "@/assets/svg/search-normal.svg";
import UserIcon from "@/assets/svg/user.svg";

export default function Header ({ links }: { links: { label: string; path: string }[] }) {
    const pathname = usePathname()

    return (
        <div className="container w-full h-[75px] bg-[#0B0E12] border border-[#333333] rounded-[13px] pl-6 pr-3 flex items-center justify-between">
            <div className="flex gap-[75px] h-full">
                <Image src={LogoIcon} alt='Logo' width={48} height={50} />

                <ul className="flex gap-11 items-end">
                    {links.map(({ label, path }) => (
                        <li key={path}>
                            <Link
                                className={`${(path !== "/" && pathname.startsWith(path)) || (path === "/" && pathname === "/") ? "text-[#C9F31D] font-bold [&>span]:border-[#C9F31D]" : "text-white font-normal [&>span]:border-transparent"} text-[22px] leading-8 flex flex-col gap-[18px]`}
                                href={path}
                            >
                                {label}
                                <span className="border-b-[3px] w-full"></span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="flex items-center gap-3">
                <button className="w-[60px] h-[60px] flex items-center justify-center bg-[#161D26] rounded-xl">
                    <Image src={SettingIcon} alt='Setting' width={20} height={20} />
                </button>

                <div className="bg-[#161D26] rounded-xl w-[310px] h-[60px] px-[26px] flex items-center gap-[18px]">
                    <Image src={SearchIcom} width={20} height={20} alt='Search' />
                    <input type="text" placeholder="Search" className="bg-transparent outline-none w-full h-full text-white font-normal text-sm leading-5" />
                </div>

                <button className="w-[60px] h-[60px] flex items-center justify-center bg-[#161D26] rounded-xl">
                    <Image src={UserIcon} width={26} height={30} alt='Account'  />
                </button>
            </div>
        </div>
    )
}