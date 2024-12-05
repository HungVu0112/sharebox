'use client'

import GoogleIcon from "@/public/earth-asia-solid-gray.svg";
import VoteIcon from "@/public/caret-up-solid.svg";
import VoteUpIcon from "@/public/caret-up-solid-up.svg";
import VoteDownIcon from "@/public/caret-up-solid-down.svg";
import ExtendIcon from "@/public/square-plus-regular.svg";
import CollapseIcon from "@/public/square-minus-regular.svg";
import CommentIcon from "@/public/comment-solid.svg";
import SendIcon from "@/public/paper-plane-solid-pink.svg";

import Image from "next/image";
import { SetStateAction, useEffect, useState } from "react";
import axios from "axios";

export default function CommentCard({ data, setReload, isScroll } : { data: any, setReload: (value: SetStateAction<number>) => void, isScroll?: boolean }) {
    const userString = sessionStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : {};
    const [isExtend, setIsExtend] = useState<boolean>(false);
    const [isReply, setIsReply] = useState<boolean>(false);
    const [replyContent, setReplyContent] = useState<string>("");
    const [voteDown, setVoteDown] = useState<boolean>(false);
    const [voteUp, setVoteUp] = useState<boolean>(false);
    const [score, setScore] = useState<number>(data.voteCommentCount);
    const id = sessionStorage.getItem("commentId");
    const isChosen = sessionStorage.getItem("commentId") && id?.includes(data.commentId.toString());

    const handleSendReply = async() => {
        if (replyContent != "") {
            const res = await axios.post(
                `http://localhost:8080/authentication/comment/create/${user.userId}/${data.postId}`,
                {
                    "content": replyContent,
                    "parentCommentId": data.commentId
                }
            )

            if (res.data.code == 1000) {
                setIsReply(!isReply);
                setReplyContent("");
                setIsExtend(true);
                setReload(n => n+1);
            }
        }
    }

    const voteApi = async (voteType: string) => {
        await axios.post(
            `http://localhost:8080/authentication/vote-comment/${user.userId}/${data.postId}/${data.commentId}?voteType=${voteType}`
        )
    }

    const formatScore = (score: number) => {
        if (score >= 1000000) {
            return (score / 1000000).toFixed(1) + "m";
        } else if (score >= 1000) {
            return (score / 1000).toFixed(1) + "k";
        }
        return score;
    };

    const handleVoteUp = async (e: any) => {
        e.stopPropagation();
        voteApi("UPVOTE");
        if (voteUp) {
            setScore(n => n-1);
            setVoteUp(false);
        } else if (voteDown) {
            setScore(n => n+2);
            setVoteDown(false);
            setVoteUp(true);
        } else {
            setScore(n => n+1);
            setVoteUp(true);
        }
    }

    const handleVoteDown = (e: any) => {
        e.stopPropagation();
        voteApi("DOWNVOTE");
        if (voteDown) {
            setScore(n => n+1);
            setVoteDown(false);
        } else if (voteUp) {
            setScore(n => n-2);
            setVoteUp(false);
            setVoteDown(true);
        } else {
            setScore(n => n-1);
            setVoteDown(true);
        }
    }

    useEffect(() => {
        const checkVote = async () => {
            const res = await axios.get(
                `http://localhost:8080/authentication/vote-comment/type/${user.userId}/${data.postId}/${data.commentId}`
            )

            if (res.data.result.voteType) {
                if (res.data.result.voteType == "UPVOTE") setVoteUp(true);
                else if (res.data.result.voteType == "DOWNVOTE") setVoteDown(true);
            }
        }
        checkVote();
    }, [])

    return (
        <div id={`id${data.commentId}`} className={`w-full p-4 select-none ${(isScroll && isChosen) && 'flash-bg'}`}>
            <div className="flex gap-4">
                <div className="w-[40px] h-[40px] rounded-full overflow-hidden">
                    <img src={data.avatar} alt="userAvatar" />
                </div>
                <div className="flex items-center gap-4">
                    <h1>{data.username}</h1>
                    <div className="flex gap-1">
                        <Image
                            src={GoogleIcon}
                            alt="Google Icon"
                            className="w-[12px]"
                        />
                        <p className="text-sm text-textGrayColor1">
                            {(new Date(data.createAt).toLocaleString('vi-VN', {
                                hour: '2-digit',
                                minute: '2-digit',
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                            }
                            ))}
                        </p>
                    </div>
                </div>
            </div>
            <div className={`mt-2 w-full ml-[19px] pl-[36px] ${data.childComments.length != 0 && "border-l border-l-lineColor"}`}>
                <p>{data.content}</p>
            </div>
            <div className="mt-2 relative pl-[56px] flex">
                {data.childComments.length != 0 && 
                    <Image 
                        src={isExtend ? CollapseIcon : ExtendIcon}
                        alt="icon"
                        className="absolute left-[9px] top-[4px] w-[20px] cursor-pointer"
                        onClick={() => setIsExtend(!isExtend)}
                    />
                }
                <div className="flex gap-4 items-center">
                    <Image 
                        src={voteUp ? VoteUpIcon : VoteIcon}
                        alt="Voteup Icon"
                        className="w-[20px] cursor-pointer hover:scale-[1.05] duration-150"
                        onClick={handleVoteUp}
                    />
                    <div className="w-[20px]">
                        <p className={`text-center mb-[5px] ${voteUp && !voteDown ? "text-mainColor" : voteDown && !voteUp ? "text-voteDownColor" : "text-textGrayColor1"}`}>{formatScore(score)}</p>
                    </div>
                    <Image 
                        src={voteDown ? VoteDownIcon : VoteIcon}
                        alt="Voteup Icon"
                        className="w-[20px] rotate-180 mb-[5px] cursor-pointer hover:scale-[1.05] duration-150"
                        onClick={handleVoteDown}
                    />
                </div>
                <div onClick={() => setIsReply(!isReply)} className="px-4 cursor-pointer rounded-full hover:bg-slate-200 flex ml-6 gap-2 items-center">
                    <Image 
                        src={CommentIcon}
                        alt="Comment Icon"
                        className="w-[18px]"
                    />
                    <p className="mb-[5px]">Reply</p>
                </div>
            </div>
            {isReply &&
                <div className="pl-[56px] w-full h-[80px] p-4 flex items-center gap-4">
                    <input value={replyContent} onChange={(e) => setReplyContent(e.target.value)} type="text" className=" text-sm w-[90%] h-[40px] p-4 border border-lineColor outline-none rounded-full" placeholder="Add a reply" />
                    <div onClick={handleSendReply} className="w-[40px] h-[40px] rounded-full hover:bg-slate-200 flex items-center justify-center cursor-pointer">
                        <Image
                            src={SendIcon}
                            alt="Send Icon"
                            className="w-[20px]"
                        />
                    </div>
                </div>
            }
            {isExtend &&
                <div className="ml-[19px] pl-[9px] relative border-l border-l-lineColor">
                    {data.childComments.length != 0 && 
                        data.childComments.reverse().map((cmt: any, index: number) => {
                            return <CommentCard key={index} data={cmt} setReload={setReload} isScroll={isScroll}/>
                        })
                    }
                </div>
            }
        </div>
    )
}