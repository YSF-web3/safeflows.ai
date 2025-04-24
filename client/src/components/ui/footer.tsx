'use client'

import { usePathname } from 'next/navigation'
import Image from 'next/image';
import Link from 'next/link'
import { motion } from 'framer-motion';

import XIcon from "@/assets/svg/x.svg";
import GithubIcon from "@/assets/svg/github.svg"

export default function Footer ({ links }: { links: { label: string; path: string }[] }) {
    const pathname = usePathname()

    const socialLinks = [
        { icon: GithubIcon, href: "https://github.com", alt: "GitHub" },
        { icon: XIcon, href: "https://x.com/SafeFlowsAI", alt: "X (Twitter)" },
    ];

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="container w-full h-[75px] glass-container backdrop-blur-xl border border-white/10 rounded-2xl px-6 flex items-center justify-between shadow-card"
        >
            <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center"
            >
                <Link href="/" className="text-white text-xl w-[120px] lg:w-[180px] transition-transform duration-300">
                    <motion.img 
                        src="/logo.svg" 
                        width={180} 
                        alt="SafeFlows Logo" 
                        className="hover:brightness-125 transition-all duration-300"
                    />
                </Link>
            </motion.div>
            
            <div className="pr-4 flex items-center gap-4">
                {socialLinks.map((social, index) => (
                    <motion.div
                        key={social.href}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 + (index * 0.1) }}
                    >
                        <Link 
                            href={social.href} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            aria-label={social.alt}
                        >
                            <motion.div
                                whileHover={{ scale: 1.2, rotate: 5 }}
                                whileTap={{ scale: 0.9 }}
                                className="relative group"
                            >
                                <Image 
                                    src={social.icon} 
                                    alt={social.alt} 
                                    className="size-6 lg:size-8 transition-all duration-300 group-hover:text-primary"
                                />
                                <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                                    {social.alt}
                                </span>
                            </motion.div>
                        </Link>
                    </motion.div>
                ))}
                
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="ml-2 hidden lg:block"
                >
                    <a
                        href="https://safeflows.ai"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 text-sm glass-container border border-white/10 hover:border-primary/30 rounded-xl transition-all duration-300 text-white/80 hover:text-white flex items-center gap-2"
                    >
                        <span>SafeFlows.ai</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7 17L17 7M17 7H8M17 7V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </a>
                </motion.div>
            </div>
        </motion.div>
    )
}