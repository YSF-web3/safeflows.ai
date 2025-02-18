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

const slideVariants = {
  initial: { opacity: 0, x: "100%" },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: "-100%" },
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5,
};

export function UiLayout({
    children,
    links,
}: {
    children: ReactNode;
    links: { label: string; path: string }[];
}) {
    const pathname = usePathname();

    const { loading } = useDashboard()


    return (
        <>
            <style jsx global>{`
                html {
                font-family: ${poppins.style.fontFamily};
                }
            `}</style>

            <div className="relative h-screen bg-[#000000] max-h-[100vh] overflow-x-hidden">
                <div className="absolute -top-[200px] -left-[200px] size-[600px] bg-gradient-radial rounded-full opacity-35"></div>
                <div className="absolute top-[calc(100vh_/_3)] -right-[300px] size-[600px] bg-gradient-radial rounded-full opacity-25"></div>

                {
                    loading && 
                    <div className="absolute z-20 w-[100vw] min-h-[100vh] flex items-center justify-center">
                        <LoadingScreen />
                    </div>
                }

                <div className="relative z-10 text-center h-[100vh] overflow-y-auto">
                    <div className="h-full px-4 lg:px-11 pt-4 lg:pt-11 pb-8 min-h-fit">
                        <div className="flex items-center justify-center w-full">
                            <Header links={links} />
                        </div>
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
                                    <AnimatePresence initial={false} mode="wait">
                                        <motion.div
                                            key={pathname}
                                            variants={slideVariants}
                                            initial="enter"
                                            animate="center"
                                            exit="exit"
                                            transition={{
                                                x: { type: "spring", stiffness: 300, damping: 30 },
                                                opacity: { duration: 0.1 },
                                            }}
                                        >
                                        {children}
                                        </motion.div>
                                    </AnimatePresence>
                                </Suspense>
                                <Toaster position="top-center" />
                            </div>
                        </div>
                        <div className="flex items-center justify-center w-full mt-8">
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
      <div className="modal-box space-y-5">
        <h3 className="font-bold text-lg">{title}</h3>
        {children}
        <div className="modal-action">
          <div className="join space-x-2">
            {submit ? (
              <button
                className="btn btn-xs lg:btn-md btn-primary"
                onClick={submit}
                disabled={submitDisabled}
              >
                {submitLabel || "Save"}
              </button>
            ) : null}
            <button onClick={hide} className="btn">
              Close
            </button>
          </div>
        </div>
      </div>
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
    <div className="hero py-[64px]">
      <div className="hero-content text-center">
        <div className="max-w-2xl">
          {typeof title === "string" ? (
            <h1 className="text-5xl font-bold">{title}</h1>
          ) : (
            title
          )}
          {typeof subtitle === "string" ? (
            <p className="py-6">{subtitle}</p>
          ) : (
            subtitle
          )}
          {children}
        </div>
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
      <div className={"text-center"}>
        <div className="text-lg">Transaction sent</div>
        <ExplorerLink
          path={`tx/${signature}`}
          label={"View Transaction"}
          className="btn btn-xs btn-primary"
        />
      </div>
    );
  };
}
