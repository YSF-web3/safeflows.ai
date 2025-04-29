"use client";

import { ReactNode, Suspense, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

import { ClusterUiSelect } from "../cluster/cluster-ui";

import LogoIcon from "@/assets/svg/logo.svg";
import SearchIcon from "@/assets/svg/search-normal.svg";

import { WalletButton } from "../solana/solana-provider";
import { useWallet } from "@solana/wallet-adapter-react";
import { useGetBalance } from "../account/account-data-access";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import OnBoardingModal from "./onboarding-modal";
import { useGetPools } from "../dashboard/dashboard-data-access";
import { Search, Menu, X } from "lucide-react";

export default function Header({
  links,
}: {
  links: { label: string; path: string; isNew?: boolean }[];
}) {
  const pathname = usePathname();
  const { publicKey } = useWallet();
  const { data } = useGetBalance({ address: publicKey! });
  const query = useGetPools({ address: publicKey || undefined });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

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

  // Focus search input when search is opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="container w-full h-[75px] glass-container backdrop-blur-xl border border-white/10 rounded-2xl pl-6 pr-3 flex items-center justify-between relative shadow-card">
        <div className="flex lg:gap-[75px] h-full items-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center cursor-pointer"
          >
            <Image src={LogoIcon} alt="Logo" width={48} height={50} className="animate-float" />
          </motion.div>

          <div className="hidden lg:flex gap-11 items-end">
            {links.map(({ label, path, isNew }) => (
              <Link
                key={path}
                href={path}
                className="group relative"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`${
                      (path !== "/" && pathname.startsWith(path)) ||
                      (path === "/" && pathname === "/")
                        ? "text-primary font-bold"
                        : "text-white font-normal"
                    } text-[22px] leading-8 transition-colors duration-300 group-hover:text-primary-light`}
                  >
                    {label}
                  </div>
                  {isNew && (
                    <div className="absolute -top-2 -right-8">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="bg-primary text-black text-xs font-bold px-1.5 py-0.5 rounded-full"
                      >
                        NEW
                      </motion.div>
                    </div>
                  )}
                </div>
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary"
                  initial={false}
                  animate={{
                    width: (path !== "/" && pathname.startsWith(path)) ||
                    (path === "/" && pathname === "/")
                      ? "100%"
                      : "0%",
                    opacity: (path !== "/" && pathname.startsWith(path)) ||
                    (path === "/" && pathname === "/")
                      ? 1
                      : 0,
                  }}
                  transition={{ duration: 0.3 }}
                />
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary-light"
                  initial={{ width: "0%" }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <AnimatePresence>
            {isSearchOpen ? (
              <motion.div
                initial={{ width: 60, opacity: 0 }}
                animate={{ width: "310px", opacity: 1 }}
                exit={{ width: 60, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="bg-background-card border border-border/30 rounded-xl h-[60px] px-[26px] hidden lg:flex items-center gap-[18px] overflow-hidden"
              >
                <Search size={20} className="text-white/60" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent outline-none w-full h-full text-white font-normal text-sm leading-5 placeholder:text-white/40"
                  onBlur={() => {
                    if (!searchInputRef.current?.value) {
                      setIsSearchOpen(false);
                    }
                  }}
                />
                <button 
                  onClick={() => {
                    if (searchInputRef.current) {
                      searchInputRef.current.value = '';
                    }
                    setIsSearchOpen(false);
                  }}
                  className="text-white/60 hover:text-white"
                >
                  <X size={16} />
                </button>
              </motion.div>
            ) : (
              <motion.button 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSearchOpen(true)}
                className="min-w-[60px] h-[60px] hidden lg:flex items-center justify-center bg-background-card border border-border/30 hover:border-border rounded-xl px-4 transition-all duration-300"
              >
                <Search size={20} className="text-white/60" />
              </motion.button>
            )}
          </AnimatePresence>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="min-w-[60px] h-[60px] hidden lg:flex items-center justify-center glass-container hover:border-primary/30 rounded-xl px-4 transition-all duration-300 group"
          >
            <div className="flex items-center gap-2">
              <motion.img 
                src="/sol.png" 
                className="w-6" 
                alt="SOL" 
                animate={{ rotate: 360 }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 10, 
                  ease: "linear" 
                }}
              />
              <div className="flex items-baseline">
                <span className="text-white font-bold mr-2 group-hover:text-primary transition-colors duration-300">
                  {((data ?? 0) / LAMPORTS_PER_SOL).toFixed(2)}
                </span>
                <span className="text-xs text-white/70 group-hover:text-primary/70 transition-colors duration-300">SOL</span>
              </div>
            </div>
          </motion.button>
          
          <WalletButton />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden h-full p-2 text-white"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute top-full left-0 right-0 glass-container backdrop-blur-xl mt-2 rounded-xl border border-white/10 overflow-hidden z-[100] shadow-card"
            >
              <ul className="py-2">
                {links.map(({ label, path, isNew }) => (
                  <motion.li 
                    key={path}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      className={`${
                        (path !== "/" && pathname.startsWith(path)) ||
                        (path === "/" && pathname === "/")
                          ? "text-primary font-bold"
                          : "text-white"
                      } block px-6 py-3 hover:bg-white/5 transition-colors text-base flex items-center gap-2`}
                      href={path}
                    >
                      {label}
                      {isNew && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="bg-primary text-black text-xs font-bold px-1.5 py-0.5 rounded-full"
                        >
                          NEW
                        </motion.div>
                      )}
                    </Link>
                  </motion.li>
                ))}
                <motion.li whileHover={{ x: 5 }} className="px-6 py-3">
                  <div className="flex items-center gap-2">
                    <img src="/sol.png" className="w-5" alt="SOL" />
                    <span className="text-white font-bold">
                      {((data ?? 0) / LAMPORTS_PER_SOL).toFixed(2)} SOL
                    </span>
                  </div>
                </motion.li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

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