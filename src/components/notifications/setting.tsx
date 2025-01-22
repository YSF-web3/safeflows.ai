"use client"

import Image from "next/image";
import { useState } from "react";

import CheckIcon from "@/assets/svg/circle-check.svg";
import DropdownArrowIcon from "@/assets/svg/dropdown-arrow.svg";
import CircleIcon from "@/assets/svg/circle.svg";
import CircleCheckedIcon from "@/assets/svg/circle-checked.svg";


export default function SettingPage () {

    const [ checked, setChecked ] = useState(false)

    return (
        <div className="max-w-[697px] w-full h-[508px] border rounded-[13px] border-[#333333] px-[38px] pt-6 flex flex-col gap-5">
            <div className="w-full flex flex-col gap-2">
                <div className="w-full text-white text-left text-base font-normal">Email Address</div>
                <div className="bg-[#161D26] h-16 w-full flex items-center px-6 rounded-2xl gap-4">
                    <input name="email" type="email" placeholder="Email Address" className="bg-transparent outline-none text-white w-full text-lg font-normal" />
                    <Image src={CheckIcon} width={12} height={12} alt="Check" />
                </div>
            </div>

            <div className="w-full flex flex-col gap-2">
                <div className="w-full text-white text-left text-base font-normal">Threshold Setting</div>
                <div className="bg-[#161D26] h-16 w-full flex items-center px-6 rounded-2xl gap-4 relative">
                    <select className="appearance-none block w-full border border-none bg-transparent rounded-md shadow-sm focus:outline-none text-white">
                        <option value="1">Option 1</option>
                        <option value="2">Option 2</option>
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center px-2 pointer-events-none">
                        <Image src={DropdownArrowIcon} width={16} height={10} alt="Check" />
                    </div>
                </div>
            </div>

            <div className="w-full flex flex-col gap-2">
                <div className="w-full text-white text-left text-base font-normal">Collateral Health Thresholds</div>
                <div className="bg-[#161D26] h-16 w-full flex items-center px-6 rounded-2xl gap-4 relative">
                    <select className="appearance-none block w-full border border-none bg-transparent rounded-md shadow-sm focus:outline-none text-white">
                        <option value="1">Option 1</option>
                        <option value="2">Option 2</option>
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center px-2 pointer-events-none">
                        <Image src={DropdownArrowIcon} width={16} height={10} alt="Check" />
                    </div>
                </div>
            </div>

            <div className="w-full flex items-center gap-[18px] cursor-pointer" onClick={() => setChecked(pre => (!pre))}>
                {
                    checked ? 
                    <Image src={ CircleCheckedIcon } width={24} height={24} alt="Check" className="cursor-pointer" />
                    :
                    <Image src={ CircleIcon } width={24} height={24} alt="Check" className="cursor-pointer" />
                }
                <div className="text-[#808195] font-normal text-lg">Lorem ipsum dolor sit amet</div>
            </div>

            <div className="w-full flex items-center justify-end">
                <button className="h-[54px] rounded-xl bg-[#C9F31D] text-black text-[22px] font-normal px-10">Create</button>
            </div>
        </div>
    )
}