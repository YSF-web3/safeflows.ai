"use client";

import { ReactNode, Suspense, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { ClusterUiSelect } from "../cluster/cluster-ui";

import LogoIcon from "@/assets/svg/logo.svg";
import SettingIcon from "@/assets/svg/setting.svg";
import SearchIcom from "@/assets/svg/search-normal.svg";

import { WalletButton } from "../solana/solana-provider";
import { useWallet } from "@solana/wallet-adapter-react";
import { useGetBalance } from "../account/account-data-access";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import OnBoardingModal from "./onboarding-modal";
import { useGetPools } from "../dashboard/dashboard-data-access";

export default function Header({
  links,
}: {
  links: { label: string; path: string }[];
}) {
  const pathname = usePathname();
  const { publicKey } = useWallet(); // Get the wallet public key
  const { data } = useGetBalance({ address: publicKey! });
  const query = useGetPools({ address: publicKey || undefined });

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setIsModalOpen(!publicKey);
    if(publicKey){
        if(!query.isLoading){
            setIsModalOpen(!query.data?.pools?.length)
        }
    }
  }, [publicKey, query?.data?.pools]);

  return (
    <>
      <div className="container w-full h-[75px] bg-[#0B0E12] border border-[#333333] rounded-[13px] pl-6 pr-3 flex items-center justify-between">
        <div className="flex lg:gap-[75px] h-full">
          <Image src={LogoIcon} alt="Logo" width={48} height={50} />

          <div className="dropdown lg:hidden h-full">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost lg:hidden h-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#FFFFFF"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-[#0B0E12] rounded-box z-[1] mt-3 w-48 p-2 shadow"
            >
              {links.map(({ label, path }) => (
                <li key={path}>
                  <Link
                    className={`${
                      (path !== "/" && pathname.startsWith(path)) ||
                      (path === "/" && pathname === "/")
                        ? "text-[#C9F31D] font-bold [&>span]:border-[#C9F31D]"
                        : "text-white font-normal [&>span]:border-transparent"
                    } text-base leading-8 flex flex-col gap-[18px]`}
                    href={path}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <ul className="lg:flex gap-11 items-end hidden">
            {links.map(({ label, path }) => (
              <li key={path}>
                <Link
                  className={`${
                    (path !== "/" && pathname.startsWith(path)) ||
                    (path === "/" && pathname === "/")
                      ? "text-[#C9F31D] font-bold [&>span]:border-[#C9F31D]"
                      : "text-white font-normal [&>span]:border-transparent"
                  } text-[22px] leading-8 flex flex-col gap-[18px]`}
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
          <div className="bg-[#161D26] rounded-xl lg:w-[310px] h-[60px] px-[26px] hidden lg:flex items-center gap-[18px]">
            <Image src={SearchIcom} width={20} height={20} alt="Search" />
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent outline-none w-full h-full text-white font-normal text-sm leading-5"
            />
          </div>
          <button className="w-[60px] h-[60px] hidden lg:flex items-center justify-center bg-[#161D26] rounded-xl">
            <div className="flex items-baseline">
              <span className="text-white font-bold mr-2">
                {(data ?? 0) / LAMPORTS_PER_SOL}
              </span>
              <span className="text-sm text-white">SOL</span>
            </div>
          </button>
          <WalletButton />
          {/* <div className="hidden lg:block">
                <div className="bg-[#161D26] rounded-xl lg:w-[310px] h-[60px] px-[26px] hidden lg:flex items-center gap-[18px]">
                    <Image src={SearchIcom} width={20} height={20} alt='Search' />
                    <input type="text" placeholder="Search" className="bg-transparent outline-none w-full h-full text-white font-normal text-sm leading-5" />
                </div>
                 <button className="w-[60px] h-[60px] hidden lg:flex items-center justify-center bg-[#161D26] rounded-xl">
                    <div className='flex items-baseline'>

                    <span className='text-white font-bold mr-2'>
                    {(data ?? 0 )/ LAMPORTS_PER_SOL}
                    </span>
                    <span className='text-sm text-white'>
                        SOL
                    </span>
                    </div>
                     
                </button>
                <WalletButton />
                {/* <div className="hidden lg:block">
                    <ClusterUiSelect />
                </div> */}
          {/* <button className="w-[60px] h-[60px] flex items-center justify-center bg-[#161D26] rounded-xl">
                    <Image src={UserIcon} width={26} height={30} alt='Account'  />
                </button> */}
        </div>
      </div>
     {isModalOpen&& <OnBoardingModal
        isOpen={Boolean(publicKey)}
        onClose={() => {
            setIsModalOpen(false)
        }}
        poolsData={query.data?.pools ?? []}
      />}
    </>
  );
}
