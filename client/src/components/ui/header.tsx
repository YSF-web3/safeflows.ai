"use client";

import { ReactNode, Suspense, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

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
  const { publicKey } = useWallet();
  const { data } = useGetBalance({ address: publicKey! });
  const query = useGetPools({ address: publicKey || undefined });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsModalOpen(!publicKey);
    if (publicKey) {
      if (!query.isLoading) {
        setIsModalOpen(!query.data?.pools?.length);
      }
    }
  }, [publicKey, query?.data?.pools]);

  // Close menu when pathname changes (i.e., when a link is clicked)
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <div className="container w-full h-[75px] bg-[gray]/10 backdrop-blur-xl border border-[#333333] rounded-[13px] pl-6 pr-3 flex items-center justify-between relative">
        <div className="flex lg:gap-[75px] h-full">
          <Image src={LogoIcon} alt="Logo" width={48} height={50} />

          <ul className="lg:flex gap-11 items-end hidden">
            {links.map(({ label, path }) => (
              <li key={path}>
                <Link
                  className={`${
                    (path !== "/" && pathname.startsWith(path)) ||
                    (path === "/" && pathname === "/")
                      ? "text-[#C9F31D] font-bold [&>span]:border-[#C9F31D]"
                      : "text-white font-normal [&>span]:border-transparent"
                  } text-[22px] leading-8 flex flex-col gap-4`}
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
          <div className="bg-[black] rounded-xl lg:w-[310px] h-[60px] px-[26px] hidden lg:flex items-center gap-[18px]">
            <Image src={SearchIcom} width={20} height={20} alt="Search" />
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent outline-none w-full h-full text-white font-normal text-sm leading-5"
            />
          </div>
          <button className="min-w-[60px] h-[60px] hidden lg:flex items-center justify-center bg-[black] rounded-xl px-4">
            <div className="flex items-center gap-2">
              <img src="/sol.png" className="w-6" alt="" />
              <div className="flex items-baseline">
                <span className="text-white font-bold mr-2">
                  {((data ?? 0) / LAMPORTS_PER_SOL).toFixed(2)}
                </span>
                <span className="text-xs text-white">SOL</span>
              </div>
            </div>
          </button>
          <WalletButton />

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden h-full p-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#FFFFFF"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h8m-8 6h16"}
              />
            </svg>
          </button>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute  top-full left-0 right-0 bg-[#0B0E12]/95 backdrop-blur-xl mt-2 rounded-xl border border-[#333333] overflow-hidden z-[100]"
            >
              <ul className="py-2">
                {links.map(({ label, path }) => (
                  <li key={path}>
                    <Link
                      className={`${
                        (path !== "/" && pathname.startsWith(path)) ||
                        (path === "/" && pathname === "/")
                          ? "text-[#C9F31D] font-bold"
                          : "text-white"
                      } block px-6 py-3 hover:bg-white/5 transition-colors text-base`}
                      href={path}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {isModalOpen && (
        <OnBoardingModal
          isOpen={Boolean(publicKey)}
          onClose={() => {
            setIsModalOpen(false);
          }}
          poolsData={query.data?.pools ?? []}
        />
      )}
    </>
  );
}