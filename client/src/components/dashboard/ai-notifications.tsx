import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useDashboard } from "./dashboard-data-access"
import AlarmIcon from "@/assets/svg/alarm.svg";
import { Pools } from "./dashboard-data-access"
import { useState } from "react";
import OnBoardingModal from "../ui/onboarding-modal";
import {MessageSquareWarning} from "lucide-react"

// Animation variants for container
const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1, // Delay between each child animation
            delayChildren: 0.3    // Initial delay before children start animating
        }
    }
};

// Animation variants for individual cards
const cardVariants = {
    hidden: { 
        opacity: 0,
        y: 20,
        scale: 0.95
    },
    show: { 
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 10
        }
    },
    hover: {
        scale: 1.02,
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 10
        }
    }
};

export default function AiNotifications ({poolsData }: {poolsData: Pools }) {
    const { notifications } = useDashboard()
    const [isModalOpen, setIsModalOpen] = useState(false)

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full h-full glass-container rounded-2xl border border-white/10 p-6 relative overflow-hidden"
        >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50 pointer-events-none" />
            
            <div className="text-white text-xl font-medium mb-4 relative">AI Insights</div>
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="min-h-[360px] h-[360px] w-full space-y-3 overflow-y-scroll pr-2 relative"
            >
                {
                    ((!poolsData?.message?.warnings || poolsData?.message?.warnings.length === 0) 
                    && (!poolsData?.message?.suggestions || poolsData?.message?.suggestions.length === 0)) 
                    && (
                        <motion.div 
                            variants={cardVariants}
                            className="p-8 py-16 w-full border bg-black/30 border-white/10 rounded-xl flex flex-col items-center justify-center text-white gap-4 backdrop-blur-sm"
                        >
                            <motion.div
                                animate={{ 
                                    rotate: [0, 10, -10, 0],
                                    scale: [1, 1.1, 1]
                                }}
                                transition={{ 
                                    duration: 2,
                                    repeat: Infinity,
                                    repeatType: "reverse"
                                }}
                            >
                                <MessageSquareWarning color="#C9F31D" size={32}/>
                            </motion.div>
                            <div className="text-center">
                                No AI Insights: Please make sure to use an account with ongoing lendings
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsModalOpen(true)}
                            >
                                <div className="p-2 hover:bg-[#C9F31D] hover:text-[black] rounded-[13px] border border-white/10 bg-[#0B0E129E] text-white text-xs font-semibold px-[21px] flex items-center transition-all duration-200">
                                    View More
                                </div>
                            </motion.button>
                        </motion.div>
                    )
                }
                <AnimatePresence>
                    {poolsData?.message?.warnings?.map((noti, index) => (
                        <motion.div 
                            key={index}
                            variants={cardVariants}
                            whileHover="hover"
                            className="lg:h-[50px] w-full border border-white/10 bg-black/30 rounded-xl flex items-center pl-[18px] pr-2 py-2 backdrop-blur-sm hover:border-[#FDAA35]/30 transition-colors duration-200"
                        >
                            <div className="flex gap-[14px] h-full w-full">
                                <motion.div
                                    whileHover={{ rotate: [0, -10, 10, 0] }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <Image src={AlarmIcon} alt="Notification" width={18} height={22} />
                                </motion.div>
                                <div className="flex flex-col gap-[6px] justify-center min-w-[71px]">
                                    <div className="text-sm leading-5 font-normal text-[#FDAA35] text-left">Warning</div>
                                    <div className="text-white font-light text-[10px] leading-3 text-left">
                                        {new Date(poolsData.message.createdAt).toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short' })}
                                    </div>
                                </div>
                                <div className="border-r border-[#E0E4F5] flex"></div>
                                <div className="text-[#C2C2C2] text-sm font-normal flex items-center text-left flex-1">{noti}</div>
                            </div>
                        </motion.div>
                    ))}
                    {poolsData?.message?.suggestions?.map((noti, index) => (
                        <motion.div 
                            key={index}
                            variants={cardVariants}
                            whileHover="hover"
                            className="lg:h-[50px] w-full border border-white/10 bg-black/30 rounded-xl flex items-center pl-[18px] pr-2 py-2 backdrop-blur-sm hover:border-[#3BD32D]/30 transition-colors duration-200"
                        >
                            <div className="flex gap-[14px] h-full w-full">
                                <motion.div
                                    whileHover={{ rotate: [0, -10, 10, 0] }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <Image src={AlarmIcon} alt="Notification" width={18} height={22} />
                                </motion.div>
                                <div className="flex flex-col gap-[6px] justify-center min-w-[71px]">
                                    <div className="text-sm leading-5 font-normal text-[#3BD32D] w-16">Suggestion</div>
                                    <div className="text-white font-light text-[10px] leading-3 text-left">
                                        {new Date(poolsData.message.createdAt).toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short' })}
                                    </div>
                                </div>
                                <div className="border-r border-[#E0E4F5] flex"></div>
                                <div className="text-[#C2C2C2] text-sm font-normal flex items-center text-left flex-1">{noti}</div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>
            {isModalOpen && <OnBoardingModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false)
                }}
                poolsData={[]}
            />}
        </motion.div>
    )
}