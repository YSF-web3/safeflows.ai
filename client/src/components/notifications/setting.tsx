"use client";

import Image from "next/image";
import { useState } from "react";
import { useCreateNotification } from "./alert-data-access";

import CheckIcon from "@/assets/svg/circle-check.svg";
import CircleIcon from "@/assets/svg/circle.svg";
import CircleCheckedIcon from "@/assets/svg/circle-checked.svg";
import { IconSettings } from "@tabler/icons-react";
import { useWallet } from "@solana/wallet-adapter-react";

export default function SettingPage() {
  const [checked, setChecked] = useState(false);
  const [threshold, setThreshold] = useState(50); // Default value for range
  const [collateralThreshold, setCollateralThreshold] = useState(50); // Default value for range
  const [description, setDescription] = useState(""); // New state for description
  const [email, setEmail] = useState(""); // New state for email

  const { mutate } = useCreateNotification();


  const { connected, publicKey } = useWallet();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Collect the form data
    const data = {
      address: publicKey?.toBase58()!,
      description,
      email,
      healthThreshold: threshold,
      collateralThreshold,
      oneTime: checked,
    };

    // Trigger the mutation
    mutate(data);
  };

  return (
    <div className="max-w-[697px] w-full border rounded-[13px] border-[#333333] px-[38px] py-6 flex flex-col gap-5">
      <div className="flex items-center gap-2 m-auto">
        <IconSettings color="#C9F31D" />
        <h2 className="text-2xl text-white uppercase font-bold">Set Alert</h2>
      </div>

      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
        {/* Description Input */}
        <div className="w-full flex flex-col gap-2">
          <div className="w-full text-white text-left text-base font-normal">Description</div>
          <div className="bg-[black] border border-[#333333] h-16 w-full flex items-center px-6 rounded-2xl gap-4">
            <input
              name="description"
              type="text"
              placeholder="Alert description"
              className="bg-transparent outline-none text-white w-full text-lg font-normal"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Image src={CheckIcon} width={12} height={12} alt="Check" />
          </div>
        </div>

        {/* Email Input */}
        <div className="w-full flex flex-col gap-2">
          <div className="w-full text-white text-left text-base font-normal">Email Address</div>
          <div className="bg-[black] border border-[#333333] h-16 w-full flex items-center px-6 rounded-2xl gap-4">
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              className="bg-transparent outline-none text-white w-full text-lg font-normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Image src={CheckIcon} width={12} height={12} alt="Check" />
          </div>
        </div>

        {/* Threshold Setting */}
        <div className="w-full flex flex-col gap-2">
          <div className="w-full text-white text-left text-base font-normal">Threshold Setting</div>
          <div className="bg-[black] border border-[#333333] h-16 w-full flex items-center px-6 rounded-2xl gap-4">
            <input
              type="range"
              min="1"
              max="100"
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="w-full appearance-none bg-[#333333] h-2 rounded-lg cursor-pointer"
              style={{
                background: `linear-gradient(to right, #C9F31D 0%, #C9F31D ${threshold}%, #333333 ${threshold}%, #333333 100%)`,
              }}
            />
            <span className="text-white text-sm font-medium w-[50px] text-center">{threshold}</span>
          </div>
        </div>

        {/* Collateral Health Thresholds */}
        <div className="w-full flex flex-col gap-2">
          <div className="w-full text-white text-left text-base font-normal">Collateral Health Thresholds</div>
          <div className="bg-[black] border border-[#333333] h-16 w-full flex items-center px-6 rounded-2xl gap-4">
            <input
              type="range"
              min="1"
              max="100"
              value={collateralThreshold}
              onChange={(e) => setCollateralThreshold(Number(e.target.value))}
              className="w-full appearance-none bg-[#333333] h-2 rounded-lg cursor-pointer"
              style={{
                background: `linear-gradient(to right, #C9F31D 0%, #C9F31D ${collateralThreshold}%, #333333 ${collateralThreshold}%, #333333 100%)`,
              }}
            />
            <span className="text-white text-sm font-medium w-[50px] text-center">{collateralThreshold}</span>
          </div>
        </div>

        {/* One Time Checkbox */}
        <div
          className="w-full flex items-center gap-[18px] cursor-pointer"
          onClick={() => setChecked((prev) => !prev)}
        >
          {checked ? (
            <Image src={CircleCheckedIcon} width={24} height={24} alt="Check" className="cursor-pointer" />
          ) : (
            <Image src={CircleIcon} width={24} height={24} alt="Check" className="cursor-pointer" />
          )}
          <div className="text-[#808195] font-normal text-lg">One Time</div>
        </div>

        {/* Submit Button */}
        <div className="w-full flex items-center justify-end">
          <button
            type="submit"
            className={`h-[54px] rounded-xl bg-[#C9F31D] text-black text-[22px] font-normal px-10 active:scale-95`}
            
            style={{
                opacity:Boolean(publicKey) ? "1": "0.5",
                zIndex:1
                
            }}
          >
            { publicKey? "Create": "Wallet not connected"}
          </button>
        </div>
      </form>
    </div>
  );
}
