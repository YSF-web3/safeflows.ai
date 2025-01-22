import Image from "next/image";

import QuestionIcon from "@/assets/svg/question.svg";
import SortIcon from "@/assets/svg/sort.svg";
import GreenCheck from "@/assets/svg/green-check.svg";

export default function PoolsTable () {
    return (
        <div className="w-full rounded-[13px] border border-[#333333] p-6 flex flex-col gap-4">
            <div className="w-full flex justify-between items-end">
                <div className="text-white text-[22px] font-normal leading-8">Top Selling NFTs</div>
                <Image src={QuestionIcon} alt="question" width={20} height={20} />
            </div>
        
            <table className="w-full">
                <thead>
                    <tr className="border-b">
                        <th className="w-[5%]">
                            <div className="text-white flex items-center gap-2 cursor-pointer text-xs font-normal pb-2">
                                    #
                                <Image src={SortIcon} alt="sort" width={8} height={12} />
                            </div>
                        </th>
                        <th className="w-[55%]">
                            <div className="text-white flex items-center gap-2 cursor-pointer text-xs font-normal pb-2">
                                Pool Name
                                <Image src={SortIcon} alt="sort" width={8} height={12} />
                            </div>
                        </th>
                        <th className="w-[10%]">
                            <div className="text-white flex items-center gap-2 cursor-pointer text-xs font-normal pb-2">
                                Total Collateral
                                <Image src={SortIcon} alt="sort" width={8} height={12} />
                            </div>
                        </th>
                        <th className="w-[10%]">
                            <div className="text-white flex items-center gap-2 cursor-pointer text-xs font-normal pb-2">
                                Total Borrowed
                                <Image src={SortIcon} alt="sort" width={8} height={12} />
                            </div>
                        </th>
                        <th className="w-[10%]">
                            <div className="text-white flex items-center gap-2 cursor-pointer text-xs font-normal pb-2">
                                Risk Score
                                <Image src={SortIcon} alt="sort" width={8} height={12} />
                            </div>
                        </th>
                        <th className="w-[10%]">
                            <div className="text-white flex items-center gap-2 cursor-pointer text-xs font-normal pb-2">
                                Status
                                <Image src={SortIcon} alt="sort" width={8} height={12} />
                            </div>
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {
                        new Array(5).fill(0).map((_, index) => 
                            <tr key={index}>
                                <td className="py-[22px] text-left text-white text-base font-normal">{`${index + 1}.`}</td>
                                <td className="py-[22px] text-left text-white text-base font-normal">
                                    <div className="flex w-full gap-2 items-center">
                                        Travis Ragsdale
                                        <Image src={GreenCheck} width={14} alt="green-check" height={14} />
                                    </div>
                                </td>
                                <td className="py-[22px] text-left text-white text-base font-normal">$4,945</td>
                                <td className="py-[22px] text-left text-white text-base font-normal">$4,945</td>
                                <td className="py-[22px] text-left text-white text-base font-normal">65%</td>
                                <td className="py-[22px] text-left text-white text-base font-normal">
                                    <button className="h-10 border-[#FF3E46] border rounded-[15px] text-sm font-normal px-[10px] text-[#FF3E46]">Uninsured</button>
                                </td>
                            </tr>
                        )
                    }
                   
                </tbody>
            </table>
        </div>
    )
}