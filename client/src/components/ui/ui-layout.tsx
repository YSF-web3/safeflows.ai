"use client";

import { Poppins } from "next/font/google";
import { usePathname } from "next/navigation";
import * as React from "react";
import { ReactNode, Suspense, useEffect, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useDashboard } from "../dashboard/dashboard-data-access";
import { AccountChecker } from "../account/account-ui";

import {
  ClusterChecker,
  ClusterUiSelect,
  ExplorerLink,
} from "../cluster/cluster-ui";
import { WalletButton } from "../solana/solana-provider";

import Header from "./header";
import Footer from "./footer";
import LoadingScreen from "./loader";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const pageVariants = {
  initial: { 
    opacity: 0, 
    y: 20,
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1],
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
    }
  },
};

export function UiLayout({
    children,
    links,
}: {
    children: ReactNode;
    links: { label: string; path: string }[];
}) {
    const pathname = usePathname();
    const { loading } = useDashboard();

    return (
        <>
            <style jsx global>{`
                html {
                    font-family: ${poppins.style.fontFamily};
                }
            `}</style>

            <div className="relative min-h-screen bg-background-dark max-h-[100vh] overflow-x-hidden">
                {/* Dynamic gradient background effects */}
                <div className="fixed inset-0 z-0">
                    {/* Top left gradient blob */}
                    <motion.div 
                        className="absolute -top-[200px] -left-[200px] size-[600px] bg-gradient-radial rounded-full opacity-35"
                        animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.35, 0.4, 0.35],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            repeatType: "reverse",
                        }}
                    />
                    
                    {/* Bottom right gradient blob */}
                    <motion.div 
                        className="absolute top-[calc(100vh_/_3)] -right-[300px] size-[600px] bg-gradient-radial rounded-full opacity-25"
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.25, 0.3, 0.25],
                        }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            repeatType: "reverse",
                            delay: 1,
                        }}
                    />
                    
                    {/* Additional small accent gradients */}
                    <motion.div 
                        className="absolute top-[calc(20vh)] left-[10vw] size-[200px] bg-gradient-conic rounded-full opacity-15"
                        animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.15, 0.2, 0.15],
                        }}
                        transition={{
                            duration: 12,
                            repeat: Infinity,
                            repeatType: "reverse",
                            delay: 2,
                        }}
                    />

                    {/* Subtle gradient overlay */}
                    <div className="absolute inset-0 bg-background-dark/30 backdrop-blur-xs" />
                </div>

                {/* Loading screen */}
                {loading && 
                    <motion.div 
                        className="fixed z-20 w-full h-full flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <LoadingScreen />
                    </motion.div>
                }

                {/* Main content */}
                <div className="relative z-10 h-[100vh] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20">
                    <div className="min-h-screen flex flex-col px-4 lg:px-11 pt-4 lg:pt-8 pb-8">
                        {/* Header */}
                        <div className="flex items-center justify-center w-full mb-6">
                            <Header links={links} />
                        </div>

                        {/* Main content area */}
                        <ClusterChecker>
                            <AccountChecker />
                        </ClusterChecker>
                        
                        <div className="w-full flex-1 flex justify-center">
                            <div className="w-full container">
                                <Suspense
                                    fallback={
                                        <div className="flex items-center justify-center my-32">
                                            <div className="relative">
                                                <div className="h-12 w-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                                                <div className="absolute inset-0 flex items-center justify-center text-xs text-primary">
                                                    Loading
                                                </div>
                                            </div>
                                        </div>
                                    }
                                >
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={pathname}
                                            variants={pageVariants}
                                            initial="initial"
                                            animate="animate"
                                            exit="exit"
                                            className="w-full min-h-fit pb-8"
                                        >
                                            {children}
                                        </motion.div>
                                    </AnimatePresence>
                                </Suspense>
                                
                                <Toaster 
                                    position="top-center"
                                    toastOptions={{
                                        className: 'glass-container border border-white/10 text-white',
                                        style: {
                                            background: 'rgba(27, 32, 43, 0.9)',
                                            color: 'white',
                                            borderRadius: '12px',
                                            backdropFilter: 'blur(10px)',
                                        },
                                        success: {
                                            iconTheme: {
                                                primary: '#C9F31D',
                                                secondary: 'black',
                                            },
                                        },
                                    }} 
                                />
                            </div>
                        </div>
                        
                        {/* Footer */}
                        <div className="flex items-center justify-center w-full mt-auto pt-4">
                            <Footer links={links} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
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
  children: ReactNode;
  title: string;
  hide: () => void;
  show: boolean;
  submit?: () => void;
  submitDisabled?: boolean;
  submitLabel?: string;
}) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    if (!dialogRef.current) return;
    if (show) {
      dialogRef.current.showModal();
    } else {
      dialogRef.current.close();
    }
  }, [show, dialogRef]);

  return (
    <dialog className="modal" ref={dialogRef}>
      <motion.div 
        className="modal-box space-y-5"
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <h3 className="font-bold text-lg">{title}</h3>
        {children}
        <div className="modal-action">
          <div className="flex space-x-3">
            {submit ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-primary btn-md"
                onClick={submit}
                disabled={submitDisabled}
              >
                {submitLabel || "Save"}
              </motion.button>
            ) : null}
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={hide} 
              className="btn btn-secondary"
            >
              Close
            </motion.button>
          </div>
        </div>
      </motion.div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={hide}>close</button>
      </form>
    </dialog>
  );
}

export function AppHero({
  children,
  title,
  subtitle,
}: {
  children?: ReactNode;
  title: ReactNode;
  subtitle: ReactNode;
}) {
  return (
    <div className="hero py-12">
      <div className="hero-content text-center">
        <motion.div 
          className="max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {typeof title === "string" ? (
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-primary">{title}</h1>
          ) : (
            title
          )}
          {typeof subtitle === "string" ? (
            <p className="py-6 text-text-secondary">{subtitle}</p>
          ) : (
            subtitle
          )}
          {children}
        </motion.div>
      </div>
    </div>
  );
}

export function ellipsify(str = "", len = 4) {
  if (str.length > 30) {
    return (
      str.substring(0, len) + ".." + str.substring(str.length - len, str.length)
    );
  }
  return str;
}

export function useTransactionToast() {
  return (signature: string) => {
    toast.success(
      <div className="text-center">
        <div className="text-lg font-medium mb-2">Transaction sent</div>
        <ExplorerLink
          path={`tx/${signature}`}
          label={"View Transaction"}
          className="btn btn-xs btn-primary"
        />
      </div>
    );
  };
}
