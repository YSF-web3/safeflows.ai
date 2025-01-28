"use client"

import Image from "next/image";
import { useState } from "react";

import CheckIcon from "@/assets/svg/circle-check.svg";
import DropdownArrowIcon from "@/assets/svg/dropdown-arrow.svg";
import CircleIcon from "@/assets/svg/circle.svg";
import CircleCheckedIcon from "@/assets/svg/circle-checked.svg";
import { IconAlertCircle, IconBell } from "@tabler/icons-react";

export default function SettingPage() {
    const [checked, setChecked] = useState(false);
    const [threshold, setThreshold] = useState(50); // Default value for range
    const [collateralThreshold, setCollateralThreshold] = useState(50); // Default value for range

    return (
        <div className="max-w-[697px] w-full  border rounded-[13px] border-[#333333] px-[38px] py-6 flex flex-col gap-5">
            <div className="flex items-center gap-2 m-auto">

            <IconBell/>
            <h2 className="text-2xl text-white uppercase font-bold">  Set Alert</h2>
            </div>
            <div className="w-full flex flex-col gap-2">
                <div className="w-full text-white text-left text-base font-normal">Email Address</div>
                <div className="bg-[#161D26] h-16 w-full flex items-center px-6 rounded-2xl gap-4">
                    <input
                        name="email"
                        type="email"
                        placeholder="Email Address"
                        className="bg-transparent outline-none text-white w-full text-lg font-normal"
                    />
                    <Image src={CheckIcon} width={12} height={12} alt="Check" />
                </div>
            </div>

            <div className="w-full flex flex-col gap-2">
                <div className="w-full text-white text-left text-base font-normal">Threshold Setting</div>
                <div className="bg-[#161D26] h-16 w-full flex items-center px-6 rounded-2xl gap-4">
                    <input
                        type="range"
                        min="1"
                        max="100"
                        value={threshold}
                        onChange={(e) => setThreshold(e.target.value)}
                        className="w-full appearance-none bg-[#333333] h-2 rounded-lg cursor-pointer"
                        style={{
                            background: `linear-gradient(to right, #C9F31D 0%, #C9F31D ${threshold}%, #333333 ${threshold}%, #333333 100%)`
                        }}
                    />
                    <span className="text-white text-sm font-medium w-[50px] text-center">{threshold}</span>
                </div>
            </div>

            <div className="w-full flex flex-col gap-2">
                <div className="w-full text-white text-left text-base font-normal">Collateral Health Thresholds</div>
                <div className="bg-[#161D26] h-16 w-full flex items-center px-6 rounded-2xl gap-4">
                    <input
                        type="range"
                        min="1"
                        max="100"
                        value={collateralThreshold}
                        onChange={(e) => setCollateralThreshold(e.target.value)}
                        className="w-full appearance-none bg-[#333333] h-2 rounded-lg cursor-pointer"
                        style={{
                            background: `linear-gradient(to right, #C9F31D 0%, #C9F31D ${collateralThreshold}%, #333333 ${collateralThreshold}%, #333333 100%)`
                        }}
                    />
                    <span className="text-white text-sm font-medium w-[50px] text-center">{collateralThreshold}</span>
                </div>
            </div>

            <div className="w-full flex items-center gap-[18px] cursor-pointer" onClick={() => setChecked((prev) => !prev)}>
                {checked ? (
                    <Image src={CircleCheckedIcon} width={24} height={24} alt="Check" className="cursor-pointer" />
                ) : (
                    <Image src={CircleIcon} width={24} height={24} alt="Check" className="cursor-pointer" />
                )}
                <div className="text-[#808195] font-normal text-lg">One Time</div>
            </div>

            <div className="w-full flex items-center justify-end">
                <button className="h-[54px] rounded-xl bg-[#C9F31D] text-black text-[22px] font-normal px-10">Create</button>
            </div>
        </div>
    );
}
