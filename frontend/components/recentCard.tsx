'use client'

import VoteIcon from "@/public/thumbs-up-solid.svg";
import CommentIcon from "@/public/comment-solid-pink.svg";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";

export default function RecentCard({ data } : { data: any }) {
    const router = useRouter();
    const recentString = sessionStorage.getItem("recent");
    const recent = recentString ? JSON.parse(recentString) : []; 
    const [cmt, setCmtCount] = useState<number>(0);

    const handleNavigate = () => {
        const newRecent = recent.filter((obj: any) => JSON.stringify(obj) !== JSON.stringify(data));
        newRecent.push(data);
        sessionStorage.setItem("recent", JSON.stringify(newRecent));
        router.push(`/post/${data.postId}`);
    }

    useEffect(() => {
        const checkCmt = async () => {
            const res = await axios.get(
                `http://localhost:8080/authentication/comment/count/${data.postId}`
            )

            if (res.data.result) {
                setCmtCount(res.data.result);
            }
        }
        checkCmt();
    }, [])

    return (
        <div onClick={handleNavigate} className="p-2 rounded-md w-[99%] h-[60px] flex justify-between select-none cursor-pointer hover:bg-slate-200">
            <div className="flex gap-6">
                <div className="w-[45px] h-[45px] rounded-full bg-red-300 overflow-hidden">
                    <img src={data.userAvatar} alt="user avatar"/>
                </div>
                <div className="flex flex-col justify-center w-[160px]">
                    <h1 className="w-[140px] font-bold whitespace-nowrap overflow-hidden text-ellipsis">{data.title}</h1>
                    <p className="whitespace-nowrap overflow-hidden text-ellipsis">{data.content}</p>
                </div>
            </div>
            <div className="flex flex-col justify-center w-[50px]">
                <div className="flex gap-2">
                    <Image 
                        src={VoteIcon}
                        alt="Vote Icon"
                        className="w-[15px]"
                    />
                    <p className="text-textGrayColor1">{data.voteCount}</p>
                </div>
                <div className="flex gap-2">
                    <Image 
                        src={CommentIcon}
                        alt="Comment Icon"
                        className="w-[15px]"
                    />
                    <p className="text-textGrayColor1">{cmt}</p>
                </div>
            </div>
        </div>
    )
}