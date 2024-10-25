'use client'

import GoogleIcon from "@/public/earth-asia-solid-gray.svg";
import OptionIcon from "@/public/ellipsis-solid-gray.svg";
import VoteIcon from "@/public/caret-up-solid.svg";
import VoteUpIcon from "@/public/caret-up-solid-up.svg";
import VoteDownIcon from "@/public/caret-up-solid-down.svg";
import CommentIcon from "@/public/comment-solid-white.svg";
import ImageIcon from "@/public/image-solid-white.svg";
import CloseIcon from "@/public/xmark-solid.svg";
import Arrow from "@/public/angle-up-solid-white.svg";

import Image from "next/image";
import { Music, Game, Anime, Movie, Manga, Sport } from "./topics";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function PostCard({ data, canNavigate }: { data: any, canNavigate: boolean }) {
    const router = useRouter();
    const imageSlide = useRef<HTMLDivElement>(null);
    const [imgIndex, setImgIndex] = useState<number>(0);
    const [voteDown, setVoteDown] = useState<boolean>(false);
    const [voteUp, setVoteUp] = useState<boolean>(false);
    const [score, setScore] = useState<number>(data.voteCount);

    const handleClick = (e: any) => {
        e.stopPropagation();
        imageSlide.current?.classList.toggle("hidden");
        setImgIndex(0);
        imageSlide.current?.focus();
    }

    const isVideo = (url: string) => {
        const videoExtensions = ['.mp4', '.mov', '.avi', '.mkv', '.webm'];
        return videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
    };

    const formatScore = (score: number) => {
        if (score >= 1000000) {
            return (score / 1000000).toFixed(1) + "m";
        } else if (score >= 1000) {
            return (score / 1000).toFixed(1) + "k";
        }
        return score;
    };

    const handlePrevImg = () => {
        setImgIndex(n => (n-1));
    }

    const handleNextImg = () => {
        setImgIndex(n => (n+1));
    }

    const handleKeyDown = (e: any) => {
        if (e.key == "ArrowLeft" && imgIndex > 0) handlePrevImg();
        if (e.key == "ArrowRight" && imgIndex < (data.media.length - 1)) handleNextImg();
        if (e.key == "Escape") {
            imageSlide.current?.classList.toggle("hidden");
            setImgIndex(0);
        }
    }

    const handleVoteUp = (e: any) => {
        e.stopPropagation();
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

    const handleNavigate = () => {
        if (canNavigate) router.push(`/post/${data.postId}`);
    }

    return (
        <>
            <div onClick={handleNavigate} className={`w-full px-4 py-8 border-b border-b-lineColor select-none ${canNavigate && "cursor-pointer hover:bg-postHover"}`}>
                <div className="flex justify-between">
                    <div className="flex items-center">
                        <img src={data.userAvatar} alt="User Avatar" className="w-[60px] h-[60px] shadow-2xl rounded-full"/>
                        <div className="ml-4">
                            <p className="text-lg font-medium">{data.username}</p>
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
                        <div className="ml-6">
                            {data.postTopics[0].id == 1 && <Music isHaveBg isSmall canHover={false}/>}
                            {data.postTopics[0].id == 2 && <Game isHaveBg isSmall canHover={false}/>}
                            {data.postTopics[0].id == 3 && <Anime isHaveBg isSmall canHover={false}/>}
                            {data.postTopics[0].id == 4 && <Movie isHaveBg isSmall canHover={false}/>}
                            {data.postTopics[0].id == 5 && <Manga isHaveBg isSmall canHover={false}/>}
                            {data.postTopics[0].id == 6 && <Sport isHaveBg isSmall canHover={false}/>}
                        </div>
                    </div>
                    <Image 
                        src={OptionIcon}
                        alt="Option Icon"
                        className="w-[25px] cursor-pointer hover:scale-[1.05]"
                    />
                </div>

                <div className="mt-6">
                    <h2 className="text-2xl font-semibold">{data.title}</h2>
                    <p className="text-lg mt-2">{data.content}</p>
                    {data.media?.length > 0 && 
                        <div className="relative cursor-pointer flex justify-center w-full mt-6 rounded-2xl border overflow-hidden">
                            <div className="absolute flex items-center justify-center font-semibold gap-2 bottom-4 right-4 w-[60px] h-[40px] rounded-lg bg-imageBlock z-50">
                                <Image 
                                    src={ImageIcon}
                                    alt="Image Icon"
                                    className="w-[20px]"
                                />
                                <p className="text-white">{data.media.length}</p>
                            </div>
                            {data.media && isVideo(data.media[0]) ? 
                                <video onClick={handleClick} src={data.media && data.media[0]} className="bg-cover w-[80%] hover:scale-[1.05] duration-100 ease-linear"/> :
                                <img onClick={handleClick} src={data.media && data.media[0]} alt="" className="bg-cover w-[80%] hover:scale-[1.05] duration-100 ease-linear" />
                            }
                        </div>
                    }
                </div>

                <div className="mt-6 flex">
                    <div className={`flex items-center justify-center px-3 gap-4 min-w-[130px] h-[40px] border-[3px] ${voteUp && !voteDown ? "border-mainColor" : voteDown && !voteUp ? "border-voteDownColor" : "border-textGrayColor1"} rounded-full`}>
                        <Image 
                            src={voteUp ? VoteUpIcon : VoteIcon}
                            alt="Vote Up"
                            className="w-[20px] cursor-pointer hover:scale-[1.05]"
                            onClick={handleVoteUp}
                        />
                        <p className={`mb-[4px] font-medium ${voteUp && !voteDown ? "text-mainColor" : voteDown && !voteUp ? "text-voteDownColor" : "text-textGrayColor1"}`}>{formatScore(score)}</p>
                        <Image 
                            src={voteDown ? VoteDownIcon : VoteIcon}
                            alt="Vote Down"
                            className="w-[20px] mb-[5px] rotate-180 cursor-pointer hover:scale-[1.05]"
                            onClick={handleVoteDown}
                        />
                    </div>
                    <div className="ml-6 w-[100px] h-[40px] gap-2 rounded-full flex items-center justify-center bg-mainColor">
                        <Image 
                            src={CommentIcon}
                            alt="Comment Icon"
                            className="w-[20px]"
                        />
                        <p className="text-white font-medium">4.5k</p>
                    </div>
                </div>
            </div>
            <div  onKeyDown={handleKeyDown} tabIndex={0} ref={imageSlide} className="fixed hidden top-0 left-0 w-full h-[100vh] bg-transparentBlack z-[100] select-none">
                <Image 
                    src={CloseIcon}                
                    alt="Close Icon"
                    className="absolute top-8 left-8 w-[35px] hover:scale-[1.05] cursor-pointer z-50"
                    onClick={handleClick}
                />
                <div className="relative w-full h-[80%] flex items-center justify-center">
                    {imgIndex > 0 && 
                        <Image 
                            src={Arrow}
                            onClick={handlePrevImg}
                            alt="Prev Icon"
                            className="absolute top-[50%] left-4 w-[40px] -rotate-90 hover:scale-[1.05] cursor-pointer"
                        />
                    }
                    {data.media && isVideo(data.media[imgIndex]) ? 
                        <video src={data.media && data.media[imgIndex]} controls className="mt-4 max-w-[80%] max-h-[80%] object-contain" /> :
                        <img src={data.media && data.media[imgIndex]} alt="Image" className="mt-4 max-w-[80%] max-h-[80%] object-contain"/>
                    }
                    {data.media && imgIndex < (data.media.length - 1) && 
                        <Image 
                            src={Arrow}
                            onClick={handleNextImg}
                            alt="Next Icon"
                            className="absolute top-[50%] right-4 w-[40px] rotate-90 hover:scale-[1.05] cursor-pointer"
                        />
                    }
                </div>
                <div className="w-full h-[20%] py-4 flex gap-6 items-center justify-center">
                    {data.media && data.media.map((url: string, index: number) => {
                        if (isVideo(url)) {
                            return <video key={index} src={url} className={`rounded-2xl max-h-[80%] object-contain transition-transform duration-200 ${imgIndex == index ? "border-[3px] border-white" : "opacity-60"} ${data.media.length > 0 && imgIndex == index && "scale-[1.2]"}`}/>
                        } else {
                            return <img key={index} src={url} alt="Image" className={`rounded-2xl max-h-[80%] object-contain transition-transform duration-200 ${imgIndex == index ? "border-[3px] border-white" : "opacity-60"} ${data.media.length > 0 && imgIndex == index && "scale-[1.2]"}`}/>
                        }
                    })}
                </div>
            </div>
        </>
    )
}